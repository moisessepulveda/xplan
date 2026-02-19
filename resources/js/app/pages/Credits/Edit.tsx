import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { CreditForm } from '@/app/components/credits';
import type { Credit, CreditTypeOption, Account } from '@/app/types';

interface Props {
    credit: Credit;
    creditTypes: CreditTypeOption[];
    accounts: Account[];
}

export default function CreditsEdit({ credit, creditTypes, accounts }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: credit.name,
        type: credit.type,
        entity: credit.entity || '',
        account_id: credit.account_id,
        original_amount: credit.original_amount,
        interest_rate: credit.interest_rate,
        interest_rate_type: (credit.interest_rate_type || 'annual') as 'annual' | 'monthly',
        rate_type: credit.rate_type,
        term_months: credit.term_months,
        start_date: credit.start_date,
        payment_day: credit.payment_day,
        monthly_payment: credit.monthly_payment,
        reference_number: credit.reference_number || '',
        credit_limit: credit.credit_limit,
        billing_day: credit.billing_day,
        notes: credit.notes || '',
    });

    const handleSubmit = () => {
        put(`/credits/${credit.id}`);
    };

    const handleDelete = () => {
        router.delete(`/credits/${credit.id}`);
    };

    return (
        <AppLayout title="Editar Crédito" showBack>
            <Head title="Editar Crédito" />

            <div style={{ padding: 16 }}>
                <CreditForm
                    data={data}
                    errors={errors}
                    processing={processing}
                    setData={(key, value) => setData(key as keyof typeof data, value as never)}
                    onSubmit={handleSubmit}
                    creditTypes={creditTypes}
                    accounts={accounts}
                    isEdit
                />

                <Popconfirm
                    title="Eliminar crédito"
                    description="Esta acción eliminará el crédito y todas sus cuotas. ¿Continuar?"
                    onConfirm={handleDelete}
                    okText="Eliminar"
                    cancelText="Cancelar"
                    okButtonProps={{ danger: true }}
                >
                    <Button
                        danger
                        block
                        size="large"
                        icon={<DeleteOutlined />}
                        style={{ marginTop: 16 }}
                    >
                        Eliminar Crédito
                    </Button>
                </Popconfirm>
            </div>
        </AppLayout>
    );
}
