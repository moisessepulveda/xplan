import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
    HomeOutlined,
    HomeFilled,
    UnorderedListOutlined,
    PlusOutlined,
    PieChartOutlined,
    PieChartFilled,
    MenuOutlined,
} from '@ant-design/icons';
import { useTheme } from '@/app/contexts/ThemeContext';
import { colors } from '@/app/styles/theme';
import { QuickActions } from './QuickActions';

interface NavItem {
    key: string;
    label: string;
    icon: React.ReactNode;
    activeIcon: React.ReactNode;
    path: string;
}

const navItems: NavItem[] = [
    {
        key: 'home',
        label: 'Inicio',
        icon: <HomeOutlined />,
        activeIcon: <HomeFilled />,
        path: '/dashboard',
    },
    {
        key: 'transactions',
        label: 'Trans.',
        icon: <UnorderedListOutlined />,
        activeIcon: <UnorderedListOutlined />,
        path: '/transactions',
    },
    {
        key: 'add',
        label: '',
        icon: <PlusOutlined />,
        activeIcon: <PlusOutlined />,
        path: '',
    },
    {
        key: 'budget',
        label: 'Presup.',
        icon: <PieChartOutlined />,
        activeIcon: <PieChartFilled />,
        path: '/budgets',
    },
    {
        key: 'more',
        label: 'Más',
        icon: <MenuOutlined />,
        activeIcon: <MenuOutlined />,
        path: '/settings',
    },
];

export function BottomNavigation() {
    const { isDark } = useTheme();
    const { url } = usePage();
    const [showQuickActions, setShowQuickActions] = useState(false);

    const isActive = (path: string) => {
        if (!path) return false;
        return url.startsWith(path);
    };

    const handleNavigate = (item: NavItem) => {
        if (item.key === 'add') {
            setShowQuickActions(true);
        } else if (item.path) {
            router.visit(item.path);
        }
    };

    return (
        <>
            <nav
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 56,
                    paddingBottom: 'env(safe-area-inset-bottom)',
                    backgroundColor: isDark ? colors.neutral[900] : colors.neutral[0],
                    borderTop: `1px solid ${isDark ? colors.neutral[800] : colors.neutral[200]}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    zIndex: 100,
                }}
            >
                {navItems.map((item) => {
                    const active = isActive(item.path);

                    if (item.key === 'add') {
                        return (
                            <button
                                key={item.key}
                                onClick={() => handleNavigate(item)}
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    backgroundColor: colors.primary[500],
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#fff',
                                    fontSize: 24,
                                    boxShadow: '0 2px 8px rgba(22, 119, 255, 0.4)',
                                }}
                            >
                                {item.icon}
                            </button>
                        );
                    }

                    return (
                        <button
                            key={item.key}
                            onClick={() => handleNavigate(item)}
                            style={{
                                flex: 1,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 2,
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: active
                                    ? colors.primary[500]
                                    : isDark
                                    ? colors.neutral[400]
                                    : colors.neutral[600],
                            }}
                        >
                            <span style={{ fontSize: 20 }}>
                                {active ? item.activeIcon : item.icon}
                            </span>
                            <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </nav>

            <QuickActions
                open={showQuickActions}
                onClose={() => setShowQuickActions(false)}
            />
        </>
    );
}
