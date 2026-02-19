<?php

namespace App\Actions\EmailAccount;

use App\Enums\EmailProvider;
use App\Enums\EmailSyncMode;
use App\Models\EmailAccount;

class CreateEmailAccountAction
{
    public function execute(array $data): EmailAccount
    {
        $provider = EmailProvider::from($data['provider']);
        $imapConfig = $provider->getImapConfig();

        return EmailAccount::create([
            'planning_id' => $data['planning_id'] ?? auth()->user()->active_planning_id,
            'created_by' => $data['created_by'] ?? auth()->id(),
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'provider' => $data['provider'],
            'imap_host' => $data['imap_host'] ?? $imapConfig['host'],
            'imap_port' => $data['imap_port'] ?? $imapConfig['port'],
            'imap_encryption' => $data['imap_encryption'] ?? $imapConfig['encryption'],
            'folder' => $data['folder'] ?? 'INBOX',
            'is_active' => $data['is_active'] ?? true,
            'sync_frequency' => $data['sync_frequency'] ?? 15,
            'sync_mode' => $data['sync_mode'] ?? EmailSyncMode::NEW_ONLY->value,
            'initial_sync_done' => false,
        ]);
    }
}
