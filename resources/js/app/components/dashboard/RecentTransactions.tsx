import React from 'react';
import { Card, Typography, Empty } from 'antd';
import { router } from '@inertiajs/react';
import type { Transaction } from '@/app/types';
import { colors } from '@/app/styles/theme';

interface Props {
    transactions: Transaction[];
    formatCurrency: (amount: number) => string;
}

export function RecentTransactions({ transactions, formatCurrency }: Props) {
    const getTypeColor = (type: string) => {
        switch (type) {
            case 'income': return colors.income.main;
            case 'expense': return colors.expense.main;
            case 'transfer': return colors.transfer.main;
            default: return colors.neutral[500];
        }
    };

    const getSign = (type: string) => {
        switch (type) {
            case 'income': return '+';
            case 'expense': return '-';
            default: return '';
        }
    };

    return (
        <Card
            title="Últimas transacciones"
            extra={
                <Typography.Link onClick={() => router.visit('/transactions')} style={{ fontSize: 12 }}>
                    Ver todas
                </Typography.Link>
            }
            style={{ borderRadius: 12, marginBottom: 16 }}
            styles={{ body: { padding: transactions.length > 0 ? 0 : 16 } }}
        >
            {transactions.length > 0 ? (
                <div>
                    {transactions.map((tx, index) => (
                        <div
                            key={tx.id}
                            style={{
                                padding: '10px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottom: index < transactions.length - 1 ? '1px solid #f0f0f0' : 'none',
                                cursor: 'pointer',
                            }}
                            onClick={() => router.visit(`/transactions/${tx.id}`)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        backgroundColor: tx.category?.color || colors.neutral[200],
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 14,
                                        flexShrink: 0,
                                    }}
                                >
                                    {tx.category?.icon || '💰'}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <Typography.Text ellipsis style={{ display: 'block', fontSize: 13 }}>
                                        {tx.description || tx.category?.name || tx.type_label}
                                    </Typography.Text>
                                    <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                                        {tx.account?.name}
                                    </Typography.Text>
                                </div>
                            </div>
                            <Typography.Text strong style={{ color: getTypeColor(tx.type), fontSize: 13, flexShrink: 0 }}>
                                {getSign(tx.type)}{formatCurrency(tx.amount)}
                            </Typography.Text>
                        </div>
                    ))}
                </div>
            ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sin transacciones recientes" />
            )}
        </Card>
    );
}
