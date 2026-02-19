import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Button, Card, Typography, Segmented, Row, Col } from 'antd';
import {
    PlusOutlined,
    DollarOutlined,
    CalendarOutlined,
    BankOutlined,
} from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { CreditList, InstallmentItem } from '@/app/components/credits';
import type { Credit, CreditTypeOption, CreditStatusOption, CreditSummary, CreditInstallment } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';

interface Props {
    credits: Credit[];
    filters: {
        type?: string;
        status: string;
    };
    summary: CreditSummary;
    creditTypes: CreditTypeOption[];
    creditStatuses: CreditStatusOption[];
}

export default function CreditsIndex({ credits, filters, summary, creditTypes, creditStatuses }: Props) {
    const { planning } = usePlanning();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const handleStatusChange = (value: string) => {
        router.visit('/credits', {
            data: { status: value, type: filters.type },
            preserveState: true,
        });
    };

    return (
        <AppLayout title="Créditos" showBack>
            <Head title="Créditos" />

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
                        DEUDA TOTAL
                    </Typography.Text>
                    <Typography.Title level={3} style={{ color: '#fff', margin: '4px 0 12px' }}>
                        {formatCurrency(summary.total_debt)}
                    </Typography.Title>

                    <Row gutter={12}>
                        <Col span={8}>
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 10, textAlign: 'center' }}>
                                <BankOutlined style={{ color: '#fff', fontSize: 16 }} />
                                <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, display: 'block', marginTop: 2 }}>
                                    Créditos
                                </Typography.Text>
                                <Typography.Text strong style={{ color: '#fff', fontSize: 14 }}>
                                    {summary.active_credits_count}
                                </Typography.Text>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 10, textAlign: 'center' }}>
                                <DollarOutlined style={{ color: '#fff', fontSize: 16 }} />
                                <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, display: 'block', marginTop: 2 }}>
                                    Cuota total
                                </Typography.Text>
                                <Typography.Text strong style={{ color: '#fff', fontSize: 13 }}>
                                    {formatCurrency(summary.total_monthly_payment)}
                                </Typography.Text>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 10, textAlign: 'center' }}>
                                <CalendarOutlined style={{ color: '#fff', fontSize: 16 }} />
                                <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, display: 'block', marginTop: 2 }}>
                                    Próximas
                                </Typography.Text>
                                <Typography.Text strong style={{ color: '#fff', fontSize: 14 }}>
                                    {summary.upcoming_installments.length}
                                </Typography.Text>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Upcoming Installments */}
                {summary.upcoming_installments.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                        <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                            PRÓXIMAS CUOTAS
                        </Typography.Text>
                        {summary.upcoming_installments.map((inst: CreditInstallment & { credit?: Credit }) => (
                            <InstallmentItem
                                key={inst.id}
                                installment={inst}
                                formatCurrency={formatCurrency}
                            />
                        ))}
                    </div>
                )}

                {/* Filter Tabs */}
                <Segmented
                    block
                    size="large"
                    value={filters.status}
                    onChange={handleStatusChange}
                    options={[
                        { value: 'active', label: 'Activos' },
                        { value: 'all', label: 'Todos' },
                        { value: 'paid', label: 'Pagados' },
                    ]}
                    style={{ marginBottom: 16 }}
                />

                {/* Credits List */}
                <CreditList
                    credits={credits}
                    formatCurrency={formatCurrency}
                    onSelect={(credit) => router.visit(`/credits/${credit.id}`)}
                />

                {/* Add Button */}
                <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    block
                    size="large"
                    onClick={() => router.visit('/credits/create')}
                    style={{ marginTop: 16 }}
                >
                    Nuevo Crédito
                </Button>
            </div>
        </AppLayout>
    );
}
