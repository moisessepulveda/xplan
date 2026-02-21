import React from 'react';
import { Modal, Typography, Progress, Empty, Button } from 'antd';
import { EditOutlined, RightOutlined, ArrowUpOutlined, ArrowDownOutlined, SwapOutlined, TagOutlined } from '@ant-design/icons';
import { VirtualFund, Transaction } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';
import { router } from '@inertiajs/react';

interface Props {
    fund: VirtualFund | null;
    transactions: Transaction[];
    open: boolean;
    onClose: () => void;
    onEdit: () => void;
    currency: string;
}

const categoryIconMap: Record<string, React.ComponentType> = {
    'shopping-cart': () => <TagOutlined />,
    'shopping': () => <TagOutlined />,
    'tag': () => <TagOutlined />,
};

export function FundDetailModal({
    fund,
    transactions,
    open,
    onClose,
    onEdit,
    currency,
}: Props) {
    const { planning } = usePlanning();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    if (!fund) return null;

    const hasGoal = fund.goal_amount && fund.goal_amount > 0;
    const fundColor = fund.color || colors.primary[500];

    // Filter transactions for this fund
    const fundTransactions = transactions.filter(tx => tx.virtual_fund_id === fund.id);

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 32 }}>
                    <span>{fund.name}</span>
                    {!fund.is_default && (
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                            size="small"
                        />
                    )}
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            width={400}
        >
            {/* Fund Summary */}
            <div
                style={{
                    padding: 16,
                    backgroundColor: 'var(--ant-color-bg-layout)',
                    borderRadius: 12,
                    marginBottom: 16,
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        Saldo actual
                    </Typography.Text>
                    <Typography.Title
                        level={3}
                        style={{
                            margin: '4px 0',
                            color: fund.current_amount < 0 ? colors.expense.main : undefined,
                        }}
                    >
                        {formatCurrency(fund.current_amount)}
                    </Typography.Title>
                </div>

                {hasGoal && (
                    <div style={{ marginTop: 12 }}>
                        <Progress
                            percent={Math.round(fund.progress)}
                            size="small"
                            strokeColor={fundColor}
                            trailColor="var(--ant-color-border)"
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                                {Math.round(fund.progress)}% completado
                            </Typography.Text>
                            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                                Meta: {formatCurrency(fund.goal_amount!)}
                            </Typography.Text>
                        </div>
                    </div>
                )}

                {fund.description && (
                    <Typography.Paragraph
                        type="secondary"
                        style={{ marginTop: 12, marginBottom: 0, fontSize: 13 }}
                    >
                        {fund.description}
                    </Typography.Paragraph>
                )}
            </div>

            {/* Transactions List */}
            <div>
                <Typography.Text strong style={{ display: 'block', marginBottom: 12 }}>
                    Transacciones del fondo
                </Typography.Text>

                {fundTransactions.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Sin transacciones en este fondo"
                    />
                ) : (
                    <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                        {fundTransactions.map((tx, index) => {
                            let amountColor = colors.neutral[700];
                            let prefix = '';
                            let iconBg = 'var(--ant-color-bg-container-disabled)';
                            let iconColor = 'var(--ant-color-text-tertiary)';
                            let TypeIcon = TagOutlined;

                            if (tx.type === 'income') {
                                amountColor = colors.success.main;
                                prefix = '+';
                                iconBg = `${colors.success.main}15`;
                                iconColor = colors.success.main;
                                TypeIcon = ArrowDownOutlined;
                            } else if (tx.type === 'expense') {
                                amountColor = colors.error.main;
                                prefix = '-';
                                iconBg = `${colors.error.main}15`;
                                iconColor = colors.error.main;
                                TypeIcon = ArrowUpOutlined;
                            } else if (tx.type === 'transfer') {
                                iconBg = `${colors.primary[500]}15`;
                                iconColor = colors.primary[500];
                                TypeIcon = SwapOutlined;
                                amountColor = colors.error.main;
                                prefix = '-';
                            }

                            if (tx.category?.color) {
                                iconBg = `${tx.category.color}15`;
                                iconColor = tx.category.color;
                            }

                            return (
                                <div
                                    key={tx.id}
                                    style={{
                                        padding: '10px 0',
                                        borderBottom: index < fundTransactions.length - 1
                                            ? '1px solid var(--ant-color-border)'
                                            : 'none',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => {
                                        onClose();
                                        router.visit(`/transactions/${tx.id}`);
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                                        <div
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: 8,
                                                backgroundColor: iconBg,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                color: iconColor,
                                                fontSize: 14,
                                            }}
                                        >
                                            <TypeIcon />
                                        </div>
                                        <div style={{ minWidth: 0, flex: 1 }}>
                                            <div
                                                style={{
                                                    fontSize: 13,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {tx.description || tx.category?.name || tx.type_label}
                                            </div>
                                            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                                                {new Date(tx.date).toLocaleDateString('es-CL', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                })}
                                            </Typography.Text>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Typography.Text
                                            style={{
                                                fontSize: 13,
                                                fontWeight: 500,
                                                color: amountColor,
                                            }}
                                        >
                                            {prefix}{formatCurrency(tx.amount)}
                                        </Typography.Text>
                                        <RightOutlined style={{ fontSize: 10, color: 'var(--ant-color-text-quaternary)' }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Modal>
    );
}
