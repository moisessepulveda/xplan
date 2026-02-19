import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Empty } from 'antd';
import { colors } from '@/app/styles/theme';

interface MonthData {
    month: string;
    month_label: string;
    income: number;
    expense: number;
    balance: number;
}

interface Props {
    data: MonthData[];
    formatCurrency: (amount: number) => string;
}

export function IncomeVsExpensesChart({ data, formatCurrency }: Props) {
    if (data.length === 0) {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sin datos disponibles" />;
    }

    return (
        <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="month_label"
                        tick={{ fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => {
                            if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
                            if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
                            return v.toString();
                        }}
                    />
                    <Tooltip
                        formatter={(value: number, name: string) => [
                            formatCurrency(value),
                            name === 'income' ? 'Ingresos' : 'Gastos',
                        ]}
                        labelStyle={{ fontWeight: 600 }}
                    />
                    <Legend
                        formatter={(value) => (value === 'income' ? 'Ingresos' : 'Gastos')}
                    />
                    <Bar dataKey="income" fill={colors.income.main} radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="expense" fill={colors.expense.main} radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
