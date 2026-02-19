<?php

namespace App\Http\Controllers;

use App\Actions\Report\ExportReportAction;
use App\Services\ReportGenerator;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function __construct(private ReportGenerator $reportGenerator) {}

    public function index(): Response
    {
        return Inertia::render('Reports/Index');
    }

    public function expensesByCategory(Request $request): Response
    {
        $planningId = $request->user()->active_planning_id;

        $report = $this->reportGenerator->getExpensesByCategory(
            $planningId,
            $request->input('start_date'),
            $request->input('end_date'),
        );

        return Inertia::render('Reports/ExpensesByCategory', [
            'report' => $report,
            'filters' => [
                'start_date' => $request->input('start_date', now()->startOfMonth()->toDateString()),
                'end_date' => $request->input('end_date', now()->endOfMonth()->toDateString()),
            ],
        ]);
    }

    public function incomeVsExpenses(Request $request): Response
    {
        $planningId = $request->user()->active_planning_id;

        $months = (int) $request->input('months', 6);
        $report = $this->reportGenerator->getIncomeVsExpenses($planningId, $months);

        return Inertia::render('Reports/IncomeVsExpenses', [
            'report' => $report,
            'filters' => [
                'months' => $months,
            ],
        ]);
    }

    public function cashFlow(Request $request): Response
    {
        $planningId = $request->user()->active_planning_id;

        $report = $this->reportGenerator->getCashFlow(
            $planningId,
            $request->input('start_date'),
            $request->input('end_date'),
        );

        return Inertia::render('Reports/CashFlow', [
            'report' => $report,
            'filters' => [
                'start_date' => $request->input('start_date', now()->startOfMonth()->toDateString()),
                'end_date' => $request->input('end_date', now()->endOfMonth()->toDateString()),
            ],
        ]);
    }

    public function debts(Request $request): Response
    {
        $planningId = $request->user()->active_planning_id;

        $report = $this->reportGenerator->getDebtSummary($planningId);

        return Inertia::render('Reports/Debts', [
            'report' => $report,
        ]);
    }

    public function budgetVsReal(Request $request): Response
    {
        $planningId = $request->user()->active_planning_id;

        $report = $this->reportGenerator->getBudgetVsReal(
            $planningId,
            $request->input('period'),
        );

        return Inertia::render('Reports/BudgetVsReal', [
            'report' => $report,
        ]);
    }

    public function export(Request $request, ExportReportAction $exportAction): StreamedResponse
    {
        $request->validate([
            'type' => 'required|in:expenses-by-category,income-vs-expenses,cash-flow,debts',
        ]);

        $planningId = $request->user()->active_planning_id;

        return $exportAction->execute(
            $request->input('type'),
            $planningId,
            $request->only(['start_date', 'end_date', 'months']),
        );
    }
}
