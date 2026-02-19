<?php

namespace App\Models;

use App\Enums\EmailTransactionStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmailTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'email_account_id',
        'message_uid',
        'subject',
        'from_email',
        'received_at',
        'raw_content',
        'parsed_data',
        'transaction_id',
        'status',
        'error_message',
    ];

    protected $casts = [
        'received_at' => 'datetime',
        'parsed_data' => 'array',
        'status' => EmailTransactionStatus::class,
    ];

    public function emailAccount(): BelongsTo
    {
        return $this->belongsTo(EmailAccount::class);
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', EmailTransactionStatus::PENDING);
    }

    public function scopeProcessed($query)
    {
        return $query->where('status', EmailTransactionStatus::PROCESSED);
    }

    public function scopeIgnored($query)
    {
        return $query->where('status', EmailTransactionStatus::IGNORED);
    }

    public function scopeFailed($query)
    {
        return $query->where('status', EmailTransactionStatus::FAILED);
    }

    public function markAsProcessed(Transaction $transaction): void
    {
        $this->update([
            'status' => EmailTransactionStatus::PROCESSED,
            'transaction_id' => $transaction->id,
        ]);
    }

    public function markAsIgnored(): void
    {
        $this->update([
            'status' => EmailTransactionStatus::IGNORED,
        ]);
    }

    public function markAsFailed(string $errorMessage): void
    {
        $this->update([
            'status' => EmailTransactionStatus::FAILED,
            'error_message' => $errorMessage,
        ]);
    }

    public function isTransaction(): bool
    {
        return isset($this->parsed_data['is_transaction']) && $this->parsed_data['is_transaction'] === true;
    }

    public function getConfidence(): float
    {
        return $this->parsed_data['confidence'] ?? 0;
    }
}
