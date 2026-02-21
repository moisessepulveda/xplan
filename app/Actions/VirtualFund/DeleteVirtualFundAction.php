<?php

namespace App\Actions\VirtualFund;

use App\Models\VirtualFund;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class DeleteVirtualFundAction
{
    public function execute(VirtualFund $fund): bool
    {
        if ($fund->is_default) {
            throw new InvalidArgumentException('No se puede eliminar el fondo Disponible');
        }

        return DB::transaction(function () use ($fund) {
            // Clear virtual_fund_id from associated transactions
            $fund->transactions()->update(['virtual_fund_id' => null]);

            // Soft delete the fund (balance returns to "Disponible" automatically)
            return $fund->delete();
        });
    }
}
