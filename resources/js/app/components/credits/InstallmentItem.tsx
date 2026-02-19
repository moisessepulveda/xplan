import React from 'react';
import { Card, Typography, Tag, Button } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import type { CreditInstallment } from '@/app/types';
import { colors } from '@/app/styles/theme';

interface InstallmentItemProps {
    installment: CreditInstallment;
    creditName?: string;
    formatCurrency: (amount: number) => string;
    onPay?: () => void;
}

export function InstallmentItem({ installment, creditName, formatCurrency, onPay }: InstallmentItemProps) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T12:00:00');
        return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
    };

    return (
        <Card
            size="small"
            style={{
                marginBottom: 8,
                borderRadius: 10,
                borderLeft: `3px solid ${installment.is_overdue ? colors.error.main : installment.status_color}`,
            }}
            styles={{ body: { padding: '10px 14px' } }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Typography.Text strong style={{ fontSize: 14 }}>
                            Cuota #{installment.number}
                        </Typography.Text>
                        <Tag
                            color={installment.status_color}
                            style={{ fontSize: 10, margin: 0 }}
                        >
                            {installment.status_label}
                        </Tag>
                    </div>
                    <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                        {creditName && `${creditName} · `}Vence: {formatDate(installment.due_date)}
                    </Typography.Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Typography.Text strong style={{ fontSize: 14 }}>
                        {formatCurrency(installment.amount)}
                    </Typography.Text>
                    {onPay && installment.status !== 'paid' && (
                        <Button
                            type="primary"
                            size="small"
                            icon={<DollarOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onPay();
                            }}
                        >
                            Pagar
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}
