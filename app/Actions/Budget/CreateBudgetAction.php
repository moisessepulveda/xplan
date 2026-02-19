<?php

namespace App\Actions\Budget;

use App\Models\Budget;
use App\Models\BudgetLine;
use Illuminate\Support\Facades\DB;

class CreateBudgetAction
{
    public function execute(array $data): Budget
    {
        return DB::transaction(function () use ($data) {
            $budget = Budget::create([
                'planning_id' => $data['planning_id'] ?? auth()->user()->active_planning_id,
                'created_by' => $data['created_by'] ?? auth()->id(),
                'name' => $data['name'],
                'type' => $data['type'] ?? 'monthly',
                'start_date' => $data['start_date'] ?? null,
                'end_date' => $data['end_date'] ?? null,
                'active' => true,
            ]);

            if (!empty($data['lines'])) {
                foreach ($data['lines'] as $line) {
                    BudgetLine::create([
                        'budget_id' => $budget->id,
                        'category_id' => $line['category_id'],
                        'amount' => $line['amount'],
                        'alert_at_50' => $line['alert_at_50'] ?? false,
                        'alert_at_80' => $line['alert_at_80'] ?? true,
                        'alert_at_100' => $line['alert_at_100'] ?? true,
                        'notes' => $line['notes'] ?? null,
                    ]);
                }
            }

            return $budget->load('lines.category');
        });
    }
}
