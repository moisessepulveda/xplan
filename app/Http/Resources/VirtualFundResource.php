<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VirtualFundResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'account_id' => $this->account_id,
            'name' => $this->name,
            'current_amount' => (float) $this->current_amount,
            'goal_amount' => $this->goal_amount ? (float) $this->goal_amount : null,
            'progress' => $this->progress,
            'icon' => $this->icon,
            'color' => $this->color,
            'description' => $this->description,
            'is_default' => $this->is_default,
            'order' => $this->order,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
