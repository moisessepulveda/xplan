<?php

namespace App\Policies;

use App\Models\Transaction;
use App\Models\User;

class TransactionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->active_planning_id !== null;
    }

    public function view(User $user, Transaction $transaction): bool
    {
        return $user->active_planning_id === $transaction->planning_id;
    }

    public function create(User $user): bool
    {
        if (!$user->active_planning_id) {
            return false;
        }

        return $user->canEditPlanning($user->activePlanning);
    }

    public function update(User $user, Transaction $transaction): bool
    {
        if ($user->active_planning_id !== $transaction->planning_id) {
            return false;
        }

        return $user->canEditPlanning($user->activePlanning);
    }

    public function delete(User $user, Transaction $transaction): bool
    {
        if ($user->active_planning_id !== $transaction->planning_id) {
            return false;
        }

        return $user->canEditPlanning($user->activePlanning);
    }

    public function restore(User $user, Transaction $transaction): bool
    {
        return $this->update($user, $transaction);
    }

    public function forceDelete(User $user, Transaction $transaction): bool
    {
        return $this->delete($user, $transaction);
    }
}
