<?php

namespace App\Services;

use App\Actions\Transaction\CreateTransactionAction;
use App\Ai\Agents\TransactionEmailParser;
use App\Enums\EmailSyncMode;
use App\Enums\EmailTransactionStatus;
use App\Enums\TransactionType;
use App\Models\Account;
use App\Models\EmailAccount;
use App\Models\EmailTransaction;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class EmailTransactionProcessor
{
    public function __construct(
        protected EmailReaderService $emailReader,
        protected CreateTransactionAction $createTransaction
    ) {}

    public function processAccount(EmailAccount $account): array
    {
        $stats = [
            'total' => 0,
            'processed' => 0,
            'ignored' => 0,
            'failed' => 0,
            'transactions_created' => 0,
            'initial_sync' => false,
        ];

        try {
            $this->emailReader->connect($account);

            // Primera sincronización: marcar punto de inicio
            if (!$account->initial_sync_done) {
                $stats['initial_sync'] = true;
                return $this->handleInitialSync($account, $stats);
            }

            // Obtener emails según el modo de sincronización
            $emails = $this->fetchEmailsByMode($account);

            $stats['total'] = $emails->count();
            $lastUid = $account->last_uid;

            foreach ($emails as $emailData) {
                try {
                    $result = $this->processEmail($account, $emailData);

                    if ($result['status'] === EmailTransactionStatus::PROCESSED) {
                        $stats['processed']++;
                        if ($result['transaction_created']) {
                            $stats['transactions_created']++;
                        }
                    } elseif ($result['status'] === EmailTransactionStatus::IGNORED) {
                        $stats['ignored']++;
                    } else {
                        $stats['failed']++;
                    }

                    // Actualizar último UID procesado
                    if ($emailData['uid'] > $lastUid) {
                        $lastUid = $emailData['uid'];
                    }
                } catch (\Exception $e) {
                    $stats['failed']++;
                    Log::error('Error processing email', [
                        'account_id' => $account->id,
                        'uid' => $emailData['uid'] ?? null,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            // Actualizar último sync y UID
            $account->markSynced($lastUid);

        } catch (\Exception $e) {
            Log::error('Error syncing email account', [
                'account_id' => $account->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        } finally {
            $this->emailReader->disconnect();
        }

        return $stats;
    }

    protected function handleInitialSync(EmailAccount $account, array $stats): array
    {
        $syncMode = $account->sync_mode ?? EmailSyncMode::NEW_ONLY;

        if ($syncMode === EmailSyncMode::NEW_ONLY) {
            // Solo marcar el punto de inicio, no procesar nada
            $latestUid = $this->emailReader->getLatestUid($account);

            $account->update([
                'last_uid' => $latestUid,
                'last_sync_at' => now(),
                'initial_sync_done' => true,
            ]);

            Log::info('Initial sync completed (new_only mode)', [
                'account_id' => $account->id,
                'latest_uid' => $latestUid,
            ]);

            $this->emailReader->disconnect();

            return array_merge($stats, [
                'message' => 'Punto de inicio marcado. Solo se procesarán emails nuevos a partir de ahora.',
            ]);
        }

        // Modo UNREAD_7_DAYS: procesar emails no leídos de los últimos 7 días
        $emails = $this->emailReader->fetchUnreadEmailsLast7Days($account);
        $stats['total'] = $emails->count();
        $lastUid = $account->last_uid ?? 0;

        foreach ($emails as $emailData) {
            try {
                $result = $this->processEmail($account, $emailData);

                if ($result['status'] === EmailTransactionStatus::PROCESSED) {
                    $stats['processed']++;
                    if ($result['transaction_created']) {
                        $stats['transactions_created']++;
                    }
                } elseif ($result['status'] === EmailTransactionStatus::IGNORED) {
                    $stats['ignored']++;
                } else {
                    $stats['failed']++;
                }

                if ($emailData['uid'] > $lastUid) {
                    $lastUid = $emailData['uid'];
                }
            } catch (\Exception $e) {
                $stats['failed']++;
                Log::error('Error processing email in initial sync', [
                    'account_id' => $account->id,
                    'uid' => $emailData['uid'] ?? null,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $account->update([
            'last_uid' => $lastUid ?: $this->emailReader->getLatestUid($account),
            'last_sync_at' => now(),
            'initial_sync_done' => true,
        ]);

        $this->emailReader->disconnect();

        return $stats;
    }

    /**
     * Después de la sincronización inicial, siempre descarga todos los emails
     * desde la última fecha de sincronización (sin importar el sync_mode).
     */
    protected function fetchEmailsByMode(EmailAccount $account): Collection
    {
        // Después de la sync inicial, siempre usar fetchNewEmailsOnly
        // que trae todo desde last_sync_at
        return $this->emailReader->fetchNewEmailsOnly($account);
    }

    public function processEmail(EmailAccount $account, array $emailData): array
    {
        // Verificar si ya procesamos este email
        $existing = EmailTransaction::where('email_account_id', $account->id)
            ->where('message_uid', $emailData['uid'])
            ->first();

        if ($existing) {
            return [
                'status' => $existing->status,
                'email_transaction' => $existing,
                'transaction_created' => false,
            ];
        }

        // Crear registro del email
        $emailTransaction = EmailTransaction::create([
            'email_account_id' => $account->id,
            'message_uid' => $emailData['uid'],
            'subject' => $emailData['subject'],
            'from_email' => $emailData['from'],
            'received_at' => $emailData['date'],
            'raw_content' => $emailData['body'],
            'status' => EmailTransactionStatus::PENDING,
        ]);

        try {
            // Parsear con AI
            $parsedData = $this->parseWithAI($account, $emailData['body'], $emailData['subject']);

            $emailTransaction->update([
                'parsed_data' => $parsedData,
            ]);

            // Si no es una transacción, marcar como ignorado
            if (!isset($parsedData['is_transaction']) || !$parsedData['is_transaction']) {
                $emailTransaction->markAsIgnored();
                return [
                    'status' => EmailTransactionStatus::IGNORED,
                    'email_transaction' => $emailTransaction,
                    'transaction_created' => false,
                ];
            }

            // Crear transacción si la confianza es suficiente
            $transaction = null;
            $transactionCreated = false;

            if (($parsedData['confidence'] ?? 0) >= 0.7) {
                $transaction = $this->createTransactionFromParsed($account, $parsedData);
                if ($transaction) {
                    $emailTransaction->markAsProcessed($transaction);
                    $transactionCreated = true;
                }
            } else {
                // Baja confianza, dejar como pendiente para revisión manual
                $emailTransaction->update([
                    'status' => EmailTransactionStatus::PENDING,
                ]);
            }

            return [
                'status' => $transactionCreated ? EmailTransactionStatus::PROCESSED : EmailTransactionStatus::PENDING,
                'email_transaction' => $emailTransaction,
                'transaction_created' => $transactionCreated,
                'transaction' => $transaction,
            ];

        } catch (\Exception $e) {
            $emailTransaction->markAsFailed($e->getMessage());
            Log::error('Error parsing email with AI', [
                'email_transaction_id' => $emailTransaction->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'status' => EmailTransactionStatus::FAILED,
                'email_transaction' => $emailTransaction,
                'transaction_created' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    protected function parseWithAI(EmailAccount $account, string $body, ?string $subject = null): array
    {
        $content = $subject ? "Asunto: {$subject}\n\nContenido:\n{$body}" : $body;

        // Limitar el contenido para no exceder tokens
        $content = mb_substr($content, 0, 4000);

        $agent = TransactionEmailParser::forPlanning($account->planning_id);

        $response = $agent->prompt($content);

        return $response->toArray();
    }

    public function createTransactionFromParsed(EmailAccount $account, array $parsedData): ?Transaction
    {
        // Validar datos mínimos (ahora 0 y cadenas vacías indican ausencia)
        $amount = $parsedData['amount'] ?? 0;
        $type = $parsedData['type'] ?? 'unknown';

        if ($amount <= 0 || $type === 'unknown') {
            return null;
        }

        // Obtener cuenta por defecto del planning
        $defaultAccount = Account::where('planning_id', $account->planning_id)
            ->active()
            ->orderBy('id')
            ->first();

        if (!$defaultAccount) {
            return null;
        }

        // Parsear fecha (cadena vacía significa no encontrada)
        $date = !empty($parsedData['date']) ? $parsedData['date'] : now()->format('Y-m-d');
        try {
            $date = Carbon::parse($date)->format('Y-m-d');
        } catch (\Exception $e) {
            $date = now()->format('Y-m-d');
        }

        // Construir descripción (cadenas vacías significan no encontrado)
        $merchant = !empty($parsedData['merchant']) ? $parsedData['merchant'] : '';
        $desc = !empty($parsedData['description']) ? $parsedData['description'] : '';
        $description = $merchant ?: $desc ?: 'Transacción desde email';

        // Category ID 0 significa sin sugerencia
        $categoryId = !empty($parsedData['suggested_category_id']) && $parsedData['suggested_category_id'] > 0
            ? $parsedData['suggested_category_id']
            : null;

        $transactionData = [
            'planning_id' => $account->planning_id,
            'account_id' => $defaultAccount->id,
            'category_id' => $categoryId,
            'created_by' => $account->created_by,
            'type' => $type === 'income' ? TransactionType::INCOME : TransactionType::EXPENSE,
            'amount' => abs((float) $amount),
            'description' => $description,
            'date' => $date,
            'pending_approval' => true,
            'source' => 'email',
            'tags' => ['email-sync'],
        ];

        return $this->createTransaction->execute($transactionData);
    }

    public function reprocessEmailTransaction(EmailTransaction $emailTransaction): array
    {
        $account = $emailTransaction->emailAccount;

        // Re-parsear con AI
        $parsedData = $this->parseWithAI(
            $account,
            $emailTransaction->raw_content,
            $emailTransaction->subject
        );

        $emailTransaction->update([
            'parsed_data' => $parsedData,
            'status' => EmailTransactionStatus::PENDING,
            'error_message' => null,
        ]);

        // Si es transacción válida, crear
        if (isset($parsedData['is_transaction']) && $parsedData['is_transaction'] && ($parsedData['confidence'] ?? 0) >= 0.7) {
            $transaction = $this->createTransactionFromParsed($account, $parsedData);
            if ($transaction) {
                $emailTransaction->markAsProcessed($transaction);
                return [
                    'status' => EmailTransactionStatus::PROCESSED,
                    'transaction_created' => true,
                    'transaction' => $transaction,
                ];
            }
        }

        if (!isset($parsedData['is_transaction']) || !$parsedData['is_transaction']) {
            $emailTransaction->markAsIgnored();
            return [
                'status' => EmailTransactionStatus::IGNORED,
                'transaction_created' => false,
            ];
        }

        return [
            'status' => EmailTransactionStatus::PENDING,
            'transaction_created' => false,
        ];
    }
}
