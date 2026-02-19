<?php

namespace App\Actions\Credit;

use App\Models\Credit;
use App\Services\AmortizationCalculator;

class SimulatePrepaymentAction
{
    public function __construct(
        private AmortizationCalculator $calculator
    ) {}

    public function execute(Credit $credit, float $amount, string $strategy = 'reduce_term'): array
    {
        $remainingMonths = $credit->pending_installments_count ?: $credit->term_months;

        return $this->calculator->simulatePrepayment(
            (float) $credit->pending_amount,
            (float) $credit->interest_rate,
            $remainingMonths,
            $amount,
            $strategy,
        );
    }
}
