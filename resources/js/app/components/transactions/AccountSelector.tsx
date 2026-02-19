import React from 'react';
import { Modal, List, Typography, Empty } from 'antd';
import {
    BankOutlined,
    WalletOutlined,
    CreditCardOutlined,
    LineChartOutlined,
    FolderOutlined,
} from '@ant-design/icons';
import { Account } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';

interface Props {
    open: boolean;
    onClose: () => void;
    onSelect: (accountId: number) => void;
    accounts: Account[];
    selectedId?: number;
    excludeId?: number;
}

const iconMap: Record<string, React.ReactNode> = {
    bank: <BankOutlined />,
    save: <BankOutlined />,
    wallet: <WalletOutlined />,
    'credit-card': <CreditCardOutlined />,
    'line-chart': <LineChartOutlined />,
    folder: <FolderOutlined />,
};

export function AccountSelector({
    open,
    onClose,
    onSelect,
    accounts,
    selectedId,
    excludeId,
}: Props) {
    const { planning } = usePlanning();

    const filtered = excludeId
        ? accounts.filter((a) => a.id !== excludeId)
        : accounts;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const handleSelect = (account: Account) => {
        onSelect(account.id);
        onClose();
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            title="Seleccionar Cuenta"
            centered
            styles={{
                body: { padding: 0, maxHeight: 400, overflowY: 'auto' },
                content: { borderRadius: 16 },
            }}
        >
            {filtered.length === 0 ? (
                <div style={{ padding: 24 }}>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Sin cuentas disponibles"
                    />
                </div>
            ) : (
                <List
                    dataSource={filtered}
                    renderItem={(account) => (
                        <List.Item
                            key={account.id}
                            onClick={() => handleSelect(account)}
                            style={{
                                padding: '12px 24px',
                                cursor: 'pointer',
                                backgroundColor: selectedId === account.id ? 'var(--ant-color-primary-bg)' : undefined,
                            }}
                        >
                            <List.Item.Meta
                                avatar={
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 10,
                                            backgroundColor: account.color || colors.primary[500],
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff',
                                            fontSize: 18,
                                        }}
                                    >
                                        {iconMap[account.type_icon] || <WalletOutlined />}
                                    </div>
                                }
                                title={account.name}
                                description={formatCurrency(account.current_balance)}
                            />
                        </List.Item>
                    )}
                />
            )}
        </Modal>
    );
}
