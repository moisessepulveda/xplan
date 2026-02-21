import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Typography, theme } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { usePlanning } from '@/app/hooks/usePlanning';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: FundFormData) => void;
    loading?: boolean;
    availableBalance: number;
    currency: string;
}

export interface FundFormData {
    name: string;
    initial_amount?: number;
    goal_amount?: number;
    icon?: string;
    color?: string;
    description?: string;
}

const colorOptions = [
    '#1677ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1',
    '#eb2f96', '#13c2c2', '#fa8c16', '#2f54eb', '#a0d911',
];

const iconOptions = [
    { value: 'wallet', label: 'Billetera' },
    { value: 'bank', label: 'Banco' },
    { value: 'gift', label: 'Regalo' },
    { value: 'car', label: 'Auto' },
    { value: 'home', label: 'Casa' },
    { value: 'heart', label: 'Salud' },
    { value: 'trophy', label: 'Meta' },
    { value: 'star', label: 'Favorito' },
    { value: 'thunderbolt', label: 'Emergencia' },
    { value: 'rocket', label: 'Proyecto' },
];

export function CreateFundModal({
    open,
    onClose,
    onSubmit,
    loading,
    availableBalance,
    currency
}: Props) {
    const { planning } = usePlanning();
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [selectedColor, setSelectedColor] = useState<string>('#1677ff');

    useEffect(() => {
        if (open) {
            form.resetFields();
            form.setFieldsValue({
                color: '#1677ff',
                icon: 'wallet',
            });
            setSelectedColor('#1677ff');
        }
    }, [open, form]);

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        form.setFieldsValue({ color });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const handleSubmit = () => {
        form.validateFields().then(values => {
            onSubmit(values);
        });
    };

    return (
        <Modal
            title="Crear Fondo Virtual"
            open={open}
            onCancel={onClose}
            onOk={handleSubmit}
            okText="Crear"
            cancelText="Cancelar"
            confirmLoading={loading}
            destroyOnClose
        >
            <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                Disponible para asignar: <strong>{formatCurrency(availableBalance)}</strong>
            </Typography.Text>

            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Nombre"
                    rules={[{ required: true, message: 'El nombre es requerido' }]}
                >
                    <Input placeholder="Ej: Fondo de Emergencia" />
                </Form.Item>

                <Form.Item
                    name="initial_amount"
                    label="Monto Inicial"
                    rules={[
                        {
                            validator: (_, value) => {
                                if (value && value > availableBalance) {
                                    return Promise.reject('Supera el saldo disponible');
                                }
                                return Promise.resolve();
                            }
                        }
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="0"
                        min={0}
                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                        parser={(value) => Number(value?.replace(/\$\s?|(\.)/g, '') || 0) as 0}
                    />
                </Form.Item>

                <Form.Item name="goal_amount" label="Meta de Ahorro (opcional)">
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="0"
                        min={0}
                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                        parser={(value) => Number(value?.replace(/\$\s?|(\.)/g, '') || 0) as 0}
                    />
                </Form.Item>

                <Form.Item name="color" label="Color">
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {colorOptions.map(color => (
                            <div
                                key={color}
                                onClick={() => handleColorSelect(color)}
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 8,
                                    backgroundColor: color,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: selectedColor === color
                                        ? `2px solid ${token.colorBorder}`
                                        : '2px solid transparent',
                                    boxShadow: selectedColor === color
                                        ? `0 0 0 2px ${color}`
                                        : 'none',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {selectedColor === color && (
                                    <CheckOutlined style={{ color: '#fff', fontSize: 14 }} />
                                )}
                            </div>
                        ))}
                    </div>
                </Form.Item>

                <Form.Item name="description" label="Descripcion (opcional)">
                    <Input.TextArea rows={2} placeholder="Para que es este fondo..." />
                </Form.Item>
            </Form>
        </Modal>
    );
}
