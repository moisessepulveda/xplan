<?php

namespace App\Http\Middleware;

use App\Enums\MemberRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPlanningRole
{
    /**
     * Handle an incoming request.
     *
     * Usage: middleware('planning.role:admin,owner')
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user || !$user->active_planning_id) {
            abort(403, 'No tienes un planning activo.');
        }

        $planning = $user->activePlanning;

        if (!$planning) {
            abort(403, 'No tienes un planning activo.');
        }

        $userRole = $user->roleInPlanning($planning);

        if (!$userRole) {
            abort(403, 'No eres miembro de este planning.');
        }

        // If specific roles are required, check them
        if (!empty($roles)) {
            $allowedRoles = array_map(fn($r) => MemberRole::from($r), $roles);
            if (!in_array($userRole, $allowedRoles)) {
                abort(403, 'No tienes permisos para esta acción.');
            }
        }

        return $next($request);
    }
}
