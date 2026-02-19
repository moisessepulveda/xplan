import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { WalletOutlined, CreditCardOutlined } from '@ant-design/icons';
import { colors } from '@/app/styles/theme';

interface Props {
    totalBalance: number;
    totalDebt: number;
    totalReceivable: number;
    formatCurrency: (amount: number) => string;
}

export function BalanceCard({ totalBalance, totalDebt, totalReceivable, formatCurrency }: Props) {
    return (
        <Card
            style={{
                background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                borderRadius: 16,
                marginBottom: 16,
            }}
            styles={{ body: { padding: 20 } }}
        >
            <Typography.Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                BALANCE TOTAL
            </Typography.Text>
            <Typography.Title level={2} style={{ color: '#fff', margin: '8px 0 16px' }}>
                {formatCurrency(totalBalance)}
            </Typography.Title>

            <Row gutter={16}>
                <Col span={12}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <CreditCardOutlined style={{ color: '#fff', fontSize: 16 }} />
                        </div>
                        <div>
                            <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, display: 'block' }}>
                                Deudas
                            </Typography.Text>
                            <Typography.Text style={{ color: '#fff', fontWeight: 600 }}>
                                {formatCurrency(totalDebt)}
                            </Typography.Text>
                        </div>
                    </div>
                </Col>
                <Col span={12}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <WalletOutlined style={{ color: '#fff', fontSize: 16 }} />
                        </div>
                        <div>
                            <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, display: 'block' }}>
                                Por cobrar
                            </Typography.Text>
                            <Typography.Text style={{ color: '#fff', fontWeight: 600 }}>
                                {formatCurrency(totalReceivable)}
                            </Typography.Text>
                        </div>
                    </div>
                </Col>
            </Row>
        </Card>
    );
}
