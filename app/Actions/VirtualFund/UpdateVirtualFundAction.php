<?php

namespace App\Actions\VirtualFund;

use App\Models\VirtualFund;

class UpdateVirtualFundAction
{
    public function execute(VirtualFund $fund, array $data): VirtualFund
    {
        $fund->update([
            'name' => $data['name'] ?? $fund->name,
            'goal_amount' => array_key_exists('goal_amount', $data) ? $data['goal_amount'] : $fund->goal_amount,
            'icon' => $data['icon'] ?? $fund->icon,
            'color' => $data['color'] ?? $fund->color,
            'description' => array_key_exists('description', $data) ? $data['description'] : $fund->description,
        ]);

        return $fund->fresh();
    }
}
