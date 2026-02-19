<?php

namespace App\Traits;

use App\Models\Planning;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToPlanning
{
    public static function bootBelongsToPlanning(): void
    {
        static::creating(function ($model) {
            if (!$model->planning_id && auth()->check()) {
                $model->planning_id = auth()->user()->active_planning_id;
            }
            if (!$model->created_by && auth()->check()) {
                $model->created_by = auth()->id();
            }
        });

        static::addGlobalScope('planning', function (Builder $builder) {
            if (auth()->check() && auth()->user()->active_planning_id) {
                $builder->where($builder->getModel()->getTable() . '.planning_id', auth()->user()->active_planning_id);
            }
        });
    }

    public function planning(): BelongsTo
    {
        return $this->belongsTo(Planning::class);
    }

    public function scopeForPlanning(Builder $query, int $planningId): Builder
    {
        return $query->withoutGlobalScope('planning')->where('planning_id', $planningId);
    }
}
