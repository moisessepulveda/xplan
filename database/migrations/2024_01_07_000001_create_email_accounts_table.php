<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('planning_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->string('name'); // Nombre descriptivo (ej: "Gmail Personal")
            $table->string('email');
            $table->text('password'); // Encrypted
            $table->string('provider'); // gmail, outlook, yahoo, icloud, custom
            $table->string('imap_host');
            $table->integer('imap_port')->default(993);
            $table->string('imap_encryption')->default('ssl'); // ssl, tls
            $table->string('folder')->default('INBOX');
            $table->timestamp('last_sync_at')->nullable();
            $table->unsignedBigInteger('last_uid')->nullable(); // Último email procesado
            $table->boolean('is_active')->default(true);
            $table->integer('sync_frequency')->default(15); // Minutos
            $table->timestamps();
            $table->softDeletes();

            $table->index(['planning_id', 'is_active']);
            $table->unique(['planning_id', 'email']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_accounts');
    }
};
