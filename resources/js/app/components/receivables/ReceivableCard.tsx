import React from 'react';
import { Card, Typography, Tag, Progress } from 'antd';
import {
    UserOutlined,
    CalendarOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import { Receivable } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';

interface Props {
    receivable: Receivable;
    onClick?: () => void;
}

export function ReceivableCard({ receivable, onClick }: Props) {
    const { planning } = usePlanning();

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
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const isReceivable = receivable.type === 'receivable';
    const typeColor = isReceivable ? colors.income.main : colors.expense.main;
    const isPaidOrCancelled = receivable.status === 'paid' || receivable.status === 'cancelled';

    return (
        <Card
            style={{
                borderRadius: 12,
                cursor: onClick ? 'pointer' : 'default',
                opacity: isPaidOrCancelled ? 0.7 : 1,
                borderLeft: `4px solid ${typeColor}`,
            }}
            styles={{ body: { padding: 14 } }}
            onClick={onClick}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Header: person + amount */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                            <UserOutlined style={{ fontSize: 12, color: 'var(--color-text-secondary)' }} />
                            <Typography.Text strong ellipsis style={{ maxWidth: 180 }}>
                                {receivable.person_name}
                            </Typography.Text>
                        </div>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                            {receivable.concept}
                        </Typography.Text>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <Typography.Text strong style={{ fontSize: 15, color: typeColor }}>
                            {formatCurrency(receivable.pending_amount)}
                        </Typography.Text>
                        <Typography.Text
                            type="secondary"
                            style={{ fontSize: 11, display: 'block' }}
                        >
                            de {formatCurrency(receivable.original_amount)}
                        </Typography.Text>
                    </div>
                </div>

                {/* Progress bar */}
                {!isPaidOrCancelled && receivable.progress > 0 && (
                    <Progress
                        percent={receivable.progress}
                        size="small"
                        strokeColor={typeColor}
                        format={(pct) => `${pct}%`}
                    />
                )}

                {/* Footer: status + due date */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Tag
                        color={receivable.status_color}
                        style={{ margin: 0, borderRadius: 4, fontSize: 11 }}
                    >
                        {receivable.status_label}
                    </Tag>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {receivable.is_overdue && (
                            <WarningOutlined style={{ color: colors.expense.main, fontSize: 12 }} />
                        )}
                        {receivable.due_date && (
                            <Typography.Text
                                type="secondary"
                                style={{
                                    fontSize: 11,
                                    color: receivable.is_overdue ? colors.expense.main : undefined,
                                }}
                            >
                                <CalendarOutlined style={{ marginRight: 2 }} />
                                {formatDate(receivable.due_date)}
                            </Typography.Text>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
