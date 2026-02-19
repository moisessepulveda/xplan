import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, Button, Popconfirm, Divider } from 'antd';
import { DeleteOutlined, StopOutlined } from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { ReceivableForm } from '@/app/components/receivables';
import { Receivable, ReceivableTypeOption } from '@/app/types';

interface Props {
    receivable: Receivable;
    receivableTypes: ReceivableTypeOption[];
}

export default function EditReceivable({ receivable, receivableTypes }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        type: receivable.type,
        person_name: receivable.person_name,
        person_contact: receivable.person_contact || '',
        amount: receivable.original_amount,
        concept: receivable.concept,
        due_date: receivable.due_date || '',
        notes: receivable.notes || '',
    });

    const handleSubmit = () => {
        put(`/receivables/${receivable.id}`);
    };

    const handleCancel = () => {
        router.post(`/receivables/${receivable.id}/cancel`);
    };

    const handleDelete = () => {
        router.delete(`/receivables/${receivable.id}`);
    };

    const isActive = receivable.status === 'pending' || receivable.status === 'partial';

    return (
        <AppLayout title="Editar Cuenta Pendiente" showBack showBottomNav={false}>
            <Head title="Editar Cuenta Pendiente" />

            <div style={{ padding: 16 }}>
                <Card style={{ borderRadius: 12 }}>
                    <ReceivableForm
                        receivable={receivable}
                        receivableTypes={receivableTypes}
                        data={data}
                        errors={errors}
                        processing={processing}
                        setData={setData}
                        onSubmit={handleSubmit}
                    />

                    <Divider />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {isActive && (
                            <Popconfirm
                                title="Cancelar cuenta pendiente"
                                description="¿Estás seguro de cancelar esta cuenta? No se revertirán los pagos ya registrados."
                                onConfirm={handleCancel}
                                okText="Cancelar cuenta"
                                cancelText="Volver"
                            >
                                <Button icon={<StopOutlined />} block>
                                    Cancelar Cuenta Pendiente
                                </Button>
                            </Popconfirm>
                        )}

                        <Popconfirm
                            title="Eliminar cuenta pendiente"
                            description="¿Estás seguro de eliminar? Esta acción no se puede deshacer."
                            onConfirm={handleDelete}
                            okText="Eliminar"
                            cancelText="Volver"
                            okButtonProps={{ danger: true }}
                        >
                            <Button danger icon={<DeleteOutlined />} block>
                                Eliminar
                            </Button>
                        </Popconfirm>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
