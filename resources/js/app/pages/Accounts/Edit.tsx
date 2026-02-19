import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, Button, Popconfirm, Divider } from 'antd';
import { DeleteOutlined, InboxOutlined, UndoOutlined } from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { AccountForm } from '@/app/components/accounts';
import { Account, AccountTypeOption } from '@/app/types';

interface Props {
    account: Account;
    accountTypes: AccountTypeOption[];
}

export default function EditAccount({ account, accountTypes }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: account.name,
        type: account.type,
        currency: account.currency,
        initial_balance: account.initial_balance,
        icon: account.icon || '',
        color: account.color || '#1677ff',
        description: account.description || '',
        include_in_total: account.include_in_total,
    });

    const handleSubmit = () => {
        put(`/accounts/${account.id}`);
    };

    const handleArchive = () => {
        router.post(`/accounts/${account.id}/archive`);
    };

    const handleRestore = () => {
        router.post(`/accounts/${account.id}/restore`);
    };

    const handleDelete = () => {
        router.delete(`/accounts/${account.id}`);
    };

    return (
        <AppLayout title="Editar Cuenta" showBack showBottomNav={false}>
            <Head title="Editar Cuenta" />

            <div style={{ padding: 16 }}>
                <Card style={{ borderRadius: 12 }}>
                    <AccountForm
                        account={account}
                        accountTypes={accountTypes}
                        data={data}
                        errors={errors}
                        processing={processing}
                        setData={setData}
                        onSubmit={handleSubmit}
                    />

                    <Divider />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {account.is_archived ? (
                            <Button
                                icon={<UndoOutlined />}
                                block
                                onClick={handleRestore}
                            >
                                Restaurar Cuenta
                            </Button>
                        ) : (
                            <Button
                                icon={<InboxOutlined />}
                                block
                                onClick={handleArchive}
                            >
                                Archivar Cuenta
                            </Button>
                        )}

                        <Popconfirm
                            title="Eliminar cuenta"
                            description="¿Estás seguro de eliminar esta cuenta? Esta acción no se puede deshacer."
                            onConfirm={handleDelete}
                            okText="Eliminar"
                            cancelText="Cancelar"
                            okButtonProps={{ danger: true }}
                        >
                            <Button danger icon={<DeleteOutlined />} block>
                                Eliminar Cuenta
                            </Button>
                        </Popconfirm>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
