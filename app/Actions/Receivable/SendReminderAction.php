<?php

namespace App\Actions\Receivable;

use App\Models\Receivable;
use App\Models\Reminder;

class SendReminderAction
{
    public function createReminder(Receivable $receivable, array $data): Reminder
    {
        return Reminder::create([
            'receivable_id' => $receivable->id,
            'remind_at' => $data['remind_at'],
            'message' => $data['message'] ?? null,
        ]);
    }

    public function processDueReminders(): int
    {
        $dueReminders = Reminder::due()
            ->with('receivable')
            ->get();

        $count = 0;

        foreach ($dueReminders as $reminder) {
            // Mark as sent (notification delivery would be handled by a notification service)
            $reminder->markAsSent();
            $count++;
        }

        return $count;
    }
}
