<?php

namespace App\Models;

use App\Enums\Frequency;
use App\Enums\TransactionType;
use App\Traits\BelongsToPlanning;
use App\Traits\HasCreator;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class RecurringTransaction extends Model
{
    use HasFactory, SoftDeletes, BelongsToPlanning, HasCreator;

    protected $fillable = [
        'planning_id',
        'account_id',
        'destination_account_id',
        'category_id',
        'created_by',
        'type',
        'amount',
        'description',
        'frequency',
        'start_date',
        'end_date',
        'next_run_date',
        'last_run_date',
        'is_active',
        'tags',
    ];

    protected $casts = [
        'type' => TransactionType::class,
        'frequency' => Frequency::class,
        'amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'next_run_date' => 'date',
        'last_run_date' => 'date',
        'is_active' => 'boolean',
        'tags' => 'array',
    ];

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function destinationAccount(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'destination_account_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeDue($query)
    {
        return $query->active()->where('next_run_date', '<=', now()->toDateString());
    }

    public function deactivate(): void
    {
        $this->update(['is_active' => false]);
    }

    public function calculateNextRunDate(): void
    {
        $nextDate = $this->frequency->nextDate($this->next_run_date);

        if ($this->end_date && $nextDate > $this->end_date) {
            $this->deactivate();
            return;
        }

        $this->update([
            'next_run_date' => $nextDate,
            'last_run_date' => now(),
        ]);
    }
}
