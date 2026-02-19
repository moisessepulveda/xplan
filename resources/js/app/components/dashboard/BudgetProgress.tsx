import React from 'react';
import { Card, Progress, Typography, Button, Empty } from 'antd';
import { router } from '@inertiajs/react';
import { colors } from '@/app/styles/theme';

interface Props {
    budgetUsed: number;
    budgetTotal: number;
    budgetSpent: number;
    formatCurrency: (amount: number) => string;
}

export function BudgetProgress({ budgetUsed, budgetTotal, budgetSpent, formatCurrency }: Props) {
    const getStrokeColor = (percent: number) => {
        if (percent >= 100) return colors.error.main;
        if (percent >= 80) return colors.warning.main;
        return colors.success.main;
    };

    return (
        <Card
            title="Presupuesto del mes"
            style={{ borderRadius: 12, marginBottom: 16 }}
            styles={{ body: { padding: 16 } }}
        >
            {budgetTotal > 0 ? (
                <>
                    <Progress
                        percent={Math.min(budgetUsed, 100)}
                        strokeColor={getStrokeColor(budgetUsed)}
                        format={() => `${budgetUsed}%`}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            Gastado: {formatCurrency(budgetSpent)}
                        </Typography.Text>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            Total: {formatCurrency(budgetTotal)}
                        </Typography.Text>
                    </div>
                </>
            ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sin presupuesto configurado">
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => router.visit('/budgets/configure')}
                    >
                        Configurar
                    </Button>
                </Empty>
            )}
        </Card>
    );
}
