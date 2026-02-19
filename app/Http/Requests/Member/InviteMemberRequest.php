<?php

namespace App\Http\Requests\Member;

use App\Enums\MemberRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InviteMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'max:255'],
            'role' => [
                'required',
                'string',
                Rule::in([
                    MemberRole::ADMIN->value,
                    MemberRole::EDITOR->value,
                    MemberRole::VIEWER->value,
                ]),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'El email es requerido.',
            'email.email' => 'El email no es válido.',
            'role.required' => 'El rol es requerido.',
            'role.in' => 'El rol seleccionado no es válido.',
        ];
    }
}
