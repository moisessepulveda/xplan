<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('virtual_fund_transfers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('from_fund_id')->constrained('virtual_funds')->cascadeOnDelete();
            $table->foreignId('to_fund_id')->constrained('virtual_funds')->cascadeOnDelete();
            $table->decimal('amount', 15, 2);
            $table->string('description')->nullable();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->index(['from_fund_id', 'created_at']);
            $table->index(['to_fund_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('virtual_fund_transfers');
    }
};
