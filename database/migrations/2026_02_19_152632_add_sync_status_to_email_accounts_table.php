<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('email_accounts', function (Blueprint $table) {
            $table->boolean('is_syncing')->default(false)->after('is_active');
            $table->timestamp('sync_started_at')->nullable()->after('is_syncing');
            $table->string('last_sync_error')->nullable()->after('last_sync_at');
        });
    }

    public function down(): void
    {
        Schema::table('email_accounts', function (Blueprint $table) {
            $table->dropColumn(['is_syncing', 'sync_started_at', 'last_sync_error']);
        });
    }
};
