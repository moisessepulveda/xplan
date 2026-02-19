<?php

namespace App\Mail;

use App\Models\Invitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InvitationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Invitation $invitation
    ) {}

    public function envelope(): Envelope
    {
        $inviterName = $this->invitation->createdBy?->name ?? 'Alguien';
        $planningName = $this->invitation->planning?->name ?? 'un planning';

        return new Envelope(
            subject: "{$inviterName} te ha invitado a \"{$planningName}\" en XPlan",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.invitation',
            with: [
                'invitation' => $this->invitation,
                'acceptUrl' => url("/invitations/{$this->invitation->token}/accept"),
                'inviterName' => $this->invitation->createdBy?->name ?? 'Alguien',
                'planningName' => $this->invitation->planning?->name ?? 'Planning',
                'roleName' => $this->invitation->role->label(),
                'expiresAt' => $this->invitation->expires_at->format('d/m/Y H:i'),
            ],
        );
    }
}
