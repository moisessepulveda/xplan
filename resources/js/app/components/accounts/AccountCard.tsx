import React from 'react';
import { Card, Typography, Tag } from 'antd';
import {
    BankOutlined,
    WalletOutlined,
    CreditCardOutlined,
    DollarOutlined,
    LineChartOutlined,
    FolderOutlined,
} from '@ant-design/icons';
import { Account } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';

interface Props {
    account: Account;
    onClick?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
    bank: <BankOutlined />,
    save: <BankOutlined />,
    wallet: <WalletOutlined />,
    'credit-card': <CreditCardOutlined />,
    'line-chart': <LineChartOutlined />,
    folder: <FolderOutlined />,
    dollar: <DollarOutlined />,
};

export function AccountCard({ account, onClick }: Props) {
    const { planning } = usePlanning();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: account.currency || planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const isNegative = account.current_balance < 0;

    return (
        <Card
            style={{
                borderRadius: 12,
                cursor: onClick ? 'pointer' : 'default',
                border: account.is_archived ? '1px dashed #d9d9d9' : undefined,
                opacity: account.is_archived ? 0.7 : 1,
            }}
            styles={{ body: { padding: 16 } }}
            onClick={onClick}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        backgroundColor: account.color || colors.primary[500],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        color: '#fff',
                    }}
                >
                    {iconMap[account.type_icon] || <WalletOutlined />}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Typography.Text strong>{account.name}</Typography.Text>
                        {account.is_archived && (
                            <Tag color="default" style={{ fontSize: 10 }}>Archivada</Tag>
                        )}
                    </div>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {account.type_label}
                    </Typography.Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <Typography.Text
                        strong
                        style={{
                            fontSize: 16,
                            color: isNegative ? colors.expense.main : undefined,
                        }}
                    >
                        {formatCurrency(account.current_balance)}
                    </Typography.Text>
                    {!account.include_in_total && (
                        <div>
                            <Typography.Text type="secondary" style={{ fontSize: 10 }}>
                                No incluida en total
                            </Typography.Text>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
