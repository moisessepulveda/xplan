<?php

namespace App\Actions\Credit;

use App\Actions\Transaction\CreateTransactionAction;
use App\Enums\CreditStatus;
use App\Enums\InstallmentStatus;
use App\Models\Category;
use App\Models\Credit;
use App\Models\CreditInstallment;
use Illuminate\Support\Facades\DB;

class PayInstallmentAction
{
    public function __construct(
        private CreateTransactionAction $createTransactionAction
    ) {}

    public function execute(CreditInstallment $installment, array $data): CreditInstallment
    {
        return DB::transaction(function () use ($installment, $data) {
            $credit = $installment->credit;
            $amount = $data['amount'] ?? (float) $installment->amount;

            // Get the credits system category
            $creditsCategory = Category::where('planning_id', $credit->planning_id)
                ->credits()
                ->first();

            // Create the expense transaction
            $transaction = $this->createTransactionAction->execute([
                'planning_id' => $credit->planning_id,
                'account_id' => $data['account_id'],
                'type' => 'expense',
                'amount' => $amount,
                'description' => "Cuota #{$installment->number} - {$credit->name}",
                'date' => $data['date'] ?? now()->format('Y-m-d'),
                'category_id' => $creditsCategory?->id,
            ]);

            // Determine status
            $totalPaid = (float) $installment->paid_amount + $amount;
            $status = $totalPaid >= (float) $installment->amount
                ? InstallmentStatus::PAID
                : InstallmentStatus::PARTIAL;

            $installment->update([
                'status' => $status,
                'paid_amount' => $totalPaid,
                'paid_date' => $data['date'] ?? now()->format('Y-m-d'),
                'transaction_id' => $transaction->id,
            ]);

            // Update credit pending amount
            $credit->decrement('pending_amount', $amount);
            $credit->refresh();

            // Check if credit is fully paid
            if ((float) $credit->pending_amount <= 0) {
                $credit->markAsPaid();
            }

            return $installment->fresh();
        });
    }
}
