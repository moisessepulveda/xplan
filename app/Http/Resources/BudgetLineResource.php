<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BudgetLineResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'budget_id' => $this->budget_id,
            'category_id' => $this->category_id,
            'amount' => (float) $this->amount,
            'alert_at_50' => (bool) $this->alert_at_50,
            'alert_at_80' => (bool) $this->alert_at_80,
            'alert_at_100' => (bool) $this->alert_at_100,
            'notes' => $this->notes,

            // Relationships
            'category' => $this->whenLoaded('category'),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
