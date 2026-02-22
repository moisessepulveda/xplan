<?php

namespace App\Http\Requests\VirtualFund;

use App\Models\Account;
use App\Models\VirtualFund;
use Illuminate\Foundation\Http\FormRequest;

class TransferBetweenFundsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $accountId = $this->input('account_id');

        if (!$accountId) {
            return;
        }

        $account = Account::find($accountId);
        if (!$account) {
            return;
        }

        // Resolve 'available' to the real default fund ID (create if doesn't exist)
        $fromFundId = $this->input('from_fund_id');
        $toFundId = $this->input('to_fund_id');

        if ($fromFundId === 'available' || $toFundId === 'available') {
            $defaultFund = $account->defaultFund ?? $this->createDefaultFund($account);

            if ($fromFundId === 'available') {
                $this->merge(['from_fund_id' => $defaultFund->id]);
            }

            if ($toFundId === 'available') {
                $this->merge(['to_fund_id' => $defaultFund->id]);
            }
        }
    }

    private function createDefaultFund(Account $account): VirtualFund
    {
        return VirtualFund::create([
            'account_id' => $account->id,
            'name' => 'Disponible',
            'current_amount' => 0, // Default fund balance is calculated dynamically
            'goal_amount' => null,
            'icon' => 'wallet',
            'color' => '#52c41a',
            'is_default' => true,
            'order' => 0,
        ]);
    }

    public function rules(): array
    {
        return [
            'account_id' => ['required', 'exists:accounts,id'],
            'from_fund_id' => ['required', 'exists:virtual_funds,id'],
            'to_fund_id' => ['required', 'exists:virtual_funds,id', 'different:from_fund_id'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'account_id.required' => 'La cuenta es requerida.',
            'account_id.exists' => 'La cuenta no existe.',
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
