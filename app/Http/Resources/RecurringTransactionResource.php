<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecurringTransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'type_label' => $this->type->label(),
            'type_color' => $this->type->color(),
            'type_icon' => $this->type->icon(),
            'amount' => (float) $this->amount,
            'description' => $this->description,
            'frequency' => $this->frequency,
            'frequency_label' => $this->frequency->label(),
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'next_run_date' => $this->next_run_date?->format('Y-m-d'),
            'last_run_date' => $this->last_run_date?->format('Y-m-d'),
            'is_active' => $this->is_active,
            'tags' => $this->tags ?? [],
            'applied_months' => $this->applied_months ?? [],
            'skipped_months' => $this->skipped_months ?? [],

            // Relationships
            'account_id' => $this->account_id,
            'account' => new AccountResource($this->whenLoaded('account')),
            'destination_account_id' => $this->destination_account_id,
            'destination_account' => new AccountResource($this->whenLoaded('destinationAccount')),
            'category_id' => $this->category_id,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'created_by' => $this->created_by,
            'creator' => new UserResource($this->whenLoaded('creator')),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
