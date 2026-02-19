<?php

namespace App\Actions\Budget;

use App\Models\Budget;
use App\Models\BudgetLine;
use Illuminate\Support\Facades\DB;

class UpdateBudgetAction
{
    public function execute(Budget $budget, array $data): Budget
    {
        return DB::transaction(function () use ($budget, $data) {
            $budget->update(array_filter([
                'name' => $data['name'] ?? null,
                'type' => $data['type'] ?? null,
                'start_date' => array_key_exists('start_date', $data) ? $data['start_date'] : null,
                'end_date' => array_key_exists('end_date', $data) ? $data['end_date'] : null,
            ], fn($v) => $v !== null));

            if (isset($data['lines'])) {
                // Delete removed lines
                $keepIds = collect($data['lines'])
                    ->filter(fn($l) => isset($l['id']))
                    ->pluck('id');

                $budget->lines()->whereNotIn('id', $keepIds)->delete();

                // Update or create lines
                foreach ($data['lines'] as $lineData) {
                    BudgetLine::updateOrCreate(
                        [
                            'budget_id' => $budget->id,
                            'category_id' => $lineData['category_id'],
                        ],
                        [
                            'amount' => $lineData['amount'],
                            'alert_at_50' => $lineData['alert_at_50'] ?? false,
                            'alert_at_80' => $lineData['alert_at_80'] ?? true,
                            'alert_at_100' => $lineData['alert_at_100'] ?? true,
                            'notes' => $lineData['notes'] ?? null,
                        ]
                    );
                }
            }

            return $budget->fresh('lines.category');
        });
    }
}
