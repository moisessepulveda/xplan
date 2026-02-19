<?php

namespace App\Enums;

enum MemberRole: string
{
    case OWNER = 'owner';
    case ADMIN = 'admin';
    case EDITOR = 'editor';
    case VIEWER = 'viewer';

    public function label(): string
    {
        return match ($this) {
            self::OWNER => 'Propietario',
            self::ADMIN => 'Administrador',
            self::EDITOR => 'Editor',
            self::VIEWER => 'Visor',
        };
    }

    public function canManageMembers(): bool
    {
        return in_array($this, [self::OWNER, self::ADMIN]);
    }

    public function canEditPlanning(): bool
    {
        return in_array($this, [self::OWNER, self::ADMIN]);
    }

    public function canCreateTransactions(): bool
    {
        return in_array($this, [self::OWNER, self::ADMIN, self::EDITOR]);
    }

    public function canDeletePlanning(): bool
    {
        return $this === self::OWNER;
    }
}
