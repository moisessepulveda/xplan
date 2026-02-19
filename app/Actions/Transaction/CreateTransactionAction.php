<?php

namespace App\Actions\Transaction;

use App\Enums\TransactionType;
use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class CreateTransactionAction
{
    public function execute(array $data): Transaction
    {
        return DB::transaction(function () use ($data) {
            $transaction = Transaction::create([
                'planning_id' => $data['planning_id'] ?? auth()->user()->active_planning_id,
                'account_id' => $data['account_id'],
                'destination_account_id' => $data['destination_account_id'] ?? null,
                'category_id' => $data['category_id'] ?? null,
                'created_by' => $data['created_by'] ?? auth()->id(),
                'type' => $data['type'],
                'amount' => $data['amount'],
                'description' => $data['description'] ?? null,
                'date' => $data['date'],
                'time' => $data['time'] ?? null,
                'is_recurring' => $data['is_recurring'] ?? false,
                'recurring_transaction_id' => $data['recurring_transaction_id'] ?? null,
                'tags' => $data['tags'] ?? [],
                'attachments' => $data['attachments'] ?? [],
            ]);

            $this->updateAccountBalances($transaction);

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
}
