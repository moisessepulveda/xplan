import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card, Typography, Select, Switch, Button, Divider } from 'antd';
import {
    GlobalOutlined,
    CalendarOutlined,
    BellOutlined,
    BgColorsOutlined,
} from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { useTheme } from '@/app/contexts/ThemeContext';
import { colors } from '@/app/styles/theme';

interface Props {
    settings: Record<string, unknown>;
}

export default function Preferences({ settings }: Props) {
    const { mode, setMode } = useTheme();

    const form = useForm({
        currency: (settings.currency as string) || 'CLP',
        date_format: (settings.date_format as string) || 'DD/MM/YYYY',
        locale: (settings.locale as string) || 'es',
        theme: (settings.theme as string) || 'system',
        notifications_enabled: settings.notifications_enabled !== false,
        notification_budget_alerts: settings.notification_budget_alerts !== false,
        notification_due_dates: settings.notification_due_dates !== false,
        notification_overdue: settings.notification_overdue !== false,
        notification_members: settings.notification_members !== false,
    });

    const handleSave = () => {
        form.put('/settings/preferences', {
            preserveScroll: true,
            onSuccess: () => {
                if (form.data.theme !== mode) {
                    setMode(form.data.theme as 'light' | 'dark' | 'system');
                }
            },
        });
    };

    return (
        <AppLayout title="Preferencias" showBack>
            <Head title="Preferencias" />

            <div style={{ padding: 16 }}>
                {/* General */}
                <Typography.Text type="secondary" style={{ fontSize: 12, paddingLeft: 4, display: 'block', marginBottom: 8 }}>
                    GENERAL
                </Typography.Text>
                <Card style={{ borderRadius: 12, marginBottom: 16 }} styles={{ body: { padding: 16 } }}>
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <GlobalOutlined style={{ color: colors.primary[500] }} />
                            <Typography.Text style={{ fontSize: 13 }}>Moneda predeterminada</Typography.Text>
                        </div>
                        <Select
                            value={form.data.currency}
                            onChange={(value) => form.setData('currency', value)}
                            style={{ width: '100%' }}
                            options={[
                                { label: 'CLP - Peso Chileno', value: 'CLP' },
                                { label: 'USD - Dólar Americano', value: 'USD' },
                                { label: 'EUR - Euro', value: 'EUR' },
                                { label: 'ARS - Peso Argentino', value: 'ARS' },
                                { label: 'MXN - Peso Mexicano', value: 'MXN' },
                                { label: 'COP - Peso Colombiano', value: 'COP' },
                                { label: 'PEN - Sol Peruano', value: 'PEN' },
                                { label: 'BRL - Real Brasileño', value: 'BRL' },
                            ]}
                        />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <CalendarOutlined style={{ color: colors.warning.main }} />
                            <Typography.Text style={{ fontSize: 13 }}>Formato de fecha</Typography.Text>
                        </div>
                        <Select
                            value={form.data.date_format}
                            onChange={(value) => form.setData('date_format', value)}
                            style={{ width: '100%' }}
                            options={[
                                { label: 'DD/MM/YYYY (31/12/2024)', value: 'DD/MM/YYYY' },
                                { label: 'MM/DD/YYYY (12/31/2024)', value: 'MM/DD/YYYY' },
                                { label: 'YYYY-MM-DD (2024-12-31)', value: 'YYYY-MM-DD' },
                            ]}
                        />
                    </div>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <BgColorsOutlined style={{ color: '#722ed1' }} />
                            <Typography.Text style={{ fontSize: 13 }}>Tema</Typography.Text>
                        </div>
                        <Select
                            value={form.data.theme}
                            onChange={(value) => form.setData('theme', value)}
                            style={{ width: '100%' }}
                            options={[
                                { label: 'Automático (sistema)', value: 'system' },
                                { label: 'Claro', value: 'light' },
                                { label: 'Oscuro', value: 'dark' },
                            ]}
                        />
                    </div>
                </Card>

                {/* Notifications */}
                <Typography.Text type="secondary" style={{ fontSize: 12, paddingLeft: 4, display: 'block', marginBottom: 8 }}>
                    NOTIFICACIONES
                </Typography.Text>
                <Card style={{ borderRadius: 12, marginBottom: 16 }} styles={{ body: { padding: 0 } }}>
                    <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <BellOutlined style={{ color: colors.primary[500] }} />
                            <Typography.Text style={{ fontSize: 13 }}>Notificaciones habilitadas</Typography.Text>
                        </div>
                        <Switch
                            size="small"
                            checked={form.data.notifications_enabled}
                            onChange={(checked) => form.setData('notifications_enabled', checked)}
                        />
                    </div>

                    {form.data.notifications_enabled && (
                        <>
                            <div style={{ padding: '10px 16px 10px 44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                    Alertas de presupuesto
                                </Typography.Text>
                                <Switch
                                    size="small"
                                    checked={form.data.notification_budget_alerts}
                                    onChange={(checked) => form.setData('notification_budget_alerts', checked)}
                                />
                            </div>
                            <div style={{ padding: '10px 16px 10px 44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                    Próximos vencimientos
                                </Typography.Text>
                                <Switch
                                    size="small"
                                    checked={form.data.notification_due_dates}
                                    onChange={(checked) => form.setData('notification_due_dates', checked)}
                                />
                            </div>
                            <div style={{ padding: '10px 16px 10px 44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                    Pagos vencidos
                                </Typography.Text>
                                <Switch
                                    size="small"
                                    checked={form.data.notification_overdue}
                                    onChange={(checked) => form.setData('notification_overdue', checked)}
                                />
                            </div>
                            <div style={{ padding: '10px 16px 10px 44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                    Actividad de miembros
                                </Typography.Text>
                                <Switch
                                    size="small"
                                    checked={form.data.notification_members}
                                    onChange={(checked) => form.setData('notification_members', checked)}
                                />
                            </div>
                        </>
                    )}
                </Card>

                {/* Save button */}
                <Button
                    type="primary"
                    block
                    size="large"
                    loading={form.processing}
                    onClick={handleSave}
                    style={{ borderRadius: 10 }}
                >
                    Guardar preferencias
                </Button>
            </div>
        </AppLayout>
    );
}
