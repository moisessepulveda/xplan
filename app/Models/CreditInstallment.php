<?php

namespace App\Models;

use App\Enums\InstallmentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CreditInstallment extends Model
{
    use HasFactory;

    protected $fillable = [
        'credit_id',
        'number',
        'due_date',
        'amount',
        'principal',
        'interest',
        'insurance',
        'other_charges',
        'status',
        'paid_date',
        'paid_amount',
        'transaction_id',
        'notes',
    ];

    protected $casts = [
        'status' => InstallmentStatus::class,
        'amount' => 'decimal:2',
        'principal' => 'decimal:2',
        'interest' => 'decimal:2',
        'insurance' => 'decimal:2',
        'other_charges' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'due_date' => 'date',
        'paid_date' => 'date',
    ];

    public function credit(): BelongsTo
    {
        return $this->belongsTo(Credit::class);
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->whereIn('status', [InstallmentStatus::PENDING, InstallmentStatus::OVERDUE]);
    }

    public function scopePaid($query)
    {
        return $query->where('status', InstallmentStatus::PAID);
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', InstallmentStatus::OVERDUE);
    }

    public function scopeUpcoming($query, int $days = 30)
    {
        return $query->whereIn('status', [InstallmentStatus::PENDING, InstallmentStatus::OVERDUE])
            ->where('due_date', '<=', now()->addDays($days))
            ->orderBy('due_date');
    }

    // Computed
    public function getRemainingAmountAttribute(): float
    {
        return (float) $this->amount - (float) $this->paid_amount;
    }

    public function isOverdue(): bool
    {
        return $this->status === InstallmentStatus::OVERDUE
            || ($this->status === InstallmentStatus::PENDING && $this->due_date->isPast());
    }

    public function markAsPaid(float $amount, ?string $date = null, ?int $transactionId = null): void
    {
        $this->update([
            'status' => InstallmentStatus::PAID,
            'paid_amount' => $amount,
            'paid_date' => $date ?? now()->format('Y-m-d'),
            'transaction_id' => $transactionId,
        ]);
    }
}
