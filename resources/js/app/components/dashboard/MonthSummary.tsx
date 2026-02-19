import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { colors } from '@/app/styles/theme';

interface Props {
    monthIncome: number;
    monthExpense: number;
    formatCurrency: (amount: number) => string;
}

export function MonthSummary({ monthIncome, monthExpense, formatCurrency }: Props) {
    return (
        <Row gutter={12} style={{ marginBottom: 16 }}>
            <Col span={12}>
                <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 16 } }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                backgroundColor: colors.income.light,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <ArrowUpOutlined style={{ color: colors.income.main, fontSize: 18 }} />
                        </div>
                        <div>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                Ingresos
                            </Typography.Text>
                            <Typography.Text strong style={{ display: 'block', color: colors.income.main }}>
                                {formatCurrency(monthIncome)}
                            </Typography.Text>
                        </div>
                    </div>
                </Card>
            </Col>
            <Col span={12}>
                <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 16 } }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                backgroundColor: colors.expense.light,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <ArrowDownOutlined style={{ color: colors.expense.main, fontSize: 18 }} />
                        </div>
                        <div>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                Gastos
                            </Typography.Text>
                            <Typography.Text strong style={{ display: 'block', color: colors.expense.main }}>
                                {formatCurrency(monthExpense)}
                            </Typography.Text>
                        </div>
                    </div>
                </Card>
            </Col>
        </Row>
    );
}
