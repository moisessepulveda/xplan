<?php

namespace App\Services;

use App\Models\Account;
use App\Models\Planning;
use Illuminate\Support\Collection;

class BalanceCalculator
{
    public function getTotalBalance(?int $planningId = null): float
    {
        return Account::query()
            ->when($planningId, fn($q) => $q->forPlanning($planningId))
            ->active()
            ->includedInTotal()
            ->sum('current_balance');
    }

    public function getBalanceByAccountType(?int $planningId = null): Collection
    {
        return Account::query()
            ->when($planningId, fn($q) => $q->forPlanning($planningId))
            ->active()
            ->includedInTotal()
            ->selectRaw('type, SUM(current_balance) as total')
            ->groupBy('type')
            ->pluck('total', 'type');
    }

    public function getAccountsSummary(?int $planningId = null): array
    {
        $accounts = Account::query()
            ->with('creator')
            ->when($planningId, fn($q) => $q->forPlanning($planningId))
            ->active()
            ->ordered()
            ->get();

        $totalBalance = $accounts->where('include_in_total', true)->sum('current_balance');
        $totalAssets = $accounts->where('include_in_total', true)
            ->where('current_balance', '>', 0)
            ->sum('current_balance');
        $totalLiabilities = abs($accounts->where('include_in_total', true)
            ->where('current_balance', '<', 0)
            ->sum('current_balance'));

        return [
            'accounts' => $accounts,
            'total_balance' => $totalBalance,
            'total_assets' => $totalAssets,
            'total_liabilities' => $totalLiabilities,
            'count' => $accounts->count(),
        ];
    }

    public function recalculateAccountBalance(Account $account): float
    {
        $transactionsSum = $account->transactions()
            ->selectRaw("SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as total")
            ->value('total') ?? 0;

        $newBalance = $account->initial_balance + $transactionsSum;
        $account->update(['current_balance' => $newBalance]);

        return $newBalance;
    }

    public function recalculateAllBalances(?int $planningId = null): void
    {
        $accounts = Account::query()
            ->when($planningId, fn($q) => $q->forPlanning($planningId))
            ->get();

        foreach ($accounts as $account) {
            $this->recalculateAccountBalance($account);
        }
    }
}
