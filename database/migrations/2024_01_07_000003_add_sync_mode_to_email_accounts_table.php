<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('email_accounts', function (Blueprint $table) {
            // Modo de sincronización: 'new_only' o 'unread_7_days'
            $table->string('sync_mode')->default('new_only')->after('sync_frequency');
            // Indica si ya se hizo la primera sincronización (para marcar el punto de inicio)
            $table->boolean('initial_sync_done')->default(false)->after('sync_mode');
        });
    }

    public function down(): void
    {
        Schema::table('email_accounts', function (Blueprint $table) {
            $table->dropColumn(['sync_mode', 'initial_sync_done']);
        });
    }
};
