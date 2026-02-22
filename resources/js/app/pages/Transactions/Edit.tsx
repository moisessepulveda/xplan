import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, Button, Popconfirm, Divider } from 'antd';
import { DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { TransactionForm } from '@/app/components/transactions';
import { Transaction, TransactionTypeOption, Account, Category, VirtualFund } from '@/app/types';

interface Props {
    transaction: Transaction;
    transactionTypes: TransactionTypeOption[];
    accounts: Account[];
    categories: Category[];
    virtualFunds: VirtualFund[];
}

export default function EditTransaction({
    transaction,
    transactionTypes,
    accounts,
    categories,
    virtualFunds,
}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        type: transaction.type,
        amount: transaction.amount,
        account_id: transaction.account_id,
        destination_account_id: transaction.destination_account_id,
        category_id: transaction.category_id,
        virtual_fund_id: transaction.virtual_fund_id,
        destination_virtual_fund_id: transaction.destination_virtual_fund_id,
        description: transaction.description || '',
        date: transaction.date,
        time: transaction.time || '',
        tags: transaction.tags || [],
    });

    // Filter virtual funds by selected account (source)
    const accountFunds = virtualFunds.filter(f => f.account_id === data.account_id);

    // Filter virtual funds by destination account
    const destinationAccountFunds = virtualFunds.filter(f => f.account_id === data.destination_account_id);

    const handleSubmit = () => {
        put(`/transactions/${transaction.id}`);
    };

    const handleDelete = () => {
        router.delete(`/transactions/${transaction.id}`);
    };

    const handleDuplicate = () => {
        router.post(`/transactions/${transaction.id}/duplicate`);
    };

    return (
        <AppLayout title="Editar Transacción" showBack showBottomNav={false}>
            <Head title="Editar Transacción" />

            <div style={{ padding: 16 }}>
                <Card style={{ borderRadius: 12 }}>
                    <TransactionForm
                        transaction={transaction}
                        transactionTypes={transactionTypes}
                        accounts={accounts}
                        categories={categories}
                        virtualFunds={accountFunds}
                        destinationVirtualFunds={destinationAccountFunds}
                        data={data}
                        errors={errors}
                        processing={processing}
                        setData={setData}
                        onSubmit={handleSubmit}
                    />

                    <Divider />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <Button
                            icon={<CopyOutlined />}
                            block
                            onClick={handleDuplicate}
                        >
                            Duplicar Transacción
                        </Button>

                        <Popconfirm
                            title="Eliminar transacción"
                            description="¿Estás seguro de eliminar esta transacción? El saldo de la cuenta se ajustará automáticamente."
                            onConfirm={handleDelete}
                            okText="Eliminar"
                            cancelText="Cancelar"
                            okButtonProps={{ danger: true }}
                        >
                            <Button danger icon={<DeleteOutlined />} block>
                                Eliminar Transacción
                            </Button>
                        </Popconfirm>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
