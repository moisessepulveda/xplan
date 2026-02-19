import React from 'react';
import { Empty } from 'antd';
import { InvitationCard } from './InvitationCard';
import type { Invitation } from '@/app/types';

interface InvitationListProps {
    invitations: Invitation[];
    mode: 'sent' | 'received';
    onAccept?: (invitation: Invitation) => void;
    onReject?: (invitation: Invitation) => void;
    onCancel?: (invitation: Invitation) => void;
    onResend?: (invitation: Invitation) => void;
    emptyText?: string;
}

export function InvitationList({
    invitations,
    mode,
    onAccept,
    onReject,
    onCancel,
    onResend,
    emptyText = 'No hay invitaciones',
}: InvitationListProps) {
    if (invitations.length === 0) {
        return (
            <Empty
                description={emptyText}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
        );
    }

    return (
        <div>
            {invitations.map((invitation) => (
                <InvitationCard
                    key={invitation.id}
                    invitation={invitation}
                    mode={mode}
                    onAccept={onAccept ? () => onAccept(invitation) : undefined}
                    onReject={onReject ? () => onReject(invitation) : undefined}
                    onCancel={onCancel ? () => onCancel(invitation) : undefined}
                    onResend={onResend ? () => onResend(invitation) : undefined}
                />
            ))}
        </div>
    );
}
