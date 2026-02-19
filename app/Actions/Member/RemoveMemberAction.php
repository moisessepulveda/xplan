<?php

namespace App\Actions\Member;

use App\Models\PlanningMember;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class RemoveMemberAction
{
    public function execute(PlanningMember $membership): void
    {
        DB::transaction(function () use ($membership) {
            // Cannot remove the owner
            if ($membership->isOwner()) {
                throw new \RuntimeException('No se puede eliminar al propietario del planning.');
            }

            $user = $membership->user;
            $planningId = $membership->planning_id;

            $membership->delete();

            // If this was the user's active planning, switch to another one
            if ($user->active_planning_id === $planningId) {
                $nextPlanning = $user->planningMemberships()->first();
                $user->update([
                    'active_planning_id' => $nextPlanning?->planning_id,
                ]);
            }
        });
    }
}
