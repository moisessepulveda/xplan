<?php

namespace App\Http\Requests\Category;

use App\Enums\CategoryType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', Rule::enum(CategoryType::class)],
            'parent_id' => ['nullable', 'integer', 'exists:categories,id'],
            'icon' => ['nullable', 'string', 'max:50'],
            'color' => ['nullable', 'string', 'max:7'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre de la categoría es requerido.',
            'name.max' => 'El nombre no puede tener más de 255 caracteres.',
            'type.required' => 'El tipo de categoría es requerido.',
            'type.enum' => 'El tipo de categoría no es válido.',
            'parent_id.exists' => 'La categoría padre no existe.',
        ];
    }
}
