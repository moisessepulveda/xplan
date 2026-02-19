<?php

namespace App\Enums;

enum InstallmentStatus: string
{
    case PENDING = 'pending';
    case PAID = 'paid';
    case OVERDUE = 'overdue';
    case PARTIAL = 'partial';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pendiente',
            self::PAID => 'Pagada',
            self::OVERDUE => 'Vencida',
            self::PARTIAL => 'Parcial',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::PENDING => '#faad14',
            self::PAID => '#52c41a',
            self::OVERDUE => '#ff4d4f',
            self::PARTIAL => '#1677ff',
        };
    }

    public static function options(): array
    {
        return array_map(fn($case) => [
            'value' => $case->value,
            'label' => $case->label(),
            'color' => $case->color(),
        ], self::cases());
    }
}
