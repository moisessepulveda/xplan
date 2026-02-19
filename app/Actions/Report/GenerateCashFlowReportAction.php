<?php

namespace App\Actions\Report;

use App\Services\ReportGenerator;

class GenerateCashFlowReportAction
{
    public function __construct(private ReportGenerator $reportGenerator) {}

    public function execute(
        ?int $planningId = null,
        ?string $startDate = null,
        ?string $endDate = null,
    ): array {
        return $this->reportGenerator->getCashFlow($planningId, $startDate, $endDate);
    }
}
