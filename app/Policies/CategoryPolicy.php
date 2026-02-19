<?php

namespace App\Policies;

use App\Models\Category;
use App\Models\User;

class CategoryPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->active_planning_id !== null;
    }

    public function view(User $user, Category $category): bool
    {
        return $user->active_planning_id === $category->planning_id;
    }

    public function create(User $user): bool
    {
        if (!$user->active_planning_id) {
            return false;
        }

        return $user->canEditPlanning($user->activePlanning);
    }

    public function update(User $user, Category $category): bool
    {
        if ($user->active_planning_id !== $category->planning_id) {
            return false;
        }

        return $user->canEditPlanning($user->activePlanning);
    }

    public function delete(User $user, Category $category): bool
    {
        if ($user->active_planning_id !== $category->planning_id) {
            return false;
        }

        // System categories cannot be deleted
        if ($category->is_system) {
            return false;
        }

        return $user->canAdminPlanning($user->activePlanning);
    }

    public function restore(User $user, Category $category): bool
    {
        return $this->update($user, $category);
    }

    public function forceDelete(User $user, Category $category): bool
    {
        return $this->delete($user, $category);
    }
}
