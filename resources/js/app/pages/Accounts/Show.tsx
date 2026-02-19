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
    ArrowUpOutlined,
    ArrowDownOutlined,
    TagOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    HomeOutlined,
    CarOutlined,
    MedicineBoxOutlined,
    BookOutlined,
    GiftOutlined,
    CoffeeOutlined,
    ThunderboltOutlined,
    PhoneOutlined,
    WifiOutlined,
    ToolOutlined,
    SkinOutlined,
    TrophyOutlined,
    HeartOutlined,
    StarOutlined,
    DollarOutlined,
    EllipsisOutlined,
} from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { AdjustBalanceModal } from '@/app/components/accounts';
import { Account, Transaction } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';

interface Props {
    account: Account;
    transactions: Transaction[];
}

const accountIconMap: Record<string, React.ReactNode> = {
    bank: <BankOutlined />,
    save: <BankOutlined />,
    wallet: <WalletOutlined />,
    'credit-card': <CreditCardOutlined />,
    'line-chart': <LineChartOutlined />,
};

const categoryIconMap: Record<string, React.ComponentType> = {
    'shopping-cart': ShoppingCartOutlined,
    'shopping': ShoppingOutlined,
    'home': HomeOutlined,
    'car': CarOutlined,
    'medicine-box': MedicineBoxOutlined,
    'book': BookOutlined,
    'gift': GiftOutlined,
    'coffee': CoffeeOutlined,
    'thunderbolt': ThunderboltOutlined,
    'phone': PhoneOutlined,
    'wifi': WifiOutlined,
    'tool': ToolOutlined,
    'skin': SkinOutlined,
    'trophy': TrophyOutlined,
    'heart': HeartOutlined,
    'star': StarOutlined,
    'dollar': DollarOutlined,
    'ellipsis': EllipsisOutlined,
    'wallet': WalletOutlined,
    'bank': BankOutlined,
    'credit-card': CreditCardOutlined,
    'tag': TagOutlined,
    'swap': SwapOutlined,
};

export default function ShowAccount({ account, transactions }: Props) {
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
                            {accountIconMap[account.type_icon] || <WalletOutlined />}
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
                    styles={{ body: { padding: 0 } }}
                    extra={
                        transactions.length > 0 && (
                            <Button
                                type="link"
                                size="small"
                                onClick={() => router.visit(`/transactions?account_id=${account.id}`)}
                            >
                                Ver todas
                            </Button>
                        )
                    }
                >
                    {transactions.length === 0 ? (
                        <div style={{ padding: 16 }}>
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="Sin transacciones aún"
                            />
                        </div>
                    ) : (
                        <div>
                            {transactions.map((tx, index) => {
                                const isTransfer = tx.type === 'transfer';
                                const isOutgoing = tx.account_id === account.id;
                                const isIncoming = tx.destination_account_id === account.id;

                                // Determinar color y prefijo según tipo
                                let amountColor = colors.neutral[700];
                                let prefix = '';
                                let iconBg = colors.neutral[100];
                                let iconColor = colors.neutral[500];
                                let TypeIcon = TagOutlined;

                                if (tx.type === 'income') {
                                    amountColor = colors.success.main;
                                    prefix = '+';
                                    iconBg = `${colors.success.main}15`;
                                    iconColor = colors.success.main;
                                    TypeIcon = ArrowDownOutlined;
                                } else if (tx.type === 'expense') {
                                    amountColor = colors.error.main;
                                    prefix = '-';
                                    iconBg = `${colors.error.main}15`;
                                    iconColor = colors.error.main;
                                    TypeIcon = ArrowUpOutlined;
                                } else if (isTransfer) {
                                    iconBg = `${colors.primary[500]}15`;
                                    iconColor = colors.primary[500];
                                    TypeIcon = SwapOutlined;
                                    if (isOutgoing && !isIncoming) {
                                        amountColor = colors.error.main;
                                        prefix = '-';
                                    } else if (isIncoming && !isOutgoing) {
                                        amountColor = colors.success.main;
                                        prefix = '+';
                                    }
                                }

                                // Si hay categoría con color, usarlo
                                if (tx.category?.color) {
                                    iconBg = `${tx.category.color}15`;
                                    iconColor = tx.category.color;
                                }

                                return (
                                    <div
                                        key={tx.id}
                                        style={{
                                            padding: '12px 16px',
                                            borderBottom: index < transactions.length - 1 ? '1px solid var(--ant-color-border)' : 'none',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => router.visit(`/transactions/${tx.id}`)}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                                            <div
                                                style={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: 8,
                                                    backgroundColor: iconBg,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                    color: iconColor,
                                                    fontSize: 16,
                                                }}
                                            >
                                                {(() => {
                                                    const CategoryIcon = tx.category?.icon ? categoryIconMap[tx.category.icon] : null;
                                                    if (CategoryIcon) {
                                                        return <CategoryIcon />;
                                                    }
                                                    return <TypeIcon />;
                                                })()}
                                            </div>
                                            <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                                                <div
                                                    style={{
                                                        fontSize: 14,
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {tx.description || tx.category?.name || tx.type_label}
                                                </div>
                                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                                    {new Date(tx.date).toLocaleDateString('es-CL', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                    })}
                                                    {tx.category && ` · ${tx.category.name}`}
                                                </Typography.Text>
                                            </div>
                                        </div>
                                        <Typography.Text
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 500,
                                                color: amountColor,
                                                flexShrink: 0,
                                                marginLeft: 8,
                                            }}
                                        >
                                            {prefix}{formatCurrency(tx.amount)}
                                        </Typography.Text>
                                    </div>
                                );
                            })}
                        </div>
                    )}
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
