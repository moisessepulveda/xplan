<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $plannings = DB::table('plannings')->get();

        foreach ($plannings as $planning) {
            // Check if category already exists
            $exists = DB::table('categories')
                ->where('planning_id', $planning->id)
                ->where('name', 'Suscripciones Digitales')
                ->whereNull('parent_id')
                ->exists();

            if ($exists) {
                continue;
            }

            // Get max order for this planning
            $maxOrder = DB::table('categories')
                ->where('planning_id', $planning->id)
                ->max('order') ?? 0;

            // Create parent category
            $parentId = DB::table('categories')->insertGetId([
                'planning_id' => $planning->id,
                'created_by' => $planning->creator_id,
                'parent_id' => null,
                'name' => 'Suscripciones Digitales',
                'type' => 'expense',
                'icon' => 'cloud',
                'color' => '#722ed1',
                'is_system' => true,
                'system_type' => null,
                'is_archived' => false,
                'order' => $maxOrder + 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create subcategories
            $children = [
                ['name' => 'Streaming Video', 'icon' => 'play-circle', 'color' => '#ff4d4f'],
                ['name' => 'Streaming Música', 'icon' => 'customer-service', 'color' => '#52c41a'],
                ['name' => 'Gaming', 'icon' => 'rocket', 'color' => '#1677ff'],
                ['name' => 'Cloud/Almacenamiento', 'icon' => 'cloud', 'color' => '#13c2c2'],
                ['name' => 'Software/Apps', 'icon' => 'appstore', 'color' => '#fa8c16'],
                ['name' => 'Noticias/Revistas', 'icon' => 'read', 'color' => '#8c8c8c'],
            ];

            foreach ($children as $index => $child) {
                DB::table('categories')->insert([
                    'planning_id' => $planning->id,
                    'created_by' => $planning->creator_id,
                    'parent_id' => $parentId,
                    'name' => $child['name'],
                    'type' => 'expense',
                    'icon' => $child['icon'],
                    'color' => $child['color'],
                    'is_system' => true,
                    'system_type' => null,
                    'is_archived' => false,
                    'order' => $index,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        // Delete subcategories first (those with parent that is "Suscripciones Digitales")
        $parentIds = DB::table('categories')
            ->where('name', 'Suscripciones Digitales')
            ->whereNull('parent_id')
            ->where('is_system', true)
            ->pluck('id');

        DB::table('categories')
            ->whereIn('parent_id', $parentIds)
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('transactions')
                    ->whereColumn('transactions.category_id', 'categories.id');
            })
            ->delete();

        // Delete parent categories
        DB::table('categories')
            ->whereIn('id', $parentIds)
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('transactions')
                    ->whereColumn('transactions.category_id', 'categories.id');
            })
            ->delete();
    }
};
