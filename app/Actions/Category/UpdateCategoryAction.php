<?php

namespace App\Actions\Category;

use App\Models\Category;

class UpdateCategoryAction
{
    public function execute(Category $category, array $data): Category
    {
        $category->update([
            'parent_id' => array_key_exists('parent_id', $data) ? $data['parent_id'] : $category->parent_id,
            'name' => $data['name'] ?? $category->name,
            'icon' => $data['icon'] ?? $category->icon,
            'color' => $data['color'] ?? $category->color,
            'is_archived' => $data['is_archived'] ?? $category->is_archived,
        ]);

        return $category->fresh();
    }

    public function archive(Category $category): Category
    {
        $category->archive();
        return $category->fresh();
    }

    public function restore(Category $category): Category
    {
        $category->update(['is_archived' => false]);
        return $category->fresh();
    }
}
