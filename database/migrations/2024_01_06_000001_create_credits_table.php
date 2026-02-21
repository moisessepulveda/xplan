<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('credits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('planning_id')->constrained()->cascadeOnDelete();
            $table->foreignId('account_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('created_by')->constrained('users');
            $table->string('name');
            $table->string('type'); // CreditType enum
            $table->string('entity')->nullable(); // Bank or institution
            $table->decimal('original_amount', 15, 2);
            $table->decimal('pending_amount', 15, 2);
            $table->string('currency', 3)->default('CLP');
            $table->decimal('interest_rate', 8, 4)->default(0);
            $table->string('rate_type')->default('fixed'); // fixed, variable
            $table->integer('term_months');
            $table->date('start_date');
            $table->date('estimated_end_date');
            $table->integer('payment_day')->default(1);
            $table->decimal('monthly_payment', 15, 2)->default(0);
            $table->string('status')->default('active'); // CreditStatus enum
            $table->string('reference_number')->nullable();
            // Credit card specific
            $table->decimal('credit_limit', 15, 2)->nullable();
            $table->integer('billing_day')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('credits');
    }
};
