<?php

namespace App\Enums;

enum EmailTransactionStatus: string
{
    case PENDING = 'pending';
    case PROCESSED = 'processed';
    case IGNORED = 'ignored';
    case FAILED = 'failed';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pendiente',
            self::PROCESSED => 'Procesado',
            self::IGNORED => 'Ignorado',
            self::FAILED => 'Error',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::PENDING => 'warning',
            self::PROCESSED => 'success',
            self::IGNORED => 'default',
            self::FAILED => 'error',
        };
    }

    public function icon(): string
    {
        return match ($this) {
            self::PENDING => 'clock-circle',
            self::PROCESSED => 'check-circle',
            self::IGNORED => 'minus-circle',
            self::FAILED => 'close-circle',
        };
    }

    public static function options(): array
    {
        return array_map(fn($case) => [
            'value' => $case->value,
            'label' => $case->label(),
            'color' => $case->color(),
            'icon' => $case->icon(),
        ], self::cases());
    }
}
