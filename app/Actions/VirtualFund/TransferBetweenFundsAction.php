<?php

namespace App\Actions\VirtualFund;

use App\Models\VirtualFund;
use App\Models\VirtualFundTransfer;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class TransferBetweenFundsAction
{
    public function execute(
        VirtualFund $fromFund,
        VirtualFund $toFund,
        float $amount,
        ?string $description = null
    ): VirtualFundTransfer {
        if ($fromFund->account_id !== $toFund->account_id) {
            throw new InvalidArgumentException('Ambos fondos deben pertenecer a la misma cuenta');
        }

        if ($amount <= 0) {
            throw new InvalidArgumentException('El monto debe ser positivo');
        }

        if (!$fromFund->is_default && $fromFund->current_amount < $amount) {
            throw new InvalidArgumentException('Saldo insuficiente en el fondo de origen');
        }

        return DB::transaction(function () use ($fromFund, $toFund, $amount, $description) {
            if (!$fromFund->is_default) {
                $fromFund->decrement('current_amount', $amount);
            }

            if (!$toFund->is_default) {
                $toFund->increment('current_amount', $amount);
            }

            return VirtualFundTransfer::create([
                'from_fund_id' => $fromFund->id,
                'to_fund_id' => $toFund->id,
                'amount' => $amount,
                'description' => $description,
                'created_by' => auth()->id(),
            ]);
        });
    }
}
