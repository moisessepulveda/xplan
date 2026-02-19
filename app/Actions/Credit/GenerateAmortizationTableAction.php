<?php

namespace App\Actions\Credit;

use App\Models\Credit;
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

            $installments = $this->calculator->generateFrenchAmortization(
                (float) $credit->pending_amount,
                (float) $credit->interest_rate,
                $credit->pending_installments_count ?: $credit->term_months,
                Carbon::now(),
                $credit->payment_day,
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
