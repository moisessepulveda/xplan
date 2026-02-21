<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('virtual_funds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('account_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->decimal('current_amount', 15, 2)->default(0);
            $table->decimal('goal_amount', 15, 2)->nullable();
            $table->string('icon')->nullable();
            $table->string('color')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_default')->default(false);
            $table->integer('order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['account_id', 'is_default']);
            $table->index(['account_id', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('virtual_funds');
    }
};
