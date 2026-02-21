import React from 'react';
import { Button, Typography, Empty, Card } from 'antd';
import { PlusOutlined, SwapOutlined } from '@ant-design/icons';
import { VirtualFund } from '@/app/types';
import { FundCard } from './FundCard';

interface Props {
    funds: VirtualFund[];
    currency: string;
    onAdd: () => void;
    onSelect: (fund: VirtualFund) => void;
    onEdit: (fund: VirtualFund) => void;
    onTransfer: () => void;
}

export function FundsList({ funds, currency, onAdd, onSelect, onEdit, onTransfer }: Props) {
    const availableFund = funds.find(f => f.is_default);
    const customFunds = funds.filter(f => !f.is_default);

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16
            }}>
                <Typography.Title level={5} style={{ margin: 0 }}>
                    Fondos Virtuales
                </Typography.Title>
                <div style={{ display: 'flex', gap: 8 }}>
                    {customFunds.length > 0 && (
                        <Button
                            size="small"
                            icon={<SwapOutlined />}
                            onClick={onTransfer}
                        >
                            Transferir
                        </Button>
                    )}
                    <Button
                        type="primary"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={onAdd}
                    >
                        Nuevo
                    </Button>
                </div>
            </div>

            {/* Available fund always shown first */}
            {availableFund && (
                <div style={{ marginBottom: 12 }}>
                    <FundCard
                        fund={availableFund}
                        currency={currency}
                    />
                </div>
            )}

            {/* Custom funds */}
            {customFunds.length === 0 ? (
                <Card style={{ borderRadius: 12 }}>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Sin fondos adicionales"
                    >
                        <Button type="dashed" icon={<PlusOutlined />} onClick={onAdd}>
                            Crear primer fondo
                        </Button>
                    </Empty>
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {customFunds.map(fund => (
                        <FundCard
                            key={fund.id}
                            fund={fund}
                            currency={currency}
                            onClick={() => onSelect(fund)}
                            onEdit={() => onEdit(fund)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
