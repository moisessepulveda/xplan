import React from 'react';
import { List, Button, Popconfirm, Typography, Avatar, Space } from 'antd';
import { CheckOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons';
import { RecurringTransaction } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';
import { getIcon } from '@/app/utils/icons';

interface Props {
    recurring: RecurringTransaction;
    processing?: boolean;
    onApply: (recurring: RecurringTransaction) => void;
    onSkip: (recurring: RecurringTransaction) => void;
    onModify: (recurring: RecurringTransaction) => void;
}

export function RecurringPendingItem({ recurring, processing, onApply, onSkip, onModify }: Props) {
    const { planning } = usePlanning();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const amountColor = recurring.type === 'income' ? colors.success[500] : colors.error[500];
    const amountPrefix = recurring.type === 'income' ? '+' : '-';

    return (
        <List.Item
            style={{ padding: '12px 0' }}
            actions={[
                <Button
                    key="apply"
                    type="primary"
                    size="small"
                    icon={<CheckOutlined />}
                    loading={processing}
                    onClick={() => onApply(recurring)}
                    style={{ backgroundColor: colors.success[500] }}
                >
                    Aplicar
                </Button>,
                <Button
                    key="modify"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => onModify(recurring)}
                >
                    Modificar
                </Button>,
                <Popconfirm
                    key="skip"
                    title="¿Ignorar este mes?"
                    description="La transacción no se registrará este mes"
                    onConfirm={() => onSkip(recurring)}
                    okText="Sí, ignorar"
                    cancelText="Cancelar"
                >
                    <Button
                        size="small"
                        icon={<CloseOutlined />}
                        loading={processing}
                    >
                        Ignorar
                    </Button>
                </Popconfirm>,
            ]}
        >
            <List.Item.Meta
                avatar={
                    <Avatar
                        size={40}
                        style={{
                            backgroundColor: recurring.category?.color || (recurring.type === 'expense' ? colors.error[500] : colors.success[500]),
                        }}
                        icon={recurring.category?.icon ? getIcon(recurring.category.icon) : null}
                    />
                }
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Typography.Text>
                            {recurring.description || 'Sin descripción'}
                        </Typography.Text>
                    </div>
                }
                description={
                    <Space size={4} wrap>
                        {recurring.account && (
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                {recurring.account.name}
                            </Typography.Text>
                        )}
                        {recurring.category && (
                            <>
                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>•</Typography.Text>
                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                    {recurring.category.name}
                                </Typography.Text>
                            </>
                        )}
                    </Space>
                }
            />
            <Typography.Text
                strong
                style={{
                    color: amountColor,
                    marginRight: 8,
                }}
            >
                {amountPrefix}{formatCurrency(recurring.amount)}
            </Typography.Text>
        </List.Item>
    );
}
