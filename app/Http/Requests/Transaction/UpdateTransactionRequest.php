<?php

namespace App\Http\Requests\Transaction;

use App\Enums\TransactionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['sometimes', 'string', Rule::enum(TransactionType::class)],
            'amount' => ['sometimes', 'numeric', 'min:0.01'],
            'account_id' => ['sometimes', 'integer', 'exists:accounts,id'],
            'destination_account_id' => ['nullable', 'integer', 'exists:accounts,id', 'different:account_id'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'virtual_fund_id' => ['nullable', 'integer', 'exists:virtual_funds,id'],
            'destination_virtual_fund_id' => ['nullable', 'integer', 'exists:virtual_funds,id'],
            'description' => ['nullable', 'string', 'max:500'],
            'date' => ['sometimes', 'date'],
            'time' => ['nullable', 'date_format:H:i'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'type.enum' => 'El tipo de transacción no es válido.',
            'amount.numeric' => 'El monto debe ser un número.',
            'amount.min' => 'El monto debe ser mayor a 0.',
            'account_id.exists' => 'La cuenta seleccionada no existe.',
            'destination_account_id.exists' => 'La cuenta de destino no existe.',
            'destination_account_id.different' => 'La cuenta de destino debe ser diferente a la cuenta de origen.',
            'category_id.exists' => 'La categoría seleccionada no existe.',
            'date.date' => 'La fecha no es válida.',
            'time.date_format' => 'La hora no tiene el formato correcto (HH:MM).',
        ];
    }
}
