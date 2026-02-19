import React, { useState } from 'react';
import { Modal, Form, InputNumber, Select, DatePicker, Typography } from 'antd';
import dayjs from 'dayjs';
import type { CreditInstallment, Account } from '@/app/types';

interface PayInstallmentFormProps {
    installment: CreditInstallment | null;
    accounts: Account[];
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: { account_id: number; amount: number; date: string }) => void;
    formatCurrency: (amount: number) => string;
}

export function PayInstallmentForm({
    installment,
    accounts,
    visible,
    onClose,
    onSubmit,
    formatCurrency,
}: PayInstallmentFormProps) {
    const [accountId, setAccountId] = useState<number | undefined>();
    const [amount, setAmount] = useState<number>(0);
    const [date, setDate] = useState(dayjs());

    React.useEffect(() => {
        if (installment) {
            setAmount(installment.remaining_amount || installment.amount);
            setDate(dayjs());
        }
    }, [installment]);

    const handleOk = () => {
        if (!accountId || !amount) return;
        onSubmit({
            account_id: accountId,
            amount,
            date: date.format('YYYY-MM-DD'),
        });
        onClose();
    };

    return (
        <Modal
            title={`Pagar Cuota #${installment?.number || ''}`}
            open={visible}
            onOk={handleOk}
            onCancel={onClose}
            okText="Registrar Pago"
            cancelText="Cancelar"
            okButtonProps={{ disabled: !accountId || !amount }}
        >
            {installment && (
                <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography.Text type="secondary">Monto de la cuota</Typography.Text>
                        <Typography.Text strong>{formatCurrency(installment.amount)}</Typography.Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography.Text type="secondary">Capital</Typography.Text>
                        <Typography.Text>{formatCurrency(installment.principal)}</Typography.Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography.Text type="secondary">Interés</Typography.Text>
                        <Typography.Text>{formatCurrency(installment.interest)}</Typography.Text>
                    </div>
                </div>
            )}

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

                <Form.Item label="Monto a pagar" required>
                    <InputNumber
                        value={amount}
                        onChange={(value) => setAmount(value || 0)}
                        min={0}
                        max={installment?.remaining_amount || installment?.amount || undefined}
                        style={{ width: '100%' }}
                        size="large"
                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                        parser={(value) => Number(value?.replace(/\$\s?|(\.*)/g, '') || 0)}
                    />
                </Form.Item>

                <Form.Item label="Fecha de pago">
                    <DatePicker
                        value={date}
                        onChange={(d) => d && setDate(d)}
                        style={{ width: '100%' }}
                        size="large"
                        format="DD/MM/YYYY"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
