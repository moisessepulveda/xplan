<?php

namespace App\Models;

use App\Enums\MemberRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'settings',
        'active_planning_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'settings' => 'array',
        ];
    }

    /**
     * The plannings that the user is a member of.
     */
    public function plannings(): BelongsToMany
    {
        return $this->belongsToMany(Planning::class, 'planning_members')
            ->withPivot(['role', 'joined_at'])
            ->withTimestamps();
    }

    /**
     * The plannings created by the user.
     */
    public function createdPlannings(): HasMany
    {
        return $this->hasMany(Planning::class, 'creator_id');
    }

    /**
     * The user's active planning.
     */
    public function activePlanning(): BelongsTo
    {
        return $this->belongsTo(Planning::class, 'active_planning_id');
    }

    /**
     * The planning memberships.
     */
    public function planningMemberships(): HasMany
    {
        return $this->hasMany(PlanningMember::class);
    }

    /**
     * Invitations sent by this user.
     */
    public function sentInvitations(): HasMany
    {
        return $this->hasMany(Invitation::class, 'created_by_id');
    }

    /**
     * Check if user can edit the given planning.
     */
    public function canEditPlanning(Planning $planning): bool
    {
        $membership = $this->planningMemberships()
            ->where('planning_id', $planning->id)
            ->first();

        if (!$membership) {
            return false;
        }

        return MemberRole::from($membership->role)->canCreateTransactions();
    }

    /**
     * Check if user can manage the given planning.
     */
    public function canManagePlanning(Planning $planning): bool
    {
        $membership = $this->planningMemberships()
            ->where('planning_id', $planning->id)
            ->first();

        if (!$membership) {
            return false;
        }

        return MemberRole::from($membership->role)->canEditPlanning();
    }

    /**
     * Get the user's role in a planning.
     */
    public function roleInPlanning(Planning $planning): ?MemberRole
    {
        $membership = $this->planningMemberships()
            ->where('planning_id', $planning->id)
            ->first();

        return $membership ? MemberRole::from($membership->role) : null;
    }
}
