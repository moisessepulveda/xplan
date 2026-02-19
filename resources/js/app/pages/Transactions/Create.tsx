import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Card } from 'antd';
import { AppLayout } from '@/app/components/common/AppLayout';
import { TransactionForm } from '@/app/components/transactions';
import { TransactionTypeOption, Account, Category, RecurringTransaction } from '@/app/types';

interface Props {
    transactionTypes: TransactionTypeOption[];
    accounts: Account[];
    categories: Category[];
    fromRecurring?: RecurringTransaction;
    period?: string;
}

export default function CreateTransaction({ transactionTypes, accounts, categories, fromRecurring, period }: Props) {
    // Read type from URL query params (from QuickActions)
    const { url } = usePage();
    const searchParams = new URLSearchParams(url.split('?')[1] || '');
    const urlType = searchParams.get('type');

    // Determine default values
    const defaultType = fromRecurring?.type || urlType || 'expense';
    const defaultDate = period
        ? `${period}-01`
        : new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors } = useForm({
        type: defaultType,
        amount: fromRecurring?.amount || 0,
        account_id: fromRecurring?.account_id || (accounts.length === 1 ? accounts[0].id : undefined) as number | undefined,
        destination_account_id: fromRecurring?.destination_account_id || undefined as number | undefined,
        category_id: fromRecurring?.category_id || undefined as number | undefined,
        description: fromRecurring?.description || '',
        date: defaultDate,
        time: '',
        tags: fromRecurring?.tags || [] as string[],
        is_recurring: false,
        from_recurring_id: fromRecurring?.id || undefined as number | undefined,
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
