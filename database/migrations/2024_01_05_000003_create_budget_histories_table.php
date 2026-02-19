<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('budget_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('budget_id')->constrained()->cascadeOnDelete();
            $table->string('period', 7); // YYYY-MM
            $table->decimal('total_budgeted', 15, 2);
            $table->decimal('total_spent', 15, 2);
            $table->json('lines_snapshot');
            $table->timestamp('closed_at');
            $table->timestamps();

            $table->unique(['budget_id', 'period']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('budget_histories');
    }
};
