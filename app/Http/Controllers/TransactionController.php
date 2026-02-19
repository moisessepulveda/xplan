<?php

namespace App\Http\Controllers;

use App\Actions\Transaction\CreateTransactionAction;
use App\Actions\Transaction\DeleteTransactionAction;
use App\Actions\Transaction\DuplicateTransactionAction;
use App\Actions\Transaction\UpdateTransactionAction;
use App\Enums\TransactionType;
use App\Enums\Frequency;
use App\Http\Requests\Transaction\FilterTransactionsRequest;
use App\Http\Requests\Transaction\StoreTransactionRequest;
use App\Http\Requests\Transaction\UpdateTransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Http\Resources\AccountResource;
use App\Http\Resources\CategoryResource;
use App\Models\Account;
use App\Models\Category;
use App\Models\RecurringTransaction;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(FilterTransactionsRequest $request): Response
    {
        $filters = $request->validated();

        $query = Transaction::with(['account', 'destinationAccount', 'category', 'creator'])
            ->when($filters['type'] ?? null, fn($q, $type) => $q->where('type', $type))
            ->when($filters['account_id'] ?? null, fn($q, $id) => $q->forAccount($id))
            ->when($filters['category_id'] ?? null, fn($q, $id) => $q->forCategory($id))
            ->when($filters['date_from'] ?? null, fn($q, $date) => $q->where('date', '>=', $date))
            ->when($filters['date_to'] ?? null, fn($q, $date) => $q->where('date', '<=', $date))
            ->when($filters['search'] ?? null, fn($q, $search) => $q->where('description', 'ilike', "%{$search}%"))
            ->orderBy($filters['sort'] ?? 'date', $filters['direction'] ?? 'desc')
            ->orderBy('created_at', 'desc');

        $perPage = $filters['per_page'] ?? 20;
        $transactions = $query->paginate($perPage)->withQueryString();

        // Monthly summary
        $now = now();
        $monthStart = $now->copy()->startOfMonth();
        $monthEnd = $now->copy()->endOfMonth();

        $monthlyIncome = Transaction::income()
            ->betweenDates($monthStart->toDateString(), $monthEnd->toDateString())
            ->sum('amount');

        $monthlyExpense = Transaction::expense()
            ->betweenDates($monthStart->toDateString(), $monthEnd->toDateString())
            ->sum('amount');

        return Inertia::render('Transactions/Index', [
            'transactions' => TransactionResource::collection($transactions),
            'filters' => $filters,
            'summary' => [
                'monthly_income' => (float) $monthlyIncome,
                'monthly_expense' => (float) $monthlyExpense,
                'monthly_balance' => (float) ($monthlyIncome - $monthlyExpense),
            ],
            'transactionTypes' => TransactionType::options(),
            'accounts' => AccountResource::collection(Account::active()->ordered()->get()),
            'categories' => CategoryResource::collection(
                Category::active()->roots()->with('children')->ordered()->get()
            ),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Transactions/Create', [
            'transactionTypes' => TransactionType::options(),
            'accounts' => AccountResource::collection(Account::active()->ordered()->get()),
            'categories' => CategoryResource::collection(
                Category::active()->roots()->with('children')->ordered()->get()
            ),
        ]);
    }

    public function store(StoreTransactionRequest $request, CreateTransactionAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('transactions.index')
            ->with('success', 'Transacción registrada exitosamente.');
    }

    public function show(Transaction $transaction): Response
    {
        $transaction->load(['account', 'destinationAccount', 'category', 'creator']);

        return Inertia::render('Transactions/Show', [
            'transaction' => new TransactionResource($transaction),
        ]);
    }

    public function edit(Transaction $transaction): Response
    {
        $transaction->load(['account', 'destinationAccount', 'category']);

        return Inertia::render('Transactions/Edit', [
            'transaction' => new TransactionResource($transaction),
            'transactionTypes' => TransactionType::options(),
            'accounts' => AccountResource::collection(Account::active()->ordered()->get()),
            'categories' => CategoryResource::collection(
                Category::active()->roots()->with('children')->ordered()->get()
            ),
        ]);
    }

    public function update(UpdateTransactionRequest $request, Transaction $transaction, UpdateTransactionAction $action): RedirectResponse
    {
        $action->execute($transaction, $request->validated());

        return redirect()->route('transactions.index')
            ->with('success', 'Transacción actualizada exitosamente.');
    }

    public function destroy(Transaction $transaction, DeleteTransactionAction $action): RedirectResponse
    {
        $action->execute($transaction);

        return redirect()->route('transactions.index')
            ->with('success', 'Transacción eliminada exitosamente.');
    }

    public function duplicate(Transaction $transaction, DuplicateTransactionAction $action): RedirectResponse
    {
        $action->execute($transaction);

        return redirect()->route('transactions.index')
            ->with('success', 'Transacción duplicada exitosamente.');
    }

    public function recurring(): Response
    {
        $recurring = RecurringTransaction::with(['account', 'destinationAccount', 'category'])
            ->orderBy('next_run_date')
            ->get();

        return Inertia::render('Transactions/Recurring', [
            'recurringTransactions' => $recurring,
            'frequencies' => Frequency::options(),
            'transactionTypes' => TransactionType::options(),
            'accounts' => AccountResource::collection(Account::active()->ordered()->get()),
            'categories' => CategoryResource::collection(
                Category::active()->roots()->with('children')->ordered()->get()
            ),
        ]);
    }
}
