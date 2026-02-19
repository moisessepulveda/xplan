<?php

namespace App\Actions\Report;

use App\Services\ExportService;
use App\Services\ReportGenerator;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportReportAction
{
    public function __construct(
        private ReportGenerator $reportGenerator,
        private ExportService $exportService,
    ) {}

    public function execute(
        string $reportType,
        ?int $planningId = null,
        array $params = [],
    ): StreamedResponse {
        $reportData = match ($reportType) {
            'expenses-by-category' => $this->reportGenerator->getExpensesByCategory(
                $planningId,
                $params['start_date'] ?? null,
                $params['end_date'] ?? null,
            ),
            'income-vs-expenses' => $this->reportGenerator->getIncomeVsExpenses(
                $planningId,
                $params['months'] ?? 6,
            ),
            'cash-flow' => $this->reportGenerator->getCashFlow(
                $planningId,
                $params['start_date'] ?? null,
                $params['end_date'] ?? null,
            ),
            'debts' => $this->reportGenerator->getDebtSummary($planningId),
            default => throw new \InvalidArgumentException("Tipo de reporte no válido: {$reportType}"),
        };

        $formatted = match ($reportType) {
            'expenses-by-category' => $this->exportService->formatExpensesByCategoryForExport($reportData),
            'income-vs-expenses' => $this->exportService->formatIncomeVsExpensesForExport($reportData),
            'cash-flow' => $this->exportService->formatCashFlowForExport($reportData),
            'debts' => $this->exportService->formatDebtSummaryForExport($reportData),
        };

        $filename = "reporte-{$reportType}-" . now()->format('Y-m-d') . '.csv';

        return $this->exportService->exportCsv($formatted['rows'], $formatted['headers'], $filename);
    }
}
