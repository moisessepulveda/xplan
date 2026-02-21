<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('planning_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('type'); // checking, savings, cash, credit_card, investment, other
            $table->string('currency', 3)->default('CLP');
            $table->decimal('initial_balance', 15, 2)->default(0);
            $table->decimal('current_balance', 15, 2)->default(0);
            $table->string('icon')->nullable();
            $table->string('color')->nullable();
            $table->text('description')->nullable();
            $table->boolean('include_in_total')->default(true);
            $table->boolean('is_archived')->default(false);
            $table->integer('order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['planning_id', 'is_archived']);
            $table->index(['planning_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
