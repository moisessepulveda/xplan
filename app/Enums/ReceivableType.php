<?php

namespace App\Enums;

enum ReceivableType: string
{
    case RECEIVABLE = 'receivable';
    case PAYABLE = 'payable';

    public function label(): string
    {
        return match ($this) {
            self::RECEIVABLE => 'Por Cobrar',
            self::PAYABLE => 'Por Pagar',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::RECEIVABLE => '#52c41a',
            self::PAYABLE => '#ff4d4f',
        };
    }

    public function icon(): string
    {
        return match ($this) {
            self::RECEIVABLE => 'arrow-down-left',
            self::PAYABLE => 'arrow-up-right',
        };
    }

    public function transactionType(): TransactionType
    {
        return match ($this) {
            self::RECEIVABLE => TransactionType::INCOME,
            self::PAYABLE => TransactionType::EXPENSE,
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
