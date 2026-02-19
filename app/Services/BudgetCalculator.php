<?php

namespace App\Services;

use App\Enums\TransactionType;
use App\Models\Budget;
use App\Models\BudgetLine;
use App\Models\Transaction;
use Illuminate\Support\Collection;

class BudgetCalculator
{
    public function calculateBudgetProgress(Budget $budget, ?string $period = null): array
    {
        $period = $period ?? now()->format('Y-m');
        [$year, $month] = explode('-', $period);

        $lines = $budget->lines()->with('category')->get();

        $linesWithSpent = $lines->map(function (BudgetLine $line) use ($year, $month) {
            $spent = $this->getSpentForCategory((int) $line->category_id, (int) $year, (int) $month);
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
