<?php

namespace App\Actions\Category;

use App\Models\Category;

class ReorderCategoriesAction
{
    public function execute(array $orderedIds): void
    {
        Category::reorder($orderedIds);
    }

    public function moveToParent(Category $category, ?int $parentId): Category
    {
        // Validate that the new parent is not a descendant
        if ($parentId) {
            $parent = Category::find($parentId);
            if ($parent && $this->isDescendant($category, $parent)) {
                throw new \InvalidArgumentException('Cannot move a category to its own descendant.');
            }
        }

        $category->update(['parent_id' => $parentId]);

        return $category->fresh();
    }

    private function isDescendant(Category $potentialAncestor, Category $potentialDescendant): bool
    {
        $current = $potentialDescendant;

        while ($current->parent_id) {
            if ($current->parent_id === $potentialAncestor->id) {
                return true;
            }
            $current = $current->parent;
        }

        return false;
    }
}
