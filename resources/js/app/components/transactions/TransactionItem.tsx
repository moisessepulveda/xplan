import React from 'react';
import { Card, Typography, Tag } from 'antd';
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    SwapOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { Transaction } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';
import { getIcon } from '@/app/utils/icons';

interface Props {
    transaction: Transaction;
    onClick?: () => void;
}

const typeIconMap: Record<string, React.ReactNode> = {
    'arrow-up': <ArrowUpOutlined />,
    'arrow-down': <ArrowDownOutlined />,
    swap: <SwapOutlined />,
};

export function TransactionItem({ transaction, onClick }: Props) {
    const { planning } = usePlanning();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('es-CL', {
            day: '2-digit',
            month: 'short',
        });
    };

    const isIncome = transaction.type === 'income';
    const isTransfer = transaction.type === 'transfer';

    const amountColor = isIncome
        ? colors.income.main
        : isTransfer
        ? colors.transfer.main
        : colors.expense.main;

    const amountPrefix = isIncome ? '+' : isTransfer ? '' : '-';

    return (
        <Card
            style={{
                borderRadius: 12,
                cursor: onClick ? 'pointer' : 'default',
            }}
            styles={{ body: { padding: 12 } }}
            onClick={onClick}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Type icon */}
                <div
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: transaction.category?.color || `${transaction.type_color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        color: transaction.category?.color ? '#fff' : transaction.type_color,
                    }}
                >
                    {transaction.category?.icon
                        ? getIcon(transaction.category.icon)
                        : typeIconMap[transaction.type_icon] || <ArrowDownOutlined />
                    }
                </div>

                {/* Description & category */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Typography.Text strong ellipsis style={{ maxWidth: 160 }}>
                            {transaction.description || transaction.type_label}
                        </Typography.Text>
                        {transaction.is_recurring && (
                            <SyncOutlined style={{ fontSize: 12, color: colors.transfer.main }} />
                        )}
                    </div>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {transaction.category?.name || transaction.type_label}
                        {transaction.account && ` · ${transaction.account.name}`}
                        {planning && (planning.members_count ?? 0) > 1 && transaction.creator && (
                            <> · {transaction.creator.name.split(' ')[0]}</>
                        )}
                    </Typography.Text>
                </div>

                {/* Amount & date */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <Typography.Text
                        strong
                        style={{
                            color: amountColor,
                            fontSize: 15,
                            display: 'block',
                        }}
                    >
                        {amountPrefix}{formatCurrency(transaction.amount)}
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                        {formatDate(transaction.date)}
                    </Typography.Text>
                </div>
            </div>
        </Card>
    );
}
