import React, { ReactNode } from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useFlash } from '@/app/hooks/useFlash';
import { colors } from '@/app/styles/theme';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';

interface AppLayoutProps {
    children: ReactNode;
    showHeader?: boolean;
    showBottomNav?: boolean;
    title?: string;
    showBack?: boolean;
    onBack?: () => void;
    headerRight?: ReactNode;
}

export function AppLayout({
    children,
    showHeader = true,
    showBottomNav = true,
    title,
    showBack,
    onBack,
    headerRight,
}: AppLayoutProps) {
    const { isDark } = useTheme();

    // Initialize flash messages
    useFlash();

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: isDark ? colors.neutral[950] : colors.neutral[100],
            }}
        >
            {/* Header */}
            {showHeader && (
                <Header
                    title={title}
                    showBack={showBack}
                    onBack={onBack}
                    rightContent={headerRight}
                />
            )}

            {/* Main content */}
            <main
                style={{
                    flex: 1,
                    paddingBottom: showBottomNav ? 72 : 16,
                    overflowY: 'auto',
                }}
            >
                {children}
            </main>

            {/* Bottom Navigation */}
            {showBottomNav && <BottomNavigation />}
        </div>
    );
}
