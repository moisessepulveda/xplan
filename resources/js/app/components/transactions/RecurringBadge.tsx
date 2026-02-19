import React from 'react';
import { Tag } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

interface Props {
    frequency?: string;
    small?: boolean;
}

const frequencyLabels: Record<string, string> = {
    daily: 'Diario',
    weekly: 'Semanal',
    biweekly: 'Quincenal',
    monthly: 'Mensual',
    yearly: 'Anual',
};

export function RecurringBadge({ frequency, small }: Props) {
    return (
        <Tag
            icon={<SyncOutlined />}
            color="blue"
            style={{
                fontSize: small ? 10 : 12,
                borderRadius: 4,
            }}
        >
            {frequency ? frequencyLabels[frequency] || frequency : 'Recurrente'}
        </Tag>
    );
}
