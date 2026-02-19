<?php

namespace App\Actions\Credit;

use App\Models\Credit;
use App\Models\Planning;
use App\Services\AmortizationCalculator;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class GenerateAmortizationTableAction
{
    public function __construct(
        private AmortizationCalculator $calculator
    ) {}

    public function execute(Credit $credit): Credit
    {
        return DB::transaction(function () use ($credit) {
            // Delete existing installments that are not paid
            $credit->installments()
                ->whereIn('status', ['pending', 'overdue'])
                ->delete();

            // Get precision from planning settings
            $planning = Planning::find($credit->planning_id);
            $precision = ($planning && !$planning->show_decimals) ? 0 : 2;

            // Always pass annual rate to the calculator
            $annualRate = (float) $credit->interest_rate;
            if ($credit->interest_rate_type === 'monthly') {
                $annualRate = $annualRate * 12;
            }

            $installments = $this->calculator->generateFrenchAmortization(
                (float) $credit->pending_amount,
                $annualRate,
                $credit->pending_installments_count ?: $credit->term_months,
                Carbon::now(),
                $credit->payment_day,
                0, // insurance
                0, // other_charges
                $credit->monthly_payment ? (float) $credit->monthly_payment : null,
                $precision
            );

            $lastPaidNumber = $credit->installments()->where('status', 'paid')->max('number') ?? 0;

            foreach ($installments as $index => $installment) {
                $installment['number'] = $lastPaidNumber + $index + 1;
                $credit->installments()->create($installment);
            }

            return $credit->fresh(['installments']);
        });
    }
}
