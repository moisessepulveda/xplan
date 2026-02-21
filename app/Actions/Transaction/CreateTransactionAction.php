<?php

namespace App\Actions\Transaction;

use App\Enums\TransactionType;
use App\Models\Account;
use App\Models\Transaction;
use App\Models\VirtualFund;
use Illuminate\Support\Facades\DB;

class CreateTransactionAction
{
    public function execute(array $data): Transaction
    {
        return DB::transaction(function () use ($data) {
            $pendingApproval = $data['pending_approval'] ?? false;

            $transaction = Transaction::create([
                'planning_id' => $data['planning_id'] ?? auth()->user()->active_planning_id,
                'account_id' => $data['account_id'],
                'destination_account_id' => $data['destination_account_id'] ?? null,
                'category_id' => $data['category_id'] ?? null,
                'virtual_fund_id' => $data['virtual_fund_id'] ?? null,
                'created_by' => $data['created_by'] ?? auth()->id(),
                'type' => $data['type'],
                'amount' => $data['amount'],
                'description' => $data['description'] ?? null,
                'date' => $data['date'],
                'time' => $data['time'] ?? null,
                'is_recurring' => $data['is_recurring'] ?? false,
                'recurring_transaction_id' => $data['recurring_transaction_id'] ?? null,
                'pending_approval' => $pendingApproval,
                'source' => $data['source'] ?? 'manual',
                'tags' => $data['tags'] ?? [],
                'attachments' => $data['attachments'] ?? [],
            ]);

            // Solo actualizar saldos si la transacción NO está pendiente de aprobación
            if (!$pendingApproval) {
                $this->updateAccountBalances($transaction);
                $this->updateFundBalance($transaction);
            }

            return $transaction;
        });
    }

    private function updateAccountBalances(Transaction $transaction): void
    {
        $account = Account::findOrFail($transaction->account_id);

        match ($transaction->type) {
            TransactionType::INCOME => $account->updateBalance($transaction->amount),
            TransactionType::EXPENSE => $account->updateBalance(-$transaction->amount),
            TransactionType::TRANSFER => $this->processTransfer($transaction, $account),
        };
    }

    private function processTransfer(Transaction $transaction, Account $sourceAccount): void
    {
        $sourceAccount->updateBalance(-$transaction->amount);

        if ($transaction->destination_account_id) {
            $destinationAccount = Account::findOrFail($transaction->destination_account_id);
            $destinationAccount->updateBalance($transaction->amount);
        }
    }

    private function updateFundBalance(Transaction $transaction): void
    {
        if (!$transaction->virtual_fund_id) {
            return;
        }

        $fund = VirtualFund::find($transaction->virtual_fund_id);
        if (!$fund || $fund->is_default) {
            return;
        }

        // For transfers, the money leaves the source fund (negative impact)
        $impact = match ($transaction->type) {
            TransactionType::INCOME => (float) $transaction->amount,
            TransactionType::EXPENSE => -(float) $transaction->amount,
            TransactionType::TRANSFER => -(float) $transaction->amount, // Sale del fondo
        };

        $fund->updateAmount($impact);
    }
}
