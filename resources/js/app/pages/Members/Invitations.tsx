import React from 'react';
import { Head, router } from '@inertiajs/react';
import { AppLayout } from '@/app/components/common/AppLayout';
import { InvitationList } from '@/app/components/members';
import type { Invitation } from '@/app/types';

interface Props {
    invitations: Invitation[];
}

export default function MembersInvitations({ invitations }: Props) {
    const handleAccept = (invitation: Invitation) => {
        router.post(`/invitations/${invitation.token}/accept`);
    };

    const handleReject = (invitation: Invitation) => {
        router.post(`/invitations/${invitation.token}/reject`);
    };

    return (
        <AppLayout title="Mis Invitaciones" showBack>
            <Head title="Mis Invitaciones" />

            <div style={{ padding: 16 }}>
                <InvitationList
                    invitations={invitations}
                    mode="received"
                    onAccept={handleAccept}
                    onReject={handleReject}
                    emptyText="No tienes invitaciones"
                />
            </div>
        </AppLayout>
    );
}
