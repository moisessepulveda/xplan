import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, Popconfirm, theme } from 'antd';
import { DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { VirtualFund } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';

interface Props {
    fund: VirtualFund | null;
    open: boolean;
    onClose: () => void;
    onSubmit: (data: FundUpdateData) => void;
    onDelete: () => void;
    loading?: boolean;
    currency: string;
}

export interface FundUpdateData {
    name: string;
    goal_amount?: number | null;
    icon?: string;
    color?: string;
    description?: string;
}

const colorOptions = [
    '#1677ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1',
    '#eb2f96', '#13c2c2', '#fa8c16', '#2f54eb', '#a0d911',
];

export function EditFundModal({
    fund,
    open,
    onClose,
    onSubmit,
    onDelete,
    loading,
    currency
}: Props) {
    const { planning } = usePlanning();
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [selectedColor, setSelectedColor] = useState<string>('#1677ff');

    useEffect(() => {
        if (open && fund) {
            const color = fund.color || '#1677ff';
            form.setFieldsValue({
                name: fund.name,
                goal_amount: fund.goal_amount,
                icon: fund.icon || 'wallet',
                color: color,
                description: fund.description,
            });
            setSelectedColor(color);
        }
    }, [open, fund, form]);

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

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        form.setFieldsValue({ color });
    };

    if (!fund) return null;

    return (
        <Modal
            title="Editar Fondo Virtual"
            open={open}
            onCancel={onClose}
            footer={[
                <Popconfirm
                    key="delete"
                    title="Eliminar fondo"
                    description="El saldo volverá al fondo Disponible. ¿Continuar?"
                    onConfirm={onDelete}
                    okText="Eliminar"
                    cancelText="Cancelar"
                    okButtonProps={{ danger: true }}
                >
                    <Button danger icon={<DeleteOutlined />}>
                        Eliminar
                    </Button>
                </Popconfirm>,
                <Button key="cancel" onClick={onClose}>
                    Cancelar
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
                    Guardar
                </Button>,
            ]}
            destroyOnClose
        >
            <div style={{
                marginBottom: 16,
                padding: 12,
                backgroundColor: token.colorBgLayout,
                borderRadius: 8,
            }}>
                <div style={{ fontSize: 12, color: token.colorTextSecondary }}>Saldo actual</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: token.colorText }}>
                    {formatCurrency(fund.current_amount)}
                </div>
            </div>

            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Nombre"
                    rules={[{ required: true, message: 'El nombre es requerido' }]}
                >
                    <Input placeholder="Ej: Fondo de Emergencia" />
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
