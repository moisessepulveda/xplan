import React from 'react';
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

            {/* Category Lines */}
            <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                POR CATEGORÍA
            </Typography.Text>

            {progress.lines.map((line) => (
                <BudgetCategoryCard
                    key={line.id}
                    line={line}
                    formatCurrency={formatCurrency}
                    onClick={onCategoryClick ? () => onCategoryClick(line) : undefined}
                />
            ))}
        </div>
    );
}
