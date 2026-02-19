<?php

namespace App\Actions\Planning;

use App\Models\Planning;

class UpdatePlanningAction
{
    /**
     * Update a planning's details.
     */
    public function execute(Planning $planning, array $data): Planning
    {
        $planning->update([
            'name' => $data['name'] ?? $planning->name,
            'description' => $data['description'] ?? $planning->description,
            'currency' => $data['currency'] ?? $planning->currency,
            'icon' => $data['icon'] ?? $planning->icon,
            'color' => $data['color'] ?? $planning->color,
            'month_start_day' => $data['month_start_day'] ?? $planning->month_start_day,
            'show_decimals' => $data['show_decimals'] ?? $planning->show_decimals,
        ]);

        return $planning->fresh();
    }
}
