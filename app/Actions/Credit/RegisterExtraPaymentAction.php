<?php

namespace App\Actions\Credit;

use App\Actions\Transaction\CreateTransactionAction;
use App\Models\Credit;
use App\Models\ExtraPayment;
use Illuminate\Support\Facades\DB;

class RegisterExtraPaymentAction
{
    public function __construct(
        private CreateTransactionAction $createTransactionAction
    ) {}

    public function execute(Credit $credit, array $data): ExtraPayment
    {
        return DB::transaction(function () use ($credit, $data) {
            $amount = $data['amount'];

            // Create the expense transaction
            $transaction = $this->createTransactionAction->execute([
                'planning_id' => $credit->planning_id,
                'account_id' => $data['account_id'],
                'type' => 'expense',
                'amount' => $amount,
                'description' => "Pago extra - {$credit->name}",
                'date' => $data['date'] ?? now()->format('Y-m-d'),
                'category_id' => $data['category_id'] ?? null,
            ]);

            $extraPayment = ExtraPayment::create([
                'credit_id' => $credit->id,
                'account_id' => $data['account_id'],
                'transaction_id' => $transaction->id,
                'amount' => $amount,
                'date' => $data['date'] ?? now()->format('Y-m-d'),
                'type' => $data['type'] ?? 'principal',
                'notes' => $data['notes'] ?? null,
            ]);

            // Reduce pending amount
            $credit->decrement('pending_amount', $amount);
            $credit->refresh();

            // Check if credit is fully paid
            if ((float) $credit->pending_amount <= 0) {
                $credit->markAsPaid();
            }

            return $extraPayment;
        });
    }
}
