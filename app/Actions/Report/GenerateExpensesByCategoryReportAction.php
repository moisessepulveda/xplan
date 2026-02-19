<?php

namespace App\Actions\Report;

use App\Services\ReportGenerator;

class GenerateExpensesByCategoryReportAction
{
    public function __construct(private ReportGenerator $reportGenerator) {}

    public function execute(
        ?int $planningId = null,
        ?string $startDate = null,
        ?string $endDate = null,
    ): array {
        return $this->reportGenerator->getExpensesByCategory($planningId, $startDate, $endDate);
    }
}
