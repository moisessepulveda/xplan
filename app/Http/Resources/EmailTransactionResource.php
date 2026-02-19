<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmailTransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'email_account_id' => $this->email_account_id,
            'message_uid' => $this->message_uid,
            'subject' => $this->subject,
            'from_email' => $this->from_email,
            'received_at' => $this->received_at?->toISOString(),
            'received_at_human' => $this->received_at?->diffForHumans(),
            'parsed_data' => $this->parsed_data,
            'transaction_id' => $this->transaction_id,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'status_color' => $this->status->color(),
            'status_icon' => $this->status->icon(),
            'error_message' => $this->error_message,
            'is_transaction' => $this->isTransaction(),
            'confidence' => $this->getConfidence(),
            'created_at' => $this->created_at->toISOString(),
            'transaction' => new TransactionResource($this->whenLoaded('transaction')),
        ];
    }
}
