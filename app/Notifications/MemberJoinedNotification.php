<?php

namespace App\Notifications;

use App\Models\PlanningMember;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class MemberJoinedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private PlanningMember $membership
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'member_joined',
            'title' => 'Nuevo miembro',
            'message' => "{$this->membership->user->name} se unió a {$this->membership->planning->name}",
            'planning_id' => $this->membership->planning_id,
            'user_id' => $this->membership->user_id,
            'user_name' => $this->membership->user->name,
            'role' => $this->membership->role->value,
        ];
    }
}
