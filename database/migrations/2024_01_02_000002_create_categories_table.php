<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('planning_id')->constrained()->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('type'); // income, expense
            $table->string('icon')->nullable();
            $table->string('color')->nullable();
            $table->boolean('is_system')->default(false); // Default categories
            $table->boolean('is_archived')->default(false);
            $table->integer('order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['planning_id', 'type']);
            $table->index(['planning_id', 'parent_id']);
            $table->index(['planning_id', 'is_archived']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
