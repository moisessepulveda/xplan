<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Settings/Index', [
            'user' => $request->user()->only(['id', 'name', 'email', 'avatar', 'settings']),
        ]);
    }

    public function profile(Request $request): Response
    {
        return Inertia::render('Settings/Profile', [
            'user' => $request->user()->only(['id', 'name', 'email', 'avatar']),
        ]);
    }

    public function updateProfile(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($request->user()->id),
            ],
        ]);

        $request->user()->update($validated);

        return back()->with('success', 'Perfil actualizado correctamente');
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => 'required|current_password',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'current_password.current_password' => 'La contraseña actual no es correcta',
            'password.min' => 'La nueva contraseña debe tener al menos 8 caracteres',
            'password.confirmed' => 'Las contraseñas no coinciden',
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Contraseña actualizada correctamente');
    }

    public function preferences(Request $request): Response
    {
        return Inertia::render('Settings/Preferences', [
            'settings' => $request->user()->settings ?? [],
        ]);
    }

    public function updatePreferences(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'currency' => 'nullable|string|max:3',
            'date_format' => 'nullable|string|in:DD/MM/YYYY,MM/DD/YYYY,YYYY-MM-DD',
            'locale' => 'nullable|string|in:es,en',
            'theme' => 'nullable|string|in:light,dark,system',
            'notifications_enabled' => 'nullable|boolean',
            'notification_budget_alerts' => 'nullable|boolean',
            'notification_due_dates' => 'nullable|boolean',
            'notification_overdue' => 'nullable|boolean',
            'notification_members' => 'nullable|boolean',
        ]);

        $currentSettings = $request->user()->settings ?? [];
        $newSettings = array_merge($currentSettings, $validated);

        $request->user()->update(['settings' => $newSettings]);

        return back()->with('success', 'Preferencias actualizadas correctamente');
    }
}
