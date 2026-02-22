import React, { useState, useMemo } from 'react';
import { Form, Input, InputNumber, Select, DatePicker, Button, Segmented, Switch, Typography } from 'antd';
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    SwapOutlined,
    RightOutlined,
} from '@ant-design/icons';
import { Transaction, TransactionTypeOption, Account, Category, VirtualFund } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';
import { CategoryPicker } from '@/app/components/common/CategoryPicker';
import { getIcon } from '@/app/utils/icons';
import dayjs from 'dayjs';

interface Props {
    transaction?: Transaction;
    transactionTypes: TransactionTypeOption[];
    accounts: Account[];
    categories: Category[];
    virtualFunds?: VirtualFund[];
    destinationVirtualFunds?: VirtualFund[];
    data: {
        type: string;
        amount: number;
        account_id: number | undefined;
        destination_account_id?: number;
        category_id?: number;
        virtual_fund_id?: number;
        destination_virtual_fund_id?: number;
        description: string;
        date: string;
        time: string;
        tags: string[];
        is_recurring?: boolean;
        from_recurring_id?: number;
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
    virtualFunds,
    destinationVirtualFunds,
    data,
    errors,
    processing,
    setData,
    onSubmit,
}: Props) {
    const { planning } = usePlanning();
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const isTransfer = data.type === 'transfer';

    // Find the selected account
    const selectedAccount = useMemo(() => {
        if (!data.account_id) return null;
        return accounts.find(a => a.id === data.account_id) || null;
    }, [accounts, data.account_id]);

    // Find the selected fund
    const selectedFund = useMemo(() => {
        if (!data.virtual_fund_id || !virtualFunds) return null;
        return virtualFunds.find(f => f.id === data.virtual_fund_id) || null;
    }, [virtualFunds, data.virtual_fund_id]);

    // Calculate available balance in the "Disponible" fund (account balance minus assigned funds)
    const availableInDisponible = useMemo(() => {
        if (!selectedAccount || !virtualFunds) return selectedAccount?.current_balance || 0;
        const assignedToFunds = virtualFunds
            .filter(f => !f.is_default && typeof f.id === 'number')
            .reduce((sum, f) => sum + f.current_amount, 0);
        return selectedAccount.current_balance - assignedToFunds;
    }, [selectedAccount, virtualFunds]);

    // Format currency helper
    const formatCurrency = (amount: number) => {
        return `$ ${Math.abs(amount).toLocaleString('es-CL')}`;
    };

    // Validation: check if amount exceeds available balance
    const exceedsAccountBalance = useMemo(() => {
        if (data.type === 'income') return false;
        if (!selectedAccount) return false;
        return data.amount > selectedAccount.current_balance;
    }, [data.type, data.amount, selectedAccount]);

    const exceedsFundBalance = useMemo(() => {
        if (data.type === 'income') return false;
        if (!data.virtual_fund_id) {
            // Using "Disponible"
            return data.amount > availableInDisponible;
        }
        if (!selectedFund) return false;
        return data.amount > selectedFund.current_amount;
    }, [data.type, data.amount, data.virtual_fund_id, selectedFund, availableInDisponible]);

    // Find the selected category
    const selectedCategory = useMemo(() => {
        if (!data.category_id) return null;
        for (const cat of categories) {
            if (cat.id === data.category_id) return cat;
            if (cat.children) {
                const child = cat.children.find((c) => c.id === data.category_id);
                if (child) return child;
            }
        }
        return null;
    }, [categories, data.category_id]);

    // Get transaction type for filtering categories
    const categoryType = data.type === 'income' ? 'income' : data.type === 'expense' ? 'expense' : undefined;

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
                validateStatus={errors.account_id || exceedsAccountBalance ? 'error' : ''}
                help={errors.account_id || (exceedsAccountBalance ? 'El monto excede el saldo disponible de la cuenta' : undefined)}
                required
            >
                <Select
                    size="large"
                    placeholder="Seleccionar cuenta"
                    value={data.account_id}
                    onChange={(value) => {
                        setData('account_id', value);
                        // Clear fund selection when account changes
                        setData('virtual_fund_id', undefined);
                    }}
                    options={accounts.map((a) => ({
                        value: a.id,
                        label: a.name,
                    }))}
                />
                {selectedAccount && data.type !== 'income' && (
                    <Typography.Text
                        type="secondary"
                        style={{ fontSize: 12, marginTop: 4, display: 'block' }}
                    >
                        Saldo disponible: <span style={{
                            color: selectedAccount.current_balance >= 0 ? colors.income.main : colors.expense.main,
                            fontWeight: 500
                        }}>{formatCurrency(selectedAccount.current_balance)}</span>
                    </Typography.Text>
                )}
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
                        onChange={(value) => {
                            setData('destination_account_id', value);
                            // Clear destination fund selection when account changes
                            setData('destination_virtual_fund_id', undefined);
                        }}
                        options={accounts
                            .filter((a) => a.id !== data.account_id)
                            .map((a) => ({
                                value: a.id,
                                label: a.name,
                            }))}
                    />
                </Form.Item>
            )}

            {/* Destination Virtual Fund selector (for transfers when destination account has funds) */}
            {isTransfer && destinationVirtualFunds && destinationVirtualFunds.filter(f => !f.is_default).length > 0 && (
                <Form.Item
                    label="Fondo destino (opcional)"
                    validateStatus={errors.destination_virtual_fund_id ? 'error' : ''}
                    help={errors.destination_virtual_fund_id}
                >
                    <Select
                        size="large"
                        placeholder="Entra a Disponible"
                        value={data.destination_virtual_fund_id}
                        onChange={(value) => setData('destination_virtual_fund_id', value)}
                        allowClear
                        options={destinationVirtualFunds
                            .filter(f => !f.is_default)
                            .map((f) => ({
                                value: f.id as number,
                                label: `${f.name} (${formatCurrency(f.current_amount)})`,
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
                    <div
                        onClick={() => setShowCategoryPicker(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            border: '1px solid var(--ant-color-border)',
                            borderRadius: 8,
                            cursor: 'pointer',
                            minHeight: 40,
                            backgroundColor: 'var(--ant-color-bg-container)',
                            transition: 'border-color 0.2s',
                        }}
                    >
                        {selectedCategory ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        backgroundColor: selectedCategory.color || selectedCategory.type_color || colors.primary[500],
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontSize: 14,
                                    }}
                                >
                                    {getIcon(selectedCategory.icon)}
                                </div>
                                <span>{selectedCategory.full_name || selectedCategory.name}</span>
                            </div>
                        ) : (
                            <span style={{ color: 'var(--ant-color-text-placeholder)' }}>
                                Seleccionar categoría
                            </span>
                        )}
                        <RightOutlined style={{ color: 'var(--ant-color-text-tertiary)', fontSize: 12 }} />
                    </div>
                </Form.Item>
            )}

            {/* Category Picker */}
            <CategoryPicker
                open={showCategoryPicker}
                onClose={() => setShowCategoryPicker(false)}
                onSelect={(category) => setData('category_id', category.id)}
                categories={categories}
                selectedId={data.category_id}
                type={categoryType}
            />

            {/* Virtual Fund selector (for income/expense/transfer when account has funds) */}
            {virtualFunds && virtualFunds.filter(f => !f.is_default).length > 0 && (
                <Form.Item
                    label={isTransfer ? "Fondo de origen (opcional)" : "Fondo Virtual (opcional)"}
                    validateStatus={errors.virtual_fund_id || (data.type !== 'income' && exceedsFundBalance) ? 'error' : ''}
                    help={errors.virtual_fund_id || (data.type !== 'income' && exceedsFundBalance ? `El monto excede el saldo del fondo${data.virtual_fund_id ? '' : ' Disponible'}` : undefined)}
                >
                    <Select
                        size="large"
                        placeholder={isTransfer ? "Sale de Disponible" : "Sin asignar (va a Disponible)"}
                        value={data.virtual_fund_id}
                        onChange={(value) => setData('virtual_fund_id', value)}
                        allowClear
                        options={virtualFunds
                            .filter(f => !f.is_default)
                            .map((f) => ({
                                value: f.id as number,
                                label: `${f.name} (${formatCurrency(f.current_amount)})`,
                            }))}
                    />
                    {data.type !== 'income' && selectedAccount && (
                        <Typography.Text
                            type="secondary"
                            style={{ fontSize: 12, marginTop: 4, display: 'block' }}
                        >
                            {data.virtual_fund_id && selectedFund ? (
                                <>
                                    Saldo del fondo: <span style={{
                                        color: selectedFund.current_amount >= 0 ? colors.income.main : colors.expense.main,
                                        fontWeight: 500
                                    }}>{formatCurrency(selectedFund.current_amount)}</span>
                                </>
                            ) : (
                                <>
                                    Saldo en Disponible: <span style={{
                                        color: availableInDisponible >= 0 ? colors.income.main : colors.expense.main,
                                        fontWeight: 500
                                    }}>{formatCurrency(availableInDisponible)}</span>
                                </>
                            )}
                        </Typography.Text>
                    )}
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

            {/* Recurring switch - only for new transactions (not from recurring) */}
            {!transaction && !data.from_recurring_id && (
                <Form.Item>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <Typography.Text strong>Repetir mensualmente</Typography.Text>
                            {data.is_recurring && (
                                <Typography.Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                                    Aparecerá cada mes para su aprobación
                                </Typography.Text>
                            )}
                        </div>
                        <Switch
                            checked={data.is_recurring}
                            onChange={(checked) => setData('is_recurring', checked)}
                        />
                    </div>
                </Form.Item>
            )}

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
