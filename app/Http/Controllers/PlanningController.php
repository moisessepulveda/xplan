<?php

namespace App\Http\Controllers;

use App\Actions\Planning\CreatePlanningAction;
use App\Actions\Planning\SwitchActivePlanningAction;
use App\Actions\Planning\UpdatePlanningAction;
use App\Http\Requests\Planning\StorePlanningRequest;
use App\Http\Resources\PlanningResource;
use App\Models\Planning;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlanningController extends Controller
{
    /**
     * Display a listing of the user's plannings.
     */
    public function index(Request $request): Response
    {
        $plannings = $request->user()->plannings()
            ->withCount('memberships')
            ->get();

        return Inertia::render('Plannings/Index', [
            'plannings' => PlanningResource::collection($plannings),
        ]);
    }

    /**
     * Show the form for creating a new planning.
     */
    public function create(): Response
    {
        return Inertia::render('Plannings/Create');
    }

    /**
     * Store a newly created planning.
     */
    public function store(
        StorePlanningRequest $request,
        CreatePlanningAction $action
    ): RedirectResponse {
        $planning = $action->execute($request->validated(), $request->user());

        return redirect()
            ->route('dashboard')
            ->with('success', 'Planificación creada exitosamente.');
    }

    /**
     * Show the form for editing a planning.
     */
    public function edit(Planning $planning): Response
    {
        $this->authorize('update', $planning);

        return Inertia::render('Plannings/Edit', [
            'planning' => new PlanningResource($planning),
        ]);
    }

    /**
     * Update the specified planning.
     */
    public function update(
        StorePlanningRequest $request,
        Planning $planning,
        UpdatePlanningAction $action
    ): RedirectResponse {
        $this->authorize('update', $planning);

        $action->execute($planning, $request->validated());

        return redirect()
            ->back()
            ->with('success', 'Planificación actualizada.');
    }

    /**
     * Switch to a different planning.
     */
    public function switch(
        Request $request,
        Planning $planning,
        SwitchActivePlanningAction $action
    ): RedirectResponse {
        $action->execute($request->user(), $planning);

        return redirect()
            ->route('dashboard')
            ->with('success', "Cambiado a {$planning->name}");
    }
}
