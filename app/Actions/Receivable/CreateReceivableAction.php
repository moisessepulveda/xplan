<?php

namespace App\Actions\Receivable;

use App\Actions\Transaction\CreateTransactionAction;
use App\Models\Receivable;
use Illuminate\Support\Facades\DB;

class CreateReceivableAction
{
    public function __construct(
        private CreateTransactionAction $createTransactionAction
    ) {}

    public function execute(array $data): Receivable
    {
        return DB::transaction(function () use ($data) {
            $planningId = $data['planning_id'] ?? auth()->user()->active_planning_id;

            $receivable = Receivable::create([
                'planning_id' => $planningId,
                'created_by' => $data['created_by'] ?? auth()->id(),
                'type' => $data['type'],
                'person_name' => $data['person_name'],
                'person_contact' => $data['person_contact'] ?? null,
                'original_amount' => $data['amount'],
                'pending_amount' => $data['amount'],
                'currency' => $data['currency'] ?? auth()->user()->activePlanning?->currency ?? 'CLP',
                'concept' => $data['concept'],
                'due_date' => $data['due_date'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            // Create associated transaction if requested
            if (!empty($data['create_transaction']) && !empty($data['account_id'])) {
                $isReceivable = $data['type'] === 'receivable';

                // For receivable (me deben): expense (I gave money)
                // For payable (yo debo): income (I received money)
                $transactionType = $isReceivable ? 'expense' : 'income';
                $description = $isReceivable
                    ? "Préstamo a {$data['person_name']}"
                    : "Préstamo de {$data['person_name']}";

                $this->createTransactionAction->execute([
                    'planning_id' => $planningId,
                    'account_id' => $data['account_id'],
                    'type' => $transactionType,
                    'amount' => $data['amount'],
                    'description' => $description . " - {$data['concept']}",
                    'date' => $data['transaction_date'] ?? now()->format('Y-m-d'),
                    'category_id' => $data['category_id'] ?? null,
                ]);
            }

            return $receivable;
        });
    }
}
