<?php

namespace App\Http\Controllers;

use App\Actions\VirtualFund\CreateVirtualFundAction;
use App\Actions\VirtualFund\DeleteVirtualFundAction;
use App\Actions\VirtualFund\TransferBetweenFundsAction;
use App\Actions\VirtualFund\UpdateVirtualFundAction;
use App\Http\Requests\VirtualFund\StoreVirtualFundRequest;
use App\Http\Requests\VirtualFund\TransferBetweenFundsRequest;
use App\Http\Requests\VirtualFund\UpdateVirtualFundRequest;
use App\Models\Account;
use App\Models\VirtualFund;
use Illuminate\Http\RedirectResponse;

class VirtualFundController extends Controller
{
    public function store(
        StoreVirtualFundRequest $request,
        Account $account,
        CreateVirtualFundAction $action
    ): RedirectResponse {
        $data = $request->validated();

        // Validate that initial amount doesn't exceed available balance
        $initialAmount = $data['initial_amount'] ?? 0;
        if ($initialAmount > $account->available_balance) {
            return redirect()->back()
                ->withErrors(['initial_amount' => 'El monto inicial supera el saldo disponible.'])
                ->withInput();
        }

        $action->execute($account, $data);

        return redirect()->route('accounts.show', $account)
            ->with('success', 'Fondo virtual creado exitosamente.');
    }

    public function update(
        UpdateVirtualFundRequest $request,
        VirtualFund $fund,
        UpdateVirtualFundAction $action
    ): RedirectResponse {
        if ($fund->is_default) {
            return redirect()->back()
                ->with('error', 'No se puede editar el fondo Disponible.');
        }

        $action->execute($fund, $request->validated());

        return redirect()->route('accounts.show', $fund->account_id)
            ->with('success', 'Fondo virtual actualizado exitosamente.');
    }

    public function destroy(
        VirtualFund $fund,
        DeleteVirtualFundAction $action
    ): RedirectResponse {
        if ($fund->is_default) {
            return redirect()->back()
                ->with('error', 'No se puede eliminar el fondo Disponible.');
        }

        $accountId = $fund->account_id;
        $action->execute($fund);

        return redirect()->route('accounts.show', $accountId)
            ->with('success', 'Fondo virtual eliminado exitosamente.');
    }

    public function transfer(
        TransferBetweenFundsRequest $request,
        TransferBetweenFundsAction $action
    ): RedirectResponse {
        $data = $request->validated();

        $fromFund = VirtualFund::findOrFail($data['from_fund_id']);
        $toFund = VirtualFund::findOrFail($data['to_fund_id']);

        // Validate same account
        if ($fromFund->account_id !== $toFund->account_id) {
            return redirect()->back()
                ->withErrors(['to_fund_id' => 'Ambos fondos deben pertenecer a la misma cuenta.'])
                ->withInput();
        }

        // Validate sufficient balance for non-default funds
        if (!$fromFund->is_default && $fromFund->current_amount < $data['amount']) {
            return redirect()->back()
                ->withErrors(['amount' => 'Saldo insuficiente en el fondo de origen.'])
                ->withInput();
        }

        $action->execute($fromFund, $toFund, $data['amount'], $data['description'] ?? null);

        return redirect()->route('accounts.show', $fromFund->account_id)
            ->with('success', 'Transferencia entre fondos realizada exitosamente.');
    }
}
