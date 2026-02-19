<?php

namespace App\Actions\Member;

use App\Mail\InvitationMail;
use App\Models\Invitation;
use App\Models\Planning;
use Illuminate\Support\Facades\Mail;

class InviteMemberAction
{
    public function execute(Planning $planning, array $data): Invitation
    {
        // Cancel any existing pending invitation for this email
        Invitation::where('planning_id', $planning->id)
            ->where('email', $data['email'])
            ->pending()
            ->update(['status' => 'expired']);

        $invitation = Invitation::create([
            'planning_id' => $planning->id,
            'email' => $data['email'],
            'role' => $data['role'] ?? 'editor',
            'created_by_id' => auth()->id(),
        ]);

        // Send invitation email
        Mail::to($data['email'])->queue(new InvitationMail($invitation));

        return $invitation;
    }
}
