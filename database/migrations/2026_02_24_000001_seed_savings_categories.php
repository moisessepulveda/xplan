<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Default savings categories catalog.
     * Structure: [name, icon, color, children[]]
     */
    private function getSavingsCategories(): array
    {
        return [
            [
                'name' => 'Ahorro',
                'icon' => 'bank',
                'color' => '#1890ff',
                'children' => [
                    ['name' => 'Fondo de Emergencia', 'icon' => 'safety', 'color' => '#1890ff'],
                    ['name' => 'Vacaciones', 'icon' => 'global', 'color' => '#13c2c2'],
                    ['name' => 'Retiro/Jubilación', 'icon' => 'fund', 'color' => '#722ed1'],
                    ['name' => 'Educación', 'icon' => 'book', 'color' => '#52c41a'],
                    ['name' => 'Compra Grande', 'icon' => 'shopping', 'color' => '#fa8c16'],
                    ['name' => 'Ahorro General', 'icon' => 'wallet', 'color' => '#8c8c8c'],
                ],
            ],
        ];
    }

    public function up(): void
    {
        $plannings = DB::table('plannings')->get();

        foreach ($plannings as $planning) {
            $this->createSavingsCategoriesForPlanning($planning->id, $planning->creator_id);
        }
    }

    private function createSavingsCategoriesForPlanning(int $planningId, int $userId): void
    {
        // Check if savings categories already exist for this planning
        $existingCount = DB::table('categories')
            ->where('planning_id', $planningId)
            ->where('type', 'savings')
            ->count();

        if ($existingCount > 0) {
            return; // Skip if savings categories already exist
        }

        // Get the highest order value for this planning
        $maxOrder = DB::table('categories')
            ->where('planning_id', $planningId)
            ->max('order') ?? 0;

        $order = $maxOrder + 1;

        // Create savings categories
        foreach ($this->getSavingsCategories() as $category) {
            $parentId = DB::table('categories')->insertGetId([
                'planning_id' => $planningId,
                'created_by' => $userId,
                'parent_id' => null,
                'name' => $category['name'],
                'type' => 'savings',
                'icon' => $category['icon'],
                'color' => $category['color'],
                'is_system' => true,
                'system_type' => null,
                'is_archived' => false,
                'order' => $order++,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if (!empty($category['children'])) {
                $childOrder = 0;
                foreach ($category['children'] as $child) {
                    DB::table('categories')->insert([
                        'planning_id' => $planningId,
                        'created_by' => $userId,
                        'parent_id' => $parentId,
                        'name' => $child['name'],
                        'type' => 'savings',
                        'icon' => $child['icon'],
                        'color' => $child['color'],
                        'is_system' => true,
                        'system_type' => null,
                        'is_archived' => false,
                        'order' => $childOrder++,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }

    public function down(): void
    {
        // Only delete savings categories that don't have transactions
        DB::table('categories')
            ->where('type', 'savings')
            ->where('is_system', true)
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('transactions')
                    ->whereColumn('transactions.category_id', 'categories.id');
            })
            ->delete();
    }
};
