import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, Typography, Button, Dropdown, Divider, Tag, Progress } from 'antd';
import {
    EditOutlined,
    MoreOutlined,
    DollarOutlined,
    BellOutlined,
    UserOutlined,
    CalendarOutlined,
    PhoneOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { PaymentForm, PaymentHistory, ReminderForm } from '@/app/components/receivables';
import type { PaymentFormData } from '@/app/components/receivables/PaymentForm';
import { Receivable, Account } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';

interface Props {
    receivable: Receivable;
    accounts: Account[];
}

export default function ShowReceivable({ receivable, accounts }: Props) {
    const { planning } = usePlanning();
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [showReminderForm, setShowReminderForm] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [reminderLoading, setReminderLoading] = useState(false);

    const isReceivable = receivable.type === 'receivable';
    const typeColor = isReceivable ? colors.income.main : colors.expense.main;
    const isActive = receivable.status === 'pending' || receivable.status === 'partial';

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: receivable.currency || planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('es-CL', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handlePayment = (data: PaymentFormData) => {
        setPaymentLoading(true);
        router.post(`/receivables/${receivable.id}/payment`, data, {
            onSuccess: () => {
                setShowPaymentForm(false);
                setPaymentLoading(false);
            },
            onError: () => setPaymentLoading(false),
        });
    };

    const handleReminder = (data: { remind_at: string; message: string }) => {
        setReminderLoading(true);
        router.post(`/receivables/${receivable.id}/reminder`, data, {
            onSuccess: () => {
                setShowReminderForm(false);
                setReminderLoading(false);
            },
            onError: () => setReminderLoading(false),
        });
    };

    const menuItems = [
        {
            key: 'edit',
            label: 'Editar',
            icon: <EditOutlined />,
            onClick: () => router.visit(`/receivables/${receivable.id}/edit`),
        },
        ...(isActive ? [{
            key: 'reminder',
            label: 'Programar recordatorio',
            icon: <BellOutlined />,
            onClick: () => setShowReminderForm(true),
        }] : []),
    ];

    return (
        <AppLayout
            title={isReceivable ? 'Cuenta por Cobrar' : 'Cuenta por Pagar'}
            showBack
            headerRight={
                <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            }
        >
            <Head title={receivable.person_name} />

            <div style={{ padding: 16 }}>
                {/* Header Card */}
                <Card
                    style={{
                        background: `linear-gradient(135deg, ${typeColor} 0%, ${typeColor}dd 100%)`,
                        borderRadius: 16,
                        marginBottom: 16,
                    }}
                    styles={{ body: { padding: 24 } }}
                >
                    <div style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: 16,
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 12px',
                                fontSize: 28,
                                color: '#fff',
                            }}
                        >
                            <UserOutlined />
                        </div>

                        <Typography.Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                            {receivable.type_label}
                        </Typography.Text>

                        <Typography.Title level={4} style={{ color: '#fff', margin: '4px 0' }}>
                            {receivable.person_name}
                        </Typography.Title>

                        <Typography.Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                            {receivable.concept}
                        </Typography.Text>

                        <Typography.Title level={2} style={{ color: '#fff', margin: '16px 0 0' }}>
                            {formatCurrency(receivable.pending_amount)}
                        </Typography.Title>
                        <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                            de {formatCurrency(receivable.original_amount)}
                        </Typography.Text>
                    </div>

                    {/* Progress */}
                    {isActive && (
                        <div style={{ marginTop: 16 }}>
                            <Progress
                                percent={receivable.progress}
                                strokeColor="#fff"
                                trailColor="rgba(255,255,255,0.2)"
                                format={(pct) => (
                                    <span style={{ color: '#fff', fontSize: 12 }}>{pct}%</span>
                                )}
                            />
                        </div>
                    )}
                </Card>

                {/* Register Payment Button */}
                {isActive && (
                    <Button
                        type="primary"
                        icon={<DollarOutlined />}
                        size="large"
                        block
                        onClick={() => setShowPaymentForm(true)}
                        style={{
                            marginBottom: 16,
                            backgroundColor: typeColor,
                            borderColor: typeColor,
                            height: 48,
                        }}
                    >
                        {isReceivable ? 'Registrar Cobro' : 'Registrar Pago'}
                    </Button>
                )}

                {/* Details Card */}
                <Card style={{ borderRadius: 12, marginBottom: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography.Text type="secondary">Estado</Typography.Text>
                            <Tag color={receivable.status_color} style={{ margin: 0 }}>
                                {receivable.status_label}
                            </Tag>
                        </div>

                        {receivable.person_contact && (
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography.Text type="secondary">
                                    <PhoneOutlined style={{ marginRight: 4 }} />
                                    Contacto
                                </Typography.Text>
                                <Typography.Text>{receivable.person_contact}</Typography.Text>
                            </div>
                        )}

                        {receivable.due_date && (
                            <>
                                <Divider style={{ margin: 0 }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography.Text type="secondary">
                                        <CalendarOutlined style={{ marginRight: 4 }} />
                                        Vencimiento
                                    </Typography.Text>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        {receivable.is_overdue && (
                                            <WarningOutlined style={{ color: colors.expense.main }} />
                                        )}
                                        <Typography.Text
                                            style={{
                                                color: receivable.is_overdue ? colors.expense.main : undefined,
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {formatDate(receivable.due_date)}
                                        </Typography.Text>
                                    </div>
                                </div>
                            </>
                        )}

                        <Divider style={{ margin: 0 }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography.Text type="secondary">Monto original</Typography.Text>
                            <Typography.Text>{formatCurrency(receivable.original_amount)}</Typography.Text>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography.Text type="secondary">Pagado</Typography.Text>
                            <Typography.Text style={{ color: colors.income.main }}>
                                {formatCurrency(receivable.paid_amount)}
                            </Typography.Text>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography.Text type="secondary">Pendiente</Typography.Text>
                            <Typography.Text strong style={{ color: typeColor }}>
                                {formatCurrency(receivable.pending_amount)}
                            </Typography.Text>
                        </div>

                        {receivable.notes && (
                            <>
                                <Divider style={{ margin: 0 }} />
                                <div>
                                    <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                                        Notas
                                    </Typography.Text>
                                    <Typography.Text>{receivable.notes}</Typography.Text>
                                </div>
                            </>
                        )}
                    </div>
                </Card>

                {/* Payment History */}
                <Card
                    title="Historial de Pagos"
                    style={{ borderRadius: 12, marginBottom: 16 }}
                    styles={{ body: { padding: 16 } }}
                >
                    <PaymentHistory
                        payments={receivable.payments || []}
                        currency={receivable.currency}
                    />
                </Card>

                {/* Reminders */}
                {receivable.reminders && receivable.reminders.length > 0 && (
                    <Card
                        title="Recordatorios"
                        style={{ borderRadius: 12 }}
                        styles={{ body: { padding: 16 } }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {receivable.reminders.map((reminder) => (
                                <div
                                    key={reminder.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '8px 0',
                                        borderBottom: '1px solid var(--color-border, #e8e8e8)',
                                    }}
                                >
                                    <BellOutlined
                                        style={{
                                            color: reminder.sent ? colors.income.main : colors.warning.main,
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <Typography.Text style={{ fontSize: 13 }}>
                                            {reminder.message || 'Recordatorio programado'}
                                        </Typography.Text>
                                        <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
                                            {new Date(reminder.remind_at).toLocaleString('es-CL')}
                                        </Typography.Text>
                                    </div>
                                    <Tag color={reminder.sent ? 'green' : 'gold'} style={{ margin: 0 }}>
                                        {reminder.sent ? 'Enviado' : 'Pendiente'}
                                    </Tag>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </div>

            {/* Payment Form Modal */}
            <PaymentForm
                open={showPaymentForm}
                onClose={() => setShowPaymentForm(false)}
                onSubmit={handlePayment}
                loading={paymentLoading}
                maxAmount={receivable.pending_amount}
                accounts={accounts}
                isReceivable={isReceivable}
            />

            {/* Reminder Form Modal */}
            <ReminderForm
                open={showReminderForm}
                onClose={() => setShowReminderForm(false)}
                onSubmit={handleReminder}
                loading={reminderLoading}
            />
        </AppLayout>
    );
}
