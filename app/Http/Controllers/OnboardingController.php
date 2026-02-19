<?php

namespace App\Http\Controllers;

use App\Enums\AccountType;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingController extends Controller
{
    /**
     * Show the welcome page.
     */
    public function welcome(): Response
    {
        return Inertia::render('Onboarding/Welcome');
    }

    /**
     * Show the create planning page.
     */
    public function createPlanning(): Response
    {
        return Inertia::render('Onboarding/CreatePlanning');
    }

    /**
     * Show the add first account page.
     */
    public function addFirstAccount(): Response
    {
        return Inertia::render('Onboarding/AddFirstAccount', [
            'accountTypes' => AccountType::options(),
        ]);
    }
}
