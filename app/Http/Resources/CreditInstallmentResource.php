<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CreditInstallmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'credit_id' => $this->credit_id,
            'number' => $this->number,
            'due_date' => $this->due_date->format('Y-m-d'),
            'amount' => (float) $this->amount,
            'principal' => (float) $this->principal,
            'interest' => (float) $this->interest,
            'insurance' => (float) $this->insurance,
            'other_charges' => (float) $this->other_charges,
            'status' => $this->status,
            'status_label' => $this->status->label(),
            'status_color' => $this->status->color(),
            'paid_date' => $this->paid_date?->format('Y-m-d'),
            'paid_amount' => (float) $this->paid_amount,
            'remaining_amount' => $this->remaining_amount,
            'is_overdue' => $this->isOverdue(),
            'notes' => $this->notes,
        ];
    }
}
