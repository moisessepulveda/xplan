<?php

namespace App\Http\Requests\Receivable;

use App\Enums\ReceivableType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReceivableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'string', Rule::enum(ReceivableType::class)],
            'person_name' => ['required', 'string', 'max:255'],
            'person_contact' => ['nullable', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'currency' => ['nullable', 'string', 'size:3'],
            'concept' => ['required', 'string', 'max:500'],
            'due_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'type.required' => 'El tipo es requerido.',
            'type.enum' => 'El tipo no es válido.',
            'person_name.required' => 'El nombre de la persona es requerido.',
            'amount.required' => 'El monto es requerido.',
            'amount.min' => 'El monto debe ser mayor a 0.',
            'concept.required' => 'El concepto es requerido.',
            'due_date.date' => 'La fecha de vencimiento no es válida.',
        ];
    }
}
