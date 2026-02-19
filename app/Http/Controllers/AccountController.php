<?php

namespace App\Http\Controllers;

use App\Actions\Account\AdjustBalanceAction;
use App\Actions\Account\CreateAccountAction;
use App\Actions\Account\TransferBetweenAccountsAction;
use App\Actions\Account\UpdateAccountAction;
use App\Enums\AccountType;
use App\Http\Requests\Account\AdjustBalanceRequest;
use App\Http\Requests\Account\StoreAccountRequest;
use App\Http\Requests\Account\TransferRequest;
use App\Http\Requests\Account\UpdateAccountRequest;
use App\Http\Resources\AccountResource;
use App\Http\Resources\TransactionResource;
use App\Models\Account;
use App\Models\Transaction;
use App\Services\BalanceCalculator;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function index(BalanceCalculator $calculator): Response
    {
        $summary = $calculator->getAccountsSummary();

        return Inertia::render('Accounts/Index', [
            'accounts' => AccountResource::collection($summary['accounts']),
            'summary' => [
                'total_balance' => $summary['total_balance'],
                'total_assets' => $summary['total_assets'],
                'total_liabilities' => $summary['total_liabilities'],
                'count' => $summary['count'],
            ],
            'accountTypes' => AccountType::options(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Accounts/Create', [
            'accountTypes' => AccountType::options(),
        ]);
    }

    public function store(StoreAccountRequest $request, CreateAccountAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('accounts.index')
            ->with('success', 'Cuenta creada exitosamente.');
    }

    public function show(Account $account, BalanceCalculator $calculator): Response
    {
        // Obtener transacciones de esta cuenta (como origen o destino)
        $transactions = Transaction::with(['category', 'account', 'destinationAccount'])
            ->where(function ($query) use ($account) {
                $query->where('account_id', $account->id)
                    ->orWhere('destination_account_id', $account->id);
            })
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        return Inertia::render('Accounts/Show', [
            'account' => new AccountResource($account),
            'transactions' => TransactionResource::collection($transactions),
        ]);
    }

    public function edit(Account $account): Response
    {
        return Inertia::render('Accounts/Edit', [
            'account' => new AccountResource($account),
            'accountTypes' => AccountType::options(),
        ]);
    }

    public function update(UpdateAccountRequest $request, Account $account, UpdateAccountAction $action): RedirectResponse
    {
        $action->execute($account, $request->validated());

        return redirect()->route('accounts.index')
            ->with('success', 'Cuenta actualizada exitosamente.');
    }

    public function destroy(Account $account): RedirectResponse
    {
        $account->delete();

        return redirect()->route('accounts.index')
            ->with('success', 'Cuenta eliminada exitosamente.');
    }

    public function archive(Account $account, UpdateAccountAction $action): RedirectResponse
    {
        $action->execute($account, ['is_archived' => true]);

        return redirect()->route('accounts.index')
            ->with('success', 'Cuenta archivada exitosamente.');
    }

    public function restore(Account $account, UpdateAccountAction $action): RedirectResponse
    {
        $action->execute($account, ['is_archived' => false]);

        return redirect()->route('accounts.index')
            ->with('success', 'Cuenta restaurada exitosamente.');
    }

    public function adjustBalance(AdjustBalanceRequest $request, Account $account, AdjustBalanceAction $action): RedirectResponse
    {
        $action->execute($account, $request->validated()['balance'], $request->validated()['reason'] ?? null);

        return redirect()->route('accounts.show', $account)
            ->with('success', 'Saldo ajustado exitosamente.');
    }

    public function transfer(TransferRequest $request, TransferBetweenAccountsAction $action): RedirectResponse
    {
        $data = $request->validated();

        $fromAccount = Account::findOrFail($data['from_account_id']);
        $toAccount = Account::findOrFail($data['to_account_id']);

        $action->execute($fromAccount, $toAccount, $data['amount'], $data['description'] ?? null);

        return redirect()->route('accounts.index')
            ->with('success', 'Transferencia realizada exitosamente.');
    }
}
