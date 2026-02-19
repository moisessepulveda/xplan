<?php

namespace App\Actions\Credit;

use App\Models\Credit;
use App\Models\Planning;
use App\Services\AmortizationCalculator;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CreateCreditAction
{
    public function __construct(
        private AmortizationCalculator $calculator
    ) {}

    public function execute(array $data): Credit
    {
        return DB::transaction(function () use ($data) {
            $data['pending_amount'] = $data['original_amount'];
            $data['interest_rate_type'] = $data['interest_rate_type'] ?? 'annual';

            // Get precision from planning settings
            $planning = Planning::find($data['planning_id']);
            $precision = ($planning && !$planning->show_decimals) ? 0 : 2;

            // Calculate monthly rate based on interest_rate_type
            $interestRate = $data['interest_rate'];
            if ($data['interest_rate_type'] === 'annual') {
                $monthlyRate = $interestRate / 100 / 12;
            } else {
                $monthlyRate = $interestRate / 100;
            }

            // Calculate monthly payment if not provided
            if (empty($data['monthly_payment']) && !empty($data['interest_rate'])) {
                $data['monthly_payment'] = round(
                    $this->calculator->calculateMonthlyPayment(
                        $data['original_amount'],
                        $monthlyRate,
                        $data['term_months']
                    ),
                    $precision
                );
            } else if (!empty($data['monthly_payment'])) {
                // Round user-provided monthly payment to correct precision
                $data['monthly_payment'] = round($data['monthly_payment'], $precision);
            }

            // Calculate estimated end date if not provided
            if (empty($data['estimated_end_date'])) {
                $data['estimated_end_date'] = Carbon::parse($data['start_date'])
                    ->addMonths($data['term_months'])
                    ->format('Y-m-d');
            }

            $credit = Credit::create($data);

            // Generate amortization table for non-credit-card types
            if ($credit->type->value !== 'credit_card') {
                // Always pass annual rate to the calculator
                $annualRate = (float) $credit->interest_rate;
                if ($credit->interest_rate_type === 'monthly') {
                    $annualRate = $annualRate * 12;
                }

                $installments = $this->calculator->generateFrenchAmortization(
                    (float) $credit->original_amount,
                    $annualRate,
                    $credit->term_months,
                    Carbon::parse($credit->start_date),
                    $credit->payment_day,
                    0, // insurance
                    0, // other_charges
                    $credit->monthly_payment ? (float) $credit->monthly_payment : null,
                    $precision
                );

                foreach ($installments as $installment) {
                    $credit->installments()->create($installment);
                }
            }

            return $credit;
        });
    }
}
