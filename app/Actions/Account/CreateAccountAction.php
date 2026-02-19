<?php

namespace App\Actions\Account;

use App\Models\Account;

class CreateAccountAction
{
    public function execute(array $data): Account
    {
        $account = Account::create([
            'planning_id' => $data['planning_id'] ?? auth()->user()->active_planning_id,
            'created_by' => $data['created_by'] ?? auth()->id(),
            'name' => $data['name'],
            'type' => $data['type'],
            'currency' => $data['currency'] ?? auth()->user()->activePlanning?->currency ?? 'CLP',
            'initial_balance' => $data['initial_balance'] ?? 0,
            'current_balance' => $data['initial_balance'] ?? 0,
            'icon' => $data['icon'] ?? null,
            'color' => $data['color'] ?? null,
            'description' => $data['description'] ?? null,
            'include_in_total' => $data['include_in_total'] ?? true,
        ]);

        return $account;
    }
}
