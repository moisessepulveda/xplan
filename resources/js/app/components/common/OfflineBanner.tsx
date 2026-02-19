import React from 'react';
import { WifiOutlined } from '@ant-design/icons';
import { useOnline } from '@/app/hooks/useOnline';
import { colors } from '@/app/styles/theme';

export function OfflineBanner() {
    const isOnline = useOnline();

    if (isOnline) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                backgroundColor: colors.warning.main,
                color: '#fff',
                padding: '6px 16px',
                paddingTop: 'calc(6px + env(safe-area-inset-top))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: 13,
                fontWeight: 500,
            }}
        >
            <WifiOutlined />
            Sin conexión a internet
        </div>
    );
}
