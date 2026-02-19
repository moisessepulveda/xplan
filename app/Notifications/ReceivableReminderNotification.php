<?php

namespace App\Notifications;

use App\Models\Receivable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class ReceivableReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private Receivable $receivable,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $typeLabel = $this->receivable->type->value === 'receivable' ? 'cobrar a' : 'pagar a';

        return [
            'type' => 'receivable_reminder',
            'title' => 'Recordatorio de cuenta pendiente',
            'message' => "Recuerda {$typeLabel} {$this->receivable->person_name}: \"{$this->receivable->concept}\"",
            'receivable_id' => $this->receivable->id,
            'receivable_type' => $this->receivable->type->value,
            'person_name' => $this->receivable->person_name,
            'concept' => $this->receivable->concept,
            'pending_amount' => (float) $this->receivable->pending_amount,
            'due_date' => $this->receivable->due_date?->format('Y-m-d'),
        ];
    }
}
