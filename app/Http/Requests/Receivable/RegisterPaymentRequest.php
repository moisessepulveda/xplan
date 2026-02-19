<?php

namespace App\Http\Requests\Receivable;

use Illuminate\Foundation\Http\FormRequest;

class RegisterPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:0.01'],
            'date' => ['required', 'date'],
            'account_id' => ['required', 'integer', 'exists:accounts,id'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'amount.required' => 'El monto del pago es requerido.',
            'amount.min' => 'El monto debe ser mayor a 0.',
            'date.required' => 'La fecha del pago es requerida.',
            'date.date' => 'La fecha no es válida.',
            'account_id.required' => 'La cuenta es requerida.',
            'account_id.exists' => 'La cuenta seleccionada no existe.',
        ];
    }
}
