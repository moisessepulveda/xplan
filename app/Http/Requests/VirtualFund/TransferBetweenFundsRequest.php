<?php

namespace App\Http\Requests\VirtualFund;

use Illuminate\Foundation\Http\FormRequest;

class TransferBetweenFundsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'from_fund_id' => ['required', 'exists:virtual_funds,id'],
            'to_fund_id' => ['required', 'exists:virtual_funds,id', 'different:from_fund_id'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'from_fund_id.required' => 'Selecciona el fondo de origen.',
            'from_fund_id.exists' => 'El fondo de origen no existe.',
            'to_fund_id.required' => 'Selecciona el fondo de destino.',
            'to_fund_id.exists' => 'El fondo de destino no existe.',
            'to_fund_id.different' => 'El fondo de destino debe ser diferente al de origen.',
            'amount.required' => 'El monto es requerido.',
            'amount.numeric' => 'El monto debe ser un número.',
            'amount.min' => 'El monto debe ser mayor a 0.',
        ];
    }
}
