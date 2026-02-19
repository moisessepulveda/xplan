import React from 'react';
import { Card, Typography, Tag } from 'antd';
import {
    HomeOutlined,
    CarOutlined,
    CreditCardOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    EllipsisOutlined,
} from '@ant-design/icons';
import { ProgressBar } from '@/app/components/budgets/ProgressBar';
import type { Credit } from '@/app/types';

interface CreditCardProps {
    credit: Credit;
    formatCurrency: (amount: number) => string;
    onClick?: () => void;
}

const typeIcons: Record<string, React.ReactNode> = {
    consumer: <ShoppingCartOutlined />,
    mortgage: <HomeOutlined />,
    auto: <CarOutlined />,
    credit_card: <CreditCardOutlined />,
    personal: <UserOutlined />,
    other: <EllipsisOutlined />,
};

export function CreditCard({ credit, formatCurrency, onClick }: CreditCardProps) {
    return (
        <Card
            size="small"
            style={{
                marginBottom: 10,
                borderRadius: 12,
                cursor: onClick ? 'pointer' : 'default',
                borderLeft: `4px solid ${credit.type_color}`,
            }}
            styles={{ body: { padding: '12px 16px' } }}
            onClick={onClick}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                    <span style={{ fontSize: 20, color: credit.type_color }}>
                        {typeIcons[credit.type] || <EllipsisOutlined />}
                    </span>
                    <div style={{ flex: 1 }}>
                        <Typography.Text strong style={{ fontSize: 14, display: 'block' }}>
                            {credit.name}
                        </Typography.Text>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            {credit.entity || credit.type_label}
                        </Typography.Text>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <Tag
                        color={credit.status_color}
                        style={{ margin: 0, fontSize: 11 }}
                    >
                        {credit.status_label}
                    </Tag>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                    <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
                        Saldo pendiente
                    </Typography.Text>
                    <Typography.Text strong style={{ fontSize: 15 }}>
                        {formatCurrency(credit.pending_amount)}
                    </Typography.Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
                        Cuota mensual
                    </Typography.Text>
                    <Typography.Text strong style={{ fontSize: 13 }}>
                        {formatCurrency(credit.monthly_payment)}
                    </Typography.Text>
                </div>
            </div>

            <ProgressBar percentage={credit.progress} height={5} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                    {credit.paid_installments_count} / {credit.paid_installments_count + credit.pending_installments_count} cuotas
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                    {credit.progress.toFixed(1)}% pagado
                </Typography.Text>
            </div>
        </Card>
    );
}
