import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import {
    SwapOutlined,
    BankOutlined,
    CreditCardOutlined,
    ArrowDownOutlined,
    ArrowUpOutlined,
} from '@ant-design/icons';
import { colors } from '@/app/styles/theme';

interface Props {
    expenseChange: number;
    transactionCount: number;
    accountsCount: number;
    activeCreditsCount: number;
}

export function QuickStats({ expenseChange, transactionCount, accountsCount, activeCreditsCount }: Props) {
    const stats = [
        {
            label: 'Transacciones',
            value: transactionCount,
            icon: <SwapOutlined />,
            color: colors.primary[500],
            bg: colors.primary[50],
        },
        {
            label: 'Cuentas',
            value: accountsCount,
            icon: <BankOutlined />,
            color: colors.info.main,
            bg: colors.info.light,
        },
        {
            label: 'Créditos',
            value: activeCreditsCount,
            icon: <CreditCardOutlined />,
            color: colors.warning.main,
            bg: colors.warning.light,
        },
        {
            label: 'vs mes ant.',
            value: `${expenseChange > 0 ? '+' : ''}${expenseChange}%`,
            icon: expenseChange > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />,
            color: expenseChange > 0 ? colors.error.main : colors.success.main,
            bg: expenseChange > 0 ? colors.error.light : colors.success.light,
        },
    ];

    return (
        <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
            {stats.map((stat) => (
                <Col span={12} key={stat.label}>
                    <Card style={{ borderRadius: 10 }} styles={{ body: { padding: 12 } }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 8,
                                    backgroundColor: stat.bg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: stat.color,
                                    fontSize: 14,
                                }}
                            >
                                {stat.icon}
                            </div>
                            <div>
                                <Typography.Text strong style={{ display: 'block', fontSize: 15 }}>
                                    {stat.value}
                                </Typography.Text>
                                <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                                    {stat.label}
                                </Typography.Text>
                            </div>
                        </div>
                    </Card>
                </Col>
            ))}
        </Row>
    );
}
