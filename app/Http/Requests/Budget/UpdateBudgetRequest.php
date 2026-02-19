<?php

namespace App\Http\Requests\Budget;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBudgetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'type' => ['sometimes', 'string', 'in:monthly,custom'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after:start_date'],
            'lines' => ['sometimes', 'array', 'min:1'],
            'lines.*.id' => ['sometimes', 'integer', 'exists:budget_lines,id'],
            'lines.*.category_id' => ['required_with:lines', 'integer', 'exists:categories,id'],
            'lines.*.amount' => ['required_with:lines', 'numeric', 'min:0.01'],
            'lines.*.alert_at_50' => ['sometimes', 'boolean'],
            'lines.*.alert_at_80' => ['sometimes', 'boolean'],
            'lines.*.alert_at_100' => ['sometimes', 'boolean'],
            'lines.*.notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'lines.min' => 'Debe mantener al menos una línea de presupuesto.',
            'lines.*.category_id.required_with' => 'La categoría es requerida.',
            'lines.*.category_id.exists' => 'La categoría seleccionada no es válida.',
            'lines.*.amount.required_with' => 'El monto es requerido.',
            'lines.*.amount.min' => 'El monto debe ser mayor a 0.',
            'end_date.after' => 'La fecha de fin debe ser posterior a la fecha de inicio.',
        ];
    }
}
