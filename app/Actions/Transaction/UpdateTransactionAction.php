<?php

namespace App\Actions\Transaction;

use App\Enums\TransactionType;
use App\Models\Account;
use App\Models\Transaction;
use App\Models\VirtualFund;
use Illuminate\Support\Facades\DB;

class UpdateTransactionAction
{
    public function execute(Transaction $transaction, array $data): Transaction
    {
        return DB::transaction(function () use ($transaction, $data) {
            $isPending = $transaction->pending_approval;
            $oldFundId = $transaction->virtual_fund_id;
            $oldDestinationFundId = $transaction->destination_virtual_fund_id;
            $oldType = $transaction->type;
            $oldAmount = $transaction->amount;

            // Solo revertir saldos si la transacción NO está pendiente de aprobación
            if (!$isPending) {
                $this->reverseBalanceImpact($transaction);
                $this->reverseFundImpact($oldFundId, $oldType, $oldAmount);
                $this->reverseDestinationFundImpact($oldDestinationFundId, $oldType, $oldAmount);
            }

            $transaction->update([
                'account_id' => $data['account_id'] ?? $transaction->account_id,
                'destination_account_id' => $data['destination_account_id'] ?? $transaction->destination_account_id,
                'category_id' => $data['category_id'] ?? $transaction->category_id,
                'virtual_fund_id' => array_key_exists('virtual_fund_id', $data) ? $data['virtual_fund_id'] : $transaction->virtual_fund_id,
                'destination_virtual_fund_id' => array_key_exists('destination_virtual_fund_id', $data) ? $data['destination_virtual_fund_id'] : $transaction->destination_virtual_fund_id,
                'type' => $data['type'] ?? $transaction->type,
                'amount' => $data['amount'] ?? $transaction->amount,
                'description' => $data['description'] ?? $transaction->description,
                'date' => $data['date'] ?? $transaction->date,
                'time' => $data['time'] ?? $transaction->time,
                'tags' => $data['tags'] ?? $transaction->tags,
                'attachments' => $data['attachments'] ?? $transaction->attachments,
            ]);

            $transaction->refresh();

            // Solo aplicar saldos si la transacción NO está pendiente de aprobación
            if (!$isPending) {
                $this->applyBalanceImpact($transaction);
                $this->applyFundImpact($transaction);
                $this->applyDestinationFundImpact($transaction);
            }

            return $transaction->fresh();
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

    private function applyBalanceImpact(Transaction $transaction): void
    {
        $account = Account::findOrFail($transaction->account_id);

        match ($transaction->type) {
            TransactionType::INCOME => $account->updateBalance($transaction->amount),
            TransactionType::EXPENSE => $account->updateBalance(-$transaction->amount),
            TransactionType::TRANSFER => $this->applyTransfer($transaction, $account),
        };
    }

    private function applyTransfer(Transaction $transaction, Account $sourceAccount): void
    {
        $sourceAccount->updateBalance(-$transaction->amount);

        if ($transaction->destination_account_id) {
            $destinationAccount = Account::findOrFail($transaction->destination_account_id);
            $destinationAccount->updateBalance($transaction->amount);
        }
    }

    private function reverseFundImpact(?int $fundId, TransactionType $type, float $amount): void
    {
        if (!$fundId) {
            return;
        }

        $fund = VirtualFund::find($fundId);
        if (!$fund || $fund->is_default) {
            return;
        }

        // Reverse the original impact: income added, expense/transfer subtracted
        $reverseImpact = match ($type) {
            TransactionType::INCOME => -(float) $amount,
            TransactionType::EXPENSE => (float) $amount,
            TransactionType::TRANSFER => (float) $amount, // Transfers subtracted, so reverse adds
        };

        $fund->updateAmount($reverseImpact);
    }

    private function applyFundImpact(Transaction $transaction): void
    {
        if (!$transaction->virtual_fund_id) {
            return;
        }

        $fund = VirtualFund::find($transaction->virtual_fund_id);
        if (!$fund || $fund->is_default) {
            return;
        }

        // Apply impact: income adds, expense/transfer subtracts from fund
        $impact = match ($transaction->type) {
            TransactionType::INCOME => (float) $transaction->amount,
            TransactionType::EXPENSE => -(float) $transaction->amount,
            TransactionType::TRANSFER => -(float) $transaction->amount, // Sale del fondo
        };

        $fund->updateAmount($impact);
    }

    private function reverseDestinationFundImpact(?int $fundId, TransactionType $type, float $amount): void
    {
        // Only transfers can have destination fund
        if ($type !== TransactionType::TRANSFER || !$fundId) {
            return;
        }

        $fund = VirtualFund::find($fundId);
        if (!$fund || $fund->is_default) {
            return;
        }

        // Reverse: money entered the destination fund, so we subtract it
        $fund->updateAmount(-(float) $amount);
    }

    private function applyDestinationFundImpact(Transaction $transaction): void
    {
        // Only transfers can have destination fund
        if ($transaction->type !== TransactionType::TRANSFER || !$transaction->destination_virtual_fund_id) {
            return;
        }

        $fund = VirtualFund::find($transaction->destination_virtual_fund_id);
        if (!$fund || $fund->is_default) {
            return;
        }

        // Apply: money enters the destination fund
        $fund->updateAmount((float) $transaction->amount);
    }
}
