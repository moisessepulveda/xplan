<?php

namespace App\Actions\VirtualFund;

use App\Models\Account;
use App\Models\VirtualFund;
use Illuminate\Support\Facades\DB;

class CreateVirtualFundAction
{
    public function execute(Account $account, array $data): VirtualFund
    {
        return DB::transaction(function () use ($account, $data) {
            $initialAmount = $data['initial_amount'] ?? 0;

            $fund = VirtualFund::create([
                'account_id' => $account->id,
                'name' => $data['name'],
                'current_amount' => $initialAmount,
                'goal_amount' => $data['goal_amount'] ?? null,
                'icon' => $data['icon'] ?? null,
                'color' => $data['color'] ?? null,
                'description' => $data['description'] ?? null,
                'is_default' => false,
            ]);

            return $fund;
        });
    }
}
