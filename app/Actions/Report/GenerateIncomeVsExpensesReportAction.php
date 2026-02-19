<?php

namespace App\Actions\Report;

use App\Services\ReportGenerator;

class GenerateIncomeVsExpensesReportAction
{
    public function __construct(private ReportGenerator $reportGenerator) {}

    public function execute(?int $planningId = null, int $months = 6): array
    {
        return $this->reportGenerator->getIncomeVsExpenses($planningId, $months);
    }
}
