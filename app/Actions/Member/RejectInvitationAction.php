<?php

namespace App\Actions\Member;

use App\Models\Invitation;

class RejectInvitationAction
{
    public function execute(Invitation $invitation): void
    {
        if (!$invitation->isPending()) {
            throw new \RuntimeException('La invitación ya no es válida.');
        }

        $invitation->markAsRejected();
    }
}
