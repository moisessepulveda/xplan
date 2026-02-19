<?php

namespace App\Http\Requests\Credit;

use App\Enums\CreditType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCreditRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'type' => ['sometimes', 'string', Rule::enum(CreditType::class)],
            'entity' => ['nullable', 'string', 'max:255'],
            'account_id' => ['nullable', 'integer', 'exists:accounts,id'],
            'interest_rate' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'rate_type' => ['sometimes', 'string', 'in:fixed,variable'],
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
            'type.enum' => 'El tipo de crédito no es válido.',
            'interest_rate.max' => 'La tasa de interés no puede superar el 100%.',
        ];
    }
}
