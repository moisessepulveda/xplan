<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BudgetHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'budget_id',
        'period',
        'total_budgeted',
        'total_spent',
        'lines_snapshot',
        'closed_at',
    ];

    protected $casts = [
        'total_budgeted' => 'decimal:2',
        'total_spent' => 'decimal:2',
        'lines_snapshot' => 'array',
        'closed_at' => 'datetime',
    ];

    public function budget(): BelongsTo
    {
        return $this->belongsTo(Budget::class);
    }

    public function getUsagePercentageAttribute(): float
    {
        if ((float) $this->total_budgeted === 0.0) {
            return 0;
        }

        return round(((float) $this->total_spent / (float) $this->total_budgeted) * 100, 1);
    }
}
