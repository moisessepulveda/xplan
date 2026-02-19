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

        // Always pass annual rate to the calculator
        $annualRate = (float) $credit->interest_rate;
        if ($credit->interest_rate_type === 'monthly') {
            $annualRate = $annualRate * 12;
        }

        return $this->calculator->simulatePrepayment(
            (float) $credit->pending_amount,
            $annualRate,
            $remainingMonths,
            $amount,
            $strategy,
        );
    }
}
