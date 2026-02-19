<?php

namespace App\Console\Commands;

use App\Ai\Agents\TransactionEmailParser;
use App\Actions\Transaction\CreateTransactionAction;
use App\Enums\TransactionType;
use App\Models\Account;
use App\Models\Planning;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class TestEmailTransactionCommand extends Command
{
    protected $signature = 'email:test
                            {--planning= : ID del planning a usar}
                            {--account= : ID de la cuenta para la transacción}
                            {--dry-run : Solo parsear, no crear transacción}
                            {--template= : Ruta a template HTML personalizado}';

    protected $description = 'Prueba el parsing de emails bancarios y creación de transacciones con IA';

    public function handle(CreateTransactionAction $createTransaction): int
    {
        $this->info('🧪 Iniciando prueba de parsing de email bancario...');
        $this->newLine();

        // Obtener planning
        $planningId = $this->option('planning');
        if (!$planningId) {
            $planning = Planning::first();
            if (!$planning) {
                $this->error('No hay plannings en la base de datos. Crea uno primero.');
                return 1;
            }
            $planningId = $planning->id;
        }

        $this->info("📋 Usando Planning ID: {$planningId}");

        // Leer template HTML
        $templatePath = $this->option('template')
            ?? resource_path('views/emails/templates/bci_transaction.html');

        if (!File::exists($templatePath)) {
            $this->error("Template no encontrado: {$templatePath}");
            return 1;
        }

        $htmlContent = File::get($templatePath);
        $this->info("📄 Template cargado: {$templatePath}");
        $this->newLine();

        // Mostrar preview del contenido
        $this->info('📧 Contenido del email (primeros 500 caracteres):');
        $this->line('─────────────────────────────────────────────────');
        $textContent = $this->htmlToText($htmlContent);
        $this->line(mb_substr($textContent, 0, 500) . '...');
        $this->line('─────────────────────────────────────────────────');
        $this->newLine();

        // Parsear con IA
        $this->info('🤖 Enviando a OpenAI para análisis...');

        try {
            $agent = TransactionEmailParser::forPlanning($planningId);

            $emailContent = "Asunto: Notificación de Compra Aprobada - Banco Nacional\n\n" . $textContent;

            $startTime = microtime(true);
            $response = $agent->prompt($emailContent);
            $elapsed = round((microtime(true) - $startTime) * 1000);

            $parsedData = $response->toArray();

            $this->info("✅ Respuesta recibida en {$elapsed}ms");
            $this->newLine();

        } catch (\Exception $e) {
            $this->error('❌ Error al conectar con OpenAI: ' . $e->getMessage());
            return 1;
        }

        // Mostrar resultado del parsing
        $this->info('📊 Resultado del análisis IA:');
        $this->line('─────────────────────────────────────────────────');

        // Formatear valores para mostrar (0 y cadenas vacías = no encontrado)
        $amount = $parsedData['amount'] ?? 0;
        $type = $parsedData['type'] ?? 'unknown';
        $merchant = $parsedData['merchant'] ?? '';
        $description = $parsedData['description'] ?? '';
        $date = $parsedData['date'] ?? '';
        $categoryId = $parsedData['suggested_category_id'] ?? 0;

        $this->table(
            ['Campo', 'Valor'],
            [
                ['Es transacción', $parsedData['is_transaction'] ? '✅ Sí' : '❌ No'],
                ['Tipo', $type !== 'unknown' ? $type : '⚠️ No determinado'],
                ['Monto', $amount > 0 ? '$' . number_format($amount, 0, ',', '.') : '⚠️ No encontrado'],
                ['Comercio', $merchant !== '' ? $merchant : '⚠️ No encontrado'],
                ['Descripción', $description !== '' ? $description : '⚠️ No encontrada'],
                ['Fecha', $date !== '' ? $date : '⚠️ No encontrada'],
                ['Categoría sugerida ID', $categoryId > 0 ? $categoryId : '⚠️ Sin sugerencia'],
                ['Confianza', round(($parsedData['confidence'] ?? 0) * 100) . '%'],
            ]
        );

        $this->newLine();

        // Si es dry-run, terminar aquí
        if ($this->option('dry-run')) {
            $this->warn('🔸 Modo dry-run: No se creó la transacción');
            return 0;
        }

        // Verificar si es una transacción válida
        if (!$parsedData['is_transaction']) {
            $this->warn('⚠️ El email no fue identificado como una transacción');
            return 0;
        }

        // Verificar datos mínimos
        if ($amount <= 0 || $type === 'unknown') {
            $this->warn('⚠️ No se pudo extraer monto o tipo de transacción');
            return 0;
        }

        // Obtener cuenta
        $accountId = $this->option('account');
        if (!$accountId) {
            $account = Account::where('planning_id', $planningId)->active()->first();
            if (!$account) {
                $this->error('No hay cuentas activas en el planning. Crea una primero.');
                return 1;
            }
            $accountId = $account->id;
        }

        $this->info("💳 Usando Cuenta ID: {$accountId}");

        // Crear transacción
        if ($this->confirm('¿Deseas crear la transacción?', true)) {
            try {
                $transactionDate = $date !== '' ? $date : now()->format('Y-m-d');
                try {
                    $transactionDate = Carbon::parse($transactionDate)->format('Y-m-d');
                } catch (\Exception $e) {
                    $transactionDate = now()->format('Y-m-d');
                }

                $transactionDescription = $merchant !== '' ? $merchant : ($description !== '' ? $description : 'Transacción desde email de prueba');

                $transaction = $createTransaction->execute([
                    'planning_id' => $planningId,
                    'account_id' => $accountId,
                    'category_id' => $categoryId > 0 ? $categoryId : null,
                    'type' => $type === 'income' ? TransactionType::INCOME : TransactionType::EXPENSE,
                    'amount' => abs((float) $amount),
                    'description' => $transactionDescription,
                    'date' => $transactionDate,
                    'tags' => ['email-test'],
                ]);

                $this->newLine();
                $this->info('✅ ¡Transacción creada exitosamente!');
                $this->table(
                    ['Campo', 'Valor'],
                    [
                        ['ID', $transaction->id],
                        ['Tipo', $transaction->type->label()],
                        ['Monto', '$' . number_format($transaction->amount, 0, ',', '.')],
                        ['Descripción', $transaction->description],
                        ['Fecha', $transaction->date],
                        ['Cuenta ID', $transaction->account_id],
                        ['Categoría ID', $transaction->category_id ?? 'Sin categoría'],
                    ]
                );

            } catch (\Exception $e) {
                $this->error('❌ Error al crear transacción: ' . $e->getMessage());
                return 1;
            }
        } else {
            $this->warn('Transacción cancelada por el usuario');
        }

        $this->newLine();
        $this->info('🎉 Prueba completada');

        return 0;
    }

    protected function htmlToText(string $html): string
    {
        // Remover scripts y estilos
        $html = preg_replace('/<script[^>]*>.*?<\/script>/is', '', $html);
        $html = preg_replace('/<style[^>]*>.*?<\/style>/is', '', $html);

        // Convertir saltos de línea
        $html = preg_replace('/<br\s*\/?>/i', "\n", $html);
        $html = preg_replace('/<\/p>/i', "\n\n", $html);
        $html = preg_replace('/<\/div>/i', "\n", $html);
        $html = preg_replace('/<\/tr>/i', "\n", $html);
        $html = preg_replace('/<\/td>/i', " | ", $html);
        $html = preg_replace('/<\/h[1-6]>/i', "\n\n", $html);

        // Remover etiquetas HTML
        $text = strip_tags($html);

        // Decodificar entidades HTML
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        // Limpiar espacios múltiples
        $text = preg_replace('/[ \t]+/', ' ', $text);
        $text = preg_replace('/\n\s*\n/', "\n\n", $text);
        $text = preg_replace('/\n{3,}/', "\n\n", $text);

        return trim($text);
    }
}
