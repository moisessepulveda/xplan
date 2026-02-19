<?php

namespace App\Models;

use App\Enums\CreditStatus;
use App\Enums\CreditType;
use App\Traits\BelongsToPlanning;
use App\Traits\HasCreator;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Credit extends Model
{
    use HasFactory, SoftDeletes, BelongsToPlanning, HasCreator;

    protected $fillable = [
        'planning_id',
        'account_id',
        'created_by',
        'name',
        'type',
        'entity',
        'original_amount',
        'pending_amount',
        'currency',
        'interest_rate',
        'interest_rate_type',
        'rate_type',
        'term_months',
        'start_date',
        'estimated_end_date',
        'payment_day',
        'monthly_payment',
        'status',
        'reference_number',
        'credit_limit',
        'billing_day',
        'notes',
    ];

    protected $casts = [
        'type' => CreditType::class,
        'status' => CreditStatus::class,
        'original_amount' => 'decimal:2',
        'pending_amount' => 'decimal:2',
        'interest_rate' => 'decimal:4',
        'monthly_payment' => 'decimal:2',
        'credit_limit' => 'decimal:2',
        'start_date' => 'date',
        'estimated_end_date' => 'date',
    ];

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function installments(): HasMany
    {
        return $this->hasMany(CreditInstallment::class)->orderBy('number');
    }

    public function extraPayments(): HasMany
    {
        return $this->hasMany(ExtraPayment::class)->orderBy('date', 'desc');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', CreditStatus::ACTIVE);
    }

    public function scopeByType($query, CreditType $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByStatus($query, CreditStatus $status)
    {
        return $query->where('status', $status);
    }

    // Computed
    public function getPaidAmountAttribute(): float
    {
        return (float) $this->original_amount - (float) $this->pending_amount;
    }

    public function getProgressAttribute(): float
    {
        if ((float) $this->original_amount <= 0) return 100;
        return round(($this->paid_amount / (float) $this->original_amount) * 100, 1);
    }

    public function getPaidInstallmentsCountAttribute(): int
    {
        return $this->installments()->where('status', 'paid')->count();
    }

    public function getPendingInstallmentsCountAttribute(): int
    {
        return $this->installments()->whereIn('status', ['pending', 'overdue', 'partial'])->count();
    }

    public function getNextInstallmentAttribute(): ?CreditInstallment
    {
        return $this->installments()
            ->whereIn('status', ['pending', 'overdue', 'partial'])
            ->orderBy('due_date')
            ->first();
    }

    public function getTotalInterestAttribute(): float
    {
        return (float) $this->installments()->sum('interest');
    }

    public function getMonthlyInterestRateAttribute(): float
    {
        $rate = (float) $this->interest_rate;
        if ($this->interest_rate_type === 'annual') {
            return $rate / 12;
        }
        return $rate;
    }

    public function getAnnualInterestRateAttribute(): float
    {
        $rate = (float) $this->interest_rate;
        if ($this->interest_rate_type === 'monthly') {
            return $rate * 12;
        }
        return $rate;
    }

    public function isCreditCard(): bool
    {
        return $this->type === CreditType::CREDIT_CARD;
    }

    public function isActive(): bool
    {
        return $this->status === CreditStatus::ACTIVE;
    }

    public function markAsPaid(): void
    {
        $this->update([
            'status' => CreditStatus::PAID,
            'pending_amount' => 0,
        ]);
    }
}
