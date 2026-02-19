<?php

namespace App\Enums;

enum CreditType: string
{
    case CONSUMER = 'consumer';
    case MORTGAGE = 'mortgage';
    case AUTO = 'auto';
    case CREDIT_CARD = 'credit_card';
    case PERSONAL = 'personal';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::CONSUMER => 'Crédito de Consumo',
            self::MORTGAGE => 'Hipotecario',
            self::AUTO => 'Automotriz',
            self::CREDIT_CARD => 'Tarjeta de Crédito',
            self::PERSONAL => 'Personal',
            self::OTHER => 'Otro',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::CONSUMER => '#722ed1',
            self::MORTGAGE => '#1890ff',
            self::AUTO => '#13c2c2',
            self::CREDIT_CARD => '#eb2f96',
            self::PERSONAL => '#fa8c16',
            self::OTHER => '#8c8c8c',
        };
    }

    public function icon(): string
    {
        return match ($this) {
            self::CONSUMER => 'shopping-cart',
            self::MORTGAGE => 'home',
            self::AUTO => 'car',
            self::CREDIT_CARD => 'credit-card',
            self::PERSONAL => 'user',
            self::OTHER => 'ellipsis',
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
