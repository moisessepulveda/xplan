<?php

namespace App\Http\Requests\Account;

use App\Enums\AccountType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'type' => ['sometimes', 'required', 'string', Rule::enum(AccountType::class)],
            'currency' => ['nullable', 'string', 'size:3'],
            'icon' => ['nullable', 'string', 'max:50'],
            'color' => ['nullable', 'string', 'max:7'],
            'description' => ['nullable', 'string', 'max:500'],
            'include_in_total' => ['nullable', 'boolean'],
            'is_archived' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre de la cuenta es requerido.',
            'name.max' => 'El nombre no puede tener más de 255 caracteres.',
            'type.enum' => 'El tipo de cuenta no es válido.',
        ];
    }
}
