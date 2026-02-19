<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CreditResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'planning_id' => $this->planning_id,
            'account_id' => $this->account_id,
            'name' => $this->name,
            'type' => $this->type,
            'type_label' => $this->type->label(),
            'type_color' => $this->type->color(),
            'type_icon' => $this->type->icon(),
            'entity' => $this->entity,
            'original_amount' => (float) $this->original_amount,
            'pending_amount' => (float) $this->pending_amount,
            'paid_amount' => $this->paid_amount,
            'progress' => $this->progress,
            'currency' => $this->currency,
            'interest_rate' => (float) $this->interest_rate,
            'interest_rate_type' => $this->interest_rate_type ?? 'annual',
            'rate_type' => $this->rate_type,
            'term_months' => $this->term_months,
            'start_date' => $this->start_date->format('Y-m-d'),
            'estimated_end_date' => $this->estimated_end_date->format('Y-m-d'),
            'payment_day' => $this->payment_day,
            'monthly_payment' => (float) $this->monthly_payment,
            'status' => $this->status,
            'status_label' => $this->status->label(),
            'status_color' => $this->status->color(),
            'reference_number' => $this->reference_number,
            'credit_limit' => $this->credit_limit ? (float) $this->credit_limit : null,
            'billing_day' => $this->billing_day,
            'notes' => $this->notes,
            'is_credit_card' => $this->isCreditCard(),

            // Computed
            'paid_installments_count' => $this->paid_installments_count,
            'pending_installments_count' => $this->pending_installments_count,
            'total_interest' => $this->total_interest,

            // Relationships
            'account' => new AccountResource($this->whenLoaded('account')),
            'installments' => CreditInstallmentResource::collection($this->whenLoaded('installments')),
            'extra_payments' => $this->whenLoaded('extraPayments'),
            'next_installment' => $this->when(
                $this->relationLoaded('installments'),
                fn() => $this->next_installment ? new CreditInstallmentResource($this->next_installment) : null
            ),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
