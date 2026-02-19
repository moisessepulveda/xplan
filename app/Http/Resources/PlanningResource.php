<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlanningResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'currency' => $this->currency,
            'icon' => $this->icon,
            'color' => $this->color,
            'month_start_day' => $this->month_start_day,
            'show_decimals' => $this->show_decimals,
            'creator_id' => $this->creator_id,
            'members_count' => $this->members_count ?? $this->memberships()->count(),
            'role' => $user ? $user->roleInPlanning($this->resource)?->value : null,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
