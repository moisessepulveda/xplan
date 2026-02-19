<?php

namespace App\Http\Requests\Credit;

use App\Enums\CreditType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCreditRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', Rule::enum(CreditType::class)],
            'entity' => ['nullable', 'string', 'max:255'],
            'account_id' => ['nullable', 'integer', 'exists:accounts,id'],
            'original_amount' => ['required', 'numeric', 'min:0.01'],
            'currency' => ['nullable', 'string', 'size:3'],
            'interest_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'interest_rate_type' => ['sometimes', 'string', 'in:annual,monthly'],
            'rate_type' => ['sometimes', 'string', 'in:fixed,variable'],
            'term_months' => ['required', 'integer', 'min:1', 'max:600'],
            'start_date' => ['required', 'date'],
            'estimated_end_date' => ['nullable', 'date', 'after:start_date'],
            'payment_day' => ['sometimes', 'integer', 'min:1', 'max:31'],
            'monthly_payment' => ['nullable', 'numeric', 'min:0'],
            'reference_number' => ['nullable', 'string', 'max:100'],
            'credit_limit' => ['nullable', 'numeric', 'min:0'],
            'billing_day' => ['nullable', 'integer', 'min:1', 'max:31'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del crédito es requerido.',
            'type.required' => 'El tipo de crédito es requerido.',
            'type.enum' => 'El tipo de crédito no es válido.',
            'original_amount.required' => 'El monto original es requerido.',
            'original_amount.min' => 'El monto debe ser mayor a 0.',
            'interest_rate.required' => 'La tasa de interés es requerida.',
            'interest_rate.max' => 'La tasa de interés no puede superar el 100%.',
            'term_months.required' => 'El plazo en meses es requerido.',
            'term_months.min' => 'El plazo debe ser al menos 1 mes.',
            'start_date.required' => 'La fecha de inicio es requerida.',
            'estimated_end_date.after' => 'La fecha de término debe ser posterior al inicio.',
        ];
    }
}
