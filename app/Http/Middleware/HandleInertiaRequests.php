<?php

namespace App\Http\Middleware;

use App\Http\Resources\PlanningResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            'auth' => [
                'user' => $request->user()
                    ? new UserResource($request->user())
                    : null,
            ],

            'planning' => fn () => $request->user()?->activePlanning
                ? new PlanningResource($request->user()->activePlanning)
                : null,

            'plannings' => fn () => $request->user()
                ? PlanningResource::collection($request->user()->plannings)
                : [],

            'unreadNotificationsCount' => fn () => $request->user()
                ? $request->user()->unreadNotifications()->count()
                : 0,

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info' => fn () => $request->session()->get('info'),
            ],
        ];
    }
}
