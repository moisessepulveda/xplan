import React from 'react';
import { Head } from '@inertiajs/react';
import { AppLayout } from '@/app/components/common/AppLayout';
import { DebtSummary, ExportButton } from '@/app/components/reports';
import { usePlanning } from '@/app/hooks/usePlanning';

interface DebtByType {
    type: string;
    type_label: string;
    type_color: string;
    count: number;
    total_debt: number;
    total_monthly: number;
}

interface Props {
    report: {
        credits: {
            count: number;
            total_debt: number;
            total_monthly_payment: number;
            total_interest: number;
            by_type: DebtByType[];
        };
        payables: {
            count: number;
            total_amount: number;
            overdue_count: number;
        };
        total_debt: number;
    };
}

export default function Debts({ report }: Props) {
    const { planning } = usePlanning();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    return (
        <AppLayout
            title="Resumen de Deudas"
            showBack
            headerRight={<ExportButton reportType="debts" />}
        >
            <Head title="Resumen de Deudas" />

            <div style={{ padding: 16 }}>
                <DebtSummary report={report} formatCurrency={formatCurrency} />
            </div>
        </AppLayout>
    );
}
