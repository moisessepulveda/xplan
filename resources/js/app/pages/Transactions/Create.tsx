import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Card } from 'antd';
import { AppLayout } from '@/app/components/common/AppLayout';
import { TransactionForm } from '@/app/components/transactions';
import { TransactionTypeOption, Account, Category } from '@/app/types';

interface Props {
    transactionTypes: TransactionTypeOption[];
    accounts: Account[];
    categories: Category[];
}

export default function CreateTransaction({ transactionTypes, accounts, categories }: Props) {
    // Read type from URL query params (from QuickActions)
    const { url } = usePage();
    const searchParams = new URLSearchParams(url.split('?')[1] || '');
    const defaultType = searchParams.get('type') || 'expense';

    const { data, setData, post, processing, errors } = useForm({
        type: defaultType,
        amount: 0,
        account_id: accounts.length === 1 ? accounts[0].id : undefined as number | undefined,
        destination_account_id: undefined as number | undefined,
        category_id: undefined as number | undefined,
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        tags: [] as string[],
    });

    const handleSubmit = () => {
        post('/transactions');
    };

    const typeLabels: Record<string, string> = {
        income: 'Ingreso',
        expense: 'Gasto',
        transfer: 'Transferencia',
    };

    return (
        <AppLayout title={`Nuevo ${typeLabels[data.type] || 'Transacción'}`} showBack showBottomNav={false}>
            <Head title={`Nuevo ${typeLabels[data.type] || 'Transacción'}`} />

            <div style={{ padding: 16 }}>
                <Card style={{ borderRadius: 12 }}>
                    <TransactionForm
                        transactionTypes={transactionTypes}
                        accounts={accounts}
                        categories={categories}
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
