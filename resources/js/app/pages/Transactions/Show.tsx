import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, Typography, Button, Dropdown, Divider, Tag } from 'antd';
import {
    EditOutlined,
    MoreOutlined,
    CopyOutlined,
    DeleteOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    SwapOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { Transaction } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';

interface Props {
    transaction: Transaction;
}

const typeIconMap: Record<string, React.ReactNode> = {
    'arrow-up': <ArrowUpOutlined style={{ fontSize: 28 }} />,
    'arrow-down': <ArrowDownOutlined style={{ fontSize: 28 }} />,
    swap: <SwapOutlined style={{ fontSize: 28 }} />,
};

export default function ShowTransaction({ transaction }: Props) {
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
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleDelete = () => {
        router.delete(`/transactions/${transaction.id}`);
    };

    const menuItems = [
        {
            key: 'edit',
            label: 'Editar',
            icon: <EditOutlined />,
            onClick: () => router.visit(`/transactions/${transaction.id}/edit`),
        },
        {
            key: 'duplicate',
            label: 'Duplicar',
            icon: <CopyOutlined />,
            onClick: () => router.post(`/transactions/${transaction.id}/duplicate`),
        },
        {
            type: 'divider' as const,
        },
        {
            key: 'delete',
            label: 'Eliminar',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: handleDelete,
        },
    ];

    const isIncome = transaction.type === 'income';
    const isTransfer = transaction.type === 'transfer';
    const amountPrefix = isIncome ? '+' : isTransfer ? '' : '-';
    const gradientColor = transaction.type_color;

    return (
        <AppLayout
            title="Transacción"
            showBack
            headerRight={
                <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            }
        >
            <Head title="Transacción" />

            <div style={{ padding: 16 }}>
                {/* Transaction Header */}
                <Card
                    style={{
                        background: `linear-gradient(135deg, ${gradientColor} 0%, ${gradientColor}dd 100%)`,
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
                                margin: '0 auto 16px',
                                color: '#fff',
                            }}
                        >
                            {typeIconMap[transaction.type_icon]}
                        </div>

                        <Typography.Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                            {transaction.type_label}
                        </Typography.Text>

                        <Typography.Title
                            level={2}
                            style={{ color: '#fff', margin: '8px 0' }}
                        >
                            {amountPrefix}{formatCurrency(transaction.amount)}
                        </Typography.Title>

                        {transaction.description && (
                            <Typography.Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
                                {transaction.description}
                            </Typography.Text>
                        )}
                    </div>
                </Card>

                {/* Transaction Details */}
                <Card style={{ borderRadius: 12, marginBottom: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography.Text type="secondary">Fecha</Typography.Text>
                            <Typography.Text style={{ textTransform: 'capitalize' }}>
                                {formatDate(transaction.date)}
                            </Typography.Text>
                        </div>

                        {transaction.time && (
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography.Text type="secondary">Hora</Typography.Text>
                                <Typography.Text>{transaction.time}</Typography.Text>
                            </div>
                        )}

                        <Divider style={{ margin: 0 }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography.Text type="secondary">
                                {isTransfer ? 'Cuenta origen' : 'Cuenta'}
                            </Typography.Text>
                            <Typography.Text>
                                {transaction.account?.name || '-'}
                            </Typography.Text>
                        </div>

                        {isTransfer && transaction.destination_account && (
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography.Text type="secondary">Cuenta destino</Typography.Text>
                                <Typography.Text>
                                    {transaction.destination_account.name}
                                </Typography.Text>
                            </div>
                        )}

                        {!isTransfer && (
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography.Text type="secondary">Categoría</Typography.Text>
                                <Typography.Text>
                                    {transaction.category?.name || 'Sin categoría'}
                                </Typography.Text>
                            </div>
                        )}

                        {transaction.is_recurring && (
                            <>
                                <Divider style={{ margin: 0 }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography.Text type="secondary">Recurrencia</Typography.Text>
                                    <Tag icon={<SyncOutlined />} color="blue">Recurrente</Tag>
                                </div>
                            </>
                        )}

                        {transaction.tags && transaction.tags.length > 0 && (
                            <>
                                <Divider style={{ margin: 0 }} />
                                <div>
                                    <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                                        Etiquetas
                                    </Typography.Text>
                                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                        {transaction.tags.map((tag) => (
                                            <Tag key={tag}>{tag}</Tag>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
