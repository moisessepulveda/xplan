import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button, Dropdown, Typography } from 'antd';
import {
    EditOutlined,
    TableOutlined,
    DollarOutlined,
    CalculatorOutlined,
    MoreOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import {
    CreditDetail,
    CreditCardDetail,
    InstallmentItem,
    PayInstallmentForm,
    ExtraPaymentForm,
} from '@/app/components/credits';
import type { Credit, CreditInstallment, Account } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';

interface Props {
    credit: Credit;
    accounts: Account[];
}

export default function CreditsShow({ credit, accounts }: Props) {
    const { planning } = usePlanning();
    const [payingInstallment, setPayingInstallment] = useState<CreditInstallment | null>(null);
    const [showExtraPayment, setShowExtraPayment] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const handlePayInstallment = (data: { account_id: number; amount: number; date: string }) => {
        if (!payingInstallment) return;
        router.post(`/credits/${credit.id}/installments/${payingInstallment.id}/pay`, data);
    };

    const handleExtraPayment = (data: { account_id: number; amount: number; date: string; type: string; notes?: string }) => {
        router.post(`/credits/${credit.id}/extra-payment`, data);
    };

    const menuItems = [
        {
            key: 'edit',
            label: 'Editar',
            icon: <EditOutlined />,
            onClick: () => router.visit(`/credits/${credit.id}/edit`),
        },
        {
            key: 'amortization',
            label: 'Tabla de amortización',
            icon: <TableOutlined />,
            onClick: () => router.visit(`/credits/${credit.id}/amortization`),
        },
        ...(credit.is_credit_card
            ? []
            : [
                  {
                      key: 'simulate',
                      label: 'Simular prepago',
                      icon: <CalculatorOutlined />,
                      onClick: () => router.visit(`/credits/${credit.id}/simulate`),
                  },
              ]),
        {
            key: 'extra-payment',
            label: 'Pago extra',
            icon: <DollarOutlined />,
            onClick: () => setShowExtraPayment(true),
        },
        { type: 'divider' as const },
        {
            key: 'delete',
            label: 'Eliminar',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => router.delete(`/credits/${credit.id}`),
        },
    ];

    const headerRight = (
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
            <Button type="text" icon={<MoreOutlined style={{ fontSize: 20, color: '#fff' }} />} />
        </Dropdown>
    );

    // Pending installments
    const pendingInstallments = credit.installments?.filter(
        (i) => i.status !== 'paid'
    )?.slice(0, 5) || [];

    return (
        <AppLayout title={credit.name} showBack headerRight={headerRight}>
            <Head title={credit.name} />

            <div style={{ padding: 16 }}>
                {credit.is_credit_card ? (
                    <CreditCardDetail credit={credit} formatCurrency={formatCurrency} />
                ) : (
                    <CreditDetail credit={credit} formatCurrency={formatCurrency} />
                )}

                {/* Pending Installments */}
                {pendingInstallments.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                PRÓXIMAS CUOTAS
                            </Typography.Text>
                            <Button
                                type="link"
                                size="small"
                                onClick={() => router.visit(`/credits/${credit.id}/amortization`)}
                            >
                                Ver todas
                            </Button>
                        </div>
                        {pendingInstallments.map((inst) => (
                            <InstallmentItem
                                key={inst.id}
                                installment={inst}
                                formatCurrency={formatCurrency}
                                onPay={() => setPayingInstallment(inst)}
                            />
                        ))}
                    </div>
                )}

                {/* Extra Payments History */}
                {credit.extra_payments && credit.extra_payments.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                        <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                            PAGOS EXTRA
                        </Typography.Text>
                        {credit.extra_payments.map((ep) => (
                            <div
                                key={ep.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '8px 0',
                                    borderBottom: '1px solid #f5f5f5',
                                }}
                            >
                                <div>
                                    <Typography.Text style={{ fontSize: 13 }}>
                                        {ep.type === 'principal' ? 'Abono a capital' : 'Abono completo'}
                                    </Typography.Text>
                                    <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                                        {new Date(ep.date + 'T12:00:00').toLocaleDateString('es-CL')}
                                        {ep.account && ` · ${ep.account.name}`}
                                    </Typography.Text>
                                </div>
                                <Typography.Text strong style={{ color: '#52c41a' }}>
                                    {formatCurrency(ep.amount)}
                                </Typography.Text>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pay Installment Modal */}
            <PayInstallmentForm
                installment={payingInstallment}
                accounts={accounts}
                visible={!!payingInstallment}
                onClose={() => setPayingInstallment(null)}
                onSubmit={handlePayInstallment}
                formatCurrency={formatCurrency}
            />

            {/* Extra Payment Modal */}
            <ExtraPaymentForm
                maxAmount={credit.pending_amount}
                accounts={accounts}
                visible={showExtraPayment}
                onClose={() => setShowExtraPayment(false)}
                onSubmit={handleExtraPayment}
                formatCurrency={formatCurrency}
            />
        </AppLayout>
    );
}
