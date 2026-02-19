import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, Typography, Empty, Tag, Button, Popconfirm, Dropdown } from 'antd';
import {
    SyncOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    SwapOutlined,
    CalendarOutlined,
    MoreOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { RecurringTransaction, FrequencyOption, TransactionTypeOption, Account, Category } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';

interface Props {
    recurringTransactions: RecurringTransaction[];
    frequencies: FrequencyOption[];
    transactionTypes: TransactionTypeOption[];
    accounts: Account[];
    categories: Category[];
}

const typeIconMap: Record<string, React.ReactNode> = {
    income: <ArrowUpOutlined />,
    expense: <ArrowDownOutlined />,
    transfer: <SwapOutlined />,
};

const typeColorMap: Record<string, string> = {
    income: colors.income.main,
    expense: colors.expense.main,
    transfer: colors.transfer.main,
};

const frequencyLabels: Record<string, string> = {
    daily: 'Diario',
    weekly: 'Semanal',
    biweekly: 'Quincenal',
    monthly: 'Mensual',
    yearly: 'Anual',
};

export default function RecurringTransactionsPage({
    recurringTransactions,
}: Props) {
    const { planning } = usePlanning();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('es-CL', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const handleToggle = (recurring: RecurringTransaction) => {
        router.post(`/recurring/${recurring.id}/toggle`, {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (recurring: RecurringTransaction) => {
        router.delete(`/recurring/${recurring.id}`, {
            preserveScroll: true,
        });
    };

    const getMenuItems = (recurring: RecurringTransaction) => [
        {
            key: 'toggle',
            label: recurring.is_active ? 'Desactivar' : 'Activar',
            icon: recurring.is_active ? <PauseCircleOutlined /> : <PlayCircleOutlined />,
            onClick: () => handleToggle(recurring),
        },
        {
            key: 'delete',
            label: 'Eliminar',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDelete(recurring),
        },
    ];

    const active = recurringTransactions.filter((r) => r.is_active);
    const inactive = recurringTransactions.filter((r) => !r.is_active);

    return (
        <AppLayout title="Transacciones Recurrentes" showBack>
            <Head title="Transacciones Recurrentes" />

            <div style={{ padding: 16 }}>
                {recurringTransactions.length === 0 ? (
                    <Card style={{ borderRadius: 12 }}>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No hay transacciones recurrentes configuradas"
                        />
                    </Card>
                ) : (
                    <>
                        {/* Active recurring */}
                        {active.length > 0 && (
                            <div style={{ marginBottom: 24 }}>
                                <Typography.Title level={5} style={{ marginBottom: 12 }}>
                                    Activas ({active.length})
                                </Typography.Title>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {active.map((recurring) => (
                                        <Card
                                            key={recurring.id}
                                            style={{ borderRadius: 12 }}
                                            styles={{ body: { padding: 12 } }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div
                                                    style={{
                                                        width: 44,
                                                        height: 44,
                                                        borderRadius: 12,
                                                        backgroundColor: `${typeColorMap[recurring.type]}15`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: 18,
                                                        color: typeColorMap[recurring.type],
                                                    }}
                                                >
                                                    {typeIconMap[recurring.type]}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <Typography.Text strong>
                                                        {recurring.description || recurring.type}
                                                    </Typography.Text>
                                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                        <Tag icon={<SyncOutlined />} color="blue" style={{ fontSize: 10, margin: 0 }}>
                                                            {frequencyLabels[recurring.frequency] || recurring.frequency}
                                                        </Tag>
                                                        <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                                                            <CalendarOutlined /> Próximo: {formatDate(recurring.next_run_date)}
                                                        </Typography.Text>
                                                    </div>
                                                </div>
                                                <Typography.Text
                                                    strong
                                                    style={{
                                                        color: typeColorMap[recurring.type],
                                                        fontSize: 15,
                                                        marginRight: 8,
                                                    }}
                                                >
                                                    {formatCurrency(recurring.amount)}
                                                </Typography.Text>
                                                <Dropdown
                                                    menu={{ items: getMenuItems(recurring) }}
                                                    trigger={['click']}
                                                >
                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        icon={<MoreOutlined />}
                                                    />
                                                </Dropdown>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Inactive recurring */}
                        {inactive.length > 0 && (
                            <div>
                                <Typography.Title level={5} style={{ marginBottom: 12 }}>
                                    Inactivas ({inactive.length})
                                </Typography.Title>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {inactive.map((recurring) => (
                                        <Card
                                            key={recurring.id}
                                            style={{ borderRadius: 12, opacity: 0.6 }}
                                            styles={{ body: { padding: 12 } }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div
                                                    style={{
                                                        width: 44,
                                                        height: 44,
                                                        borderRadius: 12,
                                                        backgroundColor: '#f0f0f0',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: 18,
                                                        color: '#999',
                                                    }}
                                                >
                                                    {typeIconMap[recurring.type]}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <Typography.Text>{recurring.description || recurring.type}</Typography.Text>
                                                    <div>
                                                        <Tag color="default" style={{ fontSize: 10 }}>Inactiva</Tag>
                                                    </div>
                                                </div>
                                                <Typography.Text type="secondary" style={{ marginRight: 8 }}>
                                                    {formatCurrency(recurring.amount)}
                                                </Typography.Text>
                                                <Dropdown
                                                    menu={{ items: getMenuItems(recurring) }}
                                                    trigger={['click']}
                                                >
                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        icon={<MoreOutlined />}
                                                    />
                                                </Dropdown>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}
