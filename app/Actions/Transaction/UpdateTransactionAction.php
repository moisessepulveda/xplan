<?php

namespace App\Actions\Transaction;

use App\Enums\TransactionType;
use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class UpdateTransactionAction
{
    public function execute(Transaction $transaction, array $data): Transaction
    {
        return DB::transaction(function () use ($transaction, $data) {
            // Reverse the old balance impact
            $this->reverseBalanceImpact($transaction);

            $transaction->update([
                'account_id' => $data['account_id'] ?? $transaction->account_id,
                'destination_account_id' => $data['destination_account_id'] ?? $transaction->destination_account_id,
                'category_id' => $data['category_id'] ?? $transaction->category_id,
                'type' => $data['type'] ?? $transaction->type,
                'amount' => $data['amount'] ?? $transaction->amount,
                'description' => $data['description'] ?? $transaction->description,
                'date' => $data['date'] ?? $transaction->date,
                'time' => $data['time'] ?? $transaction->time,
                'tags' => $data['tags'] ?? $transaction->tags,
                'attachments' => $data['attachments'] ?? $transaction->attachments,
            ]);

            $transaction->refresh();

            // Apply the new balance impact
            $this->applyBalanceImpact($transaction);

            return $transaction->fresh();
        });
    }

    private function reverseBalanceImpact(Transaction $transaction): void
    {
        $account = Account::findOrFail($transaction->account_id);

        match ($transaction->type) {
            TransactionType::INCOME => $account->updateBalance(-$transaction->amount),
            TransactionType::EXPENSE => $account->updateBalance($transaction->amount),
            TransactionType::TRANSFER => $this->reverseTransfer($transaction, $account),
        };
    }

    private function reverseTransfer(Transaction $transaction, Account $sourceAccount): void
    {
        $sourceAccount->updateBalance($transaction->amount);

        if ($transaction->destination_account_id) {
            $destinationAccount = Account::findOrFail($transaction->destination_account_id);
            $destinationAccount->updateBalance(-$transaction->amount);
        }
    }

    private function applyBalanceImpact(Transaction $transaction): void
    {
        $account = Account::findOrFail($transaction->account_id);

        match ($transaction->type) {
            TransactionType::INCOME => $account->updateBalance($transaction->amount),
            TransactionType::EXPENSE => $account->updateBalance(-$transaction->amount),
            TransactionType::TRANSFER => $this->applyTransfer($transaction, $account),
        };
    }

    private function applyTransfer(Transaction $transaction, Account $sourceAccount): void
    {
        $sourceAccount->updateBalance(-$transaction->amount);

        if ($transaction->destination_account_id) {
            $destinationAccount = Account::findOrFail($transaction->destination_account_id);
            $destinationAccount->updateBalance($transaction->amount);
        }
    }
}
