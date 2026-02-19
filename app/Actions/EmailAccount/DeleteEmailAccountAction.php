<?php

namespace App\Actions\EmailAccount;

use App\Models\EmailAccount;

class DeleteEmailAccountAction
{
    public function execute(EmailAccount $emailAccount): void
    {
        // Eliminar transacciones de email asociadas
        $emailAccount->emailTransactions()->delete();

        // Soft delete de la cuenta
        $emailAccount->delete();
    }
}
