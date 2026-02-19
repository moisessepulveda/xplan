<?php

namespace App\Enums;

enum EmailSyncMode: string
{
    case NEW_ONLY = 'new_only';
    case UNREAD_7_DAYS = 'unread_7_days';

    public function label(): string
    {
        return match ($this) {
            self::NEW_ONLY => 'Solo emails nuevos desde ahora',
            self::UNREAD_7_DAYS => 'Emails no leídos de los últimos 7 días',
        };
    }

    public function description(): string
    {
        return match ($this) {
            self::NEW_ONLY => 'Solo marca el punto de inicio. Las siguientes sincronizaciones procesarán emails nuevos.',
            self::UNREAD_7_DAYS => 'Procesa emails no leídos de la última semana, luego continúa con emails nuevos.',
        };
    }

    public static function options(): array
    {
        return array_map(fn($case) => [
            'value' => $case->value,
            'label' => $case->label(),
            'description' => $case->description(),
        ], self::cases());
    }
}
