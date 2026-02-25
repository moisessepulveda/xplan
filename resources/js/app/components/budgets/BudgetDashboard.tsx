import React, { useMemo } from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { ProgressBar } from './ProgressBar';
import { BudgetCategoryCard } from './BudgetCategoryCard';
import type { BudgetProgress, BudgetProgressLine } from '@/app/types';
import { colors } from '@/app/styles/theme';

interface BudgetDashboardProps {
    progress: BudgetProgress;
    formatCurrency: (amount: number) => string;
    onCategoryClick?: (line: BudgetProgressLine) => void;
}

export function BudgetDashboard({ progress, formatCurrency, onCategoryClick }: BudgetDashboardProps) {
    // Separate expense and savings lines
    const { expenseLines, savingsLines, expenseTotals, savingsTotals } = useMemo(() => {
        const expense = progress.lines.filter(line => line.category?.type !== 'savings');
        const savings = progress.lines.filter(line => line.category?.type === 'savings');

        const expenseBudgeted = expense.reduce((sum, l) => sum + l.amount, 0);
        const expenseSpent = expense.reduce((sum, l) => sum + l.spent, 0);

        const savingsBudgeted = savings.reduce((sum, l) => sum + l.amount, 0);
        const savingsSpent = savings.reduce((sum, l) => sum + l.spent, 0);

        return {
            expenseLines: expense,
            savingsLines: savings,
            expenseTotals: {
                budgeted: expenseBudgeted,
                spent: expenseSpent,
                remaining: Math.max(0, expenseBudgeted - expenseSpent),
                percentage: expenseBudgeted > 0 ? (expenseSpent / expenseBudgeted) * 100 : 0,
            },
            savingsTotals: {
                budgeted: savingsBudgeted,
                spent: savingsSpent,
                remaining: Math.max(0, savingsBudgeted - savingsSpent),
                percentage: savingsBudgeted > 0 ? (savingsSpent / savingsBudgeted) * 100 : 0,
            },
        };
    }, [progress.lines]);

    return (
        <div>
            {/* Overall Progress Card */}
            <Card
                style={{
                    background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                    borderRadius: 16,
                    marginBottom: 16,
                }}
                styles={{ body: { padding: 16 } }}
            >
                <Typography.Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                    PRESUPUESTO DEL MES
                </Typography.Text>
                <Typography.Title level={3} style={{ color: '#fff', margin: '4px 0 8px' }}>
                    {formatCurrency(progress.total_spent)} / {formatCurrency(progress.total_budgeted)}
                </Typography.Title>

                <ProgressBar
                    percentage={progress.total_percentage}
                    height={10}
                />

                <Row gutter={12} style={{ marginTop: 12 }}>
                    <Col span={8}>
                        <div
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                borderRadius: 8,
                                padding: 10,
                                textAlign: 'center',
                            }}
                        >
                            <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, display: 'block' }}>
                                Gastado
                            </Typography.Text>
                            <Typography.Text strong style={{ color: '#fff', fontSize: 13 }}>
                                {formatCurrency(progress.total_spent)}
                            </Typography.Text>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                borderRadius: 8,
                                padding: 10,
                                textAlign: 'center',
                            }}
                        >
                            <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, display: 'block' }}>
                                Disponible
                            </Typography.Text>
                            <Typography.Text strong style={{ color: '#fff', fontSize: 13 }}>
                                {formatCurrency(progress.total_remaining)}
                            </Typography.Text>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                borderRadius: 8,
                                padding: 10,
                                textAlign: 'center',
                            }}
                        >
                            <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, display: 'block' }}>
                                Uso
                            </Typography.Text>
                            <Typography.Text strong style={{ color: '#fff', fontSize: 13 }}>
                                {progress.total_percentage.toFixed(1)}%
                            </Typography.Text>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Expense Lines Section */}
            {expenseLines.length > 0 && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            GASTOS
                        </Typography.Text>
                        <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                            {formatCurrency(expenseTotals.spent)} / {formatCurrency(expenseTotals.budgeted)} ({expenseTotals.percentage.toFixed(0)}%)
                        </Typography.Text>
                    </div>

                    {expenseLines.map((line) => (
                        <BudgetCategoryCard
                            key={line.id}
                            line={line}
                            formatCurrency={formatCurrency}
                            onClick={onCategoryClick ? () => onCategoryClick(line) : undefined}
                        />
                    ))}
                </>
            )}

            {/* Savings Lines Section */}
            {savingsLines.length > 0 && (
                <>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 8,
                        marginTop: expenseLines.length > 0 ? 20 : 0,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 2,
                                    backgroundColor: '#1890ff',
                                }}
                            />
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                AHORRO
                            </Typography.Text>
                        </div>
                        <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                            {formatCurrency(savingsTotals.spent)} / {formatCurrency(savingsTotals.budgeted)} ({savingsTotals.percentage.toFixed(0)}%)
                        </Typography.Text>
                    </div>

                    {savingsLines.map((line) => (
                        <BudgetCategoryCard
                            key={line.id}
                            line={line}
                            formatCurrency={formatCurrency}
                            onClick={onCategoryClick ? () => onCategoryClick(line) : undefined}
                        />
                    ))}
                </>
            )}
        </div>
    );
}
