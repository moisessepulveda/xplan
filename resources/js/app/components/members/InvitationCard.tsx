import React from 'react';
import { Card, Typography, Tag, Button, Space } from 'antd';
import {
    MailOutlined,
    ClockCircleOutlined,
    CheckOutlined,
    CloseOutlined,
    ReloadOutlined,
    StopOutlined,
} from '@ant-design/icons';
import type { Invitation } from '@/app/types';

interface InvitationCardProps {
    invitation: Invitation;
    mode: 'sent' | 'received';
    onAccept?: () => void;
    onReject?: () => void;
    onCancel?: () => void;
    onResend?: () => void;
}

const statusColors: Record<string, string> = {
    pending: 'warning',
    accepted: 'success',
    rejected: 'error',
    expired: 'default',
};

export function InvitationCard({
    invitation,
    mode,
    onAccept,
    onReject,
    onCancel,
    onResend,
}: InvitationCardProps) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Card
            size="small"
            style={{ marginBottom: 8, borderRadius: 12 }}
            styles={{ body: { padding: '12px 16px' } }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <MailOutlined style={{ color: '#1677ff' }} />
                        {mode === 'sent' ? (
                            <Typography.Text strong style={{ fontSize: 14 }}>
                                {invitation.email}
                            </Typography.Text>
                        ) : (
                            <Typography.Text strong style={{ fontSize: 14 }}>
                                {invitation.planning?.name || 'Planning'}
                            </Typography.Text>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <Tag color={statusColors[invitation.status]}>
                            {invitation.status_label}
                        </Tag>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            Rol: {invitation.role_label}
                        </Typography.Text>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                        <ClockCircleOutlined style={{ fontSize: 11, color: '#8c8c8c' }} />
                        <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                            {invitation.is_expired
                                ? 'Expirada'
                                : `Expira: ${formatDate(invitation.expires_at)}`}
                        </Typography.Text>
                    </div>

                    {mode === 'received' && invitation.created_by && (
                        <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 2 }}>
                            Invitado por: {invitation.created_by.name}
                        </Typography.Text>
                    )}
                </div>

                {/* Actions */}
                <Space size="small">
                    {mode === 'received' && invitation.is_pending && (
                        <>
                            <Button
                                type="primary"
                                size="small"
                                icon={<CheckOutlined />}
                                onClick={onAccept}
                            >
                                Aceptar
                            </Button>
                            <Button
                                size="small"
                                danger
                                icon={<CloseOutlined />}
                                onClick={onReject}
                            >
                                Rechazar
                            </Button>
                        </>
                    )}

                    {mode === 'sent' && invitation.is_pending && (
                        <>
                            <Button
                                size="small"
                                icon={<ReloadOutlined />}
                                onClick={onResend}
                            >
                                Reenviar
                            </Button>
                            <Button
                                size="small"
                                danger
                                icon={<StopOutlined />}
                                onClick={onCancel}
                            >
                                Cancelar
                            </Button>
                        </>
                    )}
                </Space>
            </div>
        </Card>
    );
}
