<?php

namespace App\Http\Controllers;

use App\Actions\Receivable\CreateReceivableAction;
use App\Actions\Receivable\RegisterPaymentAction;
use App\Actions\Receivable\SendReminderAction;
use App\Actions\Receivable\UpdateReceivableAction;
use App\Enums\ReceivableStatus;
use App\Enums\ReceivableType;
use App\Http\Requests\Receivable\RegisterPaymentRequest;
use App\Http\Requests\Receivable\StoreReceivableRequest;
use App\Http\Requests\Receivable\UpdateReceivableRequest;
use App\Http\Resources\AccountResource;
use App\Http\Resources\ReceivableResource;
use App\Models\Account;
use App\Models\Receivable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReceivableController extends Controller
{
    public function index(Request $request): Response
    {
        $type = $request->get('type', 'all');
        $status = $request->get('status');

        $query = Receivable::with(['payments'])
            ->when($type !== 'all', fn($q) => $q->where('type', $type))
            ->when($status, fn($q) => $q->where('status', $status))
            ->orderByRaw("CASE WHEN status IN ('pending', 'partial') THEN 0 ELSE 1 END")
            ->orderBy('due_date')
            ->orderBy('created_at', 'desc');

        $receivables = $query->get();

        // Summary
        $allReceivables = Receivable::active()->get();

        $totalReceivable = $allReceivables
            ->where('type', ReceivableType::RECEIVABLE)
            ->sum('pending_amount');

        $totalPayable = $allReceivables
            ->where('type', ReceivableType::PAYABLE)
            ->sum('pending_amount');

        $overdueCount = Receivable::overdue()->count();

        return Inertia::render('Receivables/Index', [
            'receivables' => ReceivableResource::collection($receivables),
            'filters' => [
                'type' => $type,
                'status' => $status,
            ],
            'summary' => [
                'total_receivable' => (float) $totalReceivable,
                'total_payable' => (float) $totalPayable,
                'net_balance' => (float) ($totalReceivable - $totalPayable),
                'overdue_count' => $overdueCount,
            ],
            'receivableTypes' => ReceivableType::options(),
            'receivableStatuses' => ReceivableStatus::options(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Receivables/Create', [
            'receivableTypes' => ReceivableType::options(),
        ]);
    }

    public function store(StoreReceivableRequest $request, CreateReceivableAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('receivables.index')
            ->with('success', 'Cuenta pendiente creada exitosamente.');
    }

    public function show(Receivable $receivable): Response
    {
        $receivable->load(['payments.account', 'reminders']);

        return Inertia::render('Receivables/Show', [
            'receivable' => new ReceivableResource($receivable),
            'accounts' => AccountResource::collection(Account::active()->ordered()->get()),
        ]);
    }

    public function edit(Receivable $receivable): Response
    {
        return Inertia::render('Receivables/Edit', [
            'receivable' => new ReceivableResource($receivable),
            'receivableTypes' => ReceivableType::options(),
        ]);
    }

    public function update(UpdateReceivableRequest $request, Receivable $receivable, UpdateReceivableAction $action): RedirectResponse
    {
        $action->execute($receivable, $request->validated());

        return redirect()->route('receivables.show', $receivable)
            ->with('success', 'Cuenta pendiente actualizada exitosamente.');
    }

    public function destroy(Receivable $receivable): RedirectResponse
    {
        $receivable->delete();

        return redirect()->route('receivables.index')
            ->with('success', 'Cuenta pendiente eliminada exitosamente.');
    }

    public function registerPayment(
        RegisterPaymentRequest $request,
        Receivable $receivable,
        RegisterPaymentAction $action
    ): RedirectResponse {
        $action->execute($receivable, $request->validated());

        return redirect()->route('receivables.show', $receivable)
            ->with('success', 'Pago registrado exitosamente.');
    }

    public function cancel(Receivable $receivable): RedirectResponse
    {
        $receivable->update(['status' => ReceivableStatus::CANCELLED]);

        return redirect()->route('receivables.index')
            ->with('success', 'Cuenta pendiente cancelada.');
    }

    public function addReminder(Request $request, Receivable $receivable, SendReminderAction $action): RedirectResponse
    {
        $data = $request->validate([
            'remind_at' => ['required', 'date', 'after:now'],
            'message' => ['nullable', 'string', 'max:500'],
        ]);

        $action->createReminder($receivable, $data);

        return redirect()->route('receivables.show', $receivable)
            ->with('success', 'Recordatorio programado.');
    }
}
