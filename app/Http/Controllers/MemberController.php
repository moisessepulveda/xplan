<?php

namespace App\Http\Controllers;

use App\Actions\Member\ChangeMemberRoleAction;
use App\Actions\Member\InviteMemberAction;
use App\Actions\Member\RemoveMemberAction;
use App\Enums\MemberRole;
use App\Http\Requests\Member\ChangeMemberRoleRequest;
use App\Http\Requests\Member\InviteMemberRequest;
use App\Http\Resources\InvitationResource;
use App\Http\Resources\PlanningMemberResource;
use App\Models\Planning;
use App\Models\PlanningMember;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MemberController extends Controller
{
    public function index(): Response
    {
        $planning = auth()->user()->activePlanning;

        $members = PlanningMember::with(['user', 'invitedBy'])
            ->where('planning_id', $planning->id)
            ->orderByRaw("CASE WHEN role = 'owner' THEN 0 WHEN role = 'admin' THEN 1 WHEN role = 'editor' THEN 2 ELSE 3 END")
            ->get();

        $pendingInvitations = $planning->invitations()
            ->pending()
            ->with('createdBy')
            ->orderBy('created_at', 'desc')
            ->get();

        $currentUserRole = auth()->user()->roleInPlanning($planning);

        return Inertia::render('Members/Index', [
            'members' => PlanningMemberResource::collection($members),
            'pendingInvitations' => InvitationResource::collection($pendingInvitations),
            'currentUserRole' => $currentUserRole?->value,
            'canManageMembers' => $currentUserRole?->canManageMembers() ?? false,
            'roles' => collect([MemberRole::ADMIN, MemberRole::EDITOR, MemberRole::VIEWER])
                ->map(fn($role) => ['value' => $role->value, 'label' => $role->label()])
                ->values(),
        ]);
    }

    public function invite(): Response
    {
        $roles = collect([MemberRole::ADMIN, MemberRole::EDITOR, MemberRole::VIEWER])
            ->map(fn($role) => ['value' => $role->value, 'label' => $role->label()])
            ->values();

        return Inertia::render('Members/Invite', [
            'roles' => $roles,
        ]);
    }

    public function sendInvitation(InviteMemberRequest $request, InviteMemberAction $action): RedirectResponse
    {
        $planning = auth()->user()->activePlanning;

        // Check if email already belongs to a member
        $existingMember = PlanningMember::where('planning_id', $planning->id)
            ->whereHas('user', fn($q) => $q->where('email', $request->email))
            ->exists();

        if ($existingMember) {
            return redirect()->back()
                ->withErrors(['email' => 'Este usuario ya es miembro del planning.']);
        }

        $action->execute($planning, $request->validated());

        return redirect()->route('members.index')
            ->with('success', 'Invitación enviada exitosamente.');
    }

    public function changeRole(
        PlanningMember $member,
        ChangeMemberRoleRequest $request,
        ChangeMemberRoleAction $action
    ): RedirectResponse {
        $action->execute($member, $request->role);

        return redirect()->route('members.index')
            ->with('success', 'Rol actualizado exitosamente.');
    }

    public function remove(PlanningMember $member, RemoveMemberAction $action): RedirectResponse
    {
        $action->execute($member);

        return redirect()->route('members.index')
            ->with('success', 'Miembro eliminado exitosamente.');
    }

    public function cancelInvitation(\App\Models\Invitation $invitation): RedirectResponse
    {
        $invitation->update(['status' => 'expired']);

        return redirect()->route('members.index')
            ->with('success', 'Invitación cancelada.');
    }

    public function resendInvitation(
        \App\Models\Invitation $invitation,
        InviteMemberAction $action
    ): RedirectResponse {
        $planning = $invitation->planning;

        // Create new invitation with same data
        $action->execute($planning, [
            'email' => $invitation->email,
            'role' => $invitation->role->value,
        ]);

        return redirect()->route('members.index')
            ->with('success', 'Invitación reenviada.');
    }
}
