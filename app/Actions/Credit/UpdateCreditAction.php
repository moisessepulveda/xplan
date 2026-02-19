<?php

namespace App\Actions\Credit;

use App\Models\Credit;

class UpdateCreditAction
{
    public function execute(Credit $credit, array $data): Credit
    {
        $credit->update($data);

        return $credit->fresh();
    }
}
