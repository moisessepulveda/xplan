<?php

namespace App\Actions\Member;

use App\Models\Invitation;
use App\Models\PlanningMember;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AcceptInvitationAction
{
    public function execute(Invitation $invitation, User $user): PlanningMember
    {
        return DB::transaction(function () use ($invitation, $user) {
            // Check invitation is valid
            if (!$invitation->isPending()) {
                throw new \RuntimeException('La invitación ya no es válida.');
            }

            // Check user email matches invitation
            if ($user->email !== $invitation->email) {
                throw new \RuntimeException('Esta invitación no corresponde a tu email.');
            }

            // Check user is not already a member
            if ($invitation->planning->hasMember($user)) {
                $invitation->markAsAccepted();
                return $user->planningMemberships()
                    ->where('planning_id', $invitation->planning_id)
                    ->first();
            }

            // Add user as member
            $membership = PlanningMember::create([
                'planning_id' => $invitation->planning_id,
                'user_id' => $user->id,
                'role' => $invitation->role->value,
                'invited_by_id' => $invitation->created_by_id,
                'joined_at' => now(),
            ]);

            // Mark invitation as accepted
            $invitation->markAsAccepted();

            // Set as active planning if user has none
            if (!$user->active_planning_id) {
                $user->update(['active_planning_id' => $invitation->planning_id]);
            }

            return $membership;
        });
    }
}
