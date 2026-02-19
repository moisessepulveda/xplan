<?php

namespace App\Enums;

enum CategoryType: string
{
    case INCOME = 'income';
    case EXPENSE = 'expense';

    public function label(): string
    {
        return match ($this) {
            self::INCOME => 'Ingreso',
            self::EXPENSE => 'Gasto',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::INCOME => '#52c41a',
            self::EXPENSE => '#ff4d4f',
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
