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
use App\Http\Requests\Credit\PayInstallmentRequest;
use App\Http\Resources\TransactionResource;
use App\Http\Resources\RecurringTransactionResource;
use App\Http\Resources\AccountResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\VirtualFundResource;
use App\Models\VirtualFund;
use App\Models\Account;
use App\Models\Category;
use App\Models\CreditInstallment;
use App\Models\RecurringTransaction;
use App\Models\Transaction;
use App\Actions\Credit\PayInstallmentAction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(FilterTransactionsRequest $request): Response
    {
        $filters = $request->validated();

        // Determinar el período (mes/año)
        $period = $filters['period'] ?? now()->format('Y-m');
        $periodDate = \Carbon\Carbon::createFromFormat('Y-m', $period);
        $monthStart = $periodDate->copy()->startOfMonth();
        $monthEnd = $periodDate->copy()->endOfMonth();
        $currentMonth = now()->format('Y-m');
        $isCurrentMonth = $period === $currentMonth;
        $isCurrentOrFutureMonth = $period >= $currentMonth;

        // Transacciones pendientes de aprobación (de emails) - solo en mes actual
        $pendingTransactions = collect();
        if ($isCurrentMonth) {
            $pendingTransactions = Transaction::with(['account', 'destinationAccount', 'category', 'creator'])
                ->pendingApproval()
                ->orderBy('date', 'desc')
                ->orderBy('created_at', 'desc')
                ->get();
        }

        // Transacciones aprobadas (normales) - filtradas por período
        $query = Transaction::with(['account', 'destinationAccount', 'category', 'creator'])
            ->approved()
            ->betweenDates($monthStart->toDateString(), $monthEnd->toDateString())
            ->when($filters['type'] ?? null, fn($q, $type) => $q->where('type', $type))
            ->when($filters['account_id'] ?? null, fn($q, $id) => $q->forAccount($id))
            ->when($filters['category_id'] ?? null, fn($q, $id) => $q->forCategory($id))
            ->when($filters['search'] ?? null, fn($q, $search) => $q->where('description', 'like', "%{$search}%"))
            ->orderBy($filters['sort'] ?? 'date', $filters['direction'] ?? 'desc')
            ->orderBy('created_at', 'desc');

        $perPage = $filters['per_page'] ?? 20;
        $transactions = $query->paginate($perPage)->withQueryString();

        // Monthly summary (solo transacciones aprobadas del período)
        $monthlyIncome = Transaction::income()
            ->approved()
            ->betweenDates($monthStart->toDateString(), $monthEnd->toDateString())
            ->sum('amount');

        $monthlyExpense = Transaction::expense()
            ->approved()
            ->betweenDates($monthStart->toDateString(), $monthEnd->toDateString())
            ->sum('amount');

        // Transacciones recurrentes pendientes de aplicar - mes actual o futuro
        $pendingRecurring = collect();
        if ($isCurrentOrFutureMonth) {
            $pendingRecurring = RecurringTransaction::with(['account', 'destinationAccount', 'category'])
                ->pendingForMonth($period)
                ->orderBy('description')
                ->get();
        }

        // Cuotas de créditos pendientes del mes seleccionado
        $pendingInstallments = CreditInstallment::with(['credit'])
            ->whereHas('credit', function ($q) {
                $q->where('status', 'active');
            })
            ->pending()
            ->whereBetween('due_date', [$monthStart->toDateString(), $monthEnd->toDateString()])
            ->orderBy('due_date')
            ->get()
            ->map(function ($installment) {
                return [
                    'id' => $installment->id,
                    'credit_id' => $installment->credit_id,
                    'credit_name' => $installment->credit->name,
                    'credit_entity' => $installment->credit->entity,
                    'number' => $installment->number,
                    'due_date' => $installment->due_date->format('Y-m-d'),
                    'amount' => (float) $installment->amount,
                    'remaining_amount' => (float) $installment->remaining_amount,
                    'is_overdue' => $installment->isOverdue(),
                    'status' => $installment->status->value,
                    'status_label' => $installment->status->label(),
                    'status_color' => $installment->status->color(),
                ];
            });

        return Inertia::render('Transactions/Index', [
            'transactions' => TransactionResource::collection($transactions),
            'pendingTransactions' => TransactionResource::collection($pendingTransactions),
            'pendingRecurring' => RecurringTransactionResource::collection($pendingRecurring),
            'pendingInstallments' => $pendingInstallments,
            'filters' => $filters,
            'period' => $period,
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

    public function create(Request $request): Response
    {
        $fromRecurring = null;
        $period = $request->input('period', now()->format('Y-m'));

        if ($request->has('from_recurring')) {
            $recurring = RecurringTransaction::with(['account', 'category'])->find($request->input('from_recurring'));
            if ($recurring) {
                $fromRecurring = new RecurringTransactionResource($recurring);
            }
        }

        // Load virtual funds for all active accounts
        $virtualFunds = VirtualFund::whereHas('account', function ($q) {
            $q->active();
        })->nonDefault()->ordered()->get();

        return Inertia::render('Transactions/Create', [
            'transactionTypes' => TransactionType::options(),
            'accounts' => AccountResource::collection(Account::active()->ordered()->get()),
            'categories' => CategoryResource::collection(
                Category::active()->roots()->with('children')->ordered()->get()
            ),
            'virtualFunds' => VirtualFundResource::collection($virtualFunds),
            'fromRecurring' => $fromRecurring,
            'period' => $period,
        ]);
    }

    public function store(StoreTransactionRequest $request, CreateTransactionAction $action): RedirectResponse
    {
        $data = $request->validated();

        // Si es recurrente, crear plantilla en lugar de transacción inmediata
        if ($request->boolean('is_recurring')) {
            $recurring = RecurringTransaction::create([
                'planning_id' => auth()->user()->active_planning_id,
                'account_id' => $data['account_id'],
                'destination_account_id' => $data['destination_account_id'] ?? null,
                'category_id' => $data['category_id'] ?? null,
                'type' => $data['type'],
                'amount' => $data['amount'],
                'description' => $data['description'] ?? null,
                'frequency' => Frequency::MONTHLY,
                'start_date' => $data['date'],
                'next_run_date' => $data['date'],
                'is_active' => true,
                'created_by' => auth()->id(),
                'tags' => $data['tags'] ?? [],
            ]);

            return redirect()->route('transactions.index')
                ->with('success', 'Transacción recurrente creada. Aparecerá cada mes para su aprobación.');
        }

        // Si viene de una recurrente (modificar), agregar datos y marcar como aplicada
        if (!empty($data['from_recurring_id'])) {
            $recurring = RecurringTransaction::find($data['from_recurring_id']);
            if ($recurring) {
                $data['is_recurring'] = true;
                $data['recurring_transaction_id'] = $recurring->id;
                $data['source'] = 'recurring';

                // Obtener el período de la fecha
                $period = \Carbon\Carbon::parse($data['date'])->format('Y-m');
                $recurring->markAsApplied($period);
            }
        }

        $action->execute($data);

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
        $transaction->load(['account', 'destinationAccount', 'category', 'virtualFund']);

        // Load virtual funds for all active accounts
        $virtualFunds = VirtualFund::whereHas('account', function ($q) {
            $q->active();
        })->nonDefault()->ordered()->get();

        return Inertia::render('Transactions/Edit', [
            'transaction' => new TransactionResource($transaction),
            'transactionTypes' => TransactionType::options(),
            'accounts' => AccountResource::collection(Account::active()->ordered()->get()),
            'categories' => CategoryResource::collection(
                Category::active()->roots()->with('children')->ordered()->get()
            ),
            'virtualFunds' => VirtualFundResource::collection($virtualFunds),
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

    public function approve(Transaction $transaction): RedirectResponse
    {
        $transaction->approve();

        return redirect()->back()
            ->with('success', 'Transacción aprobada.');
    }

    public function reject(Transaction $transaction, DeleteTransactionAction $action): RedirectResponse
    {
        $action->execute($transaction);

        return redirect()->back()
            ->with('success', 'Transacción rechazada y eliminada.');
    }

    public function applyRecurring(RecurringTransaction $recurring, Request $request, CreateTransactionAction $action): RedirectResponse
    {
        $period = $request->input('period', now()->format('Y-m'));
        $periodDate = \Carbon\Carbon::createFromFormat('Y-m', $period);

        $transaction = $action->execute([
            'type' => $recurring->type->value,
            'amount' => $request->input('amount', $recurring->amount),
            'account_id' => $recurring->account_id,
            'destination_account_id' => $recurring->destination_account_id,
            'category_id' => $recurring->category_id,
            'description' => $request->input('description', $recurring->description),
            'date' => $request->input('date', $periodDate->copy()->startOfMonth()->format('Y-m-d')),
            'is_recurring' => true,
            'recurring_transaction_id' => $recurring->id,
            'source' => 'recurring',
            'tags' => $recurring->tags ?? [],
        ]);

        $recurring->markAsApplied($period);

        return redirect()->back()
            ->with('success', 'Transacción recurrente aplicada.');
    }

    public function skipRecurring(RecurringTransaction $recurring, Request $request): RedirectResponse
    {
        $period = $request->input('period', now()->format('Y-m'));
        $recurring->markAsSkipped($period);

        return redirect()->back()
            ->with('success', 'Transacción ignorada para este mes.');
    }

    public function toggleRecurring(RecurringTransaction $recurring): RedirectResponse
    {
        $recurring->update(['is_active' => !$recurring->is_active]);

        $message = $recurring->is_active
            ? 'Transacción recurrente activada.'
            : 'Transacción recurrente desactivada.';

        return redirect()->back()->with('success', $message);
    }

    public function destroyRecurring(RecurringTransaction $recurring): RedirectResponse
    {
        $recurring->delete();

        return redirect()->back()
            ->with('success', 'Transacción recurrente eliminada.');
    }

    public function payInstallment(PayInstallmentRequest $request, CreditInstallment $installment, PayInstallmentAction $action): RedirectResponse
    {
        $action->execute($installment, $request->validated());

        return redirect()->back()
            ->with('success', 'Cuota pagada exitosamente.');
    }
}
