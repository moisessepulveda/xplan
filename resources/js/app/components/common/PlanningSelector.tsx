import React, { useState } from 'react';
import { Typography, Drawer, List, Avatar, Button } from 'antd';
import { DownOutlined, PlusOutlined, CheckOutlined, SwapOutlined } from '@ant-design/icons';
import { router } from '@inertiajs/react';
import { usePlanning } from '@/app/hooks/usePlanning';
import { useTheme } from '@/app/contexts/ThemeContext';
import { colors } from '@/app/styles/theme';

interface PlanningSelectorProps {
    compact?: boolean;
}

export function PlanningSelector({ compact = false }: PlanningSelectorProps) {
    const { planning, plannings, switchPlanning } = usePlanning();
    const { isDark } = useTheme();
    const [open, setOpen] = useState(false);

    const handleSelect = (planningId: number) => {
        if (planningId !== planning?.id) {
            switchPlanning(planningId);
        }
        setOpen(false);
    };

    const handleCreateNew = () => {
        setOpen(false);
        router.visit('/plannings/create');
    };

    if (!planning) {
        return null;
    }

    // Only show swap button if there are multiple plannings
    const hasMultiplePlannings = plannings.length > 1;

    return (
        <>
            {compact ? (
                // Compact mode: just a swap icon button
                hasMultiplePlannings && (
                    <Button
                        type="text"
                        size="small"
                        icon={<SwapOutlined />}
                        onClick={() => setOpen(true)}
                        style={{ marginLeft: 4 }}
                    />
                )
            ) : (
                // Full mode: planning name with dropdown
                <button
                    onClick={() => setOpen(true)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                    }}
                >
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            backgroundColor: planning.color || colors.primary[500],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 16,
                        }}
                    >
                        {planning.icon === 'home' ? '🏠' : planning.icon}
                    </div>
                    <Typography.Text
                        strong
                        style={{
                            fontSize: 16,
                            maxWidth: 150,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {planning.name}
                    </Typography.Text>
                    {hasMultiplePlannings && (
                        <DownOutlined style={{ fontSize: 12, opacity: 0.5 }} />
                    )}
                </button>
            )}

            <Drawer
                title="Mis Planificaciones"
                placement="bottom"
                open={open}
                onClose={() => setOpen(false)}
                height="auto"
                styles={{
                    body: { padding: 0 },
                }}
            >
                <List
                    dataSource={plannings}
                    renderItem={(item) => (
                        <List.Item
                            onClick={() => handleSelect(item.id)}
                            style={{
                                padding: '16px 24px',
                                cursor: 'pointer',
                                backgroundColor:
                                    item.id === planning.id
                                        ? isDark
                                            ? colors.neutral[800]
                                            : colors.neutral[100]
                                        : undefined,
                            }}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        style={{
                                            backgroundColor: item.color || colors.primary[500],
                                        }}
                                    >
                                        {item.icon === 'home' ? '🏠' : item.icon?.[0]?.toUpperCase()}
                                    </Avatar>
                                }
                                title={item.name}
                                description={`${item.members_count || 1} miembro${(item.members_count || 1) > 1 ? 's' : ''}`}
                            />
                            {item.id === planning.id && (
                                <CheckOutlined style={{ color: colors.primary[500] }} />
                            )}
                        </List.Item>
                    )}
                />

                <div style={{ padding: 16 }}>
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        block
                        onClick={handleCreateNew}
                    >
                        Nueva planificación
                    </Button>
                </div>
            </Drawer>
        </>
    );
}
