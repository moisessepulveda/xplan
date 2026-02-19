import React from 'react';
import { Modal, List, Typography } from 'antd';
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    SwapOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import { router } from '@inertiajs/react';
import { colors } from '@/app/styles/theme';

interface QuickActionsProps {
    open: boolean;
    onClose: () => void;
}

interface ActionItem {
    key: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    path: string;
}

const actions: ActionItem[] = [
    {
        key: 'income',
        label: 'Ingreso',
        description: 'Registrar un ingreso',
        icon: <ArrowUpOutlined />,
        color: colors.income.main,
        bgColor: colors.income.light,
        path: '/transactions/create?type=income',
    },
    {
        key: 'expense',
        label: 'Gasto',
        description: 'Registrar un gasto',
        icon: <ArrowDownOutlined />,
        color: colors.expense.main,
        bgColor: colors.expense.light,
        path: '/transactions/create?type=expense',
    },
    {
        key: 'transfer',
        label: 'Transferencia',
        description: 'Mover dinero entre cuentas',
        icon: <SwapOutlined />,
        color: colors.transfer.main,
        bgColor: colors.transfer.light,
        path: '/transactions/create?type=transfer',
    },
    {
        key: 'receivable',
        label: 'Cuenta pendiente',
        description: 'Por cobrar o por pagar',
        icon: <FileTextOutlined />,
        color: colors.warning.main,
        bgColor: colors.warning.light,
        path: '/receivables/create',
    },
];

export function QuickActions({ open, onClose }: QuickActionsProps) {
    const handleSelect = (action: ActionItem) => {
        onClose();
        router.visit(action.path);
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            title={null}
            closable={false}
            centered
            width={320}
            styles={{
                body: { padding: 0 },
                content: { borderRadius: 16 },
            }}
        >
            <div style={{ padding: '16px 0' }}>
                <Typography.Text
                    type="secondary"
                    style={{
                        display: 'block',
                        textAlign: 'center',
                        marginBottom: 16,
                    }}
                >
                    ¿Qué deseas registrar?
                </Typography.Text>

                <List
                    dataSource={actions}
                    renderItem={(action) => (
                        <List.Item
                            onClick={() => handleSelect(action)}
                            style={{
                                padding: '12px 24px',
                                cursor: 'pointer',
                            }}
                        >
                            <List.Item.Meta
                                avatar={
                                    <div
                                        style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 12,
                                            backgroundColor: action.bgColor,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: action.color,
                                            fontSize: 20,
                                        }}
                                    >
                                        {action.icon}
                                    </div>
                                }
                                title={action.label}
                                description={action.description}
                            />
                        </List.Item>
                    )}
                />
            </div>
        </Modal>
    );
}
