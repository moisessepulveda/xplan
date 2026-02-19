<?php

namespace App\Actions\Planning;

use App\Models\Planning;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class SwitchActivePlanningAction
{
    /**
     * Switch the user's active planning.
     */
    public function execute(User $user, Planning $planning): void
    {
        // Verify user has access to this planning
        if (!$this->userHasAccess($user, $planning)) {
            throw ValidationException::withMessages([
                'planning' => 'No tienes acceso a esta planificación.',
            ]);
        }

        $user->update(['active_planning_id' => $planning->id]);
    }

    /**
     * Check if user has access to the planning.
     */
    public function userHasAccess(User $user, Planning $planning): bool
    {
        return $user->plannings()
            ->where('plannings.id', $planning->id)
            ->exists();
    }
}
