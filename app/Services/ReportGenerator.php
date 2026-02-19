<?php

namespace App\Services;

use App\Enums\CreditStatus;
use App\Enums\ReceivableStatus;
use App\Enums\ReceivableType;
use App\Enums\TransactionType;
use App\Models\Account;
use App\Models\Budget;
use App\Models\Credit;
use App\Models\Receivable;
use App\Models\Transaction;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ReportGenerator
{
    public function __construct(
        private BalanceCalculator $balanceCalculator,
        private BudgetCalculator $budgetCalculator,
    ) {}

    /**
     * Dashboard summary stats.
     */
    public function getDashboardStats(?int $planningId = null): array
    {
        $now = now();
        $year = $now->year;
        $month = $now->month;

        $totalBalance = $this->balanceCalculator->getTotalBalance($planningId);

        $monthIncome = (float) Transaction::query()
            ->when($planningId, fn($q) => $q->where('planning_id', $planningId))
            ->income()
            ->forMonth($year, $month)
            ->sum('amount');

        $monthExpense = (float) Transaction::query()
            ->when($planningId, fn($q) => $q->where('planning_id', $planningId))
            ->expense()
            ->forMonth($year, $month)
            ->sum('amount');

        $totalDebt = (float) Credit::query()
            ->when($planningId, fn($q) => $q->where('planning_id', $planningId))
            ->active()
            ->sum('pending_amount');

        $totalReceivable = (float) Receivable::query()
            ->when($planningId, fn($q) => $q->where('planning_id', $planningId))
            ->receivables()
            ->active()
            ->sum('pending_amount');

        // Budget progress
        $budgetProgress = $this->getBudgetSummary($planningId);

        return [
            'total_balance' => $totalBalance,
            'month_income' => $monthIncome,
            'month_expense' => $monthExpense,
            'month_balance' => $monthIncome - $monthExpense,
            'total_debt' => $totalDebt,
            'total_receivable' => $totalReceivable,
            'budget_used' => $budgetProgress['percentage'],
            'budget_total' => $budgetProgress['total_budgeted'],
            'budget_spent' => $budgetProgress['total_spent'],
        ];
    }

    /**
     * Get upcoming payments (credit installments + receivable payables).
     */
    public function getUpcomingPayments(?int $planningId = null, int $limit = 5): array
    {
        $upcoming = collect();

        // Credit installments due in next 30 days
        $creditInstallments = DB::table('credit_installments')
            ->join('credits', 'credit_installments.credit_id', '=', 'credits.id')
            ->when($planningId, fn($q) => $q->where('credits.planning_id', $planningId))
            ->whereNull('credits.deleted_at')
            ->where('credits.status', CreditStatus::ACTIVE->value)
            ->whereIn('credit_installments.status', ['pending', 'overdue', 'partial'])
            ->where('credit_installments.due_date', '<=', now()->addDays(30))
            ->orderBy('credit_installments.due_date')
            ->select([
                'credit_installments.id',
                'credit_installments.due_date',
                'credit_installments.amount',
                'credit_installments.status',
                'credits.name as description',
            ])
            ->limit($limit)
            ->get()
            ->map(fn($item) => [
                'id' => $item->id,
                'type' => 'credit_installment',
                'description' => $item->description,
                'amount' => (float) $item->amount,
                'due_date' => $item->due_date,
                'status' => $item->status,
                'is_overdue' => $item->due_date < now()->toDateString(),
            ]);

        $upcoming = $upcoming->merge($creditInstallments);

        // Receivable payables due in next 30 days
        $payables = Receivable::query()
            ->when($planningId, fn($q) => $q->where('planning_id', $planningId))
            ->payables()
            ->active()
            ->where(function ($q) {
                $q->whereNull('due_date')
                    ->orWhere('due_date', '<=', now()->addDays(30));
            })
            ->orderBy('due_date')
            ->limit($limit)
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'type' => 'payable',
                'description' => $r->concept . ' - ' . $r->person_name,
                'amount' => (float) $r->pending_amount,
                'due_date' => $r->due_date?->toDateString(),
                'status' => $r->isOverdue() ? 'overdue' : 'pending',
                'is_overdue' => $r->isOverdue(),
            ]);

        $upcoming = $upcoming->merge($payables);

        return $upcoming
            ->sortBy('due_date')
            ->take($limit)
            ->values()
            ->toArray();
    }

    /**
     * Expenses by category report.
     */
    public function getExpensesByCategory(
        ?int $planningId = null,
        ?string $startDate = null,
        ?string $endDate = null,
    ): array {
        $startDate = $startDate ?? now()->startOfMonth()->toDateString();
        $endDate = $endDate ?? now()->endOfMonth()->toDateString();

        $expenses = Transaction::query()
            ->when($planningId, fn($q) => $q->where('planning_id', $planningId))
            ->expense()
            ->betweenDates($startDate, $endDate)
            ->join('categories', 'transactions.category_id', '=', 'categories.id')
            ->selectRaw('categories.id as category_id, categories.name as category_name, categories.icon as category_icon, categories.color as category_color, SUM(transactions.amount) as total')
            ->groupBy('categories.id', 'categories.name', 'categories.icon', 'categories.color')
            ->orderByDesc('total')
            ->get();

        $grandTotal = $expenses->sum('total');

        $data = $expenses->map(fn($item) => [
            'category_id' => $item->category_id,
            'category_name' => $item->category_name,
            'category_icon' => $item->category_icon,
            'category_color' => $item->category_color,
            'total' => (float) $item->total,
            'percentage' => $grandTotal > 0 ? round(((float) $item->total / $grandTotal) * 100, 1) : 0,
        ])->toArray();

        return [
            'data' => $data,
            'total' => $grandTotal,
            'start_date' => $startDate,
            'end_date' => $endDate,
        ];
    }

    /**
     * Income vs Expenses report (monthly comparison).
     */
    public function getIncomeVsExpenses(
        ?int $planningId = null,
        int $months = 6,
    ): array {
        $data = [];

        for ($i = $months - 1; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $year = $date->year;
            $month = $date->month;

            $income = (float) Transaction::query()
                ->when($planningId, fn($q) => $q->where('planning_id', $planningId))
                ->income()
                ->forMonth($year, $month)
                ->sum('amount');

            $expense = (float) Transaction::query()
                ->when($planningId, fn($q) => $q->where('planning_id', $planningId))
                ->expense()
                ->forMonth($year, $month)
                ->sum('amount');

            $data[] = [
                'month' => $date->format('Y-m'),
                'month_label' => $date->locale('es')->isoFormat('MMM YY'),
                'income' => $income,
                'expense' => $expense,
                'balance' => $income - $expense,
            ];
        }

        return [
            'data' => $data,
            'total_income' => array_sum(array_column($data, 'income')),
            'total_expense' => array_sum(array_column($data, 'expense')),
            'average_income' => count($data) > 0 ? array_sum(array_column($data, 'income')) / count($data) : 0,
            'average_expense' => count($data) > 0 ? array_sum(array_column($data, 'expense')) / count($data) : 0,
        ];
    }

    /**
     * Cash flow report (daily accumulated balance).
     */
    public function getCashFlow(
        ?int $planningId = null,
        ?string $startDate = null,
        ?string $endDate = null,
    ): array {
        $startDate = $startDate ?? now()->startOfMonth()->toDateString();
        $endDate = $endDate ?? now()->endOfMonth()->toDateString();

        $transactions = Transaction::query()
            ->when($planningId, fn($q) => $q->where('planning_id', $planningId))
            ->betweenDates($startDate, $endDate)
            ->whereIn('type', [TransactionType::INCOME, TransactionType::EXPENSE])
            ->selectRaw("date,
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense")
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $accumulated = 0;
        $data = $transactions->map(function ($item) use (&$accumulated) {
            $dailyNet = (float) $item->income - (float) $item->expense;
            $accumulated += $dailyNet;

            return [
                'date' => $item->date->format('Y-m-d'),
                'date_label' => $item->date->format('d/m'),
                'income' => (float) $item->income,
                'expense' => (float) $item->expense,
                'net' => $dailyNet,
                'accumulated' => $accumulated,
            ];
        })->toArray();

        return [
            'data' => $data,
            'total_income' => array_sum(array_column($data, 'income')),
            'total_expense' => array_sum(array_column($data, 'expense')),
            'net_flow' => array_sum(array_column($data, 'net')),
            'start_date' => $startDate,
            'end_date' => $endDate,
        ];
    }

    /**
     * Budget vs actual report.
     */
    public function getBudgetVsReal(?int $planningId = null, ?string $period = null): array
    {
        $budget = Budget::query()
            ->when($planningId, fn($q) => $q->where('planning_id', $planningId))
            ->active()
            ->first();

        if (!$budget) {
            return [
                'has_budget' => false,
                'data' => [],
                'total_budgeted' => 0,
                'total_spent' => 0,
            ];
        }

        $progress = $this->budgetCalculator->calculateBudgetProgress($budget, $period);

        $data = collect($progress['lines'])->map(fn($line) => [
            'category_id' => $line['category_id'],
            'category_name' => $line['category']?->name ?? 'Sin categoría',
            'category_icon' => $line['category']?->icon,
            'category_color' => $line['category']?->color,
            'budgeted' => $line['amount'],
            'spent' => $line['spent'],
            'remaining' => $line['remaining'],
            'percentage' => $line['percentage'],
            'status' => $line['status'],
        ])->toArray();

        return [
            'has_budget' => true,
            'data' => $data,
            'total_budgeted' => $progress['total_budgeted'],
            'total_spent' => $progress['total_spent'],
            'total_remaining' => $progress['total_remaining'],
            'total_percentage' => $progress['total_percentage'],
            'period' => $progress['period'],
        ];
    }

    /**
     * Debt summary report.
     */
    public function getDebtSummary(?int $planningId = null): array
    {
        $credits = Credit::query()
            ->when($planningId, fn($q) => $q->where('planning_id', $planningId))
            ->active()
            ->get();

        $byType = $credits->groupBy(fn($c) => $c->type->value)->map(fn($group) => [
            'type' => $group->first()->type->value,
            'type_label' => $group->first()->type->label(),
            'type_color' => $group->first()->type->color(),
            'count' => $group->count(),
            'total_debt' => (float) $group->sum('pending_amount'),
            'total_monthly' => (float) $group->sum('monthly_payment'),
        ])->values()->toArray();

        $payables = Receivable::query()
            ->when($planningId, fn($q) => $q->where('planning_id', $planningId))
            ->payables()
            ->active()
            ->get();

        return [
            'credits' => [
                'count' => $credits->count(),
                'total_debt' => (float) $credits->sum('pending_amount'),
                'total_monthly_payment' => (float) $credits->sum('monthly_payment'),
                'total_interest' => (float) $credits->sum(fn($c) => $c->total_interest),
                'by_type' => $byType,
            ],
            'payables' => [
                'count' => $payables->count(),
                'total_amount' => (float) $payables->sum('pending_amount'),
                'overdue_count' => $payables->filter(fn($p) => $p->isOverdue())->count(),
            ],
            'total_debt' => (float) $credits->sum('pending_amount') + (float) $payables->sum('pending_amount'),
        ];
    }

    /**
     * Quick stats for dashboard widgets.
     */
    public function getQuickStats(?int $planningId = null): array
    {
        $now = now();
        $lastMonth = now()->subMonth();

        $currentMonthExpense = (float) Transaction::query()
            ->when($planningId, fn($q) => $q->where('planning_id', $planningId))
            ->expense()
            ->forMonth($now->year, $now->month)
            ->sum('amount');

        $lastMonthExpense = (float) Transaction::query()
            ->when($planningId, fn($q) => $q->where('planning_id', $planningId))
            ->expense()
            ->forMonth($lastMonth->year, $lastMonth->month)
            ->sum('amount');

        $expenseChange = $lastMonthExpense > 0
            ? round((($currentMonthExpense - $lastMonthExpense) / $lastMonthExpense) * 100, 1)
            : 0;

        $transactionCount = Transaction::query()
            ->when($planningId, fn($q) => $q->where('planning_id', $planningId))
            ->forMonth($now->year, $now->month)
            ->count();

        $accountsCount = Account::query()
            ->when($planningId, fn($q) => $q->forPlanning($planningId))
            ->active()
            ->count();

        $activeCreditsCount = Credit::query()
            ->when($planningId, fn($q) => $q->where('planning_id', $planningId))
            ->active()
            ->count();

        return [
            'expense_change' => $expenseChange,
            'transaction_count' => $transactionCount,
            'accounts_count' => $accountsCount,
            'active_credits_count' => $activeCreditsCount,
        ];
    }

    /**
     * Recent transactions for dashboard.
     */
    public function getRecentTransactions(?int $planningId = null, int $limit = 5): Collection
    {
        return Transaction::query()
            ->when($planningId, fn($q) => $q->where('planning_id', $planningId))
            ->with(['account', 'category'])
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    private function getBudgetSummary(?int $planningId = null): array
    {
        $budget = Budget::query()
            ->when($planningId, fn($q) => $q->where('planning_id', $planningId))
            ->active()
            ->first();

        if (!$budget) {
            return ['percentage' => 0, 'total_budgeted' => 0, 'total_spent' => 0];
        }

        $progress = $this->budgetCalculator->calculateBudgetProgress($budget);

        return [
            'percentage' => $progress['total_percentage'],
            'total_budgeted' => $progress['total_budgeted'],
            'total_spent' => $progress['total_spent'],
        ];
    }
}
