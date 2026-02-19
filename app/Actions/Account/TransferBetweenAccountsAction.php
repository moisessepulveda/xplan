<?php

namespace App\Actions\Account;

use App\Models\Account;
use Illuminate\Support\Facades\DB;

class TransferBetweenAccountsAction
{
    public function execute(Account $fromAccount, Account $toAccount, float $amount, ?string $description = null): array
    {
        return DB::transaction(function () use ($fromAccount, $toAccount, $amount, $description) {
            // Decrement from source account
            $fromAccount->decrement('current_balance', $amount);

            // Increment to destination account
            $toAccount->increment('current_balance', $amount);

            // In the future, this will create two linked transactions
            // for proper transaction history tracking

            return [
                'from_account' => $fromAccount->fresh(),
                'to_account' => $toAccount->fresh(),
                'amount' => $amount,
                'description' => $description,
            ];
        });
    }
}
