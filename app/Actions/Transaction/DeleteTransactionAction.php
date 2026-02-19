<?php

namespace App\Actions\Transaction;

use App\Enums\TransactionType;
use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class DeleteTransactionAction
{
    public function execute(Transaction $transaction): void
    {
        DB::transaction(function () use ($transaction) {
            $this->reverseBalanceImpact($transaction);
            $transaction->delete();
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
}
