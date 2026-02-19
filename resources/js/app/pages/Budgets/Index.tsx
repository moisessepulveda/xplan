import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Button, Typography, Empty, Dropdown } from 'antd';
import {
    SettingOutlined,
    HistoryOutlined,
    CopyOutlined,
    MoreOutlined,
    LockOutlined,
    LeftOutlined,
    RightOutlined,
} from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { BudgetDashboard } from '@/app/components/budgets';
import type { Budget, BudgetProgress, BudgetProgressLine } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';

interface Props {
    budget: Budget | null;
    progress: BudgetProgress | null;
    alertLines: BudgetProgressLine[];
    period: string;
}

function formatPeriodLabel(period: string): string {
    const [year, month] = period.split('-');
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ];
    return `${months[parseInt(month) - 1]} ${year}`;
}

export default function BudgetsIndex({ budget, progress, alertLines, period }: Props) {
    const { planning } = usePlanning();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const navigatePeriod = (direction: 'prev' | 'next') => {
        const [year, month] = period.split('-').map(Number);
        let newYear = year;
        let newMonth = month + (direction === 'next' ? 1 : -1);

        if (newMonth > 12) {
            newMonth = 1;
            newYear++;
        } else if (newMonth < 1) {
            newMonth = 12;
            newYear--;
        }

        const newPeriod = `${newYear}-${String(newMonth).padStart(2, '0')}`;
        router.visit('/budgets', {
            data: { period: newPeriod },
            preserveState: true,
        });
    };

    const handleCategoryClick = (line: BudgetProgressLine) => {
        if (budget) {
            router.visit(`/budgets/${budget.id}/category/${line.category_id}?period=${period}`);
        }
    };

    const menuItems = [
        {
            key: 'configure',
            label: 'Configurar',
            icon: <SettingOutlined />,
            onClick: () => router.visit('/budgets/configure'),
        },
        {
            key: 'history',
            label: 'Historial',
            icon: <HistoryOutlined />,
            onClick: () => router.visit('/budgets/history'),
        },
        ...(budget
            ? [
                  {
                      key: 'copy',
                      label: 'Copiar presupuesto',
                      icon: <CopyOutlined />,
                      onClick: () => router.post(`/budgets/${budget.id}/copy`),
                  },
                  {
                      key: 'close',
                      label: 'Cerrar período',
                      icon: <LockOutlined />,
                      onClick: () => router.post(`/budgets/${budget.id}/close-period`, { period }),
                  },
              ]
            : []),
    ];

    const headerRight = (
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
            <Button type="text" icon={<MoreOutlined style={{ fontSize: 20, color: '#fff' }} />} />
        </Dropdown>
    );

    return (
        <AppLayout title="Presupuesto" headerRight={headerRight}>
            <Head title="Presupuesto" />

            <div style={{ padding: 16 }}>
                {/* Period Navigator */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 16,
                    }}
                >
                    <Button
                        type="text"
                        icon={<LeftOutlined />}
                        onClick={() => navigatePeriod('prev')}
                    />
                    <Typography.Text strong style={{ fontSize: 16 }}>
                        {formatPeriodLabel(period)}
                    </Typography.Text>
                    <Button
                        type="text"
                        icon={<RightOutlined />}
                        onClick={() => navigatePeriod('next')}
                    />
                </div>

                {/* Alert Lines */}
                {alertLines.length > 0 && (
                    <div
                        style={{
                            backgroundColor: 'var(--ant-color-warning-bg)',
                            borderRadius: 12,
                            padding: 12,
                            marginBottom: 16,
                            border: '1px solid var(--ant-color-warning-border)',
                        }}
                    >
                        <Typography.Text strong style={{ fontSize: 13, display: 'block', marginBottom: 4, color: 'var(--ant-color-warning)' }}>
                            Alertas de presupuesto
                        </Typography.Text>
                        {alertLines.map((line) => (
                            <Typography.Text
                                key={line.id}
                                style={{ fontSize: 12, display: 'block', color: 'var(--ant-color-text-secondary)' }}
                            >
                                {line.category?.name}: {line.percentage.toFixed(1)}% utilizado
                            </Typography.Text>
                        ))}
                    </div>
                )}

                {budget && progress ? (
                    <BudgetDashboard
                        progress={progress}
                        formatCurrency={formatCurrency}
                        onCategoryClick={handleCategoryClick}
                    />
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <Empty
                            description="No tienes un presupuesto activo"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                        <Button
                            type="primary"
                            size="large"
                            icon={<SettingOutlined />}
                            onClick={() => router.visit('/budgets/configure')}
                            style={{ marginTop: 16 }}
                        >
                            Configurar Presupuesto
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
