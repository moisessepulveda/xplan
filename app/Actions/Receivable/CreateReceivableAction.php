<?php

namespace App\Actions\Receivable;

use App\Models\Receivable;

class CreateReceivableAction
{
    public function execute(array $data): Receivable
    {
        return Receivable::create([
            'planning_id' => $data['planning_id'] ?? auth()->user()->active_planning_id,
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
    }
}
