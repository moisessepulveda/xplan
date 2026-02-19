<?php

namespace App\Models;

use App\Enums\MemberRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlanningMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'planning_id',
        'user_id',
        'role',
        'invited_by_id',
        'joined_at',
    ];

    protected function casts(): array
    {
        return [
            'role' => MemberRole::class,
            'joined_at' => 'datetime',
        ];
    }

    /**
     * The planning this membership belongs to.
     */
    public function planning(): BelongsTo
    {
        return $this->belongsTo(Planning::class);
    }

    /**
     * The user this membership belongs to.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The user who invited this member.
     */
    public function invitedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by_id');
    }

    /**
     * Check if this is the owner.
     */
    public function isOwner(): bool
    {
        return $this->role === MemberRole::OWNER;
    }

    /**
     * Check if this member can edit.
     */
    public function canEdit(): bool
    {
        return $this->role->canCreateTransactions();
    }

    /**
     * Check if this member can manage.
     */
    public function canManage(): bool
    {
        return $this->role->canEditPlanning();
    }
}
