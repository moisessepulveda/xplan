<?php

namespace App\Models;

use App\Enums\ReceivableStatus;
use App\Enums\ReceivableType;
use App\Traits\BelongsToPlanning;
use App\Traits\HasCreator;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Receivable extends Model
{
    use HasFactory, SoftDeletes, BelongsToPlanning, HasCreator;

    protected $fillable = [
        'planning_id',
        'created_by',
        'type',
        'person_name',
        'person_contact',
        'original_amount',
        'pending_amount',
        'currency',
        'concept',
        'due_date',
        'status',
        'notes',
    ];

    protected $casts = [
        'type' => ReceivableType::class,
        'status' => ReceivableStatus::class,
        'original_amount' => 'decimal:2',
        'pending_amount' => 'decimal:2',
        'due_date' => 'date',
    ];

    public function payments(): HasMany
    {
        return $this->hasMany(ReceivablePayment::class)->orderBy('date', 'desc');
    }

    public function reminders(): HasMany
    {
        return $this->hasMany(Reminder::class)->orderBy('remind_at');
    }

    public function scopeReceivables($query)
    {
        return $query->where('type', ReceivableType::RECEIVABLE);
    }

    public function scopePayables($query)
    {
        return $query->where('type', ReceivableType::PAYABLE);
    }

    public function scopeOfType($query, ReceivableType $type)
    {
        return $query->where('type', $type);
    }

    public function scopeOfStatus($query, ReceivableStatus $status)
    {
        return $query->where('status', $status);
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', [
            ReceivableStatus::PENDING,
            ReceivableStatus::PARTIAL,
        ]);
    }

    public function scopeOverdue($query)
    {
        return $query->active()
            ->whereNotNull('due_date')
            ->where('due_date', '<', now()->toDateString());
    }

    public function isReceivable(): bool
    {
        return $this->type === ReceivableType::RECEIVABLE;
    }

    public function isPayable(): bool
    {
        return $this->type === ReceivableType::PAYABLE;
    }

    public function isPending(): bool
    {
        return $this->status === ReceivableStatus::PENDING;
    }

    public function isPaid(): bool
    {
        return $this->status === ReceivableStatus::PAID;
    }

    public function isOverdue(): bool
    {
        return $this->due_date
            && !$this->isPaid()
            && $this->due_date->isPast();
    }

    public function getPaidAmountAttribute(): float
    {
        return (float) $this->original_amount - (float) $this->pending_amount;
    }

    public function getProgressAttribute(): float
    {
        if ((float) $this->original_amount === 0.0) {
            return 100;
        }

        return round(($this->paid_amount / (float) $this->original_amount) * 100, 1);
    }

    public function recalculateStatus(): void
    {
        if ((float) $this->pending_amount <= 0) {
            $this->update([
                'pending_amount' => 0,
                'status' => ReceivableStatus::PAID,
            ]);
        } elseif ((float) $this->pending_amount < (float) $this->original_amount) {
            $this->update(['status' => ReceivableStatus::PARTIAL]);
        } else {
            $this->update(['status' => ReceivableStatus::PENDING]);
        }
    }
}
