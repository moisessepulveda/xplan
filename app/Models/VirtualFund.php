<?php

namespace App\Models;

use App\Traits\Orderable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class VirtualFund extends Model
{
    use HasFactory, SoftDeletes, Orderable;

    protected $fillable = [
        'account_id',
        'name',
        'current_amount',
        'goal_amount',
        'icon',
        'color',
        'description',
        'is_default',
        'order',
        'virtual_fund_id',
    ];

    protected $casts = [
        'current_amount' => 'decimal:2',
        'goal_amount' => 'decimal:2',
        'is_default' => 'boolean',
    ];

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function outgoingTransfers(): HasMany
    {
        return $this->hasMany(VirtualFundTransfer::class, 'from_fund_id');
    }

    public function incomingTransfers(): HasMany
    {
        return $this->hasMany(VirtualFundTransfer::class, 'to_fund_id');
    }

    public function getProgressAttribute(): float
    {
        if (!$this->goal_amount || $this->goal_amount <= 0) {
            return 0;
        }

        return min(100, ((float) $this->current_amount / (float) $this->goal_amount) * 100);
    }

    public function scopeForAccount($query, int $accountId)
    {
        return $query->where('account_id', $accountId);
    }

    public function scopeNonDefault($query)
    {
        return $query->where('is_default', false);
    }

    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    public function updateAmount(float $delta): void
    {
        $this->increment('current_amount', $delta);
    }

    public function setAmount(float $amount): void
    {
        $this->update(['current_amount' => $amount]);
    }
}
