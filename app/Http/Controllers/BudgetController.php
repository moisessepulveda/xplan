<?php

namespace App\Http\Controllers;

use App\Actions\Budget\CloseBudgetPeriodAction;
use App\Actions\Budget\CopyBudgetFromPreviousMonthAction;
use App\Actions\Budget\CreateBudgetAction;
use App\Actions\Budget\UpdateBudgetAction;
use App\Http\Requests\Budget\StoreBudgetRequest;
use App\Http\Requests\Budget\UpdateBudgetRequest;
use App\Http\Resources\BudgetResource;
use App\Models\Budget;
use App\Models\BudgetHistory;
use App\Models\Category;
use App\Services\BudgetCalculator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BudgetController extends Controller
{
    public function __construct(
        private BudgetCalculator $calculator
    ) {}

    public function index(Request $request): Response
    {
        $period = $request->get('period', now()->format('Y-m'));
        $budget = Budget::with('lines.category')
            ->active()
            ->first();

        $progress = null;
        $alertLines = collect();

        if ($budget) {
            $progress = $this->calculator->calculateBudgetProgress($budget, $period);
            $alertLines = $this->calculator->getAlertLines($budget, $period);
        }

        return Inertia::render('Budgets/Index', [
            'budget' => $budget ? new BudgetResource($budget) : null,
            'progress' => $progress,
            'alertLines' => $alertLines->values(),
            'period' => $period,
        ]);
    }

    public function configure(Request $request): Response
    {
        $budget = Budget::with('lines.category')
            ->active()
            ->first();

        $categories = Category::where('type', 'expense')
            ->where('is_archived', false)
            ->orderBy('order')
            ->get();

        return Inertia::render('Budgets/Configure', [
            'budget' => $budget ? new BudgetResource($budget) : null,
            'categories' => $categories,
        ]);
    }

    public function store(StoreBudgetRequest $request, CreateBudgetAction $action): RedirectResponse
    {
        // Deactivate existing active budgets
        Budget::where('active', true)->update(['active' => false]);

        $action->execute($request->validated());

        return redirect()->route('budgets.index')
            ->with('success', 'Presupuesto creado exitosamente.');
    }

    public function update(UpdateBudgetRequest $request, Budget $budget, UpdateBudgetAction $action): RedirectResponse
    {
        $action->execute($budget, $request->validated());

        return redirect()->route('budgets.index')
            ->with('success', 'Presupuesto actualizado exitosamente.');
    }

    public function destroy(Budget $budget): RedirectResponse
    {
        $budget->lines()->delete();
        $budget->delete();

        return redirect()->route('budgets.index')
            ->with('success', 'Presupuesto eliminado exitosamente.');
    }

    public function category(Request $request, Budget $budget, int $categoryId): Response
    {
        $period = $request->get('period', now()->format('Y-m'));
        $progress = $this->calculator->calculateBudgetProgress($budget, $period);

        $categoryLine = collect($progress['lines'])->firstWhere('category_id', $categoryId);

        // Get transactions for this category in the period
        [$year, $month] = explode('-', $period);
        $transactions = \App\Models\Transaction::with(['account'])
            ->where('type', \App\Enums\TransactionType::EXPENSE)
            ->where('category_id', $categoryId)
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->orderBy('date', 'desc')
            ->get();

        return Inertia::render('Budgets/Category', [
            'budget' => new BudgetResource($budget),
            'categoryLine' => $categoryLine,
            'transactions' => \App\Http\Resources\TransactionResource::collection($transactions),
            'period' => $period,
        ]);
    }

    public function history(Request $request): Response
    {
        $histories = BudgetHistory::with('budget')
            ->orderBy('period', 'desc')
            ->get()
            ->map(function ($history) {
                return [
                    'id' => $history->id,
                    'budget_id' => $history->budget_id,
                    'budget_name' => $history->budget?->name,
                    'period' => $history->period,
                    'total_budgeted' => (float) $history->total_budgeted,
                    'total_spent' => (float) $history->total_spent,
                    'usage_percentage' => $history->usagePercentage,
                    'lines_snapshot' => $history->lines_snapshot,
                    'closed_at' => $history->closed_at,
                ];
            });

        return Inertia::render('Budgets/History', [
            'histories' => $histories,
        ]);
    }

    public function copy(Budget $budget, CopyBudgetFromPreviousMonthAction $action): RedirectResponse
    {
        // Deactivate current active budgets
        Budget::where('active', true)->update(['active' => false]);

        $action->execute($budget);

        return redirect()->route('budgets.index')
            ->with('success', 'Presupuesto copiado exitosamente.');
    }

    public function closePeriod(Request $request, Budget $budget, CloseBudgetPeriodAction $action): RedirectResponse
    {
        $period = $request->get('period', now()->subMonth()->format('Y-m'));

        $action->execute($budget, $period);

        return redirect()->route('budgets.history')
            ->with('success', 'Período cerrado exitosamente.');
    }
}
