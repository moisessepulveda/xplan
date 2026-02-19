<?php

namespace App\Services;

use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportService
{
    /**
     * Export data to CSV.
     */
    public function exportCsv(array $data, array $headers, string $filename): StreamedResponse
    {
        return response()->streamDownload(function () use ($data, $headers) {
            $handle = fopen('php://output', 'w');

            // BOM for UTF-8
            fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));

            // Header row
            fputcsv($handle, $headers, ';');

            // Data rows
            foreach ($data as $row) {
                fputcsv($handle, $row, ';');
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    /**
     * Format expenses by category for export.
     */
    public function formatExpensesByCategoryForExport(array $reportData): array
    {
        $headers = ['Categoría', 'Monto', 'Porcentaje'];
        $rows = [];

        foreach ($reportData['data'] as $item) {
            $rows[] = [
                $item['category_name'],
                number_format($item['total'], 2, ',', '.'),
                $item['percentage'] . '%',
            ];
        }

        $rows[] = ['TOTAL', number_format($reportData['total'], 2, ',', '.'), '100%'];

        return ['headers' => $headers, 'rows' => $rows];
    }

    /**
     * Format income vs expenses for export.
     */
    public function formatIncomeVsExpensesForExport(array $reportData): array
    {
        $headers = ['Período', 'Ingresos', 'Gastos', 'Balance'];
        $rows = [];

        foreach ($reportData['data'] as $item) {
            $rows[] = [
                $item['month_label'],
                number_format($item['income'], 2, ',', '.'),
                number_format($item['expense'], 2, ',', '.'),
                number_format($item['balance'], 2, ',', '.'),
            ];
        }

        return ['headers' => $headers, 'rows' => $rows];
    }

    /**
     * Format cash flow for export.
     */
    public function formatCashFlowForExport(array $reportData): array
    {
        $headers = ['Fecha', 'Ingresos', 'Gastos', 'Neto', 'Acumulado'];
        $rows = [];

        foreach ($reportData['data'] as $item) {
            $rows[] = [
                $item['date'],
                number_format($item['income'], 2, ',', '.'),
                number_format($item['expense'], 2, ',', '.'),
                number_format($item['net'], 2, ',', '.'),
                number_format($item['accumulated'], 2, ',', '.'),
            ];
        }

        return ['headers' => $headers, 'rows' => $rows];
    }

    /**
     * Format debt summary for export.
     */
    public function formatDebtSummaryForExport(array $reportData): array
    {
        $headers = ['Tipo', 'Cantidad', 'Deuda Total', 'Pago Mensual'];
        $rows = [];

        foreach ($reportData['credits']['by_type'] as $item) {
            $rows[] = [
                $item['type_label'],
                $item['count'],
                number_format($item['total_debt'], 2, ',', '.'),
                number_format($item['total_monthly'], 2, ',', '.'),
            ];
        }

        return ['headers' => $headers, 'rows' => $rows];
    }
}
