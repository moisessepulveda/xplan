<?php

namespace App\Models;

use App\Enums\CategoryType;
use App\Traits\BelongsToPlanning;
use App\Traits\HasCreator;
use App\Traits\Orderable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, SoftDeletes, BelongsToPlanning, HasCreator, Orderable;

    protected $fillable = [
        'planning_id',
        'parent_id',
        'created_by',
        'name',
        'type',
        'icon',
        'color',
        'is_system',
        'system_type',
        'is_archived',
        'order',
    ];

    protected $casts = [
        'type' => CategoryType::class,
        'is_system' => 'boolean',
        'is_archived' => 'boolean',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id')->ordered();
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_archived', false);
    }

    public function scopeRoots($query)
    {
        return $query->whereNull('parent_id');
    }

    public function scopeOfType($query, CategoryType $type)
    {
        return $query->where('type', $type);
    }

    public function scopeIncome($query)
    {
        return $query->where('type', CategoryType::INCOME);
    }

    public function scopeExpense($query)
    {
        return $query->where('type', CategoryType::EXPENSE);
    }

    public function scopeSystemType($query, string $systemType)
    {
        return $query->where('system_type', $systemType);
    }

    public function scopeCredits($query)
    {
        return $query->systemType('credits');
    }

    public function archive(): void
    {
        $this->update(['is_archived' => true]);
        $this->children()->update(['is_archived' => true]);
    }

    public function isParent(): bool
    {
        return $this->children()->exists();
    }

    public function getFullNameAttribute(): string
    {
        if ($this->parent) {
            return $this->parent->name . ' > ' . $this->name;
        }
        return $this->name;
    }
}
