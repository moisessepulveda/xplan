<?php

namespace App\Http\Requests\Account;

use Illuminate\Foundation\Http\FormRequest;

class TransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'from_account_id' => ['required', 'integer', 'exists:accounts,id'],
            'to_account_id' => ['required', 'integer', 'exists:accounts,id', 'different:from_account_id'],
            'amount' => ['required', 'numeric', 'gt:0'],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'from_account_id.required' => 'La cuenta de origen es requerida.',
            'from_account_id.exists' => 'La cuenta de origen no existe.',
            'to_account_id.required' => 'La cuenta de destino es requerida.',
            'to_account_id.exists' => 'La cuenta de destino no existe.',
            'to_account_id.different' => 'La cuenta de destino debe ser diferente a la de origen.',
            'amount.required' => 'El monto es requerido.',
            'amount.numeric' => 'El monto debe ser un número.',
            'amount.gt' => 'El monto debe ser mayor a 0.',
        ];
    }
}
