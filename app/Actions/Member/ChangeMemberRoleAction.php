<?php

namespace App\Actions\Member;

use App\Enums\MemberRole;
use App\Models\PlanningMember;

class ChangeMemberRoleAction
{
    public function execute(PlanningMember $membership, string $newRole): PlanningMember
    {
        // Cannot change the owner's role
        if ($membership->isOwner()) {
            throw new \RuntimeException('No se puede cambiar el rol del propietario.');
        }

        // Cannot promote to owner
        if ($newRole === MemberRole::OWNER->value) {
            throw new \RuntimeException('No se puede asignar el rol de propietario.');
        }

        $membership->update(['role' => $newRole]);

        return $membership->fresh();
    }
}
