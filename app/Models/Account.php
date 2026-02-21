<?php

namespace App\Models;

use App\Enums\AccountType;
use App\Traits\BelongsToPlanning;
use App\Traits\HasCreator;
use App\Traits\Orderable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Account extends Model
{
    use HasFactory, SoftDeletes, BelongsToPlanning, HasCreator, Orderable;

    protected $fillable = [
        'planning_id',
        'created_by',
        'name',
        'type',
        'currency',
        'initial_balance',
        'current_balance',
        'icon',
        'color',
        'description',
        'include_in_total',
        'is_archived',
        'order',
    ];

    protected $casts = [
        'type' => AccountType::class,
        'initial_balance' => 'decimal:2',
        'current_balance' => 'decimal:2',
        'include_in_total' => 'boolean',
        'is_archived' => 'boolean',
    ];

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_archived', false);
    }

    public function scopeIncludedInTotal($query)
    {
        return $query->where('include_in_total', true);
    }

    public function archive(): void
    {
        $this->update(['is_archived' => true]);
    }

    public function restore(): void
    {
        $this->update(['is_archived' => false]);
    }

    public function adjustBalance(float $amount, string $reason = null): void
    {
        $this->current_balance = $amount;
        $this->save();
    }

    public function updateBalance(float $delta): void
    {
        $this->increment('current_balance', $delta);
    }

    public function virtualFunds(): HasMany
    {
        return $this->hasMany(VirtualFund::class);
    }

    public function defaultFund(): HasOne
    {
        return $this->hasOne(VirtualFund::class)->where('is_default', true);
    }

    public function getAvailableBalanceAttribute(): float
    {
        $assignedAmount = $this->virtualFunds()
            ->where('is_default', false)
            ->sum('current_amount');

        return (float) $this->current_balance - (float) $assignedAmount;
    }
}
