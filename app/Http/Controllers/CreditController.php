<?php

namespace App\Http\Controllers;

use App\Actions\Credit\CreateCreditAction;
use App\Actions\Credit\GenerateAmortizationTableAction;
use App\Actions\Credit\PayInstallmentAction;
use App\Actions\Credit\RegisterExtraPaymentAction;
use App\Actions\Credit\SimulatePrepaymentAction;
use App\Actions\Credit\UpdateCreditAction;
use App\Enums\CreditStatus;
use App\Enums\CreditType;
use App\Http\Requests\Credit\PayInstallmentRequest;
use App\Http\Requests\Credit\RegisterExtraPaymentRequest;
use App\Http\Requests\Credit\StoreCreditRequest;
use App\Http\Requests\Credit\UpdateCreditRequest;
use App\Http\Resources\AccountResource;
use App\Http\Resources\CreditInstallmentResource;
use App\Http\Resources\CreditResource;
use App\Models\Account;
use App\Models\Credit;
use App\Models\CreditInstallment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CreditController extends Controller
{
    public function index(Request $request): Response
    {
        $type = $request->get('type');
        $status = $request->get('status', 'active');

        $query = Credit::with(['installments', 'creator'])
            ->when($type, fn($q) => $q->where('type', $type))
            ->when($status && $status !== 'all', fn($q) => $q->where('status', $status))
            ->orderBy('created_at', 'desc');

        $credits = $query->get();

        // Summary
        $activeCredits = Credit::active()->get();
        $totalDebt = $activeCredits->sum('pending_amount');
        $totalMonthlyPayment = $activeCredits->sum('monthly_payment');
        $upcomingInstallments = CreditInstallment::pending()
            ->whereHas('credit', fn($q) => $q->active())
            ->where('due_date', '<=', now()->addDays(30))
            ->orderBy('due_date')
            ->with('credit')
            ->limit(5)
            ->get();

        return Inertia::render('Credits/Index', [
            'credits' => CreditResource::collection($credits),
            'filters' => [
                'type' => $type,
                'status' => $status,
            ],
            'summary' => [
                'total_debt' => (float) $totalDebt,
                'total_monthly_payment' => (float) $totalMonthlyPayment,
                'active_credits_count' => $activeCredits->count(),
                'upcoming_installments' => CreditInstallmentResource::collection($upcomingInstallments),
            ],
            'creditTypes' => CreditType::options(),
            'creditStatuses' => CreditStatus::options(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Credits/Create', [
            'creditTypes' => CreditType::options(),
            'accounts' => AccountResource::collection(Account::active()->ordered()->get()),
        ]);
    }

    public function store(StoreCreditRequest $request, CreateCreditAction $action): RedirectResponse
    {
        $credit = $action->execute($request->validated());

        return redirect()->route('credits.show', $credit)
            ->with('success', 'Crédito creado exitosamente.');
    }

    public function show(Credit $credit): Response
    {
        $credit->load(['installments', 'extraPayments.account', 'account', 'creator']);

        return Inertia::render('Credits/Show', [
            'credit' => new CreditResource($credit),
            'accounts' => AccountResource::collection(Account::active()->ordered()->get()),
        ]);
    }

    public function edit(Credit $credit): Response
    {
        return Inertia::render('Credits/Edit', [
            'credit' => new CreditResource($credit),
            'creditTypes' => CreditType::options(),
            'accounts' => AccountResource::collection(Account::active()->ordered()->get()),
        ]);
    }

    public function update(UpdateCreditRequest $request, Credit $credit, UpdateCreditAction $action): RedirectResponse
    {
        $action->execute($credit, $request->validated());

        return redirect()->route('credits.show', $credit)
            ->with('success', 'Crédito actualizado exitosamente.');
    }

    public function destroy(Credit $credit): RedirectResponse
    {
        $credit->installments()->delete();
        $credit->extraPayments()->delete();
        $credit->delete();

        return redirect()->route('credits.index')
            ->with('success', 'Crédito eliminado exitosamente.');
    }

    public function amortization(Credit $credit): Response
    {
        $credit->load('installments');

        return Inertia::render('Credits/Amortization', [
            'credit' => new CreditResource($credit),
        ]);
    }

    public function payInstallment(
        PayInstallmentRequest $request,
        Credit $credit,
        CreditInstallment $installment,
        PayInstallmentAction $action
    ): RedirectResponse {
        $action->execute($installment, $request->validated());

        return redirect()->route('credits.show', $credit)
            ->with('success', 'Cuota pagada exitosamente.');
    }

    public function extraPayment(
        RegisterExtraPaymentRequest $request,
        Credit $credit,
        RegisterExtraPaymentAction $action
    ): RedirectResponse {
        $action->execute($credit, $request->validated());

        return redirect()->route('credits.show', $credit)
            ->with('success', 'Pago extra registrado exitosamente.');
    }

    public function simulate(Request $request, Credit $credit, SimulatePrepaymentAction $action): Response
    {
        $amount = (float) $request->get('amount', 0);
        $strategy = $request->get('strategy', 'reduce_term');
        $simulation = null;

        if ($amount > 0) {
            $simulation = $action->execute($credit, $amount, $strategy);
        }

        return Inertia::render('Credits/Simulate', [
            'credit' => new CreditResource($credit),
            'simulation' => $simulation,
            'amount' => $amount,
            'strategy' => $strategy,
        ]);
    }
}
