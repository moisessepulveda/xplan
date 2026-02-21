<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('categories', 'system_type')) {
            Schema::table('categories', function (Blueprint $table) {
                $table->string('system_type')->nullable()->after('is_system');
                $table->index('system_type');
            });
        }

        // Create credits category for each planning that doesn't have one
        $plannings = DB::table('plannings')->get();
        foreach ($plannings as $planning) {
            $exists = DB::table('categories')
                ->where('planning_id', $planning->id)
                ->where('system_type', 'credits')
                ->exists();

            if (!$exists) {
                DB::table('categories')->insert([
                    'planning_id' => $planning->id,
                    'created_by' => $planning->creator_id,
                    'name' => 'Cuotas de Créditos',
                    'type' => 'expense',
                    'icon' => 'credit-card',
                    'color' => '#722ed1',
                    'is_system' => true,
                    'system_type' => 'credits',
                    'is_archived' => false,
                    'order' => 999,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        // Remove credits system categories
        DB::table('categories')->where('system_type', 'credits')->delete();

        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex(['system_type']);
            $table->dropColumn('system_type');
        });
    }
};
