import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Typography, Button } from 'antd';
import { useTheme } from '@/app/contexts/ThemeContext';
import { colors } from '@/app/styles/theme';

export default function Welcome() {
    const { isDark } = useTheme();

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 24,
                backgroundColor: isDark ? colors.neutral[950] : colors.neutral[100],
            }}
        >
            <Head title="Bienvenido" />

            {/* Logo */}
            <div
                style={{
                    width: 80,
                    height: 80,
                    borderRadius: 20,
                    backgroundColor: colors.primary[500],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24,
                }}
            >
                <Typography.Text
                    style={{
                        color: '#fff',
                        fontSize: 36,
                        fontWeight: 700,
                    }}
                >
                    X
                </Typography.Text>
            </div>

            <Typography.Title level={2} style={{ marginBottom: 8 }}>
                Bienvenido a XPlan
            </Typography.Title>

            <Typography.Paragraph
                type="secondary"
                style={{ textAlign: 'center', maxWidth: 300, marginBottom: 48 }}
            >
                Tu asistente personal para organizar tus finanzas de forma simple y efectiva.
            </Typography.Paragraph>

            {/* Indicators */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 48 }}>
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        style={{
                            width: i === 0 ? 24 : 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: i === 0 ? colors.primary[500] : colors.neutral[300],
                        }}
                    />
                ))}
            </div>

            <div style={{ width: '100%', maxWidth: 300 }}>
                <Button
                    type="primary"
                    size="large"
                    block
                    onClick={() => router.visit('/onboarding/create-planning')}
                >
                    Comenzar
                </Button>
            </div>
        </div>
    );
}
