import React from 'react';
import { Head } from '@inertiajs/react';
import { AppLayout } from '@/app/components/common/AppLayout';
import { BudgetHistoryList } from '@/app/components/budgets';
import type { BudgetHistoryItem } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';

interface Props {
    histories: BudgetHistoryItem[];
}

export default function BudgetsHistory({ histories }: Props) {
    const { planning } = usePlanning();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    return (
        <AppLayout title="Historial de Presupuestos" showBack>
            <Head title="Historial de Presupuestos" />

            <div style={{ padding: 16 }}>
                <BudgetHistoryList
                    histories={histories}
                    formatCurrency={formatCurrency}
                />
            </div>
        </AppLayout>
    );
}
