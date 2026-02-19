<?php

namespace App\Enums;

enum CreditStatus: string
{
    case ACTIVE = 'active';
    case PAID = 'paid';
    case REFINANCED = 'refinanced';
    case DEFAULTED = 'defaulted';

    public function label(): string
    {
        return match ($this) {
            self::ACTIVE => 'Activo',
            self::PAID => 'Pagado',
            self::REFINANCED => 'Refinanciado',
            self::DEFAULTED => 'Impago',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::ACTIVE => '#1677ff',
            self::PAID => '#52c41a',
            self::REFINANCED => '#faad14',
            self::DEFAULTED => '#ff4d4f',
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
