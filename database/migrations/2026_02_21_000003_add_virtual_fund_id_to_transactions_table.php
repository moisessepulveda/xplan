<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId('virtual_fund_id')
                ->nullable()
                ->after('category_id')
                ->constrained('virtual_funds')
                ->nullOnDelete();

            $table->index(['account_id', 'virtual_fund_id']);
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['virtual_fund_id']);
            $table->dropIndex(['account_id', 'virtual_fund_id']);
            $table->dropColumn('virtual_fund_id');
        });
    }
};
