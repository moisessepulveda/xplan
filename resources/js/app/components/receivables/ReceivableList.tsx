import React from 'react';
import { Empty } from 'antd';
import { Receivable } from '@/app/types';
import { ReceivableCard } from './ReceivableCard';

interface Props {
    receivables: Receivable[];
    onSelect?: (receivable: Receivable) => void;
    emptyText?: string;
}

export function ReceivableList({
    receivables,
    onSelect,
    emptyText = 'No hay cuentas pendientes',
}: Props) {
    if (receivables.length === 0) {
        return (
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={emptyText}
            />
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {receivables.map((receivable) => (
                <ReceivableCard
                    key={receivable.id}
                    receivable={receivable}
                    onClick={onSelect ? () => onSelect(receivable) : undefined}
                />
            ))}
        </div>
    );
}
