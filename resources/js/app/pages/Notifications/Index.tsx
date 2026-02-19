import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, Typography, Button, Empty, Tag, Dropdown } from 'antd';
import {
    BellOutlined,
    CheckOutlined,
    DeleteOutlined,
    MoreOutlined,
    CreditCardOutlined,
    DollarOutlined,
    PieChartOutlined,
    TeamOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { colors } from '@/app/styles/theme';
import type { PaginatedData } from '@/app/types';

interface NotificationItem {
    id: string;
    type: string;
    title: string;
    message: string;
    data: Record<string, unknown>;
    read: boolean;
    read_at: string | null;
    created_at: string;
    time_ago: string;
}

interface Props {
    notifications: PaginatedData<NotificationItem>;
    unreadCount: number;
}

const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'budget_alert': return <PieChartOutlined style={{ color: colors.warning.main }} />;
        case 'credit_installment_due': return <CreditCardOutlined style={{ color: colors.primary[500] }} />;
        case 'overdue_payment': return <ClockCircleOutlined style={{ color: colors.error.main }} />;
        case 'receivable_reminder': return <DollarOutlined style={{ color: colors.info.main }} />;
        case 'invitation_received':
        case 'member_joined': return <TeamOutlined style={{ color: colors.success.main }} />;
        default: return <BellOutlined style={{ color: colors.neutral[500] }} />;
    }
};

const getNotificationColor = (type: string) => {
    switch (type) {
        case 'budget_alert': return colors.warning.light;
        case 'credit_installment_due': return colors.primary[50];
        case 'overdue_payment': return colors.error.light;
        case 'receivable_reminder': return colors.info.light;
        case 'invitation_received':
        case 'member_joined': return colors.success.light;
        default: return colors.neutral[100];
    }
};

export default function NotificationsIndex({ notifications, unreadCount }: Props) {
    const handleMarkAsRead = (id: string) => {
        router.post(`/notifications/${id}/read`, {}, { preserveScroll: true });
    };

    const handleMarkAllAsRead = () => {
        router.post('/notifications/read-all', {}, { preserveScroll: true });
    };

    const handleDelete = (id: string) => {
        router.delete(`/notifications/${id}`, { preserveScroll: true });
    };

    const handleDeleteAll = () => {
        router.delete('/notifications', { preserveScroll: true });
    };

    const handleNavigate = (notification: NotificationItem) => {
        if (!notification.read) {
            handleMarkAsRead(notification.id);
        }

        const { data } = notification;
        switch (notification.type) {
            case 'budget_alert':
                router.visit('/budgets');
                break;
            case 'credit_installment_due':
                if (data.credit_id) router.visit(`/credits/${data.credit_id}`);
                break;
            case 'overdue_payment':
                if (data.entity_type === 'credit') router.visit('/credits');
                else router.visit('/receivables');
                break;
            case 'receivable_reminder':
                if (data.receivable_id) router.visit(`/receivables/${data.receivable_id}`);
                break;
            case 'invitation_received':
                if (data.token) router.visit(`/invitations/${data.token}`);
                break;
            case 'member_joined':
                router.visit('/members');
                break;
        }
    };

    const headerRight = unreadCount > 0 ? (
        <Dropdown
            menu={{
                items: [
                    {
                        key: 'read-all',
                        label: 'Marcar todas como leídas',
                        icon: <CheckOutlined />,
                        onClick: handleMarkAllAsRead,
                    },
                    {
                        key: 'delete-all',
                        label: 'Eliminar todas',
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: handleDeleteAll,
                    },
                ],
            }}
            trigger={['click']}
        >
            <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
    ) : undefined;

    return (
        <AppLayout title="Notificaciones" showBack headerRight={headerRight}>
            <Head title="Notificaciones" />

            <div style={{ padding: 16 }}>
                {unreadCount > 0 && (
                    <div style={{ marginBottom: 12 }}>
                        <Tag color="blue">{unreadCount} sin leer</Tag>
                    </div>
                )}

                {notifications.data.length > 0 ? (
                    <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 0 } }}>
                        {notifications.data.map((notification, index) => (
                            <div
                                key={notification.id}
                                style={{
                                    padding: '12px 16px',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 12,
                                    borderBottom: index < notifications.data.length - 1 ? '1px solid #f0f0f0' : 'none',
                                    backgroundColor: notification.read ? 'transparent' : 'rgba(22, 119, 255, 0.04)',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleNavigate(notification)}
                            >
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 10,
                                        backgroundColor: getNotificationColor(notification.type),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 18,
                                        flexShrink: 0,
                                    }}
                                >
                                    {getNotificationIcon(notification.type)}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Typography.Text
                                            strong={!notification.read}
                                            style={{ fontSize: 13, display: 'block' }}
                                        >
                                            {notification.title}
                                        </Typography.Text>
                                        {!notification.read && (
                                            <div
                                                style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: colors.primary[500],
                                                    flexShrink: 0,
                                                    marginTop: 6,
                                                }}
                                            />
                                        )}
                                    </div>
                                    <Typography.Text
                                        type="secondary"
                                        ellipsis
                                        style={{ fontSize: 12, display: 'block' }}
                                    >
                                        {notification.message}
                                    </Typography.Text>
                                    <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                                        {notification.time_ago}
                                    </Typography.Text>
                                </div>
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(notification.id);
                                    }}
                                    style={{ flexShrink: 0, marginTop: 4 }}
                                />
                            </div>
                        ))}
                    </Card>
                ) : (
                    <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 40 } }}>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No tienes notificaciones"
                        />
                    </Card>
                )}

                {/* Pagination */}
                {notifications.meta.last_page > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, gap: 8 }}>
                        {notifications.links.prev && (
                            <Button size="small" onClick={() => router.visit(notifications.links.prev!)}>
                                Anterior
                            </Button>
                        )}
                        <Typography.Text type="secondary" style={{ lineHeight: '32px', fontSize: 12 }}>
                            {notifications.meta.current_page} de {notifications.meta.last_page}
                        </Typography.Text>
                        {notifications.links.next && (
                            <Button size="small" onClick={() => router.visit(notifications.links.next!)}>
                                Siguiente
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
