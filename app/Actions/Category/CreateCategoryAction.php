<?php

namespace App\Actions\Category;

use App\Models\Category;

class CreateCategoryAction
{
    public function execute(array $data): Category
    {
        return Category::create([
            'planning_id' => $data['planning_id'] ?? auth()->user()->active_planning_id,
            'parent_id' => $data['parent_id'] ?? null,
            'created_by' => $data['created_by'] ?? auth()->id(),
            'name' => $data['name'],
            'type' => $data['type'],
            'icon' => $data['icon'] ?? null,
            'color' => $data['color'] ?? null,
            'is_system' => $data['is_system'] ?? false,
        ]);
    }

    public function createMany(array $categories, int $planningId, int $createdBy): array
    {
        $created = [];

        foreach ($categories as $categoryData) {
            $created[] = $this->execute([
                ...$categoryData,
                'planning_id' => $planningId,
                'created_by' => $createdBy,
            ]);
        }

        return $created;
    }
}
