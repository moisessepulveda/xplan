import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Typography } from 'antd';
import { AppLayout } from '@/app/components/common/AppLayout';
import { PrepaymentSimulator } from '@/app/components/credits';
import type { Credit, PrepaymentSimulation } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';

interface Props {
    credit: Credit;
    simulation: PrepaymentSimulation | null;
    amount: number;
    strategy: string;
}

export default function CreditsSimulate({ credit, simulation, amount, strategy }: Props) {
    const { planning } = usePlanning();

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(val);
    };

    const handleSimulate = (newAmount: number, newStrategy?: string) => {
        router.visit(`/credits/${credit.id}/simulate`, {
            data: {
                amount: newAmount,
                strategy: newStrategy || strategy,
            },
            preserveState: true,
        });
    };

    return (
        <AppLayout title="Simulador de Prepago" showBack>
            <Head title="Simulador de Prepago" />

            <div style={{ padding: 16 }}>
                <Typography.Title level={5} style={{ marginBottom: 4 }}>
                    {credit.name}
                </Typography.Title>
                <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 16 }}>
                    Saldo actual: {formatCurrency(credit.pending_amount)} · {credit.pending_installments_count} cuotas restantes
                </Typography.Text>

                <PrepaymentSimulator
                    maxAmount={credit.pending_amount}
                    amount={amount}
                    strategy={strategy}
                    simulation={simulation}
                    onAmountChange={(newAmount) => handleSimulate(newAmount)}
                    onStrategyChange={(newStrategy) => handleSimulate(amount, newStrategy)}
                    formatCurrency={formatCurrency}
                />
            </div>
        </AppLayout>
    );
}
