import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, Typography, Button, Dropdown, Empty } from 'antd';
import {
    EditOutlined,
    MoreOutlined,
    SwapOutlined,
    CalculatorOutlined,
    WalletOutlined,
    BankOutlined,
    CreditCardOutlined,
    LineChartOutlined,
} from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { AdjustBalanceModal } from '@/app/components/accounts';
import { Account } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';

interface Props {
    account: Account;
}

const iconMap: Record<string, React.ReactNode> = {
    bank: <BankOutlined />,
    save: <BankOutlined />,
    wallet: <WalletOutlined />,
    'credit-card': <CreditCardOutlined />,
    'line-chart': <LineChartOutlined />,
};

export default function ShowAccount({ account }: Props) {
    const { planning } = usePlanning();
    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [adjusting, setAdjusting] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: account.currency || planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const handleAdjustBalance = (balance: number, reason?: string) => {
        setAdjusting(true);
        router.post(
            `/accounts/${account.id}/adjust-balance`,
            { balance, reason },
            {
                onSuccess: () => {
                    setShowAdjustModal(false);
                    setAdjusting(false);
                },
                onError: () => {
                    setAdjusting(false);
                },
            }
        );
    };

    const menuItems = [
        {
            key: 'edit',
            label: 'Editar cuenta',
            icon: <EditOutlined />,
            onClick: () => router.visit(`/accounts/${account.id}/edit`),
        },
        {
            key: 'adjust',
            label: 'Ajustar saldo',
            icon: <CalculatorOutlined />,
            onClick: () => setShowAdjustModal(true),
        },
        {
            key: 'transfer',
            label: 'Transferir',
            icon: <SwapOutlined />,
            onClick: () => {/* TODO: Open transfer modal */},
        },
    ];

    const isNegative = account.current_balance < 0;

    return (
        <AppLayout
            title={account.name}
            showBack
            extra={
                <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            }
        >
            <Head title={account.name} />

            <div style={{ padding: 16 }}>
                {/* Account Header */}
                <Card
                    style={{
                        background: `linear-gradient(135deg, ${account.color || colors.primary[500]} 0%, ${account.color || colors.primary[600]} 100%)`,
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
                                fontSize: 28,
                                color: '#fff',
                            }}
                        >
                            {iconMap[account.type_icon] || <WalletOutlined />}
                        </div>

                        <Typography.Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                            {account.type_label}
                        </Typography.Text>

                        <Typography.Title
                            level={2}
                            style={{
                                color: '#fff',
                                margin: '8px 0',
                            }}
                        >
                            {formatCurrency(account.current_balance)}
                        </Typography.Title>

                        {account.description && (
                            <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                                {account.description}
                            </Typography.Text>
                        )}
                    </div>
                </Card>

                {/* Account Details */}
                <Card style={{ borderRadius: 12, marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <Typography.Text type="secondary">Saldo inicial</Typography.Text>
                        <Typography.Text>{formatCurrency(account.initial_balance)}</Typography.Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <Typography.Text type="secondary">Moneda</Typography.Text>
                        <Typography.Text>{account.currency}</Typography.Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography.Text type="secondary">Incluida en balance total</Typography.Text>
                        <Typography.Text>{account.include_in_total ? 'Sí' : 'No'}</Typography.Text>
                    </div>
                </Card>

                {/* Recent Transactions */}
                <Card
                    title="Transacciones Recientes"
                    style={{ borderRadius: 12 }}
                    styles={{ body: { padding: 16 } }}
                >
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Sin transacciones aún"
                    />
                </Card>
            </div>

            <AdjustBalanceModal
                account={account}
                open={showAdjustModal}
                onClose={() => setShowAdjustModal(false)}
                onConfirm={handleAdjustBalance}
                loading={adjusting}
            />
        </AppLayout>
    );
}
