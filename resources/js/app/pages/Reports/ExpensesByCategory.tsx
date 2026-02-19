import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, DatePicker, Typography } from 'antd';
import dayjs from 'dayjs';
import { AppLayout } from '@/app/components/common/AppLayout';
import { ExpensesByCategoryChart, ExportButton } from '@/app/components/reports';
import { usePlanning } from '@/app/hooks/usePlanning';

interface CategoryData {
    category_id: number;
    category_name: string;
    category_icon?: string;
    category_color?: string;
    total: number;
    percentage: number;
}

interface Props {
    report: {
        data: CategoryData[];
        total: number;
        start_date: string;
        end_date: string;
    };
    filters: {
        start_date: string;
        end_date: string;
    };
}

export default function ExpensesByCategory({ report, filters }: Props) {
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
            router.visit('/reports/expenses-by-category', {
                data: {
                    start_date: dates[0].format('YYYY-MM-DD'),
                    end_date: dates[1].format('YYYY-MM-DD'),
                },
                preserveState: true,
            });
        }
    };

    return (
        <AppLayout title="Gastos por Categoría" showBack>
            <Head title="Gastos por Categoría" />

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
                            reportType="expenses-by-category"
                            params={{ start_date: filters.start_date, end_date: filters.end_date }}
                        />
                    </div>
                </Card>

                {/* Total */}
                <Card
                    style={{ borderRadius: 12, marginBottom: 16, textAlign: 'center' }}
                    styles={{ body: { padding: 16 } }}
                >
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        TOTAL GASTOS
                    </Typography.Text>
                    <Typography.Title level={3} style={{ margin: '4px 0 0', color: '#ff4d4f' }}>
                        {formatCurrency(report.total)}
                    </Typography.Title>
                </Card>

                {/* Chart */}
                <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 16 } }}>
                    <ExpensesByCategoryChart
                        data={report.data}
                        total={report.total}
                        formatCurrency={formatCurrency}
                    />
                </Card>
            </div>
        </AppLayout>
    );
}
