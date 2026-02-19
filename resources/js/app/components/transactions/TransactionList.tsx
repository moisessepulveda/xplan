import React from 'react';
import { Empty, Typography } from 'antd';
import { Transaction } from '@/app/types';
import { TransactionItem } from './TransactionItem';

interface Props {
    transactions: Transaction[];
    onSelect?: (transaction: Transaction) => void;
    emptyText?: string;
    groupByDate?: boolean;
}

export function TransactionList({
    transactions,
    onSelect,
    emptyText = 'No hay transacciones',
    groupByDate = true,
}: Props) {
    if (transactions.length === 0) {
        return (
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={emptyText}
            />
        );
    }

    if (!groupByDate) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {transactions.map((transaction) => (
                    <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                        onClick={onSelect ? () => onSelect(transaction) : undefined}
                    />
                ))}
            </div>
        );
    }

    // Group transactions by date
    const grouped = transactions.reduce<Record<string, Transaction[]>>((acc, transaction) => {
        const date = transaction.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
    }, {});

    const formatGroupDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const dateOnly = new Date(date);
        dateOnly.setHours(0, 0, 0, 0);

        if (dateOnly.getTime() === today.getTime()) return 'Hoy';
        if (dateOnly.getTime() === yesterday.getTime()) return 'Ayer';

        return date.toLocaleDateString('es-CL', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {Object.entries(grouped).map(([date, dateTransactions]) => (
                <div key={date}>
                    <Typography.Text
                        type="secondary"
                        style={{
                            fontSize: 12,
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            display: 'block',
                            marginBottom: 8,
                        }}
                    >
                        {formatGroupDate(date)}
                    </Typography.Text>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {dateTransactions.map((transaction) => (
                            <TransactionItem
                                key={transaction.id}
                                transaction={transaction}
                                onClick={onSelect ? () => onSelect(transaction) : undefined}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
