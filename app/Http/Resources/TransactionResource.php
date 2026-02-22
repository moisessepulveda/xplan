<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'type_label' => $this->type->label(),
            'type_color' => $this->type->color(),
            'type_icon' => $this->type->icon(),
            'amount' => (float) $this->amount,
            'description' => $this->description,
            'date' => $this->date->format('Y-m-d'),
            'time' => $this->time,
            'is_recurring' => $this->is_recurring,
            'pending_approval' => $this->pending_approval,
            'source' => $this->source,
            'tags' => $this->tags ?? [],
            'attachments' => $this->attachments ?? [],

            // Relationships
            'account_id' => $this->account_id,
            'account' => new AccountResource($this->whenLoaded('account')),
            'destination_account_id' => $this->destination_account_id,
            'destination_account' => new AccountResource($this->whenLoaded('destinationAccount')),
            'category_id' => $this->category_id,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'virtual_fund_id' => $this->virtual_fund_id,
            'virtual_fund' => new VirtualFundResource($this->whenLoaded('virtualFund')),
            'destination_virtual_fund_id' => $this->destination_virtual_fund_id,
            'destination_virtual_fund' => new VirtualFundResource($this->whenLoaded('destinationVirtualFund')),
            'created_by' => $this->created_by,
            'creator' => new UserResource($this->whenLoaded('creator')),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
