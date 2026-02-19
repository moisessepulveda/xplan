<?php

namespace App\Http\Controllers;

use App\Actions\EmailAccount\CreateEmailAccountAction;
use App\Actions\EmailAccount\DeleteEmailAccountAction;
use App\Actions\EmailAccount\UpdateEmailAccountAction;
use App\Enums\EmailProvider;
use App\Enums\EmailSyncMode;
use App\Http\Requests\EmailAccount\StoreEmailAccountRequest;
use App\Jobs\SyncEmailAccountJob;
use App\Http\Requests\EmailAccount\UpdateEmailAccountRequest;
use App\Http\Resources\EmailAccountResource;
use App\Http\Resources\EmailTransactionResource;
use App\Models\EmailAccount;
use App\Services\EmailReaderService;
use App\Services\EmailTransactionProcessor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailAccountController extends Controller
{
    public function __construct(
        private EmailReaderService $emailReader,
        private EmailTransactionProcessor $processor
    ) {}

    public function index(): Response
    {
        $accounts = EmailAccount::with(['emailTransactions' => function ($query) {
            $query->latest()->limit(5);
        }])
            ->orderBy('name')
            ->get();

        return Inertia::render('Settings/EmailAccounts/Index', [
            'accounts' => EmailAccountResource::collection($accounts),
            'providers' => EmailProvider::options(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Settings/EmailAccounts/Create', [
            'providers' => EmailProvider::options(),
            'syncModes' => EmailSyncMode::options(),
        ]);
    }

    public function store(StoreEmailAccountRequest $request, CreateEmailAccountAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('email-accounts.index')
            ->with('success', 'Cuenta de correo creada exitosamente.');
    }

    public function edit(EmailAccount $emailAccount): Response
    {
        return Inertia::render('Settings/EmailAccounts/Edit', [
            'account' => new EmailAccountResource($emailAccount),
            'providers' => EmailProvider::options(),
            'syncModes' => EmailSyncMode::options(),
        ]);
    }

    public function update(UpdateEmailAccountRequest $request, EmailAccount $emailAccount, UpdateEmailAccountAction $action): RedirectResponse
    {
        $action->execute($emailAccount, $request->validated());

        return redirect()->route('email-accounts.index')
            ->with('success', 'Cuenta de correo actualizada exitosamente.');
    }

    public function destroy(EmailAccount $emailAccount, DeleteEmailAccountAction $action): RedirectResponse
    {
        $action->execute($emailAccount);

        return redirect()->route('email-accounts.index')
            ->with('success', 'Cuenta de correo eliminada exitosamente.');
    }

    public function testConnection(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'provider' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string',
            'imap_host' => 'required|string',
            'imap_port' => 'required|integer',
            'imap_encryption' => 'required|string|in:ssl,tls',
            'folder' => 'nullable|string',
        ]);

        $result = $this->emailReader->testConnection($request->all());

        return response()->json($result);
    }

    public function sync(EmailAccount $emailAccount): RedirectResponse
    {
        // Verificar si ya está sincronizando
        if ($emailAccount->is_syncing && !$emailAccount->isSyncStuck()) {
            return redirect()->route('email-accounts.index')
                ->with('warning', 'Esta cuenta ya está en proceso de sincronización.');
        }

        // Si está stuck, resetear el estado
        if ($emailAccount->isSyncStuck()) {
            $emailAccount->finishSyncing('Sincronización anterior cancelada por timeout');
        }

        // Despachar job a la cola
        SyncEmailAccountJob::dispatch($emailAccount);

        return redirect()->route('email-accounts.index')
            ->with('success', "Sincronizando {$emailAccount->name}. Este proceso puede tomar unos minutos.");
    }

    public function syncAll(): RedirectResponse
    {
        $accounts = EmailAccount::active()
            ->where(function ($query) {
                $query->where('is_syncing', false)
                    ->orWhereRaw("datetime(sync_started_at, '+10 minutes') <= datetime('now')");
            })
            ->get();

        if ($accounts->isEmpty()) {
            return redirect()->route('email-accounts.index')
                ->with('info', 'No hay cuentas disponibles para sincronizar.');
        }

        $count = 0;
        foreach ($accounts as $account) {
            // Resetear si está stuck
            if ($account->isSyncStuck()) {
                $account->finishSyncing('Sincronización anterior cancelada por timeout');
            }

            SyncEmailAccountJob::dispatch($account);
            $count++;
        }

        return redirect()->route('email-accounts.index')
            ->with('success', "Sincronizando {$count} cuenta(s). Este proceso puede tomar unos minutos.");
    }

    public function transactions(EmailAccount $emailAccount): Response
    {
        $transactions = $emailAccount->emailTransactions()
            ->with('transaction')
            ->orderBy('received_at', 'desc')
            ->paginate(20);

        return Inertia::render('Settings/EmailAccounts/Transactions', [
            'account' => new EmailAccountResource($emailAccount),
            'transactions' => EmailTransactionResource::collection($transactions),
        ]);
    }

    public function toggleActive(EmailAccount $emailAccount): RedirectResponse
    {
        if ($emailAccount->is_active) {
            $emailAccount->deactivate();
            $message = 'Cuenta de correo desactivada.';
        } else {
            $emailAccount->activate();
            $message = 'Cuenta de correo activada.';
        }

        return redirect()->route('email-accounts.index')
            ->with('success', $message);
    }
}
