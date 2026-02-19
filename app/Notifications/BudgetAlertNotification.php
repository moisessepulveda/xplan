<?php

namespace App\Notifications;

use App\Models\Budget;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class BudgetAlertNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private Budget $budget,
        private string $categoryName,
        private float $percentage,
        private string $alertLevel,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $levelLabels = [
            '50' => 'al 50%',
            '80' => 'al 80%',
            '100' => 'superó el 100%',
        ];

        return [
            'type' => 'budget_alert',
            'title' => 'Alerta de presupuesto',
            'message' => "La categoría \"{$this->categoryName}\" llegó {$levelLabels[$this->alertLevel] ?? "al {$this->percentage}%"} del presupuesto",
            'budget_id' => $this->budget->id,
            'category_name' => $this->categoryName,
            'percentage' => $this->percentage,
            'alert_level' => $this->alertLevel,
        ];
    }
}
