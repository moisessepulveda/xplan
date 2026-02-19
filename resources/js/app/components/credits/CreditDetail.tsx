import React from 'react';
import { Card, Typography, Row, Col, Descriptions, Tag } from 'antd';
import { ProgressBar } from '@/app/components/budgets/ProgressBar';
import type { Credit } from '@/app/types';
import { colors } from '@/app/styles/theme';

interface CreditDetailProps {
    credit: Credit;
    formatCurrency: (amount: number) => string;
}

export function CreditDetail({ credit, formatCurrency }: CreditDetailProps) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T12:00:00');
        return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div>
            {/* Progress Card */}
            <Card
                style={{
                    background: `linear-gradient(135deg, ${credit.type_color} 0%, ${credit.type_color}cc 100%)`,
                    borderRadius: 16,
                    marginBottom: 16,
                }}
                styles={{ body: { padding: 16 } }}
            >
                <Typography.Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                    SALDO PENDIENTE
                </Typography.Text>
                <Typography.Title level={2} style={{ color: '#fff', margin: '4px 0 8px' }}>
                    {formatCurrency(credit.pending_amount)}
                </Typography.Title>

                <ProgressBar percentage={credit.progress} height={8} />

                <Row gutter={12} style={{ marginTop: 12 }}>
                    <Col span={8}>
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 8, textAlign: 'center' }}>
                            <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, display: 'block' }}>
                                Original
                            </Typography.Text>
                            <Typography.Text strong style={{ color: '#fff', fontSize: 12 }}>
                                {formatCurrency(credit.original_amount)}
                            </Typography.Text>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 8, textAlign: 'center' }}>
                            <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, display: 'block' }}>
                                Pagado
                            </Typography.Text>
                            <Typography.Text strong style={{ color: '#fff', fontSize: 12 }}>
                                {formatCurrency(credit.paid_amount)}
                            </Typography.Text>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 8, textAlign: 'center' }}>
                            <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, display: 'block' }}>
                                Progreso
                            </Typography.Text>
                            <Typography.Text strong style={{ color: '#fff', fontSize: 12 }}>
                                {credit.progress.toFixed(1)}%
                            </Typography.Text>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Details Card */}
            <Card style={{ borderRadius: 12, marginBottom: 16 }}>
                <Descriptions column={2} size="small">
                    <Descriptions.Item label="Tipo">
                        <Tag color={credit.type_color}>{credit.type_label}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Estado">
                        <Tag color={credit.status_color}>{credit.status_label}</Tag>
                    </Descriptions.Item>
                    {credit.entity && (
                        <Descriptions.Item label="Institución">{credit.entity}</Descriptions.Item>
                    )}
                    <Descriptions.Item label="Tasa de interés">{credit.interest_rate}% {credit.rate_type === 'fixed' ? '(Fija)' : '(Variable)'}</Descriptions.Item>
                    <Descriptions.Item label="Plazo">{credit.term_months} meses</Descriptions.Item>
                    <Descriptions.Item label="Cuota mensual">{formatCurrency(credit.monthly_payment)}</Descriptions.Item>
                    <Descriptions.Item label="Fecha inicio">{formatDate(credit.start_date)}</Descriptions.Item>
                    <Descriptions.Item label="Fecha término">{formatDate(credit.estimated_end_date)}</Descriptions.Item>
                    <Descriptions.Item label="Día de pago">{credit.payment_day}</Descriptions.Item>
                    <Descriptions.Item label="Cuotas pagadas">
                        {credit.paid_installments_count} / {credit.paid_installments_count + credit.pending_installments_count}
                    </Descriptions.Item>
                    {credit.reference_number && (
                        <Descriptions.Item label="Referencia">{credit.reference_number}</Descriptions.Item>
                    )}
                    {credit.total_interest > 0 && (
                        <Descriptions.Item label="Interés total">{formatCurrency(credit.total_interest)}</Descriptions.Item>
                    )}
                </Descriptions>
            </Card>

            {/* Next Installment */}
            {credit.next_installment && (
                <Card
                    style={{
                        borderRadius: 12,
                        borderLeft: `4px solid ${credit.next_installment.is_overdue ? colors.error.main : colors.warning.main}`,
                    }}
                >
                    <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                        PRÓXIMA CUOTA
                    </Typography.Text>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <Typography.Text strong>
                                Cuota #{credit.next_installment.number}
                            </Typography.Text>
                            <Typography.Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                                Vence: {formatDate(credit.next_installment.due_date)}
                            </Typography.Text>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <Typography.Text strong style={{ fontSize: 16 }}>
                                {formatCurrency(credit.next_installment.amount)}
                            </Typography.Text>
                            {credit.next_installment.is_overdue && (
                                <Tag color="error" style={{ display: 'block', marginTop: 4 }}>Vencida</Tag>
                            )}
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
