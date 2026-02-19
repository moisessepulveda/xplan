import React, { ReactNode } from 'react';
import { Typography } from 'antd';
import { useTheme } from '@/app/contexts/ThemeContext';
import { colors } from '@/app/styles/theme';

interface AuthLayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    const { isDark } = useTheme();

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: isDark ? colors.neutral[950] : colors.neutral[100],
            }}
        >
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '24px 16px',
                    maxWidth: 400,
                    margin: '0 auto',
                    width: '100%',
                }}
            >
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: 16,
                            backgroundColor: colors.primary[500],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                        }}
                    >
                        <Typography.Text
                            style={{
                                color: '#fff',
                                fontSize: 28,
                                fontWeight: 700,
                            }}
                        >
                            X
                        </Typography.Text>
                    </div>
                    {title && (
                        <Typography.Title level={3} style={{ marginBottom: 4 }}>
                            {title}
                        </Typography.Title>
                    )}
                    {subtitle && (
                        <Typography.Text type="secondary">
                            {subtitle}
                        </Typography.Text>
                    )}
                </div>

                {/* Content */}
                <div
                    style={{
                        backgroundColor: isDark ? colors.neutral[900] : colors.neutral[0],
                        borderRadius: 16,
                        padding: 24,
                        boxShadow: isDark
                            ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                            : '0 2px 8px rgba(0, 0, 0, 0.06)',
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
