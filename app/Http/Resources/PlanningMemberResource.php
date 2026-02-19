<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlanningMemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'planning_id' => $this->planning_id,
            'user_id' => $this->user_id,
            'role' => $this->role->value,
            'role_label' => $this->role->label(),
            'is_owner' => $this->isOwner(),
            'invited_by_id' => $this->invited_by_id,
            'joined_at' => $this->joined_at?->format('Y-m-d H:i:s'),

            // Relationships
            'user' => $this->whenLoaded('user', fn() => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'avatar' => $this->user->avatar,
            ]),
            'invited_by' => $this->whenLoaded('invitedBy', fn() => [
                'id' => $this->invitedBy->id,
                'name' => $this->invitedBy->name,
            ]),

            'created_at' => $this->created_at,
        ];
    }
}
