<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('planning_id')->constrained()->cascadeOnDelete();
            $table->foreignId('account_id')->constrained()->cascadeOnDelete();
            $table->foreignId('destination_account_id')->nullable()->constrained('accounts')->nullOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->string('type'); // income, expense, transfer
            $table->decimal('amount', 15, 2);
            $table->string('description')->nullable();
            $table->date('date');
            $table->time('time')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->foreignId('recurring_transaction_id')->nullable()->constrained()->nullOnDelete();
            $table->json('tags')->nullable();
            $table->json('attachments')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['planning_id', 'date']);
            $table->index(['planning_id', 'type']);
            $table->index(['planning_id', 'account_id']);
            $table->index(['planning_id', 'category_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
