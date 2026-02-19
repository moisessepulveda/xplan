<?php

namespace App\Services;

use App\Models\Budget;
use App\Models\BudgetHistory;
use App\Models\Transaction;
use App\Enums\TransactionType;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class BudgetSnapshotService
{
    public function __construct(
        private BudgetCalculator $calculator
    ) {}

    /**
     * Get unclosed periods that have transactions (before current month).
     */
    public function getUnclosedPeriods(Budget $budget): Collection
    {
        $currentPeriod = now()->format('Y-m');

        // Get all periods that have expense transactions for this planning
        $periodsWithTransactions = Transaction::where('planning_id', $budget->planning_id)
            ->where('type', TransactionType::EXPENSE)
            ->selectRaw("strftime('%Y-%m', date) as period")
            ->distinct()
            ->pluck('period')
            ->filter(fn($period) => $period < $currentPeriod);

        // Get already closed periods
        $closedPeriods = BudgetHistory::where('budget_id', $budget->id)
            ->whereNotNull('closed_at')
            ->pluck('period');

        // Return unclosed periods
        return $periodsWithTransactions->diff($closedPeriods)->sort()->values();
    }

    /**
     * Check if there are unclosed periods before the current month.
     */
    public function hasUnclosedPeriods(Budget $budget): bool
    {
        return $this->getUnclosedPeriods($budget)->isNotEmpty();
    }

    /**
     * Close a specific period.
     */
    public function closePeriod(Budget $budget, string $period): BudgetHistory
    {
        $progress = $this->calculator->calculateBudgetProgress($budget, $period);

        $linesSnapshot = collect($progress['lines'])->map(fn($line) => [
            'category_id' => $line['category_id'],
            'category_name' => $line['category']?->name,
            'amount' => $line['amount'],
            'spent' => $line['spent'],
            'percentage' => $line['percentage'],
            'alert_at_50' => $line['alert_at_50'] ?? false,
            'alert_at_80' => $line['alert_at_80'] ?? true,
            'alert_at_100' => $line['alert_at_100'] ?? true,
        ])->toArray();

        return BudgetHistory::updateOrCreate(
            [
                'budget_id' => $budget->id,
                'period' => $period,
            ],
            [
                'total_budgeted' => $progress['total_budgeted'],
                'total_spent' => $progress['total_spent'],
                'lines_snapshot' => $linesSnapshot,
                'closed_at' => now(),
            ]
        );
    }

    /**
     * Format period for display.
     */
    public function formatPeriod(string $period): string
    {
        $date = Carbon::createFromFormat('Y-m', $period);
        $months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
        ];
        return $months[$date->month - 1] . ' ' . $date->year;
    }
}
