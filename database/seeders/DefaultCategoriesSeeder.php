<?php

namespace Database\Seeders;

use App\Models\Planning;
use App\Services\DefaultCategoriesService;
use Illuminate\Database\Seeder;

/**
 * @deprecated Use DefaultCategoriesService instead.
 * This seeder is kept for backwards compatibility.
 */
class DefaultCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        // This seeder is meant to be called when creating a new planning
        // Not to be run globally
    }

    /**
     * @deprecated Use DefaultCategoriesService::createForPlanning() instead.
     */
    public static function createForPlanning(Planning $planning, int $userId): void
    {
        app(DefaultCategoriesService::class)->createForPlanning($planning, $userId);
    }
}
