<?php

namespace App\Actions\Credit;

use App\Models\Credit;
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

            // Calculate monthly payment if not provided
            if (empty($data['monthly_payment']) && !empty($data['interest_rate'])) {
                $monthlyRate = $data['interest_rate'] / 100 / 12;
                $data['monthly_payment'] = round(
                    $this->calculator->calculateMonthlyPayment(
                        $data['original_amount'],
                        $monthlyRate,
                        $data['term_months']
                    ),
                    2
                );
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
                $installments = $this->calculator->generateFrenchAmortization(
                    (float) $credit->original_amount,
                    (float) $credit->interest_rate,
                    $credit->term_months,
                    Carbon::parse($credit->start_date),
                    $credit->payment_day,
                );

                foreach ($installments as $installment) {
                    $credit->installments()->create($installment);
                }
            }

            return $credit;
        });
    }
}
