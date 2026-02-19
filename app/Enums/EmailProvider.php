<?php

namespace App\Enums;

enum EmailProvider: string
{
    case GMAIL = 'gmail';
    case OUTLOOK = 'outlook';
    case YAHOO = 'yahoo';
    case ICLOUD = 'icloud';
    case CUSTOM = 'custom';

    public function label(): string
    {
        return match ($this) {
            self::GMAIL => 'Gmail',
            self::OUTLOOK => 'Outlook / Hotmail',
            self::YAHOO => 'Yahoo Mail',
            self::ICLOUD => 'iCloud Mail',
            self::CUSTOM => 'Servidor personalizado',
        };
    }

    public function icon(): string
    {
        return match ($this) {
            self::GMAIL => 'google',
            self::OUTLOOK => 'windows',
            self::YAHOO => 'yahoo',
            self::ICLOUD => 'apple',
            self::CUSTOM => 'setting',
        };
    }

    public function getImapConfig(): array
    {
        return match ($this) {
            self::GMAIL => [
                'host' => 'imap.gmail.com',
                'port' => 993,
                'encryption' => 'ssl',
            ],
            self::OUTLOOK => [
                'host' => 'outlook.office365.com',
                'port' => 993,
                'encryption' => 'ssl',
            ],
            self::YAHOO => [
                'host' => 'imap.mail.yahoo.com',
                'port' => 993,
                'encryption' => 'ssl',
            ],
            self::ICLOUD => [
                'host' => 'imap.mail.me.com',
                'port' => 993,
                'encryption' => 'ssl',
            ],
            self::CUSTOM => [
                'host' => '',
                'port' => 993,
                'encryption' => 'ssl',
            ],
        };
    }

    public function helpText(): string
    {
        return match ($this) {
            self::GMAIL => 'Usa una "Contraseña de aplicación" de Google. Ve a tu cuenta de Google > Seguridad > Contraseñas de aplicaciones.',
            self::OUTLOOK => 'Si tienes autenticación de dos factores, genera una contraseña de aplicación en tu cuenta de Microsoft.',
            self::YAHOO => 'Genera una contraseña de aplicación en la configuración de seguridad de Yahoo.',
            self::ICLOUD => 'Genera una contraseña específica de la app en appleid.apple.com > Seguridad.',
            self::CUSTOM => 'Ingresa la configuración IMAP de tu servidor de correo.',
        };
    }

    public static function options(): array
    {
        return array_map(fn($case) => [
            'value' => $case->value,
            'label' => $case->label(),
            'icon' => $case->icon(),
            'imap_config' => $case->getImapConfig(),
            'help_text' => $case->helpText(),
        ], self::cases());
    }
}
