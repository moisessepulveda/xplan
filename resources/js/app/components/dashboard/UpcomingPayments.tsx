import React from 'react';
import { Card, Typography, Empty, Tag } from 'antd';
import { CalendarOutlined, CreditCardOutlined, DollarOutlined } from '@ant-design/icons';
import { router } from '@inertiajs/react';
import { colors } from '@/app/styles/theme';

interface UpcomingPayment {
    id: number;
    type: 'credit_installment' | 'payable';
    description: string;
    amount: number;
    due_date: string | null;
    status: string;
    is_overdue: boolean;
}

interface Props {
    payments: UpcomingPayment[];
    formatCurrency: (amount: number) => string;
}

export function UpcomingPayments({ payments, formatCurrency }: Props) {
    return (
        <Card
            title="Próximos vencimientos"
            style={{ borderRadius: 12, marginBottom: 16 }}
            styles={{ body: { padding: payments.length > 0 ? 0 : 16 } }}
        >
            {payments.length > 0 ? (
                <div>
                    {payments.map((payment, index) => (
                        <div
                            key={`${payment.type}-${payment.id}`}
                            style={{
                                padding: '12px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottom: index < payments.length - 1 ? '1px solid #f0f0f0' : 'none',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                if (payment.type === 'credit_installment') {
                                    router.visit('/credits');
                                } else {
                                    router.visit('/receivables');
                                }
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 8,
                                        backgroundColor: payment.is_overdue ? colors.error.light : colors.warning.light,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    {payment.type === 'credit_installment' ? (
                                        <CreditCardOutlined style={{ color: payment.is_overdue ? colors.error.main : colors.warning.main }} />
                                    ) : (
                                        <DollarOutlined style={{ color: payment.is_overdue ? colors.error.main : colors.warning.main }} />
                                    )}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <Typography.Text ellipsis style={{ display: 'block', fontSize: 13 }}>
                                        {payment.description}
                                    </Typography.Text>
                                    {payment.due_date && (
                                        <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                                            <CalendarOutlined style={{ marginRight: 4 }} />
                                            {new Date(payment.due_date).toLocaleDateString('es-CL', {
                                                day: 'numeric',
                                                month: 'short',
                                            })}
                                        </Typography.Text>
                                    )}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
                                <Typography.Text strong style={{ fontSize: 13 }}>
                                    {formatCurrency(payment.amount)}
                                </Typography.Text>
                                {payment.is_overdue && (
                                    <Tag color="error" style={{ marginLeft: 0, display: 'block', marginTop: 2, fontSize: 10 }}>
                                        Vencido
                                    </Tag>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sin vencimientos próximos" />
            )}
        </Card>
    );
}
