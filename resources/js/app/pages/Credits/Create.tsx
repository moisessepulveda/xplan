import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { AppLayout } from '@/app/components/common/AppLayout';
import { CreditForm } from '@/app/components/credits';
import type { CreditTypeOption, Account } from '@/app/types';

interface Props {
    creditTypes: CreditTypeOption[];
    accounts: Account[];
}

export default function CreditsCreate({ creditTypes, accounts }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: '',
        entity: '',
        account_id: undefined as number | undefined,
        original_amount: 0,
        interest_rate: 0,
        interest_rate_type: 'annual' as 'annual' | 'monthly',
        rate_type: 'fixed',
        term_months: 12,
        start_date: new Date().toISOString().split('T')[0],
        payment_day: 1,
        monthly_payment: undefined as number | undefined,
        reference_number: '',
        credit_limit: undefined as number | undefined,
        billing_day: undefined as number | undefined,
        notes: '',
    });

    const handleSubmit = () => {
        post('/credits');
    };

    return (
        <AppLayout title="Nuevo Crédito" showBack>
            <Head title="Nuevo Crédito" />

            <div style={{ padding: 16 }}>
                <CreditForm
                    data={data}
                    errors={errors}
                    processing={processing}
                    setData={(key, value) => setData(key as keyof typeof data, value as never)}
                    onSubmit={handleSubmit}
                    creditTypes={creditTypes}
                    accounts={accounts}
                />
            </div>
        </AppLayout>
    );
}
