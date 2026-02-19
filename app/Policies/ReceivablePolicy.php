<?php

namespace App\Policies;

use App\Models\Receivable;
use App\Models\User;

class ReceivablePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->active_planning_id !== null;
    }

    public function view(User $user, Receivable $receivable): bool
    {
        return $user->active_planning_id === $receivable->planning_id;
    }

    public function create(User $user): bool
    {
        if (!$user->active_planning_id) {
            return false;
        }

        return $user->canEditPlanning($user->activePlanning);
    }

    public function update(User $user, Receivable $receivable): bool
    {
        if ($user->active_planning_id !== $receivable->planning_id) {
            return false;
        }

        return $user->canEditPlanning($user->activePlanning);
    }

    public function delete(User $user, Receivable $receivable): bool
    {
        if ($user->active_planning_id !== $receivable->planning_id) {
            return false;
        }

        return $user->canEditPlanning($user->activePlanning);
    }

    public function restore(User $user, Receivable $receivable): bool
    {
        return $this->update($user, $receivable);
    }

    public function forceDelete(User $user, Receivable $receivable): bool
    {
        return $this->delete($user, $receivable);
    }
}
