<?php

namespace App\Services;

use App\Enums\TransactionType;
use App\Models\Budget;
use App\Models\BudgetHistory;
use App\Models\BudgetLine;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Support\Collection;

class BudgetCalculator
{
    public function calculateBudgetProgress(Budget $budget, ?string $period = null): array
    {
        $period = $period ?? now()->format('Y-m');
        [$year, $month] = explode('-', $period);

        // Check if there's a closed snapshot for this period
        $snapshot = BudgetHistory::where('budget_id', $budget->id)
            ->where('period', $period)
            ->whereNotNull('closed_at')
            ->first();

        if ($snapshot) {
            // Use snapshot data for closed periods
            return $this->calculateFromSnapshot($snapshot, (int) $year, (int) $month);
        }

        // No closed snapshot, use current budget lines
        return $this->calculateFromBudget($budget, $period, (int) $year, (int) $month);
    }

    private function calculateFromSnapshot(BudgetHistory $snapshot, int $year, int $month): array
    {
        $linesWithSpent = collect($snapshot->lines_snapshot)->map(function ($line) use ($year, $month) {
            $spent = (float) ($line['spent'] ?? 0);
            $amount = (float) $line['amount'];
            $percentage = $amount > 0
                ? round(($spent / $amount) * 100, 1)
                : 0;

            $category = Category::find($line['category_id']);

            return [
                'id' => $line['category_id'],
                'category_id' => $line['category_id'],
                'category' => $category,
                'amount' => $amount,
                'spent' => $spent,
                'remaining' => max(0, $amount - $spent),
                'percentage' => $percentage,
                'alert_at_50' => $line['alert_at_50'] ?? false,
                'alert_at_80' => $line['alert_at_80'] ?? true,
                'alert_at_100' => $line['alert_at_100'] ?? true,
                'status' => $this->getLineStatus($percentage),
                'notes' => null,
            ];
        });

        $totalBudgeted = (float) $snapshot->total_budgeted;
        $totalSpent = (float) $snapshot->total_spent;

        return [
            'budget' => $snapshot->budget,
            'period' => $snapshot->period,
            'lines' => $linesWithSpent,
            'total_budgeted' => $totalBudgeted,
            'total_spent' => $totalSpent,
            'total_remaining' => max(0, $totalBudgeted - $totalSpent),
            'total_percentage' => $totalBudgeted > 0
                ? round(($totalSpent / $totalBudgeted) * 100, 1)
                : 0,
            'is_closed' => true,
        ];
    }

    private function calculateFromBudget(Budget $budget, string $period, int $year, int $month): array
    {
        $lines = $budget->lines()->with('category')->get();

        $linesWithSpent = $lines->map(function (BudgetLine $line) use ($year, $month) {
            $spent = $this->getSpentForCategory((int) $line->category_id, $year, $month);
            $percentage = (float) $line->amount > 0
                ? round(($spent / (float) $line->amount) * 100, 1)
                : 0;

            return [
                'id' => $line->id,
                'category_id' => $line->category_id,
                'category' => $line->category,
                'amount' => (float) $line->amount,
                'spent' => $spent,
                'remaining' => max(0, (float) $line->amount - $spent),
                'percentage' => $percentage,
                'alert_at_50' => $line->alert_at_50,
                'alert_at_80' => $line->alert_at_80,
                'alert_at_100' => $line->alert_at_100,
                'status' => $this->getLineStatus($percentage),
                'notes' => $line->notes,
            ];
        });

        $totalBudgeted = $linesWithSpent->sum('amount');
        $totalSpent = $linesWithSpent->sum('spent');

        return [
            'budget' => $budget,
            'period' => $period,
            'lines' => $linesWithSpent,
            'total_budgeted' => $totalBudgeted,
            'total_spent' => $totalSpent,
            'total_remaining' => max(0, $totalBudgeted - $totalSpent),
            'total_percentage' => $totalBudgeted > 0
                ? round(($totalSpent / $totalBudgeted) * 100, 1)
                : 0,
            'is_closed' => false,
        ];
    }

    public function getSpentForCategory(int $categoryId, int $year, int $month): float
    {
        return (float) Transaction::query()
            ->where('type', TransactionType::EXPENSE)
            ->where('category_id', $categoryId)
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->sum('amount');
    }

    public function getLineStatus(float $percentage): string
    {
        if ($percentage >= 100) return 'exceeded';
        if ($percentage >= 80) return 'warning';
        if ($percentage >= 50) return 'caution';
        return 'normal';
    }

    public function getAlertLines(Budget $budget, ?string $period = null): Collection
    {
        $progress = $this->calculateBudgetProgress($budget, $period);

        return collect($progress['lines'])->filter(function ($line) {
            return ($line['alert_at_50'] && $line['percentage'] >= 50 && $line['percentage'] < 80)
                || ($line['alert_at_80'] && $line['percentage'] >= 80 && $line['percentage'] < 100)
                || ($line['alert_at_100'] && $line['percentage'] >= 100);
        });
    }

    public function createSnapshot(Budget $budget, string $period): array
    {
        $progress = $this->calculateBudgetProgress($budget, $period);

        return collect($progress['lines'])->map(fn($line) => [
            'category_id' => $line['category_id'],
            'category_name' => $line['category']?->name,
            'amount' => $line['amount'],
            'spent' => $line['spent'],
            'percentage' => $line['percentage'],
        ])->toArray();
    }
}
