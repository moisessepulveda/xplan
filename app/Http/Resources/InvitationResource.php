<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvitationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'planning_id' => $this->planning_id,
            'email' => $this->email,
            'role' => $this->role->value,
            'role_label' => $this->role->label(),
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'token' => $this->token,
            'is_expired' => $this->isExpired(),
            'is_pending' => $this->isPending(),
            'expires_at' => $this->expires_at->format('Y-m-d H:i:s'),
            'responded_at' => $this->responded_at?->format('Y-m-d H:i:s'),

            // Relationships
            'planning' => $this->whenLoaded('planning', fn() => [
                'id' => $this->planning->id,
                'name' => $this->planning->name,
                'icon' => $this->planning->icon,
                'color' => $this->planning->color,
            ]),
            'created_by' => $this->whenLoaded('createdBy', fn() => [
                'id' => $this->createdBy->id,
                'name' => $this->createdBy->name,
            ]),

            'created_at' => $this->created_at,
        ];
    }
}
