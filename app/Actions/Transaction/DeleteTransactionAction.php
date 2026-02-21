<?php

namespace App\Actions\Transaction;

use App\Enums\TransactionType;
use App\Models\Account;
use App\Models\Transaction;
use App\Models\VirtualFund;
use Illuminate\Support\Facades\DB;

class DeleteTransactionAction
{
    public function execute(Transaction $transaction): void
    {
        DB::transaction(function () use ($transaction) {
            // Solo revertir saldos si la transacción NO estaba pendiente de aprobación
            if (!$transaction->pending_approval) {
                $this->reverseBalanceImpact($transaction);
                $this->reverseFundImpact($transaction);
            }
            $transaction->delete();
        });
    }

    private function reverseBalanceImpact(Transaction $transaction): void
    {
        $account = Account::findOrFail($transaction->account_id);

        match ($transaction->type) {
            TransactionType::INCOME => $account->updateBalance(-$transaction->amount),
            TransactionType::EXPENSE => $account->updateBalance($transaction->amount),
            TransactionType::TRANSFER => $this->reverseTransfer($transaction, $account),
        };
    }

    private function reverseTransfer(Transaction $transaction, Account $sourceAccount): void
    {
        $sourceAccount->updateBalance($transaction->amount);

        if ($transaction->destination_account_id) {
            $destinationAccount = Account::findOrFail($transaction->destination_account_id);
            $destinationAccount->updateBalance(-$transaction->amount);
        }
    }

    private function reverseFundImpact(Transaction $transaction): void
    {
        if (!$transaction->virtual_fund_id) {
            return;
        }

        $fund = VirtualFund::find($transaction->virtual_fund_id);
        if (!$fund || $fund->is_default) {
            return;
        }

        // Reverse the original impact: income added, expense/transfer subtracted
        $reverseImpact = match ($transaction->type) {
            TransactionType::INCOME => -(float) $transaction->amount,
            TransactionType::EXPENSE => (float) $transaction->amount,
            TransactionType::TRANSFER => (float) $transaction->amount, // Transfers subtracted, so reverse adds
        };

        $fund->updateAmount($reverseImpact);
    }
}
