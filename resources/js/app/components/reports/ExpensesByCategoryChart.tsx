import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Typography, Empty } from 'antd';
import { colors } from '@/app/styles/theme';

interface CategoryData {
    category_id: number;
    category_name: string;
    category_icon?: string;
    category_color?: string;
    total: number;
    percentage: number;
}

interface Props {
    data: CategoryData[];
    total: number;
    formatCurrency: (amount: number) => string;
}

const CHART_COLORS = [
    colors.expense.main,
    colors.primary[500],
    colors.warning.main,
    '#722ed1',
    '#13c2c2',
    '#eb2f96',
    colors.category.home,
    colors.category.transport,
    colors.success.main,
    colors.category.other,
];

export function ExpensesByCategoryChart({ data, total, formatCurrency }: Props) {
    if (data.length === 0) {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sin gastos en este período" />;
    }

    const chartData = data.map((item, index) => ({
        ...item,
        fill: item.category_color || CHART_COLORS[index % CHART_COLORS.length],
    }));

    return (
        <div>
            <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={90}
                            dataKey="total"
                            nameKey="category_name"
                            paddingAngle={2}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            labelStyle={{ fontWeight: 600 }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div style={{ marginTop: 16 }}>
                {chartData.map((item, index) => (
                    <div
                        key={item.category_id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 0',
                            borderBottom: index < chartData.length - 1 ? '1px solid #f0f0f0' : 'none',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div
                                style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: 3,
                                    backgroundColor: item.fill,
                                }}
                            />
                            <Typography.Text style={{ fontSize: 13 }}>
                                {item.category_icon} {item.category_name}
                            </Typography.Text>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <Typography.Text strong style={{ fontSize: 13 }}>
                                {formatCurrency(item.total)}
                            </Typography.Text>
                            <Typography.Text type="secondary" style={{ fontSize: 11, marginLeft: 8 }}>
                                {item.percentage}%
                            </Typography.Text>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
