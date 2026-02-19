import React, { useState } from 'react';
import { Modal, Form, InputNumber, Select, DatePicker, Input } from 'antd';
import dayjs from 'dayjs';
import type { Account } from '@/app/types';

interface ExtraPaymentFormProps {
    maxAmount: number;
    accounts: Account[];
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: { account_id: number; amount: number; date: string; type: string; notes?: string }) => void;
    formatCurrency: (amount: number) => string;
}

export function ExtraPaymentForm({
    maxAmount,
    accounts,
    visible,
    onClose,
    onSubmit,
    formatCurrency,
}: ExtraPaymentFormProps) {
    const [accountId, setAccountId] = useState<number | undefined>();
    const [amount, setAmount] = useState<number>(0);
    const [date, setDate] = useState(dayjs());
    const [type, setType] = useState('principal');
    const [notes, setNotes] = useState('');

    const handleOk = () => {
        if (!accountId || !amount) return;
        onSubmit({
            account_id: accountId,
            amount,
            date: date.format('YYYY-MM-DD'),
            type,
            notes: notes || undefined,
        });
        onClose();
        setAmount(0);
        setNotes('');
    };

    return (
        <Modal
            title="Registrar Pago Extra"
            open={visible}
            onOk={handleOk}
            onCancel={onClose}
            okText="Registrar Pago"
            cancelText="Cancelar"
            okButtonProps={{ disabled: !accountId || !amount }}
        >
            <Form layout="vertical">
                <Form.Item label="Cuenta de pago" required>
                    <Select
                        value={accountId}
                        onChange={setAccountId}
                        options={accounts.map((a) => ({
                            value: a.id,
                            label: `${a.name} (${formatCurrency(a.current_balance)})`,
                        }))}
                        size="large"
                        placeholder="Selecciona una cuenta"
                    />
                </Form.Item>

                <Form.Item label="Monto" required>
                    <InputNumber
                        value={amount}
                        onChange={(value) => setAmount(value || 0)}
                        min={0}
                        max={maxAmount}
                        style={{ width: '100%' }}
                        size="large"
                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                        parser={(value) => Number(value?.replace(/\$\s?|(\.*)/g, '') || 0)}
                    />
                </Form.Item>

                <Form.Item label="Tipo de abono">
                    <Select
                        value={type}
                        onChange={setType}
                        options={[
                            { value: 'principal', label: 'A capital' },
                            { value: 'full', label: 'Abono completo' },
                        ]}
                        size="large"
                    />
                </Form.Item>

                <Form.Item label="Fecha">
                    <DatePicker
                        value={date}
                        onChange={(d) => d && setDate(d)}
                        style={{ width: '100%' }}
                        size="large"
                        format="DD/MM/YYYY"
                    />
                </Form.Item>

                <Form.Item label="Notas">
                    <Input.TextArea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        placeholder="Opcional..."
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
