import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, Typography, Row, Col, Progress, Empty, Button } from 'antd';
import {
    WalletOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    CreditCardOutlined,
} from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { usePlanning } from '@/app/hooks/usePlanning';
import { useTheme } from '@/app/contexts/ThemeContext';
import { colors } from '@/app/styles/theme';

interface DashboardStats {
    total_balance: number;
    month_income: number;
    month_expense: number;
    budget_used: number;
}

interface Props {
    stats: DashboardStats;
}

export default function Dashboard({ stats }: Props) {
    const { planning } = usePlanning();
    const { isDark } = useTheme();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    return (
        <AppLayout>
            <Head title="Inicio" />

            <div style={{ padding: 16 }}>
                {/* Balance Card */}
                <Card
                    style={{
                        background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                        borderRadius: 16,
                        marginBottom: 16,
                    }}
                    styles={{ body: { padding: 20 } }}
                >
                    <Typography.Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                        BALANCE TOTAL
                    </Typography.Text>
                    <Typography.Title
                        level={2}
                        style={{ color: '#fff', margin: '8px 0 16px' }}
                    >
                        {formatCurrency(stats.total_balance)}
                    </Typography.Title>

                    <Row gutter={16}>
                        <Col span={12}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <CreditCardOutlined style={{ color: '#fff', fontSize: 16 }} />
                                </div>
                                <div>
                                    <Typography.Text
                                        style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, display: 'block' }}
                                    >
                                        Deudas
                                    </Typography.Text>
                                    <Typography.Text style={{ color: '#fff', fontWeight: 600 }}>
                                        {formatCurrency(0)}
                                    </Typography.Text>
                                </div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <WalletOutlined style={{ color: '#fff', fontSize: 16 }} />
                                </div>
                                <div>
                                    <Typography.Text
                                        style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, display: 'block' }}
                                    >
                                        Por cobrar
                                    </Typography.Text>
                                    <Typography.Text style={{ color: '#fff', fontWeight: 600 }}>
                                        {formatCurrency(0)}
                                    </Typography.Text>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Month Summary */}
                <Row gutter={12} style={{ marginBottom: 16 }}>
                    <Col span={12}>
                        <Card
                            style={{ borderRadius: 12 }}
                            styles={{ body: { padding: 16 } }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 10,
                                        backgroundColor: colors.income.light,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <ArrowUpOutlined style={{ color: colors.income.main, fontSize: 18 }} />
                                </div>
                                <div>
                                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                        Ingresos
                                    </Typography.Text>
                                    <Typography.Text
                                        strong
                                        style={{ display: 'block', color: colors.income.main }}
                                    >
                                        {formatCurrency(stats.month_income)}
                                    </Typography.Text>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card
                            style={{ borderRadius: 12 }}
                            styles={{ body: { padding: 16 } }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 10,
                                        backgroundColor: colors.expense.light,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <ArrowDownOutlined style={{ color: colors.expense.main, fontSize: 18 }} />
                                </div>
                                <div>
                                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                        Gastos
                                    </Typography.Text>
                                    <Typography.Text
                                        strong
                                        style={{ display: 'block', color: colors.expense.main }}
                                    >
                                        {formatCurrency(stats.month_expense)}
                                    </Typography.Text>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Budget Progress */}
                <Card
                    title="Presupuesto del mes"
                    style={{ borderRadius: 12, marginBottom: 16 }}
                    styles={{ body: { padding: 16 } }}
                >
                    {stats.budget_used > 0 ? (
                        <>
                            <Progress
                                percent={stats.budget_used}
                                strokeColor={
                                    stats.budget_used > 90
                                        ? colors.error.main
                                        : stats.budget_used > 70
                                        ? colors.warning.main
                                        : colors.success.main
                                }
                            />
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                {formatCurrency(0)} de {formatCurrency(0)}
                            </Typography.Text>
                        </>
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Sin presupuesto configurado"
                        >
                            <Button type="primary" size="small">
                                Configurar
                            </Button>
                        </Empty>
                    )}
                </Card>

                {/* Upcoming Payments */}
                <Card
                    title="Próximos vencimientos"
                    style={{ borderRadius: 12 }}
                    styles={{ body: { padding: 16 } }}
                >
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Sin vencimientos próximos"
                    />
                </Card>
            </div>
        </AppLayout>
    );
}
