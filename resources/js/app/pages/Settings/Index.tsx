import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, Typography, Avatar, Switch, Button } from 'antd';
import {
    UserOutlined,
    LockOutlined,
    BellOutlined,
    BgColorsOutlined,
    TeamOutlined,
    CreditCardOutlined,
    BankOutlined,
    LogoutOutlined,
    RightOutlined,
    DownloadOutlined,
    AppstoreOutlined,
    MailOutlined,
    DollarOutlined,
} from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { useAuth } from '@/app/hooks/useAuth';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useInstallPrompt } from '@/app/hooks/useInstallPrompt';
import { colors } from '@/app/styles/theme';

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
        settings: Record<string, unknown>;
    };
}

interface MenuItem {
    key: string;
    label: string;
    description?: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
    route?: string;
    action?: () => void;
    right?: React.ReactNode;
}

export default function SettingsIndex({ user }: Props) {
    const { isDark, toggleTheme, mode } = useTheme();
    const { isInstallable, isInstalled, install } = useInstallPrompt();

    const profileSection: MenuItem[] = [
        {
            key: 'profile',
            label: 'Perfil',
            description: user.email,
            icon: <UserOutlined />,
            color: colors.primary[500],
            bg: colors.primary[50],
            route: '/settings/profile',
        },
    ];

    const appSection: MenuItem[] = [
        {
            key: 'theme',
            label: 'Modo oscuro',
            icon: <BgColorsOutlined />,
            color: '#722ed1',
            bg: '#f9f0ff',
            right: <Switch size="small" checked={isDark} onChange={toggleTheme} />,
        },
        {
            key: 'preferences',
            label: 'Preferencias',
            description: 'Moneda, formato, notificaciones',
            icon: <BellOutlined />,
            color: colors.warning.main,
            bg: colors.warning.light,
            route: '/settings/preferences',
        },
    ];

    const financeSection: MenuItem[] = [
        {
            key: 'accounts',
            label: 'Cuentas',
            icon: <BankOutlined />,
            color: colors.info.main,
            bg: colors.info.light,
            route: '/accounts',
        },
        {
            key: 'categories',
            label: 'Categorías',
            description: 'Ingresos y gastos',
            icon: <AppstoreOutlined />,
            color: '#722ed1',
            bg: '#f9f0ff',
            route: '/categories',
        },
        {
            key: 'email-accounts',
            label: 'Sincronización de Correos',
            description: 'Detecta transacciones automáticamente',
            icon: <MailOutlined />,
            color: '#1677ff',
            bg: '#e6f4ff',
            route: '/settings/email-accounts',
        },
        {
            key: 'credits',
            label: 'Créditos',
            icon: <CreditCardOutlined />,
            color: colors.error.main,
            bg: colors.error.light,
            route: '/credits',
        },
        {
            key: 'receivables',
            label: 'Cuentas por Cobrar',
            description: 'Deudas y préstamos',
            icon: <DollarOutlined />,
            color: '#13c2c2',
            bg: '#e6fffb',
            route: '/receivables',
        },
        {
            key: 'members',
            label: 'Miembros',
            icon: <TeamOutlined />,
            color: colors.success.main,
            bg: colors.success.light,
            route: '/members',
        },
    ];

    const renderSection = (title: string, items: MenuItem[]) => (
        <div style={{ marginBottom: 16 }}>
            <Typography.Text type="secondary" style={{ fontSize: 12, paddingLeft: 4, display: 'block', marginBottom: 8 }}>
                {title}
            </Typography.Text>
            <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 0 } }}>
                {items.map((item, index) => (
                    <div
                        key={item.key}
                        style={{
                            padding: '12px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: index < items.length - 1 ? '1px solid #f0f0f0' : 'none',
                            cursor: item.route ? 'pointer' : 'default',
                        }}
                        onClick={() => {
                            if (item.route) router.visit(item.route);
                            if (item.action) item.action();
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    backgroundColor: item.bg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: item.color,
                                    fontSize: 16,
                                }}
                            >
                                {item.icon}
                            </div>
                            <div>
                                <Typography.Text style={{ fontSize: 14 }}>{item.label}</Typography.Text>
                                {item.description && (
                                    <Typography.Text type="secondary" style={{ display: 'block', fontSize: 11 }}>
                                        {item.description}
                                    </Typography.Text>
                                )}
                            </div>
                        </div>
                        {item.right || (item.route && <RightOutlined style={{ color: colors.neutral[400], fontSize: 12 }} />)}
                    </div>
                ))}
            </Card>
        </div>
    );

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <AppLayout title="Configuración" showBottomNav>
            <Head title="Configuración" />

            <div style={{ padding: 16 }}>
                {/* User Header */}
                <Card style={{ borderRadius: 12, marginBottom: 16 }} styles={{ body: { padding: 16 } }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar size={48} icon={<UserOutlined />} src={user.avatar} />
                        <div>
                            <Typography.Text strong style={{ fontSize: 16 }}>
                                {user.name}
                            </Typography.Text>
                            <Typography.Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                                {user.email}
                            </Typography.Text>
                        </div>
                    </div>
                </Card>

                {/* Install App Banner */}
                {isInstallable && !isInstalled && (
                    <Card
                        style={{
                            borderRadius: 12,
                            marginBottom: 16,
                            background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                        }}
                        styles={{ body: { padding: 16 } }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <Typography.Text strong style={{ color: '#fff', fontSize: 14 }}>
                                    Instalar XPlan
                                </Typography.Text>
                                <Typography.Text style={{ color: 'rgba(255,255,255,0.8)', display: 'block', fontSize: 12 }}>
                                    Acceso rápido desde tu pantalla de inicio
                                </Typography.Text>
                            </div>
                            <Button
                                icon={<DownloadOutlined />}
                                onClick={install}
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    color: '#fff',
                                    border: 'none',
                                }}
                            >
                                Instalar
                            </Button>
                        </div>
                    </Card>
                )}

                {renderSection('CUENTA', profileSection)}
                {renderSection('APLICACIÓN', appSection)}
                {renderSection('FINANZAS', financeSection)}

                {/* Logout */}
                <Card
                    style={{ borderRadius: 12, marginBottom: 16, cursor: 'pointer' }}
                    styles={{ body: { padding: 0 } }}
                    onClick={handleLogout}
                >
                    <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                backgroundColor: colors.error.light,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: colors.error.main,
                                fontSize: 16,
                            }}
                        >
                            <LogoutOutlined />
                        </div>
                        <Typography.Text style={{ color: colors.error.main, fontSize: 14 }}>
                            Cerrar sesión
                        </Typography.Text>
                    </div>
                </Card>

                {/* Version */}
                <Typography.Text
                    type="secondary"
                    style={{ display: 'block', textAlign: 'center', fontSize: 11, marginTop: 8 }}
                >
                    XPlan v1.0.0
                </Typography.Text>
            </div>
        </AppLayout>
    );
}
