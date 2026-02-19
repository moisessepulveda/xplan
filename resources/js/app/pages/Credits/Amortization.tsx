import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Segmented, Typography } from 'antd';
import { AppLayout } from '@/app/components/common/AppLayout';
import { AmortizationTable, PayInstallmentForm } from '@/app/components/credits';
import type { Credit, CreditInstallment, Account } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';

interface Props {
    credit: Credit;
}

export default function CreditsAmortization({ credit }: Props) {
    const { planning } = usePlanning();
    const [filter, setFilter] = useState<string>('all');
    const [payingInstallment, setPayingInstallment] = useState<CreditInstallment | null>(null);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const installments = credit.installments || [];
    const filteredInstallments = filter === 'all'
        ? installments
        : filter === 'pending'
        ? installments.filter((i) => i.status !== 'paid')
        : installments.filter((i) => i.status === 'paid');

    const totalPrincipal = installments.reduce((sum, i) => sum + i.principal, 0);
    const totalInterest = installments.reduce((sum, i) => sum + i.interest, 0);
    const totalAmount = installments.reduce((sum, i) => sum + i.amount, 0);

    const handlePayInstallment = (data: { account_id: number; amount: number; date: string }) => {
        if (!payingInstallment) return;
        router.post(`/credits/${credit.id}/installments/${payingInstallment.id}/pay`, data);
        setPayingInstallment(null);
    };

    return (
        <AppLayout title="Tabla de Amortización" showBack>
            <Head title="Tabla de Amortización" />

            <div style={{ padding: 16 }}>
                <Typography.Title level={5} style={{ marginBottom: 4 }}>
                    {credit.name}
                </Typography.Title>
                <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 16 }}>
                    {credit.type_label} · {credit.term_months} meses · {credit.interest_rate}% anual
                </Typography.Text>

                {/* Summary row */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: 12,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 8,
                    marginBottom: 16,
                    fontSize: 12,
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <Typography.Text type="secondary" style={{ fontSize: 10, display: 'block' }}>Capital</Typography.Text>
                        <Typography.Text strong>{formatCurrency(totalPrincipal)}</Typography.Text>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <Typography.Text type="secondary" style={{ fontSize: 10, display: 'block' }}>Intereses</Typography.Text>
                        <Typography.Text strong>{formatCurrency(totalInterest)}</Typography.Text>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <Typography.Text type="secondary" style={{ fontSize: 10, display: 'block' }}>Total</Typography.Text>
                        <Typography.Text strong>{formatCurrency(totalAmount)}</Typography.Text>
                    </div>
                </div>

                <Segmented
                    block
                    value={filter}
                    onChange={setFilter}
                    options={[
                        { value: 'all', label: `Todas (${installments.length})` },
                        { value: 'pending', label: 'Pendientes' },
                        { value: 'paid', label: 'Pagadas' },
                    ]}
                    style={{ marginBottom: 16 }}
                />

                <AmortizationTable
                    installments={filteredInstallments}
                    formatCurrency={formatCurrency}
                    onPayClick={(inst) => setPayingInstallment(inst)}
                />
            </div>

            <PayInstallmentForm
                installment={payingInstallment}
                accounts={[]}
                visible={!!payingInstallment}
                onClose={() => setPayingInstallment(null)}
                onSubmit={handlePayInstallment}
                formatCurrency={formatCurrency}
            />
        </AppLayout>
    );
}
