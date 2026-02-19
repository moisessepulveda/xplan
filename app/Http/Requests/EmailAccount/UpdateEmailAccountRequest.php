<?php

namespace App\Http\Requests\EmailAccount;

use App\Enums\EmailProvider;
use App\Enums\EmailSyncMode;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmailAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                Rule::unique('email_accounts')
                    ->where('planning_id', auth()->user()->active_planning_id)
                    ->whereNull('deleted_at')
                    ->ignore($this->route('emailAccount')),
            ],
            'password' => ['nullable', 'string'], // Opcional en actualización
            'provider' => ['required', 'string', Rule::enum(EmailProvider::class)],
            'imap_host' => ['required', 'string', 'max:255'],
            'imap_port' => ['required', 'integer', 'min:1', 'max:65535'],
            'imap_encryption' => ['required', 'string', 'in:ssl,tls'],
            'folder' => ['nullable', 'string', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
            'sync_frequency' => ['nullable', 'integer', 'min:5', 'max:1440'],
            'sync_mode' => ['nullable', 'string', Rule::enum(EmailSyncMode::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El correo electrónico debe ser válido.',
            'email.unique' => 'Este correo ya está configurado.',
            'provider.required' => 'Selecciona un proveedor de correo.',
            'imap_host.required' => 'El servidor IMAP es obligatorio.',
            'imap_port.required' => 'El puerto IMAP es obligatorio.',
            'imap_encryption.required' => 'El tipo de encriptación es obligatorio.',
        ];
    }
}
