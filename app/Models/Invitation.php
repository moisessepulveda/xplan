<?php

namespace App\Models;

use App\Enums\InvitationStatus;
use App\Enums\MemberRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Invitation extends Model
{
    use HasFactory;

    protected $fillable = [
        'planning_id',
        'email',
        'role',
        'token',
        'status',
        'created_by_id',
        'expires_at',
        'responded_at',
    ];

    protected function casts(): array
    {
        return [
            'role' => MemberRole::class,
            'status' => InvitationStatus::class,
            'expires_at' => 'datetime',
            'responded_at' => 'datetime',
        ];
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Invitation $invitation) {
            if (empty($invitation->token)) {
                $invitation->token = Str::random(64);
            }
            if (empty($invitation->expires_at)) {
                $invitation->expires_at = now()->addDays(7);
            }
        });
    }

    /**
     * The planning this invitation is for.
     */
    public function planning(): BelongsTo
    {
        return $this->belongsTo(Planning::class);
    }

    /**
     * The user who created this invitation.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    /**
     * Check if the invitation is expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Check if the invitation is pending.
     */
    public function isPending(): bool
    {
        return $this->status === InvitationStatus::PENDING && !$this->isExpired();
    }

    /**
     * Mark the invitation as accepted.
     */
    public function markAsAccepted(): void
    {
        $this->update([
            'status' => InvitationStatus::ACCEPTED,
            'responded_at' => now(),
        ]);
    }

    /**
     * Mark the invitation as rejected.
     */
    public function markAsRejected(): void
    {
        $this->update([
            'status' => InvitationStatus::REJECTED,
            'responded_at' => now(),
        ]);
    }

    /**
     * Scope for pending invitations.
     */
    public function scopePending($query)
    {
        return $query->where('status', InvitationStatus::PENDING)
            ->where('expires_at', '>', now());
    }

    /**
     * Scope for invitations by email.
     */
    public function scopeForEmail($query, string $email)
    {
        return $query->where('email', $email);
    }
}
