<?php

namespace App\Services;

use Carbon\Carbon;

class AmortizationCalculator
{
    /**
     * Generate a French amortization table (fixed monthly payment).
     */
    public function generateFrenchAmortization(
        float $principal,
        float $annualRate,
        int $termMonths,
        Carbon $startDate,
        int $paymentDay = 1,
        float $insurance = 0,
        float $otherCharges = 0
    ): array {
        $monthlyRate = $annualRate / 100 / 12;
        $monthlyPayment = $this->calculateMonthlyPayment($principal, $monthlyRate, $termMonths);

        $installments = [];
        $remainingPrincipal = $principal;

        for ($i = 1; $i <= $termMonths; $i++) {
            $interestPayment = $remainingPrincipal * $monthlyRate;
            $principalPayment = $monthlyPayment - $interestPayment;

            // Last installment: adjust for rounding
            if ($i === $termMonths) {
                $principalPayment = $remainingPrincipal;
                $monthlyPayment = $principalPayment + $interestPayment;
            }

            $dueDate = $startDate->copy()->addMonths($i);
            $dueDate->day = min($paymentDay, $dueDate->daysInMonth);

            $installments[] = [
                'number' => $i,
                'due_date' => $dueDate->format('Y-m-d'),
                'amount' => round($monthlyPayment + $insurance + $otherCharges, 2),
                'principal' => round($principalPayment, 2),
                'interest' => round($interestPayment, 2),
                'insurance' => $insurance,
                'other_charges' => $otherCharges,
            ];

            $remainingPrincipal -= $principalPayment;
        }

        return $installments;
    }

    /**
     * Calculate fixed monthly payment (French system).
     */
    public function calculateMonthlyPayment(float $principal, float $monthlyRate, int $termMonths): float
    {
        if ($monthlyRate === 0.0) {
            return $principal / $termMonths;
        }

        return $principal * ($monthlyRate * pow(1 + $monthlyRate, $termMonths))
            / (pow(1 + $monthlyRate, $termMonths) - 1);
    }

    /**
     * Simulate prepayment impact.
     */
    public function simulatePrepayment(
        float $currentPending,
        float $annualRate,
        int $remainingMonths,
        float $prepaymentAmount,
        string $strategy = 'reduce_term' // reduce_term | reduce_payment
    ): array {
        $monthlyRate = $annualRate / 100 / 12;
        $newPending = $currentPending - $prepaymentAmount;

        if ($newPending <= 0) {
            return [
                'new_pending' => 0,
                'original_remaining_months' => $remainingMonths,
                'new_remaining_months' => 0,
                'original_monthly_payment' => $this->calculateMonthlyPayment($currentPending, $monthlyRate, $remainingMonths),
                'new_monthly_payment' => 0,
                'total_interest_saved' => $this->calculateTotalInterest($currentPending, $monthlyRate, $remainingMonths),
                'months_saved' => $remainingMonths,
                'strategy' => $strategy,
            ];
        }

        $originalMonthly = $this->calculateMonthlyPayment($currentPending, $monthlyRate, $remainingMonths);
        $originalTotalInterest = $this->calculateTotalInterest($currentPending, $monthlyRate, $remainingMonths);

        if ($strategy === 'reduce_term') {
            // Keep same monthly payment, reduce term
            $newMonthly = $originalMonthly;
            $newTermMonths = $this->calculateTermMonths($newPending, $monthlyRate, $newMonthly);
            $newTotalInterest = $this->calculateTotalInterest($newPending, $monthlyRate, $newTermMonths);

            return [
                'new_pending' => round($newPending, 2),
                'original_remaining_months' => $remainingMonths,
                'new_remaining_months' => $newTermMonths,
                'original_monthly_payment' => round($originalMonthly, 2),
                'new_monthly_payment' => round($newMonthly, 2),
                'total_interest_saved' => round($originalTotalInterest - $newTotalInterest, 2),
                'months_saved' => $remainingMonths - $newTermMonths,
                'strategy' => $strategy,
            ];
        }

        // reduce_payment: Keep same term, reduce monthly payment
        $newMonthly = $this->calculateMonthlyPayment($newPending, $monthlyRate, $remainingMonths);
        $newTotalInterest = $this->calculateTotalInterest($newPending, $monthlyRate, $remainingMonths);

        return [
            'new_pending' => round($newPending, 2),
            'original_remaining_months' => $remainingMonths,
            'new_remaining_months' => $remainingMonths,
            'original_monthly_payment' => round($originalMonthly, 2),
            'new_monthly_payment' => round($newMonthly, 2),
            'total_interest_saved' => round($originalTotalInterest - $newTotalInterest, 2),
            'months_saved' => 0,
            'payment_reduction' => round($originalMonthly - $newMonthly, 2),
            'strategy' => $strategy,
        ];
    }

    /**
     * Calculate total interest over the life of the loan.
     */
    public function calculateTotalInterest(float $principal, float $monthlyRate, int $termMonths): float
    {
        if ($monthlyRate === 0.0) {
            return 0;
        }

        $monthlyPayment = $this->calculateMonthlyPayment($principal, $monthlyRate, $termMonths);
        return ($monthlyPayment * $termMonths) - $principal;
    }

    /**
     * Calculate remaining months given current balance and monthly payment.
     */
    public function calculateTermMonths(float $principal, float $monthlyRate, float $monthlyPayment): int
    {
        if ($monthlyRate === 0.0) {
            return (int) ceil($principal / $monthlyPayment);
        }

        if ($monthlyPayment <= $principal * $monthlyRate) {
            return 999; // Payment doesn't cover interest
        }

        $months = -log(1 - ($principal * $monthlyRate / $monthlyPayment)) / log(1 + $monthlyRate);
        return (int) ceil($months);
    }

    /**
     * Get credit summary stats.
     */
    public function getCreditSummary(
        float $originalAmount,
        float $pendingAmount,
        float $annualRate,
        int $termMonths,
        int $paidInstallments
    ): array {
        $monthlyRate = $annualRate / 100 / 12;

        return [
            'paid_amount' => round($originalAmount - $pendingAmount, 2),
            'progress' => $originalAmount > 0
                ? round((($originalAmount - $pendingAmount) / $originalAmount) * 100, 1)
                : 0,
            'remaining_months' => max(0, $termMonths - $paidInstallments),
            'total_interest' => round($this->calculateTotalInterest($originalAmount, $monthlyRate, $termMonths), 2),
        ];
    }
}
