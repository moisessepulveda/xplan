import React, { ReactNode } from 'react';
import { Typography, Button, Badge } from 'antd';
import { ArrowLeftOutlined, BellOutlined } from '@ant-design/icons';
import { router, usePage } from '@inertiajs/react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';
import { PlanningSelector } from './PlanningSelector';
import type { PageProps } from '@/app/types';

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    onBack?: () => void;
    rightContent?: ReactNode;
}

export function Header({ title, showBack, onBack, rightContent }: HeaderProps) {
    const { isDark } = useTheme();
    const { planning } = usePlanning();
    const { unreadNotificationsCount } = usePage<PageProps>().props;

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            window.history.back();
        }
    };

    return (
        <header
            style={{
                height: 56,
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: isDark ? colors.neutral[900] : colors.neutral[0],
                borderBottom: `1px solid ${isDark ? colors.neutral[800] : colors.neutral[200]}`,
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}
        >
            {/* Left section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {showBack && (
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={handleBack}
                        style={{ marginLeft: -8 }}
                    />
                )}

                {title ? (
                    <Typography.Text strong style={{ fontSize: 18 }}>
                        {title}
                    </Typography.Text>
                ) : (
                    <PlanningSelector />
                )}
            </div>

            {/* Right section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {rightContent}
                <Button
                    type="text"
                    icon={
                        <Badge count={unreadNotificationsCount || 0} size="small">
                            <BellOutlined style={{ fontSize: 20 }} />
                        </Badge>
                    }
                    onClick={() => router.visit('/notifications')}
                />
            </div>
        </header>
    );
}
