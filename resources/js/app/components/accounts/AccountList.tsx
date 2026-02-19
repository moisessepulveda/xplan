import React from 'react';
import { Empty } from 'antd';
import { Account } from '@/app/types';
import { AccountCard } from './AccountCard';

interface Props {
    accounts: Account[];
    onSelect?: (account: Account) => void;
    emptyText?: string;
}

export function AccountList({ accounts, onSelect, emptyText = 'No hay cuentas' }: Props) {
    if (accounts.length === 0) {
        return (
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={emptyText}
            />
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {accounts.map((account) => (
                <AccountCard
                    key={account.id}
                    account={account}
                    onClick={onSelect ? () => onSelect(account) : undefined}
                />
            ))}
        </div>
    );
}
