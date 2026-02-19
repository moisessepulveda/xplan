<?php

namespace App\Actions\Transaction;

use App\Models\Transaction;

class DuplicateTransactionAction
{
    public function __construct(
        private CreateTransactionAction $createAction
    ) {}

    public function execute(Transaction $transaction, ?string $date = null): Transaction
    {
        return $this->createAction->execute([
            'planning_id' => $transaction->planning_id,
            'account_id' => $transaction->account_id,
            'destination_account_id' => $transaction->destination_account_id,
            'category_id' => $transaction->category_id,
            'created_by' => auth()->id(),
            'type' => $transaction->type->value,
            'amount' => $transaction->amount,
            'description' => $transaction->description,
            'date' => $date ?? now()->toDateString(),
            'time' => $transaction->time,
            'tags' => $transaction->tags ?? [],
            'attachments' => [],
        ]);
    }
}
