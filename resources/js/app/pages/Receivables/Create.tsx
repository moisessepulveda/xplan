import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card } from 'antd';
import { AppLayout } from '@/app/components/common/AppLayout';
import { ReceivableForm } from '@/app/components/receivables';
import { ReceivableTypeOption } from '@/app/types';

interface Props {
    receivableTypes: ReceivableTypeOption[];
}

export default function CreateReceivable({ receivableTypes }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        type: 'receivable',
        person_name: '',
        person_contact: '',
        amount: 0,
        concept: '',
        due_date: '',
        notes: '',
    });

    const handleSubmit = () => {
        post('/receivables');
    };

    return (
        <AppLayout title="Nueva Cuenta Pendiente" showBack showBottomNav={false}>
            <Head title="Nueva Cuenta Pendiente" />

            <div style={{ padding: 16 }}>
                <Card style={{ borderRadius: 12 }}>
                    <ReceivableForm
                        receivableTypes={receivableTypes}
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
