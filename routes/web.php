<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\PlanningController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\ReceivableController;
use App\Http\Middleware\EnsureActivePlanning;
use Illuminate\Support\Facades\Route;

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

        // Categories
        Route::resource('categories', CategoryController::class)->except(['show']);
        Route::post('categories/{category}/archive', [CategoryController::class, 'archive'])->name('categories.archive');
        Route::post('categories/{category}/restore', [CategoryController::class, 'restore'])->name('categories.restore');
        Route::post('categories/reorder', [CategoryController::class, 'reorder'])->name('categories.reorder');

        // Transactions
        Route::resource('transactions', TransactionController::class);
        Route::post('transactions/{transaction}/duplicate', [TransactionController::class, 'duplicate'])->name('transactions.duplicate');
        Route::get('transactions-recurring', [TransactionController::class, 'recurring'])->name('transactions.recurring');

        // Receivables (Cuentas Pendientes)
        Route::resource('receivables', ReceivableController::class);
        Route::post('receivables/{receivable}/payment', [ReceivableController::class, 'registerPayment'])->name('receivables.payment');
        Route::post('receivables/{receivable}/cancel', [ReceivableController::class, 'cancel'])->name('receivables.cancel');
        Route::post('receivables/{receivable}/reminder', [ReceivableController::class, 'addReminder'])->name('receivables.reminder');
    });
});
