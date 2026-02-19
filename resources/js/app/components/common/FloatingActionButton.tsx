import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { colors } from '@/app/styles/theme';

interface Props {
    onClick: () => void;
    icon?: React.ReactNode;
    color?: string;
    bottom?: number;
    right?: number;
}

export function FloatingActionButton({
    onClick,
    icon = <PlusOutlined />,
    color = colors.primary[500],
    bottom = 80,
    right = 16,
}: Props) {
    return (
        <button
            onClick={onClick}
            style={{
                position: 'fixed',
                bottom,
                right,
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: color,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#fff',
                fontSize: 24,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                zIndex: 50,
            }}
        >
            {icon}
        </button>
    );
}
