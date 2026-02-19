<?php

namespace App\Http\Controllers;

use App\Actions\Member\AcceptInvitationAction;
use App\Actions\Member\RejectInvitationAction;
use App\Http\Resources\InvitationResource;
use App\Models\Invitation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvitationController extends Controller
{
    /**
     * Show received invitations for the authenticated user.
     */
    public function received(): Response
    {
        $invitations = Invitation::with(['planning', 'createdBy'])
            ->forEmail(auth()->user()->email)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Members/Invitations', [
            'invitations' => InvitationResource::collection($invitations),
        ]);
    }

    /**
     * Show the invitation acceptance page (public link).
     */
    public function show(string $token): Response|RedirectResponse
    {
        $invitation = Invitation::with(['planning', 'createdBy'])
            ->where('token', $token)
            ->first();

        if (!$invitation) {
            return redirect()->route('login')
                ->with('error', 'Invitación no encontrada.');
        }

        if (!$invitation->isPending()) {
            return redirect()->route('login')
                ->with('error', 'Esta invitación ya no es válida.');
        }

        return Inertia::render('Members/AcceptInvitation', [
            'invitation' => new InvitationResource($invitation),
        ]);
    }

    /**
     * Accept an invitation.
     */
    public function accept(string $token, AcceptInvitationAction $action): RedirectResponse
    {
        $invitation = Invitation::where('token', $token)->firstOrFail();

        try {
            $action->execute($invitation, auth()->user());
        } catch (\RuntimeException $e) {
            return redirect()->route('dashboard')
                ->with('error', $e->getMessage());
        }

        return redirect()->route('dashboard')
            ->with('success', "Te has unido a \"{$invitation->planning->name}\".");
    }

    /**
     * Reject an invitation.
     */
    public function reject(string $token, RejectInvitationAction $action): RedirectResponse
    {
        $invitation = Invitation::where('token', $token)->firstOrFail();

        try {
            $action->execute($invitation);
        } catch (\RuntimeException $e) {
            return redirect()->back()
                ->with('error', $e->getMessage());
        }

        return redirect()->route('invitations.received')
            ->with('success', 'Invitación rechazada.');
    }
}
