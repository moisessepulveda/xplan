<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'type_label' => $this->type->label(),
            'type_icon' => $this->type->icon(),
            'currency' => $this->currency,
            'initial_balance' => (float) $this->initial_balance,
            'current_balance' => (float) $this->current_balance,
            'icon' => $this->icon,
            'color' => $this->color,
            'description' => $this->description,
            'include_in_total' => $this->include_in_total,
            'is_archived' => $this->is_archived,
            'order' => $this->order,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
