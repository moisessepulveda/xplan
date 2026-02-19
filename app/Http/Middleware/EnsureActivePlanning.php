<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureActivePlanning
{
    /**
     * Handle an incoming request.
     * Ensures the authenticated user has an active planning selected.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // If user has no active planning, redirect to onboarding
        if (!$user->active_planning_id) {
            // Check if user has any plannings
            if ($user->plannings()->exists()) {
                // Auto-select first planning
                $firstPlanning = $user->plannings()->first();
                $user->update(['active_planning_id' => $firstPlanning->id]);
            } else {
                // Redirect to create first planning
                if (!$request->routeIs('onboarding.*') && !$request->routeIs('plannings.create')) {
                    return redirect()->route('onboarding.create-planning');
                }
            }
        }

        // Verify user still has access to active planning
        if ($user->active_planning_id) {
            $hasAccess = $user->plannings()
                ->where('plannings.id', $user->active_planning_id)
                ->exists();

            if (!$hasAccess) {
                // Lost access, select another planning or redirect to create
                $firstPlanning = $user->plannings()->first();
                if ($firstPlanning) {
                    $user->update(['active_planning_id' => $firstPlanning->id]);
                } else {
                    $user->update(['active_planning_id' => null]);
                    return redirect()->route('onboarding.create-planning');
                }
            }
        }

        return $next($request);
    }
}
