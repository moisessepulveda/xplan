<?php

namespace App\Http\Controllers;

use App\Http\Resources\TransactionResource;
use App\Services\ReportGenerator;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private ReportGenerator $reportGenerator) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $planningId = $user->active_planning_id;

        $stats = $this->reportGenerator->getDashboardStats($planningId);
        $upcomingPayments = $this->reportGenerator->getUpcomingPayments($planningId, 5);
        $quickStats = $this->reportGenerator->getQuickStats($planningId);
        $recentTransactions = $this->reportGenerator->getRecentTransactions($planningId, 5);

        return Inertia::render('Dashboard/Index', [
            'stats' => $stats,
            'upcomingPayments' => $upcomingPayments,
            'quickStats' => $quickStats,
            'recentTransactions' => TransactionResource::collection($recentTransactions),
        ]);
    }
}
