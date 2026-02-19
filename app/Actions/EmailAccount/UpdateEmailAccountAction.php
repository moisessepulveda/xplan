<?php

namespace App\Actions\EmailAccount;

use App\Models\EmailAccount;

class UpdateEmailAccountAction
{
    public function execute(EmailAccount $emailAccount, array $data): EmailAccount
    {
        $updateData = [
            'name' => $data['name'] ?? $emailAccount->name,
            'email' => $data['email'] ?? $emailAccount->email,
            'provider' => $data['provider'] ?? $emailAccount->provider,
            'imap_host' => $data['imap_host'] ?? $emailAccount->imap_host,
            'imap_port' => $data['imap_port'] ?? $emailAccount->imap_port,
            'imap_encryption' => $data['imap_encryption'] ?? $emailAccount->imap_encryption,
            'folder' => $data['folder'] ?? $emailAccount->folder,
            'is_active' => $data['is_active'] ?? $emailAccount->is_active,
            'sync_frequency' => $data['sync_frequency'] ?? $emailAccount->sync_frequency,
        ];

        // Solo permitir cambiar sync_mode si aún no se ha hecho la primera sincronización
        if (!$emailAccount->initial_sync_done && isset($data['sync_mode'])) {
            $updateData['sync_mode'] = $data['sync_mode'];
        }

        // Solo actualizar contraseña si se proporciona
        if (!empty($data['password'])) {
            $updateData['password'] = $data['password'];
        }

        $emailAccount->update($updateData);

        return $emailAccount->fresh();
    }
}
