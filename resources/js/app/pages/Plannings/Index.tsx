import React from 'react';
import { Head, router } from '@inertiajs/react';
import { List, Avatar, Button, Typography } from 'antd';
import { PlusOutlined, CheckOutlined, SettingOutlined } from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';
import type { Planning } from '@/app/types';

interface Props {
    plannings: Planning[];
}

export default function PlanningsIndex({ plannings }: Props) {
    const { planning: activePlanning, switchPlanning } = usePlanning();

    const handleSelect = (planningId: number) => {
        if (planningId !== activePlanning?.id) {
            switchPlanning(planningId);
        }
    };

    return (
        <AppLayout title="Mis Planificaciones" showBack>
            <Head title="Planificaciones" />

            <div style={{ padding: 16 }}>
                <List
                    dataSource={plannings}
                    renderItem={(item) => (
                        <List.Item
                            style={{
                                padding: 16,
                                backgroundColor: item.id === activePlanning?.id
                                    ? colors.primary[50]
                                    : 'var(--color-bg-card)',
                                borderRadius: 12,
                                marginBottom: 12,
                                cursor: 'pointer',
                                border: item.id === activePlanning?.id
                                    ? `2px solid ${colors.primary[500]}`
                                    : '2px solid transparent',
                            }}
                            onClick={() => handleSelect(item.id)}
                            actions={[
                                <Button
                                    key="settings"
                                    type="text"
                                    icon={<SettingOutlined />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.visit(`/plannings/${item.id}/edit`);
                                    }}
                                />,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        size={48}
                                        style={{
                                            backgroundColor: item.color || colors.primary[500],
                                            fontSize: 20,
                                        }}
                                    >
                                        {item.icon === 'home' ? '🏠' : item.icon?.[0]?.toUpperCase()}
                                    </Avatar>
                                }
                                title={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Typography.Text strong>{item.name}</Typography.Text>
                                        {item.id === activePlanning?.id && (
                                            <CheckOutlined style={{ color: colors.primary[500] }} />
                                        )}
                                    </div>
                                }
                                description={
                                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                        {item.members_count || 1} miembro{(item.members_count || 1) > 1 ? 's' : ''} · {item.currency}
                                    </Typography.Text>
                                }
                            />
                        </List.Item>
                    )}
                />

                <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    block
                    size="large"
                    onClick={() => router.visit('/plannings/create')}
                    style={{ marginTop: 8 }}
                >
                    Nueva planificación
                </Button>
            </div>
        </AppLayout>
    );
}
