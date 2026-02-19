<?php

namespace App\Actions\Receivable;

use App\Models\Receivable;

class UpdateReceivableAction
{
    public function execute(Receivable $receivable, array $data): Receivable
    {
        $receivable->update(array_filter([
            'person_name' => $data['person_name'] ?? null,
            'person_contact' => array_key_exists('person_contact', $data) ? $data['person_contact'] : null,
            'concept' => $data['concept'] ?? null,
            'due_date' => array_key_exists('due_date', $data) ? $data['due_date'] : null,
            'notes' => array_key_exists('notes', $data) ? $data['notes'] : null,
        ], fn($value) => $value !== null));

        return $receivable->fresh();
    }
}
