<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReceivablePaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'receivable_id' => $this->receivable_id,
            'amount' => (float) $this->amount,
            'date' => $this->date->format('Y-m-d'),
            'account_id' => $this->account_id,
            'transaction_id' => $this->transaction_id,
            'notes' => $this->notes,
            'registered_by' => $this->registered_by,

            'account' => new AccountResource($this->whenLoaded('account')),

            'created_at' => $this->created_at,
        ];
    }
}
