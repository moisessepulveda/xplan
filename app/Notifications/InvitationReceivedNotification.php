<?php

namespace App\Notifications;

use App\Models\Invitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class InvitationReceivedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private Invitation $invitation
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'invitation_received',
            'title' => 'Nueva invitación',
            'message' => "{$this->invitation->createdBy->name} te invitó a {$this->invitation->planning->name}",
            'invitation_id' => $this->invitation->id,
            'planning_id' => $this->invitation->planning_id,
            'planning_name' => $this->invitation->planning->name,
            'inviter_name' => $this->invitation->createdBy->name,
            'role' => $this->invitation->role->value,
            'token' => $this->invitation->token,
        ];
    }
}
