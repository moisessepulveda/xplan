<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reminder extends Model
{
    use HasFactory;

    protected $fillable = [
        'receivable_id',
        'remind_at',
        'message',
        'sent',
        'sent_at',
    ];

    protected $casts = [
        'remind_at' => 'datetime',
        'sent' => 'boolean',
        'sent_at' => 'datetime',
    ];

    public function receivable(): BelongsTo
    {
        return $this->belongsTo(Receivable::class);
    }

    public function scopePending($query)
    {
        return $query->where('sent', false);
    }

    public function scopeDue($query)
    {
        return $query->pending()->where('remind_at', '<=', now());
    }

    public function markAsSent(): void
    {
        $this->update([
            'sent' => true,
            'sent_at' => now(),
        ]);
    }
}
