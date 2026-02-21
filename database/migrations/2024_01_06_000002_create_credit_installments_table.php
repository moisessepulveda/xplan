<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('credit_installments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('credit_id')->constrained()->cascadeOnDelete();
            $table->integer('number'); // Installment number (1, 2, 3...)
            $table->date('due_date');
            $table->decimal('amount', 15, 2); // Total installment amount
            $table->decimal('principal', 15, 2)->default(0);
            $table->decimal('interest', 15, 2)->default(0);
            $table->decimal('insurance', 15, 2)->default(0);
            $table->decimal('other_charges', 15, 2)->default(0);
            $table->string('status')->default('pending'); // InstallmentStatus enum
            $table->date('paid_date')->nullable();
            $table->decimal('paid_amount', 15, 2)->default(0);
            $table->foreignId('transaction_id')->nullable()->constrained()->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('credit_installments');
    }
};
