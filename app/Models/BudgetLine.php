<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BudgetLine extends Model
{
    use HasFactory;

    protected $fillable = [
        'budget_id',
        'category_id',
        'amount',
        'alert_at_50',
        'alert_at_80',
        'alert_at_100',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'alert_at_50' => 'boolean',
        'alert_at_80' => 'boolean',
        'alert_at_100' => 'boolean',
    ];

    public function budget(): BelongsTo
    {
        return $this->belongsTo(Budget::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
