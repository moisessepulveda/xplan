<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'parent_id' => $this->parent_id,
            'name' => $this->name,
            'full_name' => $this->full_name,
            'type' => $this->type,
            'type_label' => $this->type->label(),
            'type_color' => $this->type->color(),
            'icon' => $this->icon,
            'color' => $this->color,
            'is_system' => $this->is_system,
            'system_type' => $this->system_type,
            'is_archived' => $this->is_archived,
            'order' => $this->order,
            'children' => CategoryResource::collection($this->whenLoaded('children')),
            'parent' => new CategoryResource($this->whenLoaded('parent')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
