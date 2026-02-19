<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;

class ReorderCategoriesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ids' => ['required', 'array'],
            'ids.*' => ['required', 'integer', 'exists:categories,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'ids.required' => 'Los IDs de las categorías son requeridos.',
            'ids.array' => 'Los IDs deben ser un arreglo.',
            'ids.*.exists' => 'Una o más categorías no existen.',
        ];
    }
}
