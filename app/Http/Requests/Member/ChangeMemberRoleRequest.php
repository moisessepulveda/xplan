<?php

namespace App\Http\Requests\Member;

use App\Enums\MemberRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ChangeMemberRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
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
            'role.required' => 'El rol es requerido.',
            'role.in' => 'El rol seleccionado no es válido.',
        ];
    }
}
