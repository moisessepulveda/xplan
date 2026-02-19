<?php

namespace App\Policies;

use App\Models\Budget;
use App\Models\User;

class BudgetPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->active_planning_id !== null;
    }

    public function view(User $user, Budget $budget): bool
    {
        return $user->active_planning_id === $budget->planning_id;
    }

    public function create(User $user): bool
    {
        if (!$user->active_planning_id) {
            return false;
        }

        return $user->canEditPlanning($user->activePlanning);
    }

    public function update(User $user, Budget $budget): bool
    {
        if ($user->active_planning_id !== $budget->planning_id) {
            return false;
        }

        return $user->canEditPlanning($user->activePlanning);
    }

    public function delete(User $user, Budget $budget): bool
    {
        if ($user->active_planning_id !== $budget->planning_id) {
            return false;
        }

        return $user->canEditPlanning($user->activePlanning);
    }

    public function restore(User $user, Budget $budget): bool
    {
        return $this->update($user, $budget);
    }

    public function forceDelete(User $user, Budget $budget): bool
    {
        return $this->delete($user, $budget);
    }
}
