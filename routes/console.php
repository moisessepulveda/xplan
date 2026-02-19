<?php

use App\Jobs\SyncAllEmailAccountsJob;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Sincronizar cuentas de correo cada 15 minutos
Schedule::job(new SyncAllEmailAccountsJob)->everyFifteenMinutes()
    ->name('sync-email-accounts')
    ->withoutOverlapping();
