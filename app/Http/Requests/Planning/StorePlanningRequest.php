<?php

namespace App\Http\Requests\Planning;

use Illuminate\Foundation\Http\FormRequest;

class StorePlanningRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'currency' => ['required', 'string', 'size:3'],
            'icon' => ['nullable', 'string', 'max:50'],
            'color' => ['nullable', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'month_start_day' => ['nullable', 'integer', 'min:1', 'max:28'],
            'show_decimals' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es requerido.',
            'name.max' => 'El nombre no puede exceder 255 caracteres.',
            'currency.required' => 'La moneda es requerida.',
            'currency.size' => 'La moneda debe tener 3 caracteres (ej: CLP, USD).',
            'color.regex' => 'El color debe ser un código hexadecimal válido.',
            'month_start_day.min' => 'El día de inicio debe ser al menos 1.',
            'month_start_day.max' => 'El día de inicio no puede ser mayor a 28.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'show_decimals' => $this->boolean('show_decimals'),
        ]);
    }
}
