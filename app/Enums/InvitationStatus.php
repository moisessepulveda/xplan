<?php

namespace App\Enums;

enum InvitationStatus: string
{
    case PENDING = 'pending';
    case ACCEPTED = 'accepted';
    case REJECTED = 'rejected';
    case EXPIRED = 'expired';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pendiente',
            self::ACCEPTED => 'Aceptada',
            self::REJECTED => 'Rechazada',
            self::EXPIRED => 'Expirada',
        };
    }

    public function isPending(): bool
    {
        return $this === self::PENDING;
    }
}
