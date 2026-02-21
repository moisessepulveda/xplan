<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('email_account_id')->constrained()->cascadeOnDelete();
            $table->string('message_uid'); // ID único del mensaje en el servidor IMAP
            $table->string('subject')->nullable();
            $table->string('from_email')->nullable();
            $table->timestamp('received_at')->nullable();
            $table->text('raw_content')->nullable(); // Contenido del email
            $table->json('parsed_data')->nullable(); // Resultado del AI
            $table->foreignId('transaction_id')->nullable()->constrained()->nullOnDelete();
            $table->string('status')->default('pending'); // pending, processed, ignored, failed
            $table->text('error_message')->nullable();
            $table->timestamps();

            $table->unique(['email_account_id', 'message_uid']);
            $table->index(['email_account_id', 'status']);
            $table->index('transaction_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_transactions');
    }
};
