<?php

namespace App\Models;

use App\Enums\MemberRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Planning extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'currency',
        'icon',
        'color',
        'month_start_day',
        'show_decimals',
        'creator_id',
    ];

    protected function casts(): array
    {
        return [
            'month_start_day' => 'integer',
            'show_decimals' => 'boolean',
        ];
    }

    /**
     * The creator of this planning.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    /**
     * The members of this planning.
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'planning_members')
            ->withPivot(['role', 'joined_at'])
            ->withTimestamps();
    }

    /**
     * The planning memberships.
     */
    public function memberships(): HasMany
    {
        return $this->hasMany(PlanningMember::class);
    }

    /**
     * The invitations for this planning.
     */
    public function invitations(): HasMany
    {
        return $this->hasMany(Invitation::class);
    }

    /**
     * Get the owner of this planning.
     */
    public function owner(): ?User
    {
        $membership = $this->memberships()
            ->where('role', MemberRole::OWNER->value)
            ->first();

        return $membership?->user;
    }

    /**
     * Check if a user is a member of this planning.
     */
    public function hasMember(User $user): bool
    {
        return $this->memberships()
            ->where('user_id', $user->id)
            ->exists();
    }

    /**
     * Get the members count.
     */
    public function getMembersCountAttribute(): int
    {
        return $this->memberships()->count();
    }
}
