<?php

namespace App\Enums;

enum TransactionType: string
{
    case INCOME = 'income';
    case EXPENSE = 'expense';
    case TRANSFER = 'transfer';

    public function label(): string
    {
        return match ($this) {
            self::INCOME => 'Ingreso',
            self::EXPENSE => 'Gasto',
            self::TRANSFER => 'Transferencia',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::INCOME => '#52c41a',
            self::EXPENSE => '#ff4d4f',
            self::TRANSFER => '#1677ff',
        };
    }

    public function icon(): string
    {
        return match ($this) {
            self::INCOME => 'arrow-up',
            self::EXPENSE => 'arrow-down',
            self::TRANSFER => 'swap',
        };
    }

    public function balanceMultiplier(): int
    {
        return match ($this) {
            self::INCOME => 1,
            self::EXPENSE => -1,
            self::TRANSFER => -1, // negative for source account
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
