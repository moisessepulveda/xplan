<?php

namespace App\Actions\Budget;

use App\Models\Budget;
use App\Models\BudgetHistory;
use App\Services\BudgetCalculator;

class CloseBudgetPeriodAction
{
    public function __construct(
        private BudgetCalculator $calculator
    ) {}

    public function execute(Budget $budget, string $period): BudgetHistory
    {
        $progress = $this->calculator->calculateBudgetProgress($budget, $period);
        $snapshot = $this->calculator->createSnapshot($budget, $period);

        return BudgetHistory::create([
            'budget_id' => $budget->id,
            'period' => $period,
            'total_budgeted' => $progress['total_budgeted'],
            'total_spent' => $progress['total_spent'],
            'lines_snapshot' => $snapshot,
            'closed_at' => now(),
        ]);
    }
}
