<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmailAccountResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'planning_id' => $this->planning_id,
            'name' => $this->name,
            'email' => $this->email,
            'provider' => $this->provider->value,
            'provider_label' => $this->provider->label(),
            'provider_icon' => $this->provider->icon(),
            'imap_host' => $this->imap_host,
            'imap_port' => $this->imap_port,
            'imap_encryption' => $this->imap_encryption,
            'folder' => $this->folder,
            'last_sync_at' => $this->last_sync_at?->toISOString(),
            'last_sync_at_human' => $this->last_sync_at?->diffForHumans(),
            'last_sync_error' => $this->last_sync_error,
            'is_active' => $this->is_active,
            'is_syncing' => $this->is_syncing,
            'sync_started_at' => $this->sync_started_at?->toISOString(),
            'sync_started_at_human' => $this->sync_started_at?->diffForHumans(),
            'sync_frequency' => $this->sync_frequency,
            'sync_mode' => $this->sync_mode?->value,
            'sync_mode_label' => $this->sync_mode?->label(),
            'initial_sync_done' => $this->initial_sync_done,
            'created_at' => $this->created_at->toISOString(),
            'email_transactions_count' => $this->whenCounted('emailTransactions'),
            'recent_transactions' => EmailTransactionResource::collection($this->whenLoaded('emailTransactions')),
        ];
    }
}
