import React from 'react';
import { Form, Input, InputNumber, Select, DatePicker, Button, Segmented } from 'antd';
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    SwapOutlined,
} from '@ant-design/icons';
import { Transaction, TransactionTypeOption, Account, Category } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';
import dayjs from 'dayjs';

interface Props {
    transaction?: Transaction;
    transactionTypes: TransactionTypeOption[];
    accounts: Account[];
    categories: Category[];
    data: {
        type: string;
        amount: number;
        account_id: number | undefined;
        destination_account_id?: number;
        category_id?: number;
        description: string;
        date: string;
        time: string;
        tags: string[];
    };
    errors: Partial<Record<string, string>>;
    processing: boolean;
    setData: (key: string, value: unknown) => void;
    onSubmit: () => void;
}

const typeIcons: Record<string, React.ReactNode> = {
    income: <ArrowUpOutlined />,
    expense: <ArrowDownOutlined />,
    transfer: <SwapOutlined />,
};

const typeColors: Record<string, string> = {
    income: colors.income.main,
    expense: colors.expense.main,
    transfer: colors.transfer.main,
};

export function TransactionForm({
    transaction,
    transactionTypes,
    accounts,
    categories,
    data,
    errors,
    processing,
    setData,
    onSubmit,
}: Props) {
    const { planning } = usePlanning();
    const isTransfer = data.type === 'transfer';

    // Flatten categories and filter by transaction type
    const filteredCategories = categories.flatMap((cat) => {
        const items = [];
        const isMatchingType =
            (data.type === 'income' && cat.type === 'income') ||
            (data.type === 'expense' && cat.type === 'expense');

        if (isMatchingType) {
            items.push(cat);
            if (cat.children) {
                items.push(...cat.children);
            }
        }
        return items;
    });

    return (
        <Form layout="vertical" onFinish={onSubmit}>
            {/* Transaction type selector */}
            {!transaction && (
                <Form.Item>
                    <Segmented
                        block
                        size="large"
                        value={data.type}
                        onChange={(value) => {
                            setData('type', value);
                            if (value === 'transfer') {
                                setData('category_id', undefined);
                            }
                        }}
                        options={transactionTypes.map((t) => ({
                            value: t.value,
                            label: (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    justifyContent: 'center',
                                    padding: '4px 0',
                                    color: data.type === t.value ? typeColors[t.value] : undefined,
                                }}>
                                    {typeIcons[t.value]}
                                    <span>{t.label}</span>
                                </div>
                            ),
                        }))}
                    />
                </Form.Item>
            )}

            {/* Amount */}
            <Form.Item
                label="Monto"
                validateStatus={errors.amount ? 'error' : ''}
                help={errors.amount}
                required
            >
                <InputNumber
                    size="large"
                    style={{ width: '100%', fontSize: 24 }}
                    value={data.amount}
                    onChange={(value) => setData('amount', value || 0)}
                    min={0}
                    formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                    }
                    parser={(value) =>
                        Number(value?.replace(/\$\s?|(\.)/g, '') || 0)
                    }
                    placeholder="0"
                />
            </Form.Item>

            {/* Account */}
            <Form.Item
                label={isTransfer ? 'Cuenta origen' : 'Cuenta'}
                validateStatus={errors.account_id ? 'error' : ''}
                help={errors.account_id}
                required
            >
                <Select
                    size="large"
                    placeholder="Seleccionar cuenta"
                    value={data.account_id}
                    onChange={(value) => setData('account_id', value)}
                    options={accounts.map((a) => ({
                        value: a.id,
                        label: a.name,
                    }))}
                />
            </Form.Item>

            {/* Destination account (transfers only) */}
            {isTransfer && (
                <Form.Item
                    label="Cuenta destino"
                    validateStatus={errors.destination_account_id ? 'error' : ''}
                    help={errors.destination_account_id}
                    required
                >
                    <Select
                        size="large"
                        placeholder="Seleccionar cuenta destino"
                        value={data.destination_account_id}
                        onChange={(value) => setData('destination_account_id', value)}
                        options={accounts
                            .filter((a) => a.id !== data.account_id)
                            .map((a) => ({
                                value: a.id,
                                label: a.name,
                            }))}
                    />
                </Form.Item>
            )}

            {/* Category (not for transfers) */}
            {!isTransfer && (
                <Form.Item
                    label="Categoría"
                    validateStatus={errors.category_id ? 'error' : ''}
                    help={errors.category_id}
                >
                    <Select
                        size="large"
                        allowClear
                        placeholder="Seleccionar categoría"
                        value={data.category_id}
                        onChange={(value) => setData('category_id', value)}
                        options={filteredCategories.map((c) => ({
                            value: c.id,
                            label: c.parent_id ? `  ${c.name}` : c.name,
                            style: c.parent_id ? { paddingLeft: 24 } : {},
                        }))}
                    />
                </Form.Item>
            )}

            {/* Date */}
            <Form.Item
                label="Fecha"
                validateStatus={errors.date ? 'error' : ''}
                help={errors.date}
                required
            >
                <DatePicker
                    size="large"
                    style={{ width: '100%' }}
                    value={data.date ? dayjs(data.date) : null}
                    onChange={(date) => setData('date', date?.format('YYYY-MM-DD') || '')}
                    placeholder="Seleccionar fecha"
                />
            </Form.Item>

            {/* Description */}
            <Form.Item
                label="Descripción (opcional)"
                validateStatus={errors.description ? 'error' : ''}
                help={errors.description}
            >
                <Input
                    size="large"
                    placeholder="Ej: Almuerzo en el centro"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                />
            </Form.Item>

            {/* Submit */}
            <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={processing}
                    style={{
                        backgroundColor: typeColors[data.type],
                        borderColor: typeColors[data.type],
                    }}
                >
                    {transaction ? 'Guardar Cambios' : `Registrar ${
                        data.type === 'income' ? 'Ingreso' :
                        data.type === 'transfer' ? 'Transferencia' : 'Gasto'
                    }`}
                </Button>
            </Form.Item>
        </Form>
    );
}
