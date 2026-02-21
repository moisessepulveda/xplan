import React from 'react';
import { Card, Typography, Progress, Button } from 'antd';
import {
    WalletOutlined,
    BankOutlined,
    GiftOutlined,
    CarOutlined,
    HomeOutlined,
    HeartOutlined,
    TrophyOutlined,
    StarOutlined,
    ThunderboltOutlined,
    RocketOutlined,
    EditOutlined,
} from '@ant-design/icons';
import { VirtualFund } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';

interface Props {
    fund: VirtualFund;
    currency: string;
    onClick?: () => void;
    onEdit?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
    wallet: <WalletOutlined />,
    bank: <BankOutlined />,
    gift: <GiftOutlined />,
    car: <CarOutlined />,
    home: <HomeOutlined />,
    heart: <HeartOutlined />,
    trophy: <TrophyOutlined />,
    star: <StarOutlined />,
    thunderbolt: <ThunderboltOutlined />,
    rocket: <RocketOutlined />,
};

export function FundCard({ fund, currency, onClick, onEdit }: Props) {
    const { planning } = usePlanning();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const hasGoal = fund.goal_amount && fund.goal_amount > 0;
    const fundColor = fund.color || colors.primary[500];

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit?.();
    };

    return (
        <Card
            hoverable={!!onClick}
            onClick={onClick}
            style={{
                borderRadius: 12,
                cursor: onClick ? 'pointer' : 'default',
            }}
            styles={{ body: { padding: 16 } }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        backgroundColor: `${fundColor}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: fundColor,
                        fontSize: 18,
                        flexShrink: 0,
                    }}
                >
                    {iconMap[fund.icon || 'wallet'] || <WalletOutlined />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography.Text strong style={{ display: 'block' }}>
                            {fund.name}
                        </Typography.Text>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                            <Typography.Text
                                strong
                                style={{
                                    fontSize: 15,
                                    color: fund.current_amount < 0 ? colors.expense.main : undefined,
                                }}
                            >
                                {formatCurrency(fund.current_amount)}
                            </Typography.Text>
                            {onEdit && !fund.is_default && (
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<EditOutlined />}
                                    onClick={handleEditClick}
                                    style={{
                                        padding: 4,
                                        height: 'auto',
                                        color: 'var(--ant-color-text-tertiary)',
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    {hasGoal && (
                        <div style={{ marginTop: 8 }}>
                            <Progress
                                percent={Math.round(fund.progress)}
                                size="small"
                                showInfo={false}
                                strokeColor={fundColor}
                                trailColor={`${fundColor}20`}
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
                </div>
            </div>
        </Card>
    );
}
