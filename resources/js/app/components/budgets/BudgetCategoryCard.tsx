import React from 'react';
import { Card, Typography } from 'antd';
import { WarningOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { ProgressBar } from './ProgressBar';
import type { BudgetProgressLine } from '@/app/types';
import { colors } from '@/app/styles/theme';

interface BudgetCategoryCardProps {
    line: BudgetProgressLine;
    formatCurrency: (amount: number) => string;
    onClick?: () => void;
}

export function BudgetCategoryCard({ line, formatCurrency, onClick }: BudgetCategoryCardProps) {
    const isAlert = line.status === 'warning' || line.status === 'exceeded';

    return (
        <Card
            size="small"
            style={{
                marginBottom: 8,
                borderRadius: 12,
                cursor: onClick ? 'pointer' : 'default',
                borderLeft: `4px solid ${line.category?.color || colors.neutral[400]}`,
            }}
            styles={{ body: { padding: '12px 16px' } }}
            onClick={onClick}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                    {line.category?.icon && (
                        <span style={{ fontSize: 18 }}>{line.category.icon}</span>
                    )}
                    <div style={{ flex: 1 }}>
                        <Typography.Text strong style={{ fontSize: 14, display: 'block' }}>
                            {line.category?.name || 'Sin categoría'}
                        </Typography.Text>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            {formatCurrency(line.spent)} de {formatCurrency(line.amount)}
                        </Typography.Text>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    {isAlert && (
                        <span style={{ marginRight: 4 }}>
                            {line.status === 'exceeded' ? (
                                <ExclamationCircleOutlined style={{ color: colors.error.main, fontSize: 14 }} />
                            ) : (
                                <WarningOutlined style={{ color: '#fa8c16', fontSize: 14 }} />
                            )}
                        </span>
                    )}
                    <Typography.Text
                        strong
                        style={{
                            fontSize: 14,
                            color: line.remaining > 0 ? colors.success.main : colors.error.main,
                        }}
                    >
                        {formatCurrency(line.remaining)}
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
                        disponible
                    </Typography.Text>
                </div>
            </div>

            <ProgressBar percentage={line.percentage} status={line.status} height={6} />
        </Card>
    );
}
