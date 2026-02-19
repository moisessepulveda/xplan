import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Empty } from 'antd';
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
    data: CashFlowData[];
    formatCurrency: (amount: number) => string;
}

export function CashFlowChart({ data, formatCurrency }: Props) {
    if (data.length === 0) {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sin datos de flujo de caja" />;
    }

    return (
        <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="date_label"
                        tick={{ fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => {
                            if (Math.abs(v) >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
                            if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(0)}K`;
                            return v.toString();
                        }}
                    />
                    <Tooltip
                        formatter={(value: number, name: string) => {
                            const labels: Record<string, string> = {
                                accumulated: 'Acumulado',
                                income: 'Ingresos',
                                expense: 'Gastos',
                            };
                            return [formatCurrency(value), labels[name] || name];
                        }}
                        labelStyle={{ fontWeight: 600 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="accumulated"
                        stroke={colors.primary[500]}
                        fill={colors.primary[50]}
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
