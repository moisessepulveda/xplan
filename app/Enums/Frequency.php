<?php

namespace App\Enums;

enum Frequency: string
{
    case DAILY = 'daily';
    case WEEKLY = 'weekly';
    case BIWEEKLY = 'biweekly';
    case MONTHLY = 'monthly';
    case YEARLY = 'yearly';

    public function label(): string
    {
        return match ($this) {
            self::DAILY => 'Diario',
            self::WEEKLY => 'Semanal',
            self::BIWEEKLY => 'Quincenal',
            self::MONTHLY => 'Mensual',
            self::YEARLY => 'Anual',
        };
    }

    public function nextDate(\DateTimeInterface $from): \DateTimeImmutable
    {
        $date = \DateTimeImmutable::createFromInterface($from);

        return match ($this) {
            self::DAILY => $date->modify('+1 day'),
            self::WEEKLY => $date->modify('+1 week'),
            self::BIWEEKLY => $date->modify('+2 weeks'),
            self::MONTHLY => $date->modify('+1 month'),
            self::YEARLY => $date->modify('+1 year'),
        };
    }

    public static function options(): array
    {
        return array_map(fn($case) => [
            'value' => $case->value,
            'label' => $case->label(),
        ], self::cases());
    }
}
