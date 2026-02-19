import React from 'react';
import { Card, Typography, Row, Col, Descriptions, Tag } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import { ProgressBar } from '@/app/components/budgets/ProgressBar';
import type { Credit } from '@/app/types';
import { colors } from '@/app/styles/theme';

interface CreditCardDetailProps {
    credit: Credit;
    formatCurrency: (amount: number) => string;
}

export function CreditCardDetail({ credit, formatCurrency }: CreditCardDetailProps) {
    const usagePercentage = credit.credit_limit
        ? ((credit.pending_amount / credit.credit_limit) * 100)
        : 0;

    const available = credit.credit_limit
        ? credit.credit_limit - credit.pending_amount
        : 0;

    return (
        <div>
            {/* Card Visual */}
            <Card
                style={{
                    background: `linear-gradient(135deg, ${colors.credit.creditCard} 0%, #c41d7f 100%)`,
                    borderRadius: 16,
                    marginBottom: 16,
                    minHeight: 180,
                }}
                styles={{ body: { padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' } }}
            >
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography.Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
                            {credit.entity || 'Tarjeta de Crédito'}
                        </Typography.Text>
                        <CreditCardOutlined style={{ color: '#fff', fontSize: 24 }} />
                    </div>
                    <Typography.Title level={3} style={{ color: '#fff', margin: '12px 0' }}>
                        {credit.name}
                    </Typography.Title>
                </div>

                <div>
                    {credit.reference_number && (
                        <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, letterSpacing: 2 }}>
                            **** **** **** {credit.reference_number.slice(-4)}
                        </Typography.Text>
                    )}
                </div>
            </Card>

            {/* Usage */}
            {credit.credit_limit && (
                <Card style={{ borderRadius: 12, marginBottom: 16 }}>
                    <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                        USO DE LÍNEA
                    </Typography.Text>

                    <ProgressBar percentage={usagePercentage} height={8} />

                    <Row gutter={12} style={{ marginTop: 12 }}>
                        <Col span={8}>
                            <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
                                Línea
                            </Typography.Text>
                            <Typography.Text strong style={{ fontSize: 13 }}>
                                {formatCurrency(credit.credit_limit)}
                            </Typography.Text>
                        </Col>
                        <Col span={8}>
                            <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
                                Utilizado
                            </Typography.Text>
                            <Typography.Text strong style={{ fontSize: 13, color: colors.expense.main }}>
                                {formatCurrency(credit.pending_amount)}
                            </Typography.Text>
                        </Col>
                        <Col span={8}>
                            <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
                                Disponible
                            </Typography.Text>
                            <Typography.Text strong style={{ fontSize: 13, color: colors.success.main }}>
                                {formatCurrency(available)}
                            </Typography.Text>
                        </Col>
                    </Row>
                </Card>
            )}

            {/* Details */}
            <Card style={{ borderRadius: 12 }}>
                <Descriptions column={2} size="small">
                    <Descriptions.Item label="Estado">
                        <Tag color={credit.status_color}>{credit.status_label}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Tasa de interés">{credit.interest_rate}%</Descriptions.Item>
                    {credit.billing_day && (
                        <Descriptions.Item label="Día de facturación">{credit.billing_day}</Descriptions.Item>
                    )}
                    <Descriptions.Item label="Día de pago">{credit.payment_day}</Descriptions.Item>
                    {credit.entity && (
                        <Descriptions.Item label="Institución">{credit.entity}</Descriptions.Item>
                    )}
                </Descriptions>
            </Card>
        </div>
    );
}
