<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReceivableResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'type_label' => $this->type->label(),
            'type_color' => $this->type->color(),
            'status' => $this->status,
            'status_label' => $this->status->label(),
            'status_color' => $this->status->color(),
            'person_name' => $this->person_name,
            'person_contact' => $this->person_contact,
            'original_amount' => (float) $this->original_amount,
            'pending_amount' => (float) $this->pending_amount,
            'paid_amount' => $this->paid_amount,
            'progress' => $this->progress,
            'currency' => $this->currency,
            'concept' => $this->concept,
            'due_date' => $this->due_date?->format('Y-m-d'),
            'is_overdue' => $this->isOverdue(),
            'notes' => $this->notes,
            'created_by' => $this->created_by,
            'creator' => new UserResource($this->whenLoaded('creator')),

            // Relationships
            'payments' => ReceivablePaymentResource::collection($this->whenLoaded('payments')),
            'reminders' => $this->whenLoaded('reminders'),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
