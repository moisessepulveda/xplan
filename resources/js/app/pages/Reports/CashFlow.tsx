import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, DatePicker, Typography, Row, Col } from 'antd';
import dayjs from 'dayjs';
import { AppLayout } from '@/app/components/common/AppLayout';
import { CashFlowChart, ExportButton } from '@/app/components/reports';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';

interface CashFlowData {
    date: string;
    date_label: string;
    income: number;
    expense: number;
    net: number;
    accumulated: number;
}

interface Props {
    report: {
        data: CashFlowData[];
        total_income: number;
        total_expense: number;
        net_flow: number;
        start_date: string;
        end_date: string;
    };
    filters: {
        start_date: string;
        end_date: string;
    };
}

export default function CashFlow({ report, filters }: Props) {
    const { planning } = usePlanning();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const handleDateChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
        if (dates && dates[0] && dates[1]) {
            router.visit('/reports/cash-flow', {
                data: {
                    start_date: dates[0].format('YYYY-MM-DD'),
                    end_date: dates[1].format('YYYY-MM-DD'),
                },
                preserveState: true,
            });
        }
    };

    return (
        <AppLayout title="Flujo de Caja" showBack>
            <Head title="Flujo de Caja" />

            <div style={{ padding: 16 }}>
                {/* Filters */}
                <Card style={{ borderRadius: 12, marginBottom: 16 }} styles={{ body: { padding: 12 } }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <DatePicker.RangePicker
                            size="small"
                            value={[dayjs(filters.start_date), dayjs(filters.end_date)]}
                            onChange={handleDateChange}
                            format="DD/MM/YYYY"
                            style={{ flex: 1, marginRight: 8 }}
                        />
                        <ExportButton
                            reportType="cash-flow"
                            params={{ start_date: filters.start_date, end_date: filters.end_date }}
                        />
                    </div>
                </Card>

                {/* Summary */}
                <Row gutter={8} style={{ marginBottom: 16 }}>
                    <Col span={8}>
                        <Card style={{ borderRadius: 10, textAlign: 'center' }} styles={{ body: { padding: 10 } }}>
                            <Typography.Text type="secondary" style={{ fontSize: 10, display: 'block' }}>
                                Ingresos
                            </Typography.Text>
                            <Typography.Text strong style={{ color: colors.income.main, fontSize: 12 }}>
                                {formatCurrency(report.total_income)}
                            </Typography.Text>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card style={{ borderRadius: 10, textAlign: 'center' }} styles={{ body: { padding: 10 } }}>
                            <Typography.Text type="secondary" style={{ fontSize: 10, display: 'block' }}>
                                Gastos
                            </Typography.Text>
                            <Typography.Text strong style={{ color: colors.expense.main, fontSize: 12 }}>
                                {formatCurrency(report.total_expense)}
                            </Typography.Text>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card style={{ borderRadius: 10, textAlign: 'center' }} styles={{ body: { padding: 10 } }}>
                            <Typography.Text type="secondary" style={{ fontSize: 10, display: 'block' }}>
                                Flujo Neto
                            </Typography.Text>
                            <Typography.Text
                                strong
                                style={{
                                    color: report.net_flow >= 0 ? colors.income.main : colors.expense.main,
                                    fontSize: 12,
                                }}
                            >
                                {formatCurrency(report.net_flow)}
                            </Typography.Text>
                        </Card>
                    </Col>
                </Row>

                {/* Chart */}
                <Card
                    title="Flujo acumulado"
                    style={{ borderRadius: 12 }}
                    styles={{ body: { padding: 16 } }}
                >
                    <CashFlowChart data={report.data} formatCurrency={formatCurrency} />
                </Card>
            </div>
        </AppLayout>
    );
}
