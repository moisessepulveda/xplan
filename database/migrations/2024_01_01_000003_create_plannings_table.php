<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('plannings', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('currency', 3)->default('CLP');
            $table->string('icon')->default('home');
            $table->string('color', 7)->default('#1677ff');
            $table->unsignedTinyInteger('month_start_day')->default(1);
            $table->boolean('show_decimals')->default(false);
            $table->foreignId('creator_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        // Add active_planning_id to users after plannings table exists
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('active_planning_id')->nullable()->after('settings')
                ->constrained('plannings')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('active_planning_id');
        });

        Schema::dropIfExists('plannings');
    }
};
