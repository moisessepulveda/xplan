<?php

namespace App\Models;

use App\Traits\BelongsToPlanning;
use App\Traits\HasCreator;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Budget extends Model
{
    use HasFactory, BelongsToPlanning, HasCreator;

    protected $fillable = [
        'planning_id',
        'created_by',
        'name',
        'type',
        'start_date',
        'end_date',
        'active',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'active' => 'boolean',
    ];

    public function lines(): HasMany
    {
        return $this->hasMany(BudgetLine::class);
    }

    public function histories(): HasMany
    {
        return $this->hasMany(BudgetHistory::class)->orderBy('period', 'desc');
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopeMonthly($query)
    {
        return $query->where('type', 'monthly');
    }

    public function getTotalBudgetedAttribute(): float
    {
        return (float) $this->lines()->sum('amount');
    }

    public function deactivate(): void
    {
        $this->update(['active' => false]);
    }

    public function activate(): void
    {
        $this->update(['active' => true]);
    }
}
