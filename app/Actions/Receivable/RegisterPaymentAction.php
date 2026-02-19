<?php

namespace App\Actions\Receivable;

use App\Actions\Transaction\CreateTransactionAction;
use App\Models\Receivable;
use App\Models\ReceivablePayment;
use Illuminate\Support\Facades\DB;

class RegisterPaymentAction
{
    public function __construct(
        private CreateTransactionAction $createTransactionAction
    ) {}

    public function execute(Receivable $receivable, array $data): ReceivablePayment
    {
        return DB::transaction(function () use ($receivable, $data) {
            // Create the associated transaction
            $transaction = $this->createTransactionAction->execute([
                'planning_id' => $receivable->planning_id,
                'account_id' => $data['account_id'],
                'type' => $receivable->type->transactionType()->value,
                'amount' => $data['amount'],
                'description' => "Pago: {$receivable->concept} - {$receivable->person_name}",
                'date' => $data['date'],
                'category_id' => $data['category_id'] ?? null,
            ]);

            // Register the payment
            $payment = ReceivablePayment::create([
                'receivable_id' => $receivable->id,
                'amount' => $data['amount'],
                'date' => $data['date'],
                'account_id' => $data['account_id'],
                'transaction_id' => $transaction->id,
                'notes' => $data['notes'] ?? null,
                'registered_by' => auth()->id(),
            ]);

            // Update the receivable's pending amount and status
            $receivable->decrement('pending_amount', $data['amount']);
            $receivable->refresh();
            $receivable->recalculateStatus();

            return $payment;
        });
    }
}
