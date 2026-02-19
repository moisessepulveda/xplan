<?php

namespace App\Models;

use App\Enums\EmailProvider;
use App\Enums\EmailSyncMode;
use App\Traits\BelongsToPlanning;
use App\Traits\HasCreator;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Crypt;

class EmailAccount extends Model
{
    use HasFactory, SoftDeletes, BelongsToPlanning, HasCreator;

    protected $fillable = [
        'planning_id',
        'created_by',
        'name',
        'email',
        'password',
        'provider',
        'imap_host',
        'imap_port',
        'imap_encryption',
        'folder',
        'last_sync_at',
        'last_sync_error',
        'last_uid',
        'is_active',
        'is_syncing',
        'sync_started_at',
        'sync_frequency',
        'sync_mode',
        'initial_sync_done',
    ];

    protected $casts = [
        'provider' => EmailProvider::class,
        'sync_mode' => EmailSyncMode::class,
        'imap_port' => 'integer',
        'last_sync_at' => 'datetime',
        'sync_started_at' => 'datetime',
        'last_uid' => 'integer',
        'is_active' => 'boolean',
        'is_syncing' => 'boolean',
        'initial_sync_done' => 'boolean',
        'sync_frequency' => 'integer',
        'password' => 'encrypted',
    ];

    protected $hidden = [
        'password',
    ];

    public function emailTransactions(): HasMany
    {
        return $this->hasMany(EmailTransaction::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeNeedsSync($query)
    {
        return $query->active()
            ->where(function ($q) {
                $q->whereNull('last_sync_at')
                    ->orWhereRaw('datetime(last_sync_at, "+" || sync_frequency || " minutes") <= datetime("now")');
            });
    }

    public function getImapConfig(): array
    {
        return [
            'host' => $this->imap_host,
            'port' => $this->imap_port,
            'encryption' => $this->imap_encryption,
            'validate_cert' => true,
            'username' => $this->email,
            'password' => $this->password,
            'protocol' => 'imap',
        ];
    }

    public function markSynced(?int $lastUid = null): void
    {
        $this->update([
            'last_sync_at' => now(),
            'last_uid' => $lastUid ?? $this->last_uid,
        ]);
    }

    public function activate(): void
    {
        $this->update(['is_active' => true]);
    }

    public function deactivate(): void
    {
        $this->update(['is_active' => false]);
    }

    public function startSyncing(): void
    {
        $this->update([
            'is_syncing' => true,
            'sync_started_at' => now(),
            'last_sync_error' => null,
        ]);
    }

    public function finishSyncing(?string $error = null): void
    {
        $this->update([
            'is_syncing' => false,
            'sync_started_at' => null,
            'last_sync_at' => $error ? $this->last_sync_at : now(),
            'last_sync_error' => $error,
        ]);
    }

    public function isSyncStuck(): bool
    {
        if (!$this->is_syncing || !$this->sync_started_at) {
            return false;
        }
        // Considerar stuck si lleva más de 10 minutos
        return $this->sync_started_at->diffInMinutes(now()) > 10;
    }
}
