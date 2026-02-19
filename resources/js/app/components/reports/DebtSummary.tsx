import React from 'react';
import { Card, Typography, Row, Col, Progress, Empty } from 'antd';
import { CreditCardOutlined, DollarOutlined, WarningOutlined } from '@ant-design/icons';
import { colors } from '@/app/styles/theme';

interface DebtByType {
    type: string;
    type_label: string;
    type_color: string;
    count: number;
    total_debt: number;
    total_monthly: number;
}

interface DebtReport {
    credits: {
        count: number;
        total_debt: number;
        total_monthly_payment: number;
        total_interest: number;
        by_type: DebtByType[];
    };
    payables: {
        count: number;
        total_amount: number;
        overdue_count: number;
    };
    total_debt: number;
}

interface Props {
    report: DebtReport;
    formatCurrency: (amount: number) => string;
}

export function DebtSummary({ report, formatCurrency }: Props) {
    if (report.credits.count === 0 && report.payables.count === 0) {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No tienes deudas registradas" />;
    }

    const maxDebt = Math.max(...report.credits.by_type.map(t => t.total_debt), 1);

    return (
        <div>
            {/* Total Summary */}
            <Card
                style={{
                    background: `linear-gradient(135deg, ${colors.error.main} 0%, ${colors.error.dark} 100%)`,
                    borderRadius: 12,
                    marginBottom: 16,
                }}
                styles={{ body: { padding: 16 } }}
            >
                <Typography.Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                    DEUDA TOTAL
                </Typography.Text>
                <Typography.Title level={3} style={{ color: '#fff', margin: '4px 0' }}>
                    {formatCurrency(report.total_debt)}
                </Typography.Title>
                <Row gutter={16}>
                    <Col span={12}>
                        <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
                            Pago mensual
                        </Typography.Text>
                        <Typography.Text style={{ color: '#fff', display: 'block', fontWeight: 600 }}>
                            {formatCurrency(report.credits.total_monthly_payment)}
                        </Typography.Text>
                    </Col>
                    <Col span={12}>
                        <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
                            Intereses totales
                        </Typography.Text>
                        <Typography.Text style={{ color: '#fff', display: 'block', fontWeight: 600 }}>
                            {formatCurrency(report.credits.total_interest)}
                        </Typography.Text>
                    </Col>
                </Row>
            </Card>

            {/* Credits by type */}
            {report.credits.by_type.length > 0 && (
                <Card
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CreditCardOutlined />
                            <span>Créditos ({report.credits.count})</span>
                        </div>
                    }
                    style={{ borderRadius: 12, marginBottom: 16 }}
                    styles={{ body: { padding: 16 } }}
                >
                    {report.credits.by_type.map((typeData) => (
                        <div key={typeData.type} style={{ marginBottom: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Typography.Text style={{ fontSize: 13 }}>
                                    {typeData.type_label} ({typeData.count})
                                </Typography.Text>
                                <Typography.Text strong style={{ fontSize: 13 }}>
                                    {formatCurrency(typeData.total_debt)}
                                </Typography.Text>
                            </div>
                            <Progress
                                percent={Math.round((typeData.total_debt / maxDebt) * 100)}
                                showInfo={false}
                                strokeColor={typeData.type_color}
                                size="small"
                            />
                            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                                Pago mensual: {formatCurrency(typeData.total_monthly)}
                            </Typography.Text>
                        </div>
                    ))}
                </Card>
            )}

            {/* Payables */}
            {report.payables.count > 0 && (
                <Card
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <DollarOutlined />
                            <span>Cuentas por pagar ({report.payables.count})</span>
                        </div>
                    }
                    style={{ borderRadius: 12 }}
                    styles={{ body: { padding: 16 } }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Typography.Text>Total pendiente</Typography.Text>
                        <Typography.Text strong>{formatCurrency(report.payables.total_amount)}</Typography.Text>
                    </div>
                    {report.payables.overdue_count > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: colors.error.main }}>
                            <WarningOutlined />
                            <Typography.Text style={{ color: colors.error.main }}>
                                {report.payables.overdue_count} vencida{report.payables.overdue_count > 1 ? 's' : ''}
                            </Typography.Text>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
}
