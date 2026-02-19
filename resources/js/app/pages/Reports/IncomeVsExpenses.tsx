import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, Segmented, Typography, Row, Col } from 'antd';
import { AppLayout } from '@/app/components/common/AppLayout';
import { IncomeVsExpensesChart, ExportButton } from '@/app/components/reports';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';

interface MonthData {
    month: string;
    month_label: string;
    income: number;
    expense: number;
    balance: number;
}

interface Props {
    report: {
        data: MonthData[];
        total_income: number;
        total_expense: number;
        average_income: number;
        average_expense: number;
    };
    filters: {
        months: number;
    };
}

export default function IncomeVsExpenses({ report, filters }: Props) {
    const { planning } = usePlanning();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const handlePeriodChange = (value: string | number) => {
        router.visit('/reports/income-vs-expenses', {
            data: { months: value },
            preserveState: true,
        });
    };

    return (
        <AppLayout title="Ingresos vs Gastos" showBack>
            <Head title="Ingresos vs Gastos" />

            <div style={{ padding: 16 }}>
                {/* Filters */}
                <Card style={{ borderRadius: 12, marginBottom: 16 }} styles={{ body: { padding: 12 } }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Segmented
                            size="small"
                            value={filters.months}
                            options={[
                                { label: '3M', value: 3 },
                                { label: '6M', value: 6 },
                                { label: '12M', value: 12 },
                            ]}
                            onChange={handlePeriodChange}
                        />
                        <ExportButton
                            reportType="income-vs-expenses"
                            params={{ months: filters.months }}
                        />
                    </div>
                </Card>

                {/* Summary */}
                <Row gutter={8} style={{ marginBottom: 16 }}>
                    <Col span={8}>
                        <Card style={{ borderRadius: 10, textAlign: 'center' }} styles={{ body: { padding: 10 } }}>
                            <Typography.Text type="secondary" style={{ fontSize: 10, display: 'block' }}>
                                Promedio Ingreso
                            </Typography.Text>
                            <Typography.Text strong style={{ color: colors.income.main, fontSize: 12 }}>
                                {formatCurrency(report.average_income)}
                            </Typography.Text>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card style={{ borderRadius: 10, textAlign: 'center' }} styles={{ body: { padding: 10 } }}>
                            <Typography.Text type="secondary" style={{ fontSize: 10, display: 'block' }}>
                                Promedio Gasto
                            </Typography.Text>
                            <Typography.Text strong style={{ color: colors.expense.main, fontSize: 12 }}>
                                {formatCurrency(report.average_expense)}
                            </Typography.Text>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card style={{ borderRadius: 10, textAlign: 'center' }} styles={{ body: { padding: 10 } }}>
                            <Typography.Text type="secondary" style={{ fontSize: 10, display: 'block' }}>
                                Balance
                            </Typography.Text>
                            <Typography.Text
                                strong
                                style={{
                                    color: report.total_income - report.total_expense >= 0
                                        ? colors.income.main
                                        : colors.expense.main,
                                    fontSize: 12,
                                }}
                            >
                                {formatCurrency(report.total_income - report.total_expense)}
                            </Typography.Text>
                        </Card>
                    </Col>
                </Row>

                {/* Chart */}
                <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 16 } }}>
                    <IncomeVsExpensesChart data={report.data} formatCurrency={formatCurrency} />
                </Card>

                {/* Monthly breakdown */}
                <Card
                    title="Detalle mensual"
                    style={{ borderRadius: 12, marginTop: 16 }}
                    styles={{ body: { padding: 0 } }}
                >
                    {report.data.map((month, index) => (
                        <div
                            key={month.month}
                            style={{
                                padding: '10px 16px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderBottom: index < report.data.length - 1 ? '1px solid #f0f0f0' : 'none',
                            }}
                        >
                            <Typography.Text style={{ fontSize: 13, textTransform: 'capitalize' }}>
                                {month.month_label}
                            </Typography.Text>
                            <div style={{ display: 'flex', gap: 16 }}>
                                <Typography.Text style={{ color: colors.income.main, fontSize: 12 }}>
                                    +{formatCurrency(month.income)}
                                </Typography.Text>
                                <Typography.Text style={{ color: colors.expense.main, fontSize: 12 }}>
                                    -{formatCurrency(month.expense)}
                                </Typography.Text>
                                <Typography.Text
                                    strong
                                    style={{
                                        fontSize: 12,
                                        color: month.balance >= 0 ? colors.income.main : colors.expense.main,
                                        minWidth: 70,
                                        textAlign: 'right',
                                    }}
                                >
                                    {formatCurrency(month.balance)}
                                </Typography.Text>
                            </div>
                        </div>
                    ))}
                </Card>
            </div>
        </AppLayout>
    );
}
