<?php

namespace App\Actions\Account;

use App\Models\Account;

class UpdateAccountAction
{
    public function execute(Account $account, array $data): Account
    {
        $account->update([
            'name' => $data['name'] ?? $account->name,
            'type' => $data['type'] ?? $account->type,
            'currency' => $data['currency'] ?? $account->currency,
            'icon' => $data['icon'] ?? $account->icon,
            'color' => $data['color'] ?? $account->color,
            'description' => $data['description'] ?? $account->description,
            'include_in_total' => $data['include_in_total'] ?? $account->include_in_total,
            'is_archived' => $data['is_archived'] ?? $account->is_archived,
        ]);

        return $account->fresh();
    }
}
