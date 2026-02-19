import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, Typography, Empty } from 'antd';
import { AppLayout } from '@/app/components/common/AppLayout';
import { ProgressBar } from '@/app/components/budgets';
import type { Budget, BudgetProgressLine, Transaction } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';

interface Props {
    budget: Budget;
    categoryLine: BudgetProgressLine;
    transactions: Transaction[];
    period: string;
}

export default function BudgetsCategory({ budget, categoryLine, transactions, period }: Props) {
    const { planning } = usePlanning();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T12:00:00');
        return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
    };

    if (!categoryLine) {
        return (
            <AppLayout title="Categoría" showBack>
                <Head title="Categoría" />
                <div style={{ padding: 16 }}>
                    <Empty description="No se encontró la categoría en este presupuesto" />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout title={categoryLine.category?.name || 'Categoría'} showBack>
            <Head title={categoryLine.category?.name || 'Categoría'} />

            <div style={{ padding: 16 }}>
                {/* Category Summary */}
                <Card
                    style={{
                        background: `linear-gradient(135deg, ${categoryLine.category?.color || colors.primary[500]} 0%, ${categoryLine.category?.color || colors.primary[600]}cc 100%)`,
                        borderRadius: 16,
                        marginBottom: 16,
                    }}
                    styles={{ body: { padding: 16 } }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        {categoryLine.category?.icon && (
                            <span style={{ fontSize: 24 }}>{categoryLine.category.icon}</span>
                        )}
                        <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
                            {categoryLine.category?.name}
                        </Typography.Title>
                    </div>

                    <Typography.Title level={2} style={{ color: '#fff', margin: '8px 0' }}>
                        {formatCurrency(categoryLine.spent)}
                    </Typography.Title>
                    <Typography.Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                        de {formatCurrency(categoryLine.amount)} presupuestado
                    </Typography.Text>

                    <div style={{ marginTop: 12 }}>
                        <ProgressBar percentage={categoryLine.percentage} height={8} status={categoryLine.status} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                        <div>
                            <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, display: 'block' }}>
                                Disponible
                            </Typography.Text>
                            <Typography.Text strong style={{ color: '#fff', fontSize: 15 }}>
                                {formatCurrency(categoryLine.remaining)}
                            </Typography.Text>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, display: 'block' }}>
                                Uso
                            </Typography.Text>
                            <Typography.Text strong style={{ color: '#fff', fontSize: 15 }}>
                                {categoryLine.percentage.toFixed(1)}%
                            </Typography.Text>
                        </div>
                    </div>
                </Card>

                {/* Transactions List */}
                <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                    TRANSACCIONES DEL PERÍODO
                </Typography.Text>

                {transactions.length === 0 ? (
                    <Empty
                        description="No hay transacciones en este período"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                ) : (
                    transactions.map((tx) => (
                        <Card
                            key={tx.id}
                            size="small"
                            style={{ marginBottom: 8, borderRadius: 10, cursor: 'pointer' }}
                            styles={{ body: { padding: '10px 14px' } }}
                            onClick={() => router.visit(`/transactions/${tx.id}`)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Typography.Text strong style={{ fontSize: 14, display: 'block' }}>
                                        {tx.description || 'Sin descripción'}
                                    </Typography.Text>
                                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                        {formatDate(tx.date)}
                                        {tx.account && ` · ${tx.account.name}`}
                                    </Typography.Text>
                                </div>
                                <Typography.Text strong style={{ color: colors.expense.main, fontSize: 14 }}>
                                    -{formatCurrency(tx.amount)}
                                </Typography.Text>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </AppLayout>
    );
}
