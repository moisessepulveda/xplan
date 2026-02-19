<?php

namespace App\Http\Requests\Budget;

use Illuminate\Foundation\Http\FormRequest;

class StoreBudgetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'type' => ['sometimes', 'string', 'in:monthly,custom'],
            'start_date' => ['nullable', 'date', 'required_if:type,custom'],
            'end_date' => ['nullable', 'date', 'after:start_date', 'required_if:type,custom'],
            'lines' => ['required', 'array', 'min:1'],
            'lines.*.category_id' => ['required', 'integer', 'exists:categories,id'],
            'lines.*.amount' => ['required', 'numeric', 'min:0.01'],
            'lines.*.alert_at_50' => ['sometimes', 'boolean'],
            'lines.*.alert_at_80' => ['sometimes', 'boolean'],
            'lines.*.alert_at_100' => ['sometimes', 'boolean'],
            'lines.*.notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del presupuesto es requerido.',
            'lines.required' => 'Debe agregar al menos una línea de presupuesto.',
            'lines.min' => 'Debe agregar al menos una línea de presupuesto.',
            'lines.*.category_id.required' => 'La categoría es requerida.',
            'lines.*.category_id.exists' => 'La categoría seleccionada no es válida.',
            'lines.*.amount.required' => 'El monto es requerido.',
            'lines.*.amount.min' => 'El monto debe ser mayor a 0.',
            'start_date.required_if' => 'La fecha de inicio es requerida para presupuestos personalizados.',
            'end_date.required_if' => 'La fecha de fin es requerida para presupuestos personalizados.',
            'end_date.after' => 'La fecha de fin debe ser posterior a la fecha de inicio.',
        ];
    }
}
