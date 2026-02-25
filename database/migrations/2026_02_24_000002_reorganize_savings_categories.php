<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $plannings = DB::table('plannings')->get();

        foreach ($plannings as $planning) {
            $this->reorganizeSavingsForPlanning($planning->id, $planning->creator_id);
        }
    }

    private function reorganizeSavingsForPlanning(int $planningId, int $userId): void
    {
        // Get all root savings categories for this planning
        $savingsCategories = DB::table('categories')
            ->where('planning_id', $planningId)
            ->where('type', 'savings')
            ->whereNull('parent_id')
            ->get();

        if ($savingsCategories->isEmpty()) {
            return;
        }

        // Check if "Ahorro" parent already exists
        $ahorroParent = $savingsCategories->firstWhere('name', 'Ahorro');

        if ($ahorroParent) {
            // Parent already exists, just reorganize children
            $parentId = $ahorroParent->id;
        } else {
            // Get the highest order value
            $maxOrder = DB::table('categories')
                ->where('planning_id', $planningId)
                ->max('order') ?? 0;

            // Create the parent "Ahorro" category
            $parentId = DB::table('categories')->insertGetId([
                'planning_id' => $planningId,
                'created_by' => $userId,
                'parent_id' => null,
                'name' => 'Ahorro',
                'type' => 'savings',
                'icon' => 'bank',
                'color' => '#1890ff',
                'is_system' => true,
                'system_type' => null,
                'is_archived' => false,
                'order' => $maxOrder + 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Move all other root savings categories to be children of "Ahorro"
        $childOrder = 0;
        foreach ($savingsCategories as $category) {
            if ($category->id === $parentId) {
                continue; // Skip the parent itself
            }

            // First, move any children of this category to be direct children of "Ahorro"
            DB::table('categories')
                ->where('parent_id', $category->id)
                ->update([
                    'parent_id' => $parentId,
                    'updated_at' => now(),
                ]);

            // Then update this category to be a child of "Ahorro"
            DB::table('categories')
                ->where('id', $category->id)
                ->update([
                    'parent_id' => $parentId,
                    'order' => $childOrder++,
                    'updated_at' => now(),
                ]);
        }
    }

    public function down(): void
    {
        // Revert: move all children back to root level
        $plannings = DB::table('plannings')->get();

        foreach ($plannings as $planning) {
            $ahorroParent = DB::table('categories')
                ->where('planning_id', $planning->id)
                ->where('type', 'savings')
                ->where('name', 'Ahorro')
                ->whereNull('parent_id')
                ->first();

            if ($ahorroParent) {
                // Move children back to root
                DB::table('categories')
                    ->where('parent_id', $ahorroParent->id)
                    ->update([
                        'parent_id' => null,
                        'updated_at' => now(),
                    ]);

                // Delete the parent
                DB::table('categories')
                    ->where('id', $ahorroParent->id)
                    ->delete();
            }
        }
    }
};
