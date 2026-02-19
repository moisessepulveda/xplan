<?php

namespace App\Http\Requests\Receivable;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReceivableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'person_name' => ['sometimes', 'string', 'max:255'],
            'person_contact' => ['nullable', 'string', 'max:255'],
            'concept' => ['sometimes', 'string', 'max:500'],
            'due_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'person_name.max' => 'El nombre no puede tener más de 255 caracteres.',
            'concept.max' => 'El concepto no puede tener más de 500 caracteres.',
            'due_date.date' => 'La fecha de vencimiento no es válida.',
        ];
    }
}
