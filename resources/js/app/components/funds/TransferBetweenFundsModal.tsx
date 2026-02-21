import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, InputNumber, Input, Typography } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { VirtualFund } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: TransferData) => void;
    loading?: boolean;
    funds: VirtualFund[];
    currency: string;
}

export interface TransferData {
    from_fund_id: number | 'available';
    to_fund_id: number | 'available';
    amount: number;
    description?: string;
}

export function TransferBetweenFundsModal({
    open,
    onClose,
    onSubmit,
    loading,
    funds,
    currency,
}: Props) {
    const { planning } = usePlanning();
    const [form] = Form.useForm();
    const [fromFundId, setFromFundId] = useState<number | 'available' | undefined>();

    useEffect(() => {
        if (open) {
            form.resetFields();
            setFromFundId(undefined);
        }
    }, [open, form]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const selectedFromFund = funds.find(f =>
        f.id === fromFundId || (f.is_default && fromFundId === 'available')
    );
    const maxAmount = selectedFromFund?.current_amount ?? 0;

    const handleSubmit = () => {
        form.validateFields().then(values => {
            onSubmit(values);
        });
    };

    const handleFromChange = (value: number | 'available') => {
        setFromFundId(value);
        form.setFieldsValue({ to_fund_id: undefined });
    };

    // Build options for the selects
    const fundOptions = funds.map(f => ({
        value: f.is_default ? 'available' : f.id,
        label: `${f.name} (${formatCurrency(f.current_amount)})`,
        disabled: false,
    }));

    const toFundOptions = funds
        .filter(f => {
            const fromValue = f.is_default ? 'available' : f.id;
            return fromValue !== fromFundId;
        })
        .map(f => ({
            value: f.is_default ? 'available' : f.id,
            label: f.name,
        }));

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <SwapOutlined />
                    <span>Transferir entre Fondos</span>
                </div>
            }
            open={open}
            onCancel={onClose}
            onOk={handleSubmit}
            okText="Transferir"
            cancelText="Cancelar"
            confirmLoading={loading}
            destroyOnClose
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="from_fund_id"
                    label="Desde"
                    rules={[{ required: true, message: 'Selecciona el fondo de origen' }]}
                >
                    <Select
                        placeholder="Seleccionar fondo"
                        options={fundOptions}
                        onChange={handleFromChange}
                    />
                </Form.Item>

                <Form.Item
                    name="to_fund_id"
                    label="Hacia"
                    rules={[
                        { required: true, message: 'Selecciona el fondo de destino' },
                    ]}
                >
                    <Select
                        placeholder="Seleccionar fondo"
                        options={toFundOptions}
                        disabled={!fromFundId}
                    />
                </Form.Item>

                {selectedFromFund && (
                    <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                        Disponible: {formatCurrency(maxAmount)}
                    </Typography.Text>
                )}

                <Form.Item
                    name="amount"
                    label="Monto"
                    rules={[
                        { required: true, message: 'El monto es requerido' },
                        {
                            validator: (_, value) => {
                                if (value && value > maxAmount) {
                                    return Promise.reject('Supera el saldo del fondo');
                                }
                                if (value && value <= 0) {
                                    return Promise.reject('El monto debe ser mayor a 0');
                                }
                                return Promise.resolve();
                            }
                        }
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                        parser={(value) => Number(value?.replace(/\$\s?|(\.)/g, '') || 0) as 0}
                    />
                </Form.Item>

                <Form.Item name="description" label="Descripcion (opcional)">
                    <Input placeholder="Razon de la transferencia..." />
                </Form.Item>
            </Form>
        </Modal>
    );
}
