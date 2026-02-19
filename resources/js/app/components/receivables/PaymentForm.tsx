import React from 'react';
import { Form, InputNumber, DatePicker, Select, Input, Button, Modal } from 'antd';
import { Account } from '@/app/types';
import { colors } from '@/app/styles/theme';
import dayjs from 'dayjs';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: PaymentFormData) => void;
    loading: boolean;
    maxAmount: number;
    accounts: Account[];
    isReceivable: boolean;
}

export interface PaymentFormData {
    amount: number;
    date: string;
    account_id: number | undefined;
    notes: string;
}

export function PaymentForm({
    open,
    onClose,
    onSubmit,
    loading,
    maxAmount,
    accounts,
    isReceivable,
}: Props) {
    const [data, setData] = React.useState<PaymentFormData>({
        amount: maxAmount,
        date: new Date().toISOString().split('T')[0],
        account_id: accounts.length === 1 ? accounts[0].id : undefined,
        notes: '',
    });

    React.useEffect(() => {
        setData((prev) => ({ ...prev, amount: maxAmount }));
    }, [maxAmount]);

    const handleSubmit = () => {
        onSubmit(data);
    };

    const typeColor = isReceivable ? colors.income.main : colors.expense.main;

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            title={isReceivable ? 'Registrar Cobro' : 'Registrar Pago'}
            centered
            styles={{
                content: { borderRadius: 16 },
            }}
        >
            <Form layout="vertical" onFinish={handleSubmit} style={{ marginTop: 16 }}>
                <Form.Item label="Monto" required>
                    <InputNumber
                        size="large"
                        style={{ width: '100%' }}
                        value={data.amount}
                        onChange={(value) => setData((prev) => ({ ...prev, amount: value || 0 }))}
                        min={0.01}
                        max={maxAmount}
                        formatter={(value) =>
                            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                        }
                        parser={(value) =>
                            Number(value?.replace(/\$\s?|(\.)/g, '') || 0)
                        }
                    />
                </Form.Item>

                <Form.Item label="Fecha" required>
                    <DatePicker
                        size="large"
                        style={{ width: '100%' }}
                        value={data.date ? dayjs(data.date) : null}
                        onChange={(date) =>
                            setData((prev) => ({ ...prev, date: date?.format('YYYY-MM-DD') || '' }))
                        }
                    />
                </Form.Item>

                <Form.Item label="Cuenta" required>
                    <Select
                        size="large"
                        placeholder="Seleccionar cuenta"
                        value={data.account_id}
                        onChange={(value) => setData((prev) => ({ ...prev, account_id: value }))}
                        options={accounts.map((a) => ({
                            value: a.id,
                            label: a.name,
                        }))}
                    />
                </Form.Item>

                <Form.Item label="Notas (opcional)">
                    <Input.TextArea
                        placeholder="Notas del pago"
                        rows={2}
                        value={data.notes}
                        onChange={(e) => setData((prev) => ({ ...prev, notes: e.target.value }))}
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, marginTop: 16 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={loading}
                        style={{ backgroundColor: typeColor, borderColor: typeColor }}
                    >
                        {isReceivable ? 'Registrar Cobro' : 'Registrar Pago'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}
