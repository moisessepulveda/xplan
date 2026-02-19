import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, Typography, Button, Empty, Tag, Space, message, Popconfirm, Switch } from 'antd';
import {
    PlusOutlined,
    SyncOutlined,
    MailOutlined,
    GoogleOutlined,
    WindowsOutlined,
    AppleOutlined,
    SettingOutlined,
    EditOutlined,
    DeleteOutlined,
    RightOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    LoadingOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import type { EmailAccount, EmailProviderOption } from '@/app/types';
import { colors } from '@/app/styles/theme';

interface Props {
    accounts: EmailAccount[];
    providers: EmailProviderOption[];
}

const providerIcons: Record<string, React.ReactNode> = {
    google: <GoogleOutlined />,
    windows: <WindowsOutlined />,
    apple: <AppleOutlined />,
    yahoo: <MailOutlined />,
    setting: <SettingOutlined />,
};

export default function EmailAccountsIndex({ accounts, providers }: Props) {
    const hasSyncingAccounts = accounts.some(acc => acc.is_syncing);

    const handleSync = (account: EmailAccount) => {
        router.post(`/settings/email-accounts/${account.id}/sync`, {}, {
            preserveScroll: true,
            onError: () => message.error('Error al iniciar sincronización'),
        });
    };

    const handleSyncAll = () => {
        router.post('/settings/email-accounts/sync-all', {}, {
            preserveScroll: true,
            onError: () => message.error('Error al iniciar sincronización'),
        });
    };

    const handleDelete = (account: EmailAccount) => {
        router.delete(`/settings/email-accounts/${account.id}`, {
            onSuccess: () => message.success('Cuenta eliminada'),
            onError: () => message.error('Error al eliminar la cuenta'),
        });
    };

    const handleToggleActive = (account: EmailAccount) => {
        router.post(`/settings/email-accounts/${account.id}/toggle-active`, {}, {
            onSuccess: () => message.success(account.is_active ? 'Cuenta desactivada' : 'Cuenta activada'),
            onError: () => message.error('Error al cambiar el estado'),
        });
    };

    return (
        <AppLayout title="Cuentas de Correo" showBack backUrl="/settings">
            <Head title="Cuentas de Correo" />

            <div style={{ padding: 16 }}>
                {/* Header Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => router.visit('/settings/email-accounts/create')}
                    >
                        Agregar cuenta
                    </Button>
                    {accounts.length > 0 && (
                        <Button
                            icon={<SyncOutlined spin={hasSyncingAccounts} />}
                            onClick={handleSyncAll}
                            disabled={hasSyncingAccounts}
                        >
                            Sincronizar todo
                        </Button>
                    )}
                </div>

                {/* Info Card */}
                <Card
                    style={{
                        marginBottom: 16,
                        borderRadius: 12,
                        background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                    }}
                    styles={{ body: { padding: 16 } }}
                >
                    <Typography.Text style={{ color: '#fff', fontSize: 14 }}>
                        Conecta tus cuentas de correo para detectar transacciones automáticamente desde las notificaciones de tu banco.
                    </Typography.Text>
                </Card>

                {/* Accounts List */}
                {accounts.length === 0 ? (
                    <Card style={{ borderRadius: 12 }}>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No tienes cuentas de correo configuradas"
                        >
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => router.visit('/settings/email-accounts/create')}
                            >
                                Agregar cuenta
                            </Button>
                        </Empty>
                    </Card>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {accounts.map((account) => (
                            <Card
                                key={account.id}
                                style={{
                                    borderRadius: 12,
                                    opacity: account.is_active ? 1 : 0.7,
                                }}
                                styles={{ body: { padding: 0 } }}
                            >
                                {/* Account Header */}
                                <div
                                    style={{
                                        padding: 16,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        borderBottom: '1px solid var(--ant-color-border)',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 10,
                                                backgroundColor: colors.primary[50],
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: colors.primary[500],
                                                fontSize: 18,
                                            }}
                                        >
                                            {providerIcons[account.provider_icon] || <MailOutlined />}
                                        </div>
                                        <div>
                                            <Typography.Text strong style={{ fontSize: 14 }}>
                                                {account.name}
                                            </Typography.Text>
                                            <Typography.Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                                                {account.email}
                                            </Typography.Text>
                                        </div>
                                    </div>
                                    <Switch
                                        size="small"
                                        checked={account.is_active}
                                        onChange={() => handleToggleActive(account)}
                                    />
                                </div>

                                {/* Account Info */}
                                <div style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                        <Tag color={account.is_active ? 'green' : 'default'}>
                                            {account.is_active ? 'Activa' : 'Inactiva'}
                                        </Tag>
                                        <Tag>{account.provider_label}</Tag>
                                        {account.is_syncing && (
                                            <Tag icon={<LoadingOutlined spin />} color="processing">
                                                Sincronizando...
                                            </Tag>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        {account.is_syncing ? (
                                            <>
                                                <LoadingOutlined style={{ color: colors.primary[500], fontSize: 12 }} spin />
                                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                                    Sincronización en progreso {account.sync_started_at_human && `(iniciada ${account.sync_started_at_human})`}
                                                </Typography.Text>
                                            </>
                                        ) : account.last_sync_error ? (
                                            <>
                                                <ExclamationCircleOutlined style={{ color: colors.error.main, fontSize: 12 }} />
                                                <Typography.Text type="danger" style={{ fontSize: 12 }}>
                                                    Error: {account.last_sync_error.substring(0, 50)}...
                                                </Typography.Text>
                                            </>
                                        ) : account.last_sync_at ? (
                                            <>
                                                <CheckCircleOutlined style={{ color: colors.success.main, fontSize: 12 }} />
                                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                                    Última sincronización: {account.last_sync_at_human}
                                                </Typography.Text>
                                            </>
                                        ) : (
                                            <>
                                                <ClockCircleOutlined style={{ color: colors.warning.main, fontSize: 12 }} />
                                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                                    Nunca sincronizado
                                                </Typography.Text>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Account Actions */}
                                <div
                                    style={{
                                        padding: '12px 16px',
                                        borderTop: '1px solid var(--ant-color-border)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Space>
                                        <Button
                                            size="small"
                                            icon={<SyncOutlined spin={account.is_syncing} />}
                                            onClick={() => handleSync(account)}
                                            disabled={!account.is_active || account.is_syncing}
                                        >
                                            {account.is_syncing ? 'Sincronizando...' : 'Sincronizar'}
                                        </Button>
                                        <Button
                                            size="small"
                                            icon={<RightOutlined />}
                                            onClick={() => router.visit(`/settings/email-accounts/${account.id}/transactions`)}
                                        >
                                            Ver emails
                                        </Button>
                                    </Space>
                                    <Space>
                                        <Button
                                            size="small"
                                            icon={<EditOutlined />}
                                            onClick={() => router.visit(`/settings/email-accounts/${account.id}/edit`)}
                                        />
                                        <Popconfirm
                                            title="Eliminar cuenta"
                                            description="¿Estás seguro de eliminar esta cuenta?"
                                            onConfirm={() => handleDelete(account)}
                                            okText="Eliminar"
                                            cancelText="Cancelar"
                                            okButtonProps={{ danger: true }}
                                        >
                                            <Button size="small" danger icon={<DeleteOutlined />} />
                                        </Popconfirm>
                                    </Space>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
