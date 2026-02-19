import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Button, Typography } from 'antd';
import { PlusOutlined, MailOutlined } from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { MemberList, InvitationList } from '@/app/components/members';
import type { PlanningMember, Invitation, MemberRole, RoleOption, PageProps } from '@/app/types';

interface Props {
    members: PlanningMember[];
    pendingInvitations: Invitation[];
    currentUserRole: string;
    canManageMembers: boolean;
    roles: RoleOption[];
}

export default function MembersIndex({
    members,
    pendingInvitations,
    canManageMembers,
    roles,
}: Props) {
    const { auth } = usePage<PageProps>().props;
    const currentUserId = auth.user?.id || 0;

    const handleChangeRole = (memberId: number, role: MemberRole) => {
        router.put(`/members/${memberId}/role`, { role });
    };

    const handleRemove = (memberId: number) => {
        router.delete(`/members/${memberId}`);
    };

    const handleCancelInvitation = (invitation: Invitation) => {
        router.post(`/members/invitations/${invitation.id}/cancel`);
    };

    const handleResendInvitation = (invitation: Invitation) => {
        router.post(`/members/invitations/${invitation.id}/resend`);
    };

    const headerRight = canManageMembers ? (
        <Button
            type="text"
            icon={<PlusOutlined style={{ color: '#fff', fontSize: 18 }} />}
            onClick={() => router.visit('/members/invite')}
        />
    ) : undefined;

    return (
        <AppLayout title="Miembros" showBack headerRight={headerRight}>
            <Head title="Miembros" />

            <div style={{ padding: 16 }}>
                {/* Members Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        MIEMBROS ({members.length})
                    </Typography.Text>
                    <Button
                        type="link"
                        size="small"
                        icon={<MailOutlined />}
                        onClick={() => router.visit('/my-invitations')}
                    >
                        Mis invitaciones
                    </Button>
                </div>

                <MemberList
                    members={members}
                    roles={roles}
                    canManage={canManageMembers}
                    currentUserId={currentUserId}
                    onChangeRole={handleChangeRole}
                    onRemove={handleRemove}
                />

                {/* Pending Invitations */}
                {canManageMembers && pendingInvitations.length > 0 && (
                    <div style={{ marginTop: 24 }}>
                        <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                            INVITACIONES PENDIENTES ({pendingInvitations.length})
                        </Typography.Text>

                        <InvitationList
                            invitations={pendingInvitations}
                            mode="sent"
                            onCancel={handleCancelInvitation}
                            onResend={handleResendInvitation}
                        />
                    </div>
                )}

                {/* Invite Button */}
                {canManageMembers && (
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        block
                        size="large"
                        onClick={() => router.visit('/members/invite')}
                        style={{ marginTop: 16 }}
                    >
                        Invitar Miembro
                    </Button>
                )}
            </div>
        </AppLayout>
    );
}
