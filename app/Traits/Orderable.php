<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait Orderable
{
    public static function bootOrderable(): void
    {
        static::creating(function ($model) {
            if ($model->order === null || $model->order === 0) {
                $model->order = static::query()->max('order') + 1;
            }
        });
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('order');
    }

    public static function reorder(array $ids): void
    {
        foreach ($ids as $order => $id) {
            static::withoutGlobalScopes()->where('id', $id)->update(['order' => $order + 1]);
        }
    }
}
