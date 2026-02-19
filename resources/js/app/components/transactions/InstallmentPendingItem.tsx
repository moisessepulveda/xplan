import React, { useState } from 'react';
import { List, Button, Typography, Avatar, Space, Modal, Form, Select, InputNumber, DatePicker } from 'antd';
import { DollarOutlined, CalendarOutlined, WarningOutlined } from '@ant-design/icons';
import { router } from '@inertiajs/react';
import { PendingInstallment, Account } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';
import dayjs from 'dayjs';

interface Props {
    installment: PendingInstallment;
    accounts: Account[];
    processing?: boolean;
}

export function InstallmentPendingItem({ installment, accounts, processing }: Props) {
    const { planning } = usePlanning();
    const [showPayModal, setShowPayModal] = useState(false);
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const handlePay = () => {
        form.validateFields().then((values) => {
            setSubmitting(true);
            router.post(`/installments/${installment.id}/pay`, {
                account_id: values.account_id,
                amount: values.amount,
                date: values.date.format('YYYY-MM-DD'),
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowPayModal(false);
                    form.resetFields();
                },
                onFinish: () => setSubmitting(false),
            });
        });
    };

    const openPayModal = () => {
        form.setFieldsValue({
            account_id: accounts.length === 1 ? accounts[0].id : undefined,
            amount: installment.remaining_amount,
            date: dayjs(installment.due_date),
        });
        setShowPayModal(true);
    };

    return (
        <>
            <List.Item
                style={{ padding: '12px 0' }}
                actions={[
                    <Button
                        key="pay"
                        type="primary"
                        size="small"
                        icon={<DollarOutlined />}
                        loading={processing}
                        onClick={openPayModal}
                        style={{ backgroundColor: colors.primary[500] }}
                    >
                        Pagar
                    </Button>,
                ]}
            >
                <List.Item.Meta
                    avatar={
                        <Avatar
                            size={40}
                            style={{
                                backgroundColor: installment.is_overdue ? colors.error[500] : colors.warning[500],
                            }}
                            icon={installment.is_overdue ? <WarningOutlined /> : <CalendarOutlined />}
                        />
                    }
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Typography.Text>
                                Cuota #{installment.number} - {installment.credit_name}
                            </Typography.Text>
                            {installment.is_overdue && (
                                <Typography.Text type="danger" style={{ fontSize: 11 }}>
                                    (Vencida)
                                </Typography.Text>
                            )}
                        </div>
                    }
                    description={
                        <Space size={4} wrap>
                            {installment.credit_entity && (
                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                    {installment.credit_entity}
                                </Typography.Text>
                            )}
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                •
                            </Typography.Text>
                            <Typography.Text
                                type={installment.is_overdue ? 'danger' : 'secondary'}
                                style={{ fontSize: 12 }}
                            >
                                Vence: {dayjs(installment.due_date).format('DD/MM/YYYY')}
                            </Typography.Text>
                        </Space>
                    }
                />
                <Typography.Text
                    strong
                    style={{
                        color: colors.error[500],
                        marginRight: 8,
                    }}
                >
                    -{formatCurrency(installment.remaining_amount)}
                </Typography.Text>
            </List.Item>

            <Modal
                title={`Pagar Cuota #${installment.number} - ${installment.credit_name}`}
                open={showPayModal}
                onCancel={() => setShowPayModal(false)}
                onOk={handlePay}
                okText="Registrar Pago"
                cancelText="Cancelar"
                confirmLoading={submitting}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        amount: installment.remaining_amount,
                        date: dayjs(installment.due_date),
                    }}
                >
                    <Form.Item
                        name="account_id"
                        label="Cuenta de pago"
                        rules={[{ required: true, message: 'Seleccione una cuenta' }]}
                    >
                        <Select
                            placeholder="Seleccionar cuenta"
                            options={accounts.map((a) => ({
                                value: a.id,
                                label: `${a.name} (${formatCurrency(a.current_balance)})`,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        name="amount"
                        label="Monto a pagar"
                        rules={[
                            { required: true, message: 'Ingrese el monto' },
                            { type: 'number', min: 0.01, message: 'El monto debe ser mayor a 0' },
                        ]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0.01}
                            max={installment.remaining_amount}
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                            parser={(value) => Number(value?.replace(/\$\s?|(\.)/g, '') || 0)}
                        />
                    </Form.Item>

                    <Form.Item
                        name="date"
                        label="Fecha de pago"
                        rules={[{ required: true, message: 'Seleccione la fecha' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <div style={{
                        padding: 12,
                        backgroundColor: 'var(--ant-color-fill-tertiary)',
                        borderRadius: 8,
                        marginTop: 16
                    }}>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            Monto total de la cuota: {formatCurrency(installment.amount)}
                        </Typography.Text>
                        <br />
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            Pendiente por pagar: {formatCurrency(installment.remaining_amount)}
                        </Typography.Text>
                    </div>
                </Form>
            </Modal>
        </>
    );
}
