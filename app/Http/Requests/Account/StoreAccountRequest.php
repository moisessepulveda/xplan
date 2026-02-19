<?php

namespace App\Http\Requests\Account;

use App\Enums\AccountType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', Rule::enum(AccountType::class)],
            'currency' => ['nullable', 'string', 'size:3'],
            'initial_balance' => ['nullable', 'numeric'],
            'icon' => ['nullable', 'string', 'max:50'],
            'color' => ['nullable', 'string', 'max:7'],
            'description' => ['nullable', 'string', 'max:500'],
            'include_in_total' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre de la cuenta es requerido.',
            'name.max' => 'El nombre no puede tener más de 255 caracteres.',
            'type.required' => 'El tipo de cuenta es requerido.',
            'type.enum' => 'El tipo de cuenta no es válido.',
            'currency.size' => 'La moneda debe tener 3 caracteres.',
            'initial_balance.numeric' => 'El saldo inicial debe ser un número.',
        ];
    }
}
