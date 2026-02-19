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
        Schema::table('credits', function (Blueprint $table) {
            $table->string('interest_rate_type', 10)->default('annual')->after('interest_rate');
        });
    }

    public function down(): void
    {
        Schema::table('credits', function (Blueprint $table) {
            $table->dropColumn('interest_rate_type');
        });
    }
};
