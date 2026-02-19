<?php

namespace App\Notifications;

use App\Models\Credit;
use App\Models\CreditInstallment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class CreditInstallmentDueNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private Credit $credit,
        private CreditInstallment $installment,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $daysUntilDue = now()->diffInDays($this->installment->due_date, false);
        $dueLabel = $daysUntilDue === 0
            ? 'vence hoy'
            : ($daysUntilDue > 0
                ? "vence en {$daysUntilDue} días"
                : 'está vencida');

        return [
            'type' => 'credit_installment_due',
            'title' => 'Cuota próxima a vencer',
            'message' => "La cuota #{$this->installment->number} de \"{$this->credit->name}\" {$dueLabel}",
            'credit_id' => $this->credit->id,
            'credit_name' => $this->credit->name,
            'installment_id' => $this->installment->id,
            'installment_number' => $this->installment->number,
            'amount' => (float) $this->installment->amount,
            'due_date' => $this->installment->due_date->format('Y-m-d'),
        ];
    }
}
