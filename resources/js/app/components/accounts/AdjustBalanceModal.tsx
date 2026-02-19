import React, { useState } from 'react';
import { Modal, Form, InputNumber, Input, Typography } from 'antd';
import { Account } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';

interface Props {
    account: Account;
    open: boolean;
    onClose: () => void;
    onConfirm: (balance: number, reason?: string) => void;
    loading?: boolean;
}

export function AdjustBalanceModal({ account, open, onClose, onConfirm, loading }: Props) {
    const { planning } = usePlanning();
    const [balance, setBalance] = useState(account.current_balance);
    const [reason, setReason] = useState('');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: account.currency || planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const difference = balance - account.current_balance;

    const handleConfirm = () => {
        onConfirm(balance, reason || undefined);
    };

    return (
        <Modal
            title="Ajustar Saldo"
            open={open}
            onCancel={onClose}
            onOk={handleConfirm}
            okText="Ajustar"
            cancelText="Cancelar"
            confirmLoading={loading}
        >
            <div style={{ marginBottom: 24 }}>
                <Typography.Text type="secondary">
                    Cuenta: <strong>{account.name}</strong>
                </Typography.Text>
                <br />
                <Typography.Text type="secondary">
                    Saldo actual: <strong>{formatCurrency(account.current_balance)}</strong>
                </Typography.Text>
            </div>

            <Form layout="vertical">
                <Form.Item label="Nuevo Saldo" required>
                    <InputNumber
                        size="large"
                        style={{ width: '100%' }}
                        value={balance}
                        onChange={(value) => setBalance(value || 0)}
                        formatter={(value) =>
                            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                        }
                        parser={(value) =>
                            Number(value?.replace(/\$\s?|(\.)/g, '') || 0)
                        }
                    />
                </Form.Item>

                {difference !== 0 && (
                    <div style={{ marginBottom: 16 }}>
                        <Typography.Text
                            style={{
                                color: difference > 0 ? '#52c41a' : '#ff4d4f',
                            }}
                        >
                            {difference > 0 ? '+' : ''}{formatCurrency(difference)}
                        </Typography.Text>
                    </div>
                )}

                <Form.Item label="Razón del ajuste (opcional)">
                    <Input.TextArea
                        placeholder="Ej: Corrección de saldo, reconciliación..."
                        rows={2}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
