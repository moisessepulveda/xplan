import React from 'react';
import { Form, Input, InputNumber, DatePicker, Button, Segmented, Switch, Select, Card, Typography } from 'antd';
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    BankOutlined,
} from '@ant-design/icons';
import { Receivable, ReceivableTypeOption, Account } from '@/app/types';
import { colors } from '@/app/styles/theme';
import dayjs from 'dayjs';

interface Props {
    receivable?: Receivable;
    receivableTypes: ReceivableTypeOption[];
    accounts?: Account[];
    data: {
        type: string;
        person_name: string;
        person_contact: string;
        amount: number;
        concept: string;
        due_date: string;
        notes: string;
        create_transaction?: boolean;
        account_id?: number;
        transaction_date?: string;
    };
    errors: Partial<Record<string, string>>;
    processing: boolean;
    setData: (key: string, value: unknown) => void;
    onSubmit: () => void;
}

export function ReceivableForm({
    receivable,
    receivableTypes,
    accounts = [],
    data,
    errors,
    processing,
    setData,
    onSubmit,
}: Props) {
    const isReceivable = data.type === 'receivable';

    return (
        <Form layout="vertical" onFinish={onSubmit}>
            {/* Type selector */}
            {!receivable && (
                <Form.Item>
                    <Segmented
                        block
                        size="large"
                        value={data.type}
                        onChange={(value) => setData('type', value)}
                        options={[
                            {
                                value: 'receivable',
                                label: (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        justifyContent: 'center',
                                        padding: '4px 0',
                                        color: data.type === 'receivable' ? colors.income.main : undefined,
                                    }}>
                                        <ArrowDownOutlined />
                                        <span>Por Cobrar</span>
                                    </div>
                                ),
                            },
                            {
                                value: 'payable',
                                label: (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        justifyContent: 'center',
                                        padding: '4px 0',
                                        color: data.type === 'payable' ? colors.expense.main : undefined,
                                    }}>
                                        <ArrowUpOutlined />
                                        <span>Por Pagar</span>
                                    </div>
                                ),
                            },
                        ]}
                    />
                </Form.Item>
            )}

            {/* Person name */}
            <Form.Item
                label={isReceivable ? '¿Quién te debe?' : '¿A quién le debes?'}
                validateStatus={errors.person_name ? 'error' : ''}
                help={errors.person_name}
                required
            >
                <Input
                    size="large"
                    placeholder="Ej: Juan Pérez"
                    value={data.person_name}
                    onChange={(e) => setData('person_name', e.target.value)}
                />
            </Form.Item>

            {/* Contact */}
            <Form.Item
                label="Contacto (opcional)"
                validateStatus={errors.person_contact ? 'error' : ''}
                help={errors.person_contact}
            >
                <Input
                    size="large"
                    placeholder="Teléfono, email o red social"
                    value={data.person_contact}
                    onChange={(e) => setData('person_contact', e.target.value)}
                />
            </Form.Item>

            {/* Amount */}
            {!receivable && (
                <Form.Item
                    label="Monto"
                    validateStatus={errors.amount ? 'error' : ''}
                    help={errors.amount}
                    required
                >
                    <InputNumber
                        size="large"
                        style={{ width: '100%' }}
                        value={data.amount}
                        onChange={(value) => setData('amount', value || 0)}
                        min={0}
                        formatter={(value) =>
                            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                        }
                        parser={(value) =>
                            Number(value?.replace(/\$\s?|(\.)/g, '') || 0)
                        }
                    />
                </Form.Item>
            )}

            {/* Concept */}
            <Form.Item
                label="Concepto"
                validateStatus={errors.concept ? 'error' : ''}
                help={errors.concept}
                required
            >
                <Input
                    size="large"
                    placeholder="Ej: Préstamo para emergencia"
                    value={data.concept}
                    onChange={(e) => setData('concept', e.target.value)}
                />
            </Form.Item>

            {/* Due date */}
            <Form.Item
                label="Fecha de vencimiento (opcional)"
                validateStatus={errors.due_date ? 'error' : ''}
                help={errors.due_date}
            >
                <DatePicker
                    size="large"
                    style={{ width: '100%' }}
                    value={data.due_date ? dayjs(data.due_date) : null}
                    onChange={(date) => setData('due_date', date?.format('YYYY-MM-DD') || '')}
                    placeholder="Seleccionar fecha"
                />
            </Form.Item>

            {/* Create transaction option - only for new receivables */}
            {!receivable && accounts.length > 0 && (
                <Card
                    size="small"
                    style={{
                        marginBottom: 16,
                        backgroundColor: 'var(--ant-color-fill-tertiary)',
                        borderColor: data.create_transaction ? (isReceivable ? colors.income.main : colors.expense.main) : undefined,
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: data.create_transaction ? 12 : 0 }}>
                        <div>
                            <Typography.Text strong style={{ display: 'block' }}>
                                <BankOutlined style={{ marginRight: 6 }} />
                                {isReceivable ? 'Registrar egreso' : 'Registrar ingreso'}
                            </Typography.Text>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                {isReceivable
                                    ? 'Descontar el préstamo de una cuenta'
                                    : 'Registrar el dinero recibido en una cuenta'}
                            </Typography.Text>
                        </div>
                        <Switch
                            checked={data.create_transaction}
                            onChange={(checked) => {
                                setData('create_transaction', checked);
                                if (!checked) {
                                    setData('account_id', undefined);
                                }
                            }}
                        />
                    </div>

                    {data.create_transaction && (
                        <>
                            <Form.Item
                                label="Cuenta"
                                style={{ marginBottom: 8 }}
                                required
                            >
                                <Select
                                    size="large"
                                    placeholder="Seleccionar cuenta"
                                    value={data.account_id}
                                    onChange={(value) => setData('account_id', value)}
                                    options={accounts.map((acc) => ({
                                        value: acc.id,
                                        label: acc.name,
                                    }))}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Fecha de la transacción"
                                style={{ marginBottom: 0 }}
                            >
                                <DatePicker
                                    size="large"
                                    style={{ width: '100%' }}
                                    value={data.transaction_date ? dayjs(data.transaction_date) : dayjs()}
                                    onChange={(date) => setData('transaction_date', date?.format('YYYY-MM-DD') || '')}
                                    placeholder="Hoy"
                                />
                            </Form.Item>
                        </>
                    )}
                </Card>
            )}

            {/* Notes */}
            <Form.Item label="Notas (opcional)">
                <Input.TextArea
                    placeholder="Detalles adicionales"
                    rows={2}
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
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
                    disabled={data.create_transaction && !data.account_id}
                    style={{
                        backgroundColor: isReceivable ? colors.income.main : colors.expense.main,
                        borderColor: isReceivable ? colors.income.main : colors.expense.main,
                    }}
                >
                    {receivable ? 'Guardar Cambios' : `Crear ${isReceivable ? 'Cuenta por Cobrar' : 'Cuenta por Pagar'}`}
                </Button>
            </Form.Item>
        </Form>
    );
}
