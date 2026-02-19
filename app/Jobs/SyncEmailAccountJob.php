<?php

namespace App\Jobs;

use App\Models\EmailAccount;
use App\Services\EmailTransactionProcessor;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SyncEmailAccountJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;
    public int $timeout = 300;

    public function __construct(
        public EmailAccount $emailAccount
    ) {}

    public function handle(EmailTransactionProcessor $processor): void
    {
        // Marcar como sincronizando
        $this->emailAccount->startSyncing();

        try {
            Log::info('Starting email sync job', [
                'account_id' => $this->emailAccount->id,
                'email' => $this->emailAccount->email,
            ]);

            $stats = $processor->processAccount($this->emailAccount);

            Log::info('Email sync job completed', [
                'account_id' => $this->emailAccount->id,
                'stats' => $stats,
            ]);

            // Marcar como finalizado exitosamente
            $this->emailAccount->finishSyncing();
        } catch (\Exception $e) {
            Log::error('Email sync job failed', [
                'account_id' => $this->emailAccount->id,
                'error' => $e->getMessage(),
            ]);

            // Marcar como finalizado con error
            $this->emailAccount->finishSyncing($e->getMessage());

            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('Email sync job permanently failed', [
            'account_id' => $this->emailAccount->id,
            'error' => $exception->getMessage(),
        ]);

        // Asegurar que se marque como no sincronizando
        $this->emailAccount->finishSyncing($exception->getMessage());
    }
}
