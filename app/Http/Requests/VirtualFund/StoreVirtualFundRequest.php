<?php

namespace App\Http\Requests\VirtualFund;

use Illuminate\Foundation\Http\FormRequest;

class StoreVirtualFundRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'initial_amount' => ['nullable', 'numeric', 'min:0'],
            'goal_amount' => ['nullable', 'numeric', 'min:0'],
            'icon' => ['nullable', 'string', 'max:50'],
            'color' => ['nullable', 'string', 'max:7'],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del fondo es requerido.',
            'name.max' => 'El nombre no puede tener más de 255 caracteres.',
            'initial_amount.numeric' => 'El monto inicial debe ser un número.',
            'initial_amount.min' => 'El monto inicial no puede ser negativo.',
            'goal_amount.numeric' => 'La meta debe ser un número.',
            'goal_amount.min' => 'La meta no puede ser negativa.',
        ];
    }
}
