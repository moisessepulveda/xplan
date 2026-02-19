import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, Typography, Row, Col } from 'antd';
import { AppLayout } from '@/app/components/common/AppLayout';
import { BudgetVsRealChart } from '@/app/components/reports';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';

interface BudgetLineData {
    category_id: number;
    category_name: string;
    category_icon?: string;
    category_color?: string;
    budgeted: number;
    spent: number;
    remaining: number;
    percentage: number;
    status: string;
}

interface Props {
    report: {
        has_budget: boolean;
        data: BudgetLineData[];
        total_budgeted: number;
        total_spent: number;
        total_remaining: number;
        total_percentage: number;
        period?: string;
    };
}

export default function BudgetVsReal({ report }: Props) {
    const { planning } = usePlanning();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const getStatusColor = () => {
        if (!report.has_budget) return colors.neutral[500];
        if (report.total_percentage >= 100) return colors.error.main;
        if (report.total_percentage >= 80) return colors.warning.main;
        return colors.success.main;
    };

    return (
        <AppLayout title="Presupuesto vs Real" showBack>
            <Head title="Presupuesto vs Real" />

            <div style={{ padding: 16 }}>
                {report.has_budget && (
                    <>
                        {/* Summary */}
                        <Row gutter={8} style={{ marginBottom: 16 }}>
                            <Col span={8}>
                                <Card style={{ borderRadius: 10, textAlign: 'center' }} styles={{ body: { padding: 10 } }}>
                                    <Typography.Text type="secondary" style={{ fontSize: 10, display: 'block' }}>
                                        Presupuestado
                                    </Typography.Text>
                                    <Typography.Text strong style={{ fontSize: 12 }}>
                                        {formatCurrency(report.total_budgeted)}
                                    </Typography.Text>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card style={{ borderRadius: 10, textAlign: 'center' }} styles={{ body: { padding: 10 } }}>
                                    <Typography.Text type="secondary" style={{ fontSize: 10, display: 'block' }}>
                                        Gastado
                                    </Typography.Text>
                                    <Typography.Text strong style={{ color: getStatusColor(), fontSize: 12 }}>
                                        {formatCurrency(report.total_spent)}
                                    </Typography.Text>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card style={{ borderRadius: 10, textAlign: 'center' }} styles={{ body: { padding: 10 } }}>
                                    <Typography.Text type="secondary" style={{ fontSize: 10, display: 'block' }}>
                                        Disponible
                                    </Typography.Text>
                                    <Typography.Text strong style={{ color: colors.success.main, fontSize: 12 }}>
                                        {formatCurrency(report.total_remaining)}
                                    </Typography.Text>
                                </Card>
                            </Col>
                        </Row>

                        {report.period && (
                            <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
                                Período: {report.period}
                            </Typography.Text>
                        )}
                    </>
                )}

                {/* Chart */}
                <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 16 } }}>
                    <BudgetVsRealChart
                        data={report.data}
                        hasBudget={report.has_budget}
                        formatCurrency={formatCurrency}
                    />
                </Card>
            </div>
        </AppLayout>
    );
}
