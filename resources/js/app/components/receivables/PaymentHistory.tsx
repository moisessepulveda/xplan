import React from 'react';
import { Typography, Empty, Card } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { ReceivablePayment } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';

interface Props {
    payments: ReceivablePayment[];
    currency?: string;
}

export function PaymentHistory({ payments, currency }: Props) {
    const { planning } = usePlanning();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: currency || planning?.currency || 'CLP',
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

    if (payments.length === 0) {
        return (
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Sin pagos registrados"
            />
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {payments.map((payment) => (
                <div
                    key={payment.id}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 0',
                        borderBottom: '1px solid var(--color-border, #e8e8e8)',
                    }}
                >
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            backgroundColor: colors.income.light,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <CheckCircleOutlined style={{ color: colors.income.main, fontSize: 16 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <Typography.Text strong style={{ fontSize: 14 }}>
                            {formatCurrency(payment.amount)}
                        </Typography.Text>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                {formatDate(payment.date)}
                            </Typography.Text>
                            {payment.account && (
                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                    · {payment.account.name}
                                </Typography.Text>
                            )}
                        </div>
                    </div>
                    {payment.notes && (
                        <Typography.Text type="secondary" style={{ fontSize: 11, maxWidth: 100 }} ellipsis>
                            {payment.notes}
                        </Typography.Text>
                    )}
                </div>
            ))}
        </div>
    );
}
