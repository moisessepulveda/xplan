import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, Typography, Row, Col } from 'antd';
import {
    PieChartOutlined,
    BarChartOutlined,
    LineChartOutlined,
    CreditCardOutlined,
    FundOutlined,
} from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { colors } from '@/app/styles/theme';

interface ReportItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
    route: string;
}

export default function ReportsIndex() {
    const reports: ReportItem[] = [
        {
            title: 'Gastos por Categoría',
            description: 'Distribución de gastos por categoría',
            icon: <PieChartOutlined />,
            color: colors.expense.main,
            bg: colors.expense.light,
            route: '/reports/expenses-by-category',
        },
        {
            title: 'Ingresos vs Gastos',
            description: 'Comparación mensual de ingresos y gastos',
            icon: <BarChartOutlined />,
            color: colors.primary[500],
            bg: colors.primary[50],
            route: '/reports/income-vs-expenses',
        },
        {
            title: 'Flujo de Caja',
            description: 'Movimiento acumulado de dinero',
            icon: <LineChartOutlined />,
            color: colors.success.main,
            bg: colors.success.light,
            route: '/reports/cash-flow',
        },
        {
            title: 'Presupuesto vs Real',
            description: 'Comparación entre presupuesto y gastos reales',
            icon: <FundOutlined />,
            color: colors.warning.main,
            bg: colors.warning.light,
            route: '/reports/budget-vs-real',
        },
        {
            title: 'Resumen de Deudas',
            description: 'Estado general de créditos y deudas',
            icon: <CreditCardOutlined />,
            color: colors.error.main,
            bg: colors.error.light,
            route: '/reports/debts',
        },
    ];

    return (
        <AppLayout title="Reportes" showBack>
            <Head title="Reportes" />

            <div style={{ padding: 16 }}>
                <Typography.Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 16 }}>
                    Analiza tus finanzas con reportes detallados
                </Typography.Text>

                <Row gutter={[12, 12]}>
                    {reports.map((report) => (
                        <Col span={24} key={report.route}>
                            <Card
                                style={{ borderRadius: 12, cursor: 'pointer' }}
                                styles={{ body: { padding: 16 } }}
                                hoverable
                                onClick={() => router.visit(report.route)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div
                                        style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 12,
                                            backgroundColor: report.bg,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: report.color,
                                            fontSize: 22,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {report.icon}
                                    </div>
                                    <div>
                                        <Typography.Text strong style={{ fontSize: 14 }}>
                                            {report.title}
                                        </Typography.Text>
                                        <Typography.Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                                            {report.description}
                                        </Typography.Text>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </AppLayout>
    );
}
