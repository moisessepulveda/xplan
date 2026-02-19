import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Empty, Typography } from 'antd';
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
    data: BudgetLineData[];
    hasBudget: boolean;
    formatCurrency: (amount: number) => string;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'exceeded': return colors.error.main;
        case 'warning': return colors.warning.main;
        case 'caution': return '#faad14';
        default: return colors.success.main;
    }
};

export function BudgetVsRealChart({ data, hasBudget, formatCurrency }: Props) {
    if (!hasBudget || data.length === 0) {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sin presupuesto configurado" />;
    }

    const chartData = data.map((item) => ({
        ...item,
        name: item.category_name.length > 10
            ? item.category_name.substring(0, 10) + '...'
            : item.category_name,
    }));

    return (
        <div>
            <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis
                            type="number"
                            tick={{ fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => {
                                if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
                                if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
                                return v.toString();
                            }}
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tick={{ fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            width={60}
                        />
                        <Tooltip
                            formatter={(value: number, name: string) => [
                                formatCurrency(value),
                                name === 'budgeted' ? 'Presupuestado' : 'Gastado',
                            ]}
                            labelStyle={{ fontWeight: 600 }}
                        />
                        <Bar dataKey="budgeted" fill={colors.neutral[300]} radius={[0, 4, 4, 0]} barSize={14} />
                        <Bar dataKey="spent" radius={[0, 4, 4, 0]} barSize={14}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div style={{ marginTop: 16 }}>
                {data.map((item, index) => (
                    <div
                        key={item.category_id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 0',
                            borderBottom: index < data.length - 1 ? '1px solid #f0f0f0' : 'none',
                        }}
                    >
                        <Typography.Text style={{ fontSize: 12 }}>
                            {item.category_icon} {item.category_name}
                        </Typography.Text>
                        <div>
                            <Typography.Text style={{ fontSize: 12, color: getStatusColor(item.status) }}>
                                {formatCurrency(item.spent)}
                            </Typography.Text>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                {' / '}{formatCurrency(item.budgeted)}
                            </Typography.Text>
                            <Typography.Text
                                style={{
                                    fontSize: 11,
                                    marginLeft: 8,
                                    color: getStatusColor(item.status),
                                    fontWeight: 600,
                                }}
                            >
                                {item.percentage}%
                            </Typography.Text>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
