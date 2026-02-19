import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card } from 'antd';
import { AppLayout } from '@/app/components/common/AppLayout';
import { AccountForm } from '@/app/components/accounts';
import { AccountTypeOption } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';

interface Props {
    accountTypes: AccountTypeOption[];
}

export default function CreateAccount({ accountTypes }: Props) {
    const { planning } = usePlanning();

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'checking',
        currency: planning?.currency || 'CLP',
        initial_balance: 0,
        icon: '',
        color: '#1677ff',
        description: '',
        include_in_total: true,
    });

    const handleSubmit = () => {
        post('/accounts');
    };

    return (
        <AppLayout title="Nueva Cuenta" showBack showBottomNav={false}>
            <Head title="Nueva Cuenta" />

            <div style={{ padding: 16 }}>
                <Card style={{ borderRadius: 12 }}>
                    <AccountForm
                        accountTypes={accountTypes}
                        data={data}
                        errors={errors}
                        processing={processing}
                        setData={setData}
                        onSubmit={handleSubmit}
                    />
                </Card>
            </div>
        </AppLayout>
    );
}
