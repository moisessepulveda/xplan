<?php

namespace App\Enums;

enum AccountType: string
{
    case CHECKING = 'checking';
    case SAVINGS = 'savings';
    case CASH = 'cash';
    case CREDIT_CARD = 'credit_card';
    case INVESTMENT = 'investment';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::CHECKING => 'Cuenta Corriente',
            self::SAVINGS => 'Cuenta de Ahorro',
            self::CASH => 'Efectivo',
            self::CREDIT_CARD => 'Tarjeta de Crédito',
            self::INVESTMENT => 'Inversión',
            self::OTHER => 'Otro',
        };
    }

    public function icon(): string
    {
        return match ($this) {
            self::CHECKING => 'bank',
            self::SAVINGS => 'save',
            self::CASH => 'wallet',
            self::CREDIT_CARD => 'credit-card',
            self::INVESTMENT => 'line-chart',
            self::OTHER => 'folder',
        };
    }

    public static function options(): array
    {
        return array_map(fn($case) => [
            'value' => $case->value,
            'label' => $case->label(),
            'icon' => $case->icon(),
        ], self::cases());
    }
}
