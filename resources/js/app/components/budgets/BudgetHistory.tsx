import React from 'react';
import { Card, Typography, Empty, Collapse } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { ProgressBar } from './ProgressBar';
import type { BudgetHistoryItem } from '@/app/types';
import { colors } from '@/app/styles/theme';

interface BudgetHistoryProps {
    histories: BudgetHistoryItem[];
    formatCurrency: (amount: number) => string;
}

function formatPeriodLabel(period: string): string {
    const [year, month] = period.split('-');
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ];
    return `${months[parseInt(month) - 1]} ${year}`;
}

export function BudgetHistoryList({ histories, formatCurrency }: BudgetHistoryProps) {
    if (histories.length === 0) {
        return (
            <Empty
                description="No hay historial de presupuestos"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
        );
    }

    const items = histories.map((history) => ({
        key: history.id.toString(),
        label: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CalendarOutlined style={{ color: colors.primary[500] }} />
                    <Typography.Text strong>{formatPeriodLabel(history.period)}</Typography.Text>
                </div>
                <Typography.Text
                    style={{
                        color: history.usage_percentage >= 100 ? colors.error.main : colors.success.main,
                        fontWeight: 600,
                        fontSize: 13,
                    }}
                >
                    {history.usage_percentage.toFixed(1)}%
                </Typography.Text>
            </div>
        ),
        children: (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Typography.Text type="secondary">Presupuestado</Typography.Text>
                    <Typography.Text strong>{formatCurrency(history.total_budgeted)}</Typography.Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <Typography.Text type="secondary">Gastado</Typography.Text>
                    <Typography.Text strong style={{ color: colors.expense.main }}>
                        {formatCurrency(history.total_spent)}
                    </Typography.Text>
                </div>

                <ProgressBar percentage={history.usage_percentage} height={6} />

                {history.lines_snapshot && history.lines_snapshot.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                        <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>
                            DETALLE POR CATEGORÍA
                        </Typography.Text>
                        {history.lines_snapshot.map((line, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '4px 0',
                                    borderBottom: idx < history.lines_snapshot.length - 1 ? '1px solid #f5f5f5' : 'none',
                                }}
                            >
                                <Typography.Text style={{ fontSize: 13 }}>
                                    {line.category_name || 'Categoría'}
                                </Typography.Text>
                                <div style={{ textAlign: 'right' }}>
                                    <Typography.Text style={{ fontSize: 12 }}>
                                        {formatCurrency(line.spent)} / {formatCurrency(line.amount)}
                                    </Typography.Text>
                                    <Typography.Text
                                        type="secondary"
                                        style={{ fontSize: 11, marginLeft: 8 }}
                                    >
                                        ({line.percentage.toFixed(0)}%)
                                    </Typography.Text>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ),
    }));

    return (
        <Collapse
            items={items}
            ghost
            style={{ backgroundColor: '#fff', borderRadius: 12 }}
        />
    );
}
