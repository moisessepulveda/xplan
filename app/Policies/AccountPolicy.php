<?php

namespace App\Policies;

use App\Models\Account;
use App\Models\User;

class AccountPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->active_planning_id !== null;
    }

    public function view(User $user, Account $account): bool
    {
        return $user->active_planning_id === $account->planning_id;
    }

    public function create(User $user): bool
    {
        if (!$user->active_planning_id) {
            return false;
        }

        return $user->canEditPlanning($user->activePlanning);
    }

    public function update(User $user, Account $account): bool
    {
        if ($user->active_planning_id !== $account->planning_id) {
            return false;
        }

        return $user->canEditPlanning($user->activePlanning);
    }

    public function delete(User $user, Account $account): bool
    {
        if ($user->active_planning_id !== $account->planning_id) {
            return false;
        }

        return $user->canAdminPlanning($user->activePlanning);
    }

    public function restore(User $user, Account $account): bool
    {
        return $this->update($user, $account);
    }

    public function forceDelete(User $user, Account $account): bool
    {
        return $this->delete($user, $account);
    }
}
