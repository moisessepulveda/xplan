<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmailAccountController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\PlanningController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\CreditController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ReceivableController;
use App\Http\Controllers\ReceiptAnalysisController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\VirtualFundController;
use App\Http\Middleware\EnsureActivePlanning;
use Illuminate\Support\Facades\Route;

// Offline fallback page (PWA)
Route::get('/offline', fn () => view('offline'))->name('offline');

/*
|--------------------------------------------------------------------------
| Guest Routes
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {
    // Home redirect
    Route::get('/', function () {
        return redirect()->route('login');
    });

    // Auth routes
    Route::get('login', [LoginController::class, 'create'])->name('login');
    Route::post('login', [LoginController::class, 'store']);

    Route::get('register', [RegisterController::class, 'create'])->name('register');
    Route::post('register', [RegisterController::class, 'store']);
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    // Logout
    Route::post('logout', [LoginController::class, 'destroy'])->name('logout');

    // Onboarding (without EnsureActivePlanning middleware)
    Route::prefix('onboarding')->name('onboarding.')->group(function () {
        Route::get('welcome', [OnboardingController::class, 'welcome'])->name('welcome');
        Route::get('create-planning', [OnboardingController::class, 'createPlanning'])->name('create-planning');
        Route::get('add-account', [OnboardingController::class, 'addFirstAccount'])->name('add-account');
    });

    // Planning management (partial - creation doesn't need active planning)
    Route::get('plannings/create', [PlanningController::class, 'create'])->name('plannings.create');
    Route::post('plannings', [PlanningController::class, 'store'])->name('plannings.store');

    // Invitations (accessible without active planning for accepting)
    Route::get('invitations/{token}', [InvitationController::class, 'show'])->name('invitations.show');
    Route::post('invitations/{token}/accept', [InvitationController::class, 'accept'])->name('invitations.accept');
    Route::post('invitations/{token}/reject', [InvitationController::class, 'reject'])->name('invitations.reject');
    Route::get('my-invitations', [InvitationController::class, 'received'])->name('invitations.received');

    /*
    |--------------------------------------------------------------------------
    | Routes requiring an active planning
    |--------------------------------------------------------------------------
    */
    Route::middleware(EnsureActivePlanning::class)->group(function () {
        // Dashboard
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Planning management
        Route::get('plannings', [PlanningController::class, 'index'])->name('plannings.index');
        Route::get('plannings/{planning}/edit', [PlanningController::class, 'edit'])->name('plannings.edit');
        Route::put('plannings/{planning}', [PlanningController::class, 'update'])->name('plannings.update');
        Route::post('plannings/{planning}/switch', [PlanningController::class, 'switch'])->name('plannings.switch');

        // Accounts
        Route::resource('accounts', AccountController::class);
        Route::post('accounts/{account}/archive', [AccountController::class, 'archive'])->name('accounts.archive');
        Route::post('accounts/{account}/restore', [AccountController::class, 'restore'])->name('accounts.restore');
        Route::post('accounts/{account}/adjust-balance', [AccountController::class, 'adjustBalance'])->name('accounts.adjust-balance');
        Route::post('accounts/transfer', [AccountController::class, 'transfer'])->name('accounts.transfer');

        // Virtual Funds
        Route::post('accounts/{account}/funds', [VirtualFundController::class, 'store'])->name('funds.store');
        Route::put('funds/{fund}', [VirtualFundController::class, 'update'])->name('funds.update');
        Route::delete('funds/{fund}', [VirtualFundController::class, 'destroy'])->name('funds.destroy');
        Route::post('funds/transfer', [VirtualFundController::class, 'transfer'])->name('funds.transfer');

        // Categories
        Route::resource('categories', CategoryController::class)->except(['show']);
        Route::post('categories/{category}/archive', [CategoryController::class, 'archive'])->name('categories.archive');
        Route::post('categories/{category}/restore', [CategoryController::class, 'restore'])->name('categories.restore');
        Route::post('categories/reorder', [CategoryController::class, 'reorder'])->name('categories.reorder');

        // Transactions
        Route::resource('transactions', TransactionController::class);
        Route::post('transactions/{transaction}/duplicate', [TransactionController::class, 'duplicate'])->name('transactions.duplicate');
        Route::post('transactions/{transaction}/approve', [TransactionController::class, 'approve'])->name('transactions.approve');
        Route::post('transactions/{transaction}/reject', [TransactionController::class, 'reject'])->name('transactions.reject');
        Route::post('transactions/analyze-receipt', [ReceiptAnalysisController::class, 'analyze'])->name('transactions.analyze-receipt');
        Route::get('transactions-recurring', [TransactionController::class, 'recurring'])->name('transactions.recurring');
        Route::post('recurring/{recurring}/apply', [TransactionController::class, 'applyRecurring'])->name('recurring.apply');
        Route::post('recurring/{recurring}/skip', [TransactionController::class, 'skipRecurring'])->name('recurring.skip');
        Route::post('recurring/{recurring}/toggle', [TransactionController::class, 'toggleRecurring'])->name('recurring.toggle');
        Route::delete('recurring/{recurring}', [TransactionController::class, 'destroyRecurring'])->name('recurring.destroy');
        Route::post('installments/{installment}/pay', [TransactionController::class, 'payInstallment'])->name('installments.pay');

        // Budgets (Presupuestos)
        Route::get('budgets', [BudgetController::class, 'index'])->name('budgets.index');
        Route::get('budgets/configure', [BudgetController::class, 'configure'])->name('budgets.configure');
        Route::post('budgets', [BudgetController::class, 'store'])->name('budgets.store');
        Route::put('budgets/{budget}', [BudgetController::class, 'update'])->name('budgets.update');
        Route::delete('budgets/{budget}', [BudgetController::class, 'destroy'])->name('budgets.destroy');
        Route::get('budgets/{budget}/category/{categoryId}', [BudgetController::class, 'category'])->name('budgets.category');
        Route::get('budgets/history', [BudgetController::class, 'history'])->name('budgets.history');
        Route::post('budgets/{budget}/copy', [BudgetController::class, 'copy'])->name('budgets.copy');
        Route::post('budgets/{budget}/close-period', [BudgetController::class, 'closePeriod'])->name('budgets.close-period');

        // Credits (Créditos y Préstamos)
        Route::resource('credits', CreditController::class);
        Route::get('credits/{credit}/amortization', [CreditController::class, 'amortization'])->name('credits.amortization');
        Route::post('credits/{credit}/installments/{installment}/pay', [CreditController::class, 'payInstallment'])->name('credits.pay-installment');
        Route::post('credits/{credit}/extra-payment', [CreditController::class, 'extraPayment'])->name('credits.extra-payment');
        Route::get('credits/{credit}/simulate', [CreditController::class, 'simulate'])->name('credits.simulate');

        // Members (Colaboración)
        Route::get('members', [MemberController::class, 'index'])->name('members.index');
        Route::get('members/invite', [MemberController::class, 'invite'])->name('members.invite');
        Route::post('members/invite', [MemberController::class, 'sendInvitation'])->name('members.send-invitation');
        Route::put('members/{member}/role', [MemberController::class, 'changeRole'])->name('members.change-role');
        Route::delete('members/{member}', [MemberController::class, 'remove'])->name('members.remove');
        Route::post('members/invitations/{invitation}/cancel', [MemberController::class, 'cancelInvitation'])->name('members.cancel-invitation');
        Route::post('members/invitations/{invitation}/resend', [MemberController::class, 'resendInvitation'])->name('members.resend-invitation');

        // Receivables (Cuentas Pendientes)
        Route::resource('receivables', ReceivableController::class);
        Route::post('receivables/{receivable}/payment', [ReceivableController::class, 'registerPayment'])->name('receivables.payment');
        Route::post('receivables/{receivable}/cancel', [ReceivableController::class, 'cancel'])->name('receivables.cancel');
        Route::post('receivables/{receivable}/reminder', [ReceivableController::class, 'addReminder'])->name('receivables.reminder');

        // Reports (Reportes)
        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('reports/expenses-by-category', [ReportController::class, 'expensesByCategory'])->name('reports.expenses-by-category');
        Route::get('reports/income-vs-expenses', [ReportController::class, 'incomeVsExpenses'])->name('reports.income-vs-expenses');
        Route::get('reports/cash-flow', [ReportController::class, 'cashFlow'])->name('reports.cash-flow');
        Route::get('reports/debts', [ReportController::class, 'debts'])->name('reports.debts');
        Route::get('reports/budget-vs-real', [ReportController::class, 'budgetVsReal'])->name('reports.budget-vs-real');
        Route::get('reports/export', [ReportController::class, 'export'])->name('reports.export');

        // Notifications (Notificaciones)
        Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
        Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
        Route::delete('notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
        Route::delete('notifications', [NotificationController::class, 'destroyAll'])->name('notifications.destroy-all');

        // Settings (Configuración)
        Route::get('settings', [SettingsController::class, 'index'])->name('settings.index');
        Route::get('settings/profile', [SettingsController::class, 'profile'])->name('settings.profile');
        Route::put('settings/profile', [SettingsController::class, 'updateProfile'])->name('settings.update-profile');
        Route::put('settings/password', [SettingsController::class, 'updatePassword'])->name('settings.update-password');
        Route::get('settings/preferences', [SettingsController::class, 'preferences'])->name('settings.preferences');
        Route::put('settings/preferences', [SettingsController::class, 'updatePreferences'])->name('settings.update-preferences');

        // Email Accounts (Cuentas de Correo para Sincronización)
        Route::prefix('settings/email-accounts')->name('email-accounts.')->group(function () {
            Route::get('/', [EmailAccountController::class, 'index'])->name('index');
            Route::get('/create', [EmailAccountController::class, 'create'])->name('create');
            Route::post('/', [EmailAccountController::class, 'store'])->name('store');
            Route::get('/{emailAccount}/edit', [EmailAccountController::class, 'edit'])->name('edit');
            Route::put('/{emailAccount}', [EmailAccountController::class, 'update'])->name('update');
            Route::delete('/{emailAccount}', [EmailAccountController::class, 'destroy'])->name('destroy');
            Route::post('/test-connection', [EmailAccountController::class, 'testConnection'])->name('test-connection');
            Route::post('/{emailAccount}/sync', [EmailAccountController::class, 'sync'])->name('sync');
            Route::post('/sync-all', [EmailAccountController::class, 'syncAll'])->name('sync-all');
            Route::get('/{emailAccount}/transactions', [EmailAccountController::class, 'transactions'])->name('transactions');
            Route::post('/{emailAccount}/toggle-active', [EmailAccountController::class, 'toggleActive'])->name('toggle-active');
        });
    });
});
