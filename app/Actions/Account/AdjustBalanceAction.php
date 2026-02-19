<?php

namespace App\Actions\Account;

use App\Models\Account;

class AdjustBalanceAction
{
    public function execute(Account $account, float $newBalance, ?string $reason = null): Account
    {
        $previousBalance = $account->current_balance;

        $account->update([
            'current_balance' => $newBalance,
        ]);

        // Here you could log the adjustment for audit purposes
        // AdjustmentLog::create([...])

        return $account->fresh();
    }

    public function increment(Account $account, float $amount): Account
    {
        $account->increment('current_balance', $amount);
        return $account->fresh();
    }

    public function decrement(Account $account, float $amount): Account
    {
        $account->decrement('current_balance', $amount);
        return $account->fresh();
    }
}
