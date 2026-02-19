<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class OverduePaymentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private string $entityType,
        private int $entityId,
        private string $description,
        private float $amount,
        private string $dueDate,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'overdue_payment',
            'title' => 'Pago vencido',
            'message' => "El pago \"{$this->description}\" por {$this->amount} venció el {$this->dueDate}",
            'entity_type' => $this->entityType,
            'entity_id' => $this->entityId,
            'description' => $this->description,
            'amount' => $this->amount,
            'due_date' => $this->dueDate,
        ];
    }
}
