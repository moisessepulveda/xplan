<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $planning = $user->activePlanning;

        // For Phase 1, we just show basic info
        // More data will be added in later phases

        return Inertia::render('Dashboard/Index', [
            'stats' => [
                'total_balance' => 0,
                'month_income' => 0,
                'month_expense' => 0,
                'budget_used' => 0,
            ],
        ]);
    }
}
