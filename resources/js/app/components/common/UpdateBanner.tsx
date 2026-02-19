import React from 'react';
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useUpdatePrompt } from '@/app/hooks/useUpdatePrompt';
import { colors } from '@/app/styles/theme';

export function UpdateBanner() {
    const { hasUpdate, applyUpdate } = useUpdatePrompt();

    if (!hasUpdate) return null;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 72,
                left: 16,
                right: 16,
                zIndex: 1000,
                backgroundColor: colors.primary[500],
                color: '#fff',
                padding: '10px 16px',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                fontSize: 13,
            }}
        >
            <span>Nueva versión disponible</span>
            <Button
                size="small"
                icon={<ReloadOutlined />}
                onClick={applyUpdate}
                style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    border: 'none',
                }}
            >
                Actualizar
            </Button>
        </div>
    );
}
