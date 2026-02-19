import React from 'react';
import { Empty } from 'antd';
import { CreditCard } from './CreditCard';
import type { Credit } from '@/app/types';

interface CreditListProps {
    credits: Credit[];
    formatCurrency: (amount: number) => string;
    onSelect?: (credit: Credit) => void;
    emptyText?: string;
}

export function CreditList({ credits, formatCurrency, onSelect, emptyText = 'No hay créditos' }: CreditListProps) {
    if (credits.length === 0) {
        return (
            <Empty
                description={emptyText}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
        );
    }

    return (
        <div>
            {credits.map((credit) => (
                <CreditCard
                    key={credit.id}
                    credit={credit}
                    formatCurrency={formatCurrency}
                    onClick={onSelect ? () => onSelect(credit) : undefined}
                />
            ))}
        </div>
    );
}
