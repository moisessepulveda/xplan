<?php

namespace App\Actions\Planning;

use App\Enums\MemberRole;
use App\Models\Planning;
use App\Models\PlanningMember;
use App\Models\User;
use App\Services\DefaultCategoriesService;
use Illuminate\Support\Facades\DB;

class CreatePlanningAction
{
    /**
     * Create a new planning and add the creator as owner.
     */
    public function execute(array $data, User $user): Planning
    {
        return DB::transaction(function () use ($data, $user) {
            // Create the planning
            $planning = $this->createPlanning($data, $user);

            // Add creator as owner
            $this->addOwner($planning, $user);

            // Set as active planning if user has none
            $this->setAsActiveIfNeeded($planning, $user);

            // Create default categories
            $this->createDefaultCategories($planning, $user);

            return $planning;
        });
    }

    /**
     * Create the planning record.
     */
    public function createPlanning(array $data, User $user): Planning
    {
        return Planning::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'currency' => $data['currency'] ?? 'CLP',
            'icon' => $data['icon'] ?? 'home',
            'color' => $data['color'] ?? '#1677ff',
            'month_start_day' => $data['month_start_day'] ?? 1,
            'show_decimals' => $data['show_decimals'] ?? false,
            'creator_id' => $user->id,
        ]);
    }

    /**
     * Add the creator as the owner of the planning.
     */
    public function addOwner(Planning $planning, User $user): PlanningMember
    {
        return PlanningMember::create([
            'planning_id' => $planning->id,
            'user_id' => $user->id,
            'role' => MemberRole::OWNER,
            'joined_at' => now(),
        ]);
    }

    /**
     * Set this planning as active if user doesn't have one.
     */
    public function setAsActiveIfNeeded(Planning $planning, User $user): void
    {
        if (!$user->active_planning_id) {
            $user->update(['active_planning_id' => $planning->id]);
        }
    }

    /**
     * Create default categories for the planning.
     */
    public function createDefaultCategories(Planning $planning, User $user): void
    {
        app(DefaultCategoriesService::class)->createForPlanning($planning, $user->id);
    }
}
