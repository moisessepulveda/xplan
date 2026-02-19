<?php

namespace App\Policies;

use App\Models\Credit;
use App\Models\User;

class CreditPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->active_planning_id !== null;
    }

    public function view(User $user, Credit $credit): bool
    {
        return $user->active_planning_id === $credit->planning_id;
    }

    public function create(User $user): bool
    {
        if (!$user->active_planning_id) {
            return false;
        }

        return $user->canEditPlanning($user->activePlanning);
    }

    public function update(User $user, Credit $credit): bool
    {
        if ($user->active_planning_id !== $credit->planning_id) {
            return false;
        }

        return $user->canEditPlanning($user->activePlanning);
    }

    public function delete(User $user, Credit $credit): bool
    {
        if ($user->active_planning_id !== $credit->planning_id) {
            return false;
        }

        return $user->canEditPlanning($user->activePlanning);
    }

    public function restore(User $user, Credit $credit): bool
    {
        return $this->update($user, $credit);
    }

    public function forceDelete(User $user, Credit $credit): bool
    {
        return $this->delete($user, $credit);
    }
}
