<?php

namespace App\Jobs;

use App\Models\EmailAccount;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SyncAllEmailAccountsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 600;

    public function handle(): void
    {
        $accounts = EmailAccount::needsSync()->get();

        Log::info('Starting bulk email sync', [
            'accounts_count' => $accounts->count(),
        ]);

        foreach ($accounts as $account) {
            SyncEmailAccountJob::dispatch($account)
                ->delay(now()->addSeconds(rand(0, 30))); // Espaciar las ejecuciones
        }

        Log::info('Bulk email sync jobs dispatched', [
            'accounts_count' => $accounts->count(),
        ]);
    }
}
