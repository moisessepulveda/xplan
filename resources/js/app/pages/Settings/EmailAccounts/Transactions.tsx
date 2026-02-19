import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, Typography, Tag, Empty, List } from 'antd';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    MinusCircleOutlined,
    CloseCircleOutlined,
    MailOutlined,
} from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import type { EmailAccount, EmailTransaction, PaginatedData } from '@/app/types';
import { colors } from '@/app/styles/theme';

interface Props {
    account: EmailAccount;
    transactions: PaginatedData<EmailTransaction>;
}

const statusIcons: Record<string, React.ReactNode> = {
    'check-circle': <CheckCircleOutlined />,
    'clock-circle': <ClockCircleOutlined />,
    'minus-circle': <MinusCircleOutlined />,
    'close-circle': <CloseCircleOutlined />,
};

export default function EmailTransactionsPage({ account, transactions }: Props) {
    return (
        <AppLayout title={`Emails - ${account.name}`} showBack backUrl="/settings/email-accounts">
            <Head title={`Emails - ${account.name}`} />

            <div style={{ padding: 16 }}>
                {/* Account Info */}
                <Card style={{ marginBottom: 16, borderRadius: 12 }} styles={{ body: { padding: 16 } }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                backgroundColor: colors.primary[50],
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: colors.primary[500],
                                fontSize: 18,
                            }}
                        >
                            <MailOutlined />
                        </div>
                        <div>
                            <Typography.Text strong>{account.name}</Typography.Text>
                            <Typography.Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                                {account.email}
                            </Typography.Text>
                        </div>
                    </div>
                </Card>

                {/* Transactions List */}
                {transactions.data.length === 0 ? (
                    <Card style={{ borderRadius: 12 }}>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No hay emails procesados"
                        />
                    </Card>
                ) : (
                    <List
                        dataSource={transactions.data}
                        renderItem={(item) => (
                            <Card
                                key={item.id}
                                style={{ marginBottom: 8, borderRadius: 12 }}
                                styles={{ body: { padding: 12 } }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <Typography.Text strong style={{ fontSize: 13 }}>
                                            {item.subject || '(Sin asunto)'}
                                        </Typography.Text>
                                        <Typography.Text type="secondary" style={{ display: 'block', fontSize: 11 }}>
                                            De: {item.from_email}
                                        </Typography.Text>
                                        <Typography.Text type="secondary" style={{ display: 'block', fontSize: 11 }}>
                                            {item.received_at_human}
                                        </Typography.Text>
                                    </div>
                                    <Tag
                                        color={item.status_color}
                                        icon={statusIcons[item.status_icon]}
                                    >
                                        {item.status_label}
                                    </Tag>
                                </div>

                                {/* Parsed Data */}
                                {item.parsed_data && item.is_transaction && (
                                    <div
                                        style={{
                                            marginTop: 8,
                                            padding: 8,
                                            backgroundColor: 'var(--ant-color-bg-layout)',
                                            borderRadius: 8,
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <Tag color={item.parsed_data.type === 'expense' ? 'red' : 'green'}>
                                                    {item.parsed_data.type === 'expense' ? 'Gasto' : 'Ingreso'}
                                                </Tag>
                                                <Typography.Text style={{ fontSize: 12 }}>
                                                    {item.parsed_data.merchant || item.parsed_data.description}
                                                </Typography.Text>
                                            </div>
                                            <Typography.Text strong>
                                                ${item.parsed_data.amount?.toLocaleString('es-CL')}
                                            </Typography.Text>
                                        </div>
                                        <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                                            Confianza: {Math.round(item.confidence * 100)}%
                                        </Typography.Text>
                                    </div>
                                )}

                                {/* Error Message */}
                                {item.error_message && (
                                    <div style={{ marginTop: 8 }}>
                                        <Typography.Text type="danger" style={{ fontSize: 11 }}>
                                            Error: {item.error_message}
                                        </Typography.Text>
                                    </div>
                                )}
                            </Card>
                        )}
                    />
                )}
            </div>
        </AppLayout>
    );
}
