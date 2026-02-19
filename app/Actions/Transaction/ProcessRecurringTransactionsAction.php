<?php

namespace App\Actions\Transaction;

use App\Models\RecurringTransaction;
use Illuminate\Support\Collection;

class ProcessRecurringTransactionsAction
{
    public function __construct(
        private CreateTransactionAction $createAction
    ) {}

    public function execute(): Collection
    {
        $dueRecurrences = RecurringTransaction::due()->get();
        $createdTransactions = collect();

        foreach ($dueRecurrences as $recurring) {
            $transaction = $this->processRecurrence($recurring);
            if ($transaction) {
                $createdTransactions->push($transaction);
            }
        }

        return $createdTransactions;
    }

    private function processRecurrence(RecurringTransaction $recurring): ?\App\Models\Transaction
    {
        $transaction = $this->createAction->execute([
            'planning_id' => $recurring->planning_id,
            'account_id' => $recurring->account_id,
            'destination_account_id' => $recurring->destination_account_id,
            'category_id' => $recurring->category_id,
            'created_by' => $recurring->created_by,
            'type' => $recurring->type->value,
            'amount' => $recurring->amount,
            'description' => $recurring->description,
            'date' => $recurring->next_run_date->toDateString(),
            'is_recurring' => true,
            'recurring_transaction_id' => $recurring->id,
            'tags' => $recurring->tags ?? [],
        ]);

        $recurring->calculateNextRunDate();

        return $transaction;
    }
}
