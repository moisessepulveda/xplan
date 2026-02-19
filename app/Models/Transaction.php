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
        'pending_approval',
        'source',
        'tags',
        'attachments',
    ];

    protected $casts = [
        'type' => TransactionType::class,
        'amount' => 'decimal:2',
        'date' => 'date',
        'is_recurring' => 'boolean',
        'pending_approval' => 'boolean',
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
        return $query->where('transactions.type', $type);
    }

    public function scopeIncome($query)
    {
        return $query->where('transactions.type', TransactionType::INCOME);
    }

    public function scopeExpense($query)
    {
        return $query->where('transactions.type', TransactionType::EXPENSE);
    }

    public function scopeTransfer($query)
    {
        return $query->where('transactions.type', TransactionType::TRANSFER);
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
        return $query->whereBetween('transactions.date', [$startDate, $endDate]);
    }

    public function scopeForMonth($query, int $year, int $month)
    {
        return $query->whereYear('transactions.date', $year)->whereMonth('transactions.date', $month);
    }

    public function isTransfer(): bool
    {
        return $this->type === TransactionType::TRANSFER;
    }

    public function getBalanceImpact(): float
    {
        return (float) $this->amount * $this->type->balanceMultiplier();
    }

    public function scopePendingApproval($query)
    {
        return $query->where('pending_approval', true);
    }

    public function scopeApproved($query)
    {
        return $query->where('pending_approval', false);
    }

    public function scopeFromEmail($query)
    {
        return $query->where('source', 'email');
    }

    public function approve(): void
    {
        $this->update(['pending_approval' => false]);

        // Actualizar saldos de cuentas al aprobar
        $this->updateAccountBalances();
    }

    protected function updateAccountBalances(): void
    {
        $account = $this->account;

        match ($this->type) {
            TransactionType::INCOME => $account->updateBalance($this->amount),
            TransactionType::EXPENSE => $account->updateBalance(-$this->amount),
            TransactionType::TRANSFER => $this->processTransferBalances($account),
        };
    }

    protected function processTransferBalances(Account $sourceAccount): void
    {
        $sourceAccount->updateBalance(-$this->amount);

        if ($this->destination_account_id) {
            $destinationAccount = Account::findOrFail($this->destination_account_id);
            $destinationAccount->updateBalance($this->amount);
        }
    }

    public function isPending(): bool
    {
        return $this->pending_approval === true;
    }
}
