import React from 'react';
import { Form, Input, Select, InputNumber, Switch, Button } from 'antd';
import { Account, AccountTypeOption } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';

interface Props {
    account?: Account;
    accountTypes: AccountTypeOption[];
    data: {
        name: string;
        type: string;
        currency: string;
        initial_balance: number;
        icon?: string;
        color?: string;
        description?: string;
        include_in_total: boolean;
    };
    errors: Partial<Record<string, string>>;
    processing: boolean;
    setData: (key: string, value: unknown) => void;
    onSubmit: () => void;
}

const colorOptions = [
    '#1677ff', '#52c41a', '#eb2f96', '#722ed1', '#fa8c16',
    '#13c2c2', '#f5222d', '#faad14', '#2f54eb', '#a0d911',
];

export function AccountForm({
    account,
    accountTypes,
    data,
    errors,
    processing,
    setData,
    onSubmit,
}: Props) {
    const { planning } = usePlanning();

    return (
        <Form layout="vertical" onFinish={onSubmit}>
            <Form.Item
                label="Nombre"
                validateStatus={errors.name ? 'error' : ''}
                help={errors.name}
                required
            >
                <Input
                    placeholder="Ej: Cuenta Corriente BCI"
                    size="large"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                />
            </Form.Item>

            <Form.Item
                label="Tipo de Cuenta"
                validateStatus={errors.type ? 'error' : ''}
                help={errors.type}
                required
            >
                <Select
                    size="large"
                    value={data.type}
                    onChange={(value) => setData('type', value)}
                    options={accountTypes.map((type) => ({
                        value: type.value,
                        label: type.label,
                    }))}
                />
            </Form.Item>

            <Form.Item label="Color">
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {colorOptions.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => setData('color', color)}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 8,
                                backgroundColor: color,
                                border: data.color === color
                                    ? '3px solid var(--ant-color-text)'
                                    : '3px solid transparent',
                                cursor: 'pointer',
                            }}
                        />
                    ))}
                </div>
            </Form.Item>

            {!account && (
                <Form.Item
                    label="Saldo Inicial"
                    validateStatus={errors.initial_balance ? 'error' : ''}
                    help={errors.initial_balance}
                    extra="El saldo actual de la cuenta al momento de crearla"
                >
                    <InputNumber
                        size="large"
                        style={{ width: '100%' }}
                        value={data.initial_balance}
                        onChange={(value) => setData('initial_balance', value || 0)}
                        formatter={(value) =>
                            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                        }
                        parser={(value) =>
                            Number(value?.replace(/\$\s?|(\.)/g, '') || 0)
                        }
                    />
                </Form.Item>
            )}

            <Form.Item label="Descripción (opcional)">
                <Input.TextArea
                    placeholder="Notas adicionales sobre esta cuenta"
                    rows={2}
                    value={data.description || ''}
                    onChange={(e) => setData('description', e.target.value)}
                />
            </Form.Item>

            <Form.Item>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontWeight: 500 }}>Incluir en balance total</div>
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                            Si está activo, el saldo se sumará al balance general
                        </div>
                    </div>
                    <Switch
                        checked={data.include_in_total}
                        onChange={(checked) => setData('include_in_total', checked)}
                    />
                </div>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={processing}
                >
                    {account ? 'Guardar Cambios' : 'Crear Cuenta'}
                </Button>
            </Form.Item>
        </Form>
    );
}
