import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, Typography, Button, Space, Result } from 'antd';
import { TeamOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { Invitation } from '@/app/types';
import { colors } from '@/app/styles/theme';

interface Props {
    invitation: Invitation;
}

export default function AcceptInvitation({ invitation }: Props) {
    if (!invitation.is_pending) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                <Head title="Invitación" />
                <Result
                    status="warning"
                    title="Invitación no disponible"
                    subTitle="Esta invitación ya no es válida o ha expirado."
                    extra={
                        <Button type="primary" onClick={() => router.visit('/dashboard')}>
                            Ir al inicio
                        </Button>
                    }
                />
            </div>
        );
    }

    const handleAccept = () => {
        router.post(`/invitations/${invitation.token}/accept`);
    };

    const handleReject = () => {
        router.post(`/invitations/${invitation.token}/reject`);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            backgroundColor: colors.neutral[100],
        }}>
            <Head title="Aceptar Invitación" />

            <Card
                style={{ maxWidth: 400, width: '100%', borderRadius: 16, textAlign: 'center' }}
                styles={{ body: { padding: 24 } }}
            >
                <div
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        backgroundColor: colors.primary[50],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                    }}
                >
                    <TeamOutlined style={{ fontSize: 28, color: colors.primary[500] }} />
                </div>

                <Typography.Title level={4} style={{ marginBottom: 4 }}>
                    Invitación a {invitation.planning?.name}
                </Typography.Title>

                <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                    {invitation.created_by?.name} te invitó como{' '}
                    <strong>{invitation.role_label}</strong>
                </Typography.Text>

                <div
                    style={{
                        padding: 12,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 8,
                        marginBottom: 24,
                    }}
                >
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        Esta invitación expira el{' '}
                        {new Date(invitation.expires_at).toLocaleDateString('es-CL', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </Typography.Text>
                </div>

                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Button
                        type="primary"
                        size="large"
                        block
                        icon={<CheckOutlined />}
                        onClick={handleAccept}
                    >
                        Aceptar Invitación
                    </Button>
                    <Button
                        size="large"
                        block
                        icon={<CloseOutlined />}
                        onClick={handleReject}
                    >
                        Rechazar
                    </Button>
                </Space>
            </Card>
        </div>
    );
}
