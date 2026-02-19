import React from 'react';
import { InputNumber, Switch, Input, Button, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { Category } from '@/app/types';

export interface BudgetLineFormData {
    id?: number;
    category_id: number;
    category_name?: string;
    amount: number;
    alert_at_50: boolean;
    alert_at_80: boolean;
    alert_at_100: boolean;
    notes?: string;
}

interface BudgetLineItemProps {
    line: BudgetLineFormData;
    categories: Category[];
    onChange: (data: Partial<BudgetLineFormData>) => void;
    onRemove: () => void;
}

export function BudgetLineItem({ line, onChange, onRemove }: BudgetLineItemProps) {
    return (
        <div
            style={{
                padding: 12,
                borderRadius: 8,
                border: '1px solid #f0f0f0',
                marginBottom: 8,
                backgroundColor: '#fafafa',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Typography.Text strong style={{ fontSize: 14 }}>
                    {line.category_name || `Categoría #${line.category_id}`}
                </Typography.Text>
                <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={onRemove}
                />
            </div>

            <div style={{ marginBottom: 8 }}>
                <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                    Monto presupuestado
                </Typography.Text>
                <InputNumber
                    value={line.amount}
                    onChange={(value) => onChange({ amount: value || 0 })}
                    min={0}
                    step={1000}
                    style={{ width: '100%' }}
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={(value) => Number(value?.replace(/\$\s?|(\.*)/g, '') || 0)}
                />
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 8, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Switch
                        size="small"
                        checked={line.alert_at_50}
                        onChange={(checked) => onChange({ alert_at_50: checked })}
                    />
                    <Typography.Text style={{ fontSize: 12 }}>50%</Typography.Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Switch
                        size="small"
                        checked={line.alert_at_80}
                        onChange={(checked) => onChange({ alert_at_80: checked })}
                    />
                    <Typography.Text style={{ fontSize: 12 }}>80%</Typography.Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Switch
                        size="small"
                        checked={line.alert_at_100}
                        onChange={(checked) => onChange({ alert_at_100: checked })}
                    />
                    <Typography.Text style={{ fontSize: 12 }}>100%</Typography.Text>
                </div>
            </div>

            <Input
                placeholder="Notas (opcional)"
                value={line.notes || ''}
                onChange={(e) => onChange({ notes: e.target.value || undefined })}
                size="small"
            />
        </div>
    );
}
