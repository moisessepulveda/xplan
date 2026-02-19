<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BudgetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'planning_id' => $this->planning_id,
            'name' => $this->name,
            'type' => $this->type,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'active' => (bool) $this->active,
            'created_by' => $this->created_by,
            'total_budgeted' => $this->totalBudgeted,

            // Relationships
            'lines' => BudgetLineResource::collection($this->whenLoaded('lines')),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
