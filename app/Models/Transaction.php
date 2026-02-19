<?php

namespace App\Models;

use App\Enums\TransactionType;
use App\Traits\BelongsToPlanning;
use App\Traits\HasCreator;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
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
        'date',
        'time',
        'is_recurring',
        'recurring_transaction_id',
        'tags',
        'attachments',
    ];

    protected $casts = [
        'type' => TransactionType::class,
        'amount' => 'decimal:2',
        'date' => 'date',
        'is_recurring' => 'boolean',
        'tags' => 'array',
        'attachments' => 'array',
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

    public function recurringTransaction(): BelongsTo
    {
        return $this->belongsTo(RecurringTransaction::class);
    }

    public function scopeOfType($query, TransactionType $type)
    {
        return $query->where('type', $type);
    }

    public function scopeIncome($query)
    {
        return $query->where('type', TransactionType::INCOME);
    }

    public function scopeExpense($query)
    {
        return $query->where('type', TransactionType::EXPENSE);
    }

    public function scopeTransfer($query)
    {
        return $query->where('type', TransactionType::TRANSFER);
    }

    public function scopeForAccount($query, int $accountId)
    {
        return $query->where(function ($q) use ($accountId) {
            $q->where('account_id', $accountId)
              ->orWhere('destination_account_id', $accountId);
        });
    }

    public function scopeForCategory($query, int $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeBetweenDates($query, string $startDate, string $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    public function scopeForMonth($query, int $year, int $month)
    {
        return $query->whereYear('date', $year)->whereMonth('date', $month);
    }

    public function isTransfer(): bool
    {
        return $this->type === TransactionType::TRANSFER;
    }

    public function getBalanceImpact(): float
    {
        return (float) $this->amount * $this->type->balanceMultiplier();
    }
}
