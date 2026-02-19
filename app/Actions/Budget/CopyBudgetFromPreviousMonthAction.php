<?php

namespace App\Actions\Budget;

use App\Models\Budget;
use App\Models\BudgetLine;
use Illuminate\Support\Facades\DB;

class CopyBudgetFromPreviousMonthAction
{
    public function execute(Budget $sourceBudget, ?string $name = null): Budget
    {
        return DB::transaction(function () use ($sourceBudget, $name) {
            $newBudget = Budget::create([
                'planning_id' => $sourceBudget->planning_id,
                'created_by' => auth()->id(),
                'name' => $name ?? $sourceBudget->name,
                'type' => $sourceBudget->type,
                'active' => true,
            ]);

            foreach ($sourceBudget->lines as $line) {
                BudgetLine::create([
                    'budget_id' => $newBudget->id,
                    'category_id' => $line->category_id,
                    'amount' => $line->amount,
                    'alert_at_50' => $line->alert_at_50,
                    'alert_at_80' => $line->alert_at_80,
                    'alert_at_100' => $line->alert_at_100,
                    'notes' => $line->notes,
                ]);
            }

            return $newBudget->load('lines.category');
        });
    }
}
