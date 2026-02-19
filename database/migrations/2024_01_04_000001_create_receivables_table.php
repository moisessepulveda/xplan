<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('receivables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('planning_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->string('type'); // receivable, payable
            $table->string('person_name');
            $table->string('person_contact')->nullable();
            $table->decimal('original_amount', 15, 2);
            $table->decimal('pending_amount', 15, 2);
            $table->string('currency', 3)->default('CLP');
            $table->string('concept');
            $table->date('due_date')->nullable();
            $table->string('status')->default('pending'); // pending, partial, paid, cancelled
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['planning_id', 'type', 'status']);
            $table->index(['planning_id', 'due_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receivables');
    }
};
