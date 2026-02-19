import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Button, Card, Typography, Segmented, Row, Col, Badge } from 'antd';
import {
    PlusOutlined,
    ArrowDownOutlined,
    ArrowUpOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { ReceivableList } from '@/app/components/receivables';
import {
    Receivable,
    ReceivableTypeOption,
    ReceivableStatusOption,
    ReceivableSummary,
} from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';

interface Props {
    receivables: Receivable[];
    filters: {
        type: string;
        status?: string;
    };
    summary: ReceivableSummary;
    receivableTypes: ReceivableTypeOption[];
    receivableStatuses: ReceivableStatusOption[];
}

export default function ReceivablesIndex({
    receivables,
    filters,
    summary,
    receivableTypes,
    receivableStatuses,
}: Props) {
    const { planning } = usePlanning();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const handleTabChange = (value: string) => {
        router.visit('/receivables', {
            data: { type: value },
            preserveState: true,
        });
    };

    const handleSelectReceivable = (receivable: Receivable) => {
        router.visit(`/receivables/${receivable.id}`);
    };

    return (
        <AppLayout title="Cuentas Pendientes" showBack>
            <Head title="Cuentas Pendientes" />

            <div style={{ padding: 16 }}>
                {/* Summary Card */}
                <Card
                    style={{
                        background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                        borderRadius: 16,
                        marginBottom: 16,
                    }}
                    styles={{ body: { padding: 16 } }}
                >
                    <Typography.Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                        BALANCE NETO
                    </Typography.Text>
                    <Typography.Title level={3} style={{ color: '#fff', margin: '4px 0 12px' }}>
                        {formatCurrency(summary.net_balance)}
                    </Typography.Title>

                    <Row gutter={12}>
                        <Col span={12}>
                            <div
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: 8,
                                    padding: 10,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                }}
                            >
                                <ArrowDownOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                                <div>
                                    <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, display: 'block' }}>
                                        Por Cobrar
                                    </Typography.Text>
                                    <Typography.Text strong style={{ color: '#fff', fontSize: 13 }}>
                                        {formatCurrency(summary.total_receivable)}
                                    </Typography.Text>
                                </div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: 8,
                                    padding: 10,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                }}
                            >
                                <ArrowUpOutlined style={{ color: '#ff4d4f', fontSize: 16 }} />
                                <div>
                                    <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, display: 'block' }}>
                                        Por Pagar
                                    </Typography.Text>
                                    <Typography.Text strong style={{ color: '#fff', fontSize: 13 }}>
                                        {formatCurrency(summary.total_payable)}
                                    </Typography.Text>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {summary.overdue_count > 0 && (
                        <div
                            style={{
                                marginTop: 12,
                                backgroundColor: 'rgba(255, 77, 79, 0.2)',
                                borderRadius: 8,
                                padding: '8px 12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            <WarningOutlined style={{ color: '#ff7875' }} />
                            <Typography.Text style={{ color: '#fff', fontSize: 12 }}>
                                {summary.overdue_count} {summary.overdue_count === 1 ? 'cuenta vencida' : 'cuentas vencidas'}
                            </Typography.Text>
                        </div>
                    )}
                </Card>

                {/* Tabs: All / Receivable / Payable */}
                <Segmented
                    block
                    size="large"
                    value={filters.type}
                    onChange={handleTabChange}
                    options={[
                        { value: 'all', label: 'Todas' },
                        { value: 'receivable', label: 'Por Cobrar' },
                        { value: 'payable', label: 'Por Pagar' },
                    ]}
                    style={{ marginBottom: 16 }}
                />

                {/* List */}
                <div style={{ marginBottom: 16 }}>
                    <ReceivableList
                        receivables={receivables}
                        onSelect={handleSelectReceivable}
                        emptyText="No hay cuentas pendientes"
                    />
                </div>

                {/* Add Button */}
                <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    block
                    size="large"
                    onClick={() => router.visit('/receivables/create')}
                    style={{ marginTop: 8 }}
                >
                    Nueva Cuenta Pendiente
                </Button>
            </div>
        </AppLayout>
    );
}
