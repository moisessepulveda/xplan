import React, { useState, useMemo, useEffect } from 'react';
import { Form, Input, Select, Button, Typography, Empty, Card, Space } from 'antd';
import { PlusOutlined, CreditCardOutlined, SyncOutlined, CheckOutlined } from '@ant-design/icons';
import { BudgetLineItem, type BudgetLineFormData } from './BudgetLineItem';
import { CategoryPicker } from '@/app/components/common/CategoryPicker';
import type { Category, Budget } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';

interface CreditsInfo {
    monthly_total: number;
    active_count: number;
    category_id: number | null;
    category_name: string | null;
}

interface BudgetFormProps {
    budget?: Budget;
    categories: Category[];
    processing: boolean;
    onSubmit: (data: { name: string; type: string; lines: BudgetLineFormData[] }) => void;
    disabled?: boolean;
    creditsInfo?: CreditsInfo;
}

export function BudgetForm({ budget, categories, processing, onSubmit, disabled = false, creditsInfo }: BudgetFormProps) {
    const { planning } = usePlanning();
    const [name, setName] = useState(budget?.name || '');
    const [type, setType] = useState(budget?.type || 'monthly');
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [lines, setLines] = useState<BudgetLineFormData[]>(
        budget?.lines?.map((l) => ({
            id: l.id,
            category_id: l.category_id,
            category_name: l.category?.name,
            amount: l.amount,
            alert_at_50: l.alert_at_50 ?? false,
            alert_at_80: l.alert_at_80 ?? true,
            alert_at_100: l.alert_at_100 ?? true,
            notes: l.notes,
        })) || []
    );

    // Check if credits line already exists in budget
    const creditsLineExists = useMemo(() => {
        if (!creditsInfo?.category_id) return false;
        return lines.some((l) => l.category_id === creditsInfo.category_id);
    }, [lines, creditsInfo?.category_id]);

    const usedCategoryIds = lines.map((l) => l.category_id);

    // Filter available categories (not already used) - including children
    // Also exclude the credits system category from manual selection
    const availableCategories = useMemo(() => {
        return categories
            .filter((cat) => cat.system_type !== 'credits') // Exclude credits category
            .map((cat) => ({
                ...cat,
                children: cat.children?.filter((child) =>
                    !usedCategoryIds.includes(child.id) && child.system_type !== 'credits'
                ) || [],
            }))
            .filter((cat) => {
                const parentAvailable = !usedCategoryIds.includes(cat.id);
                const hasAvailableChildren = cat.children && cat.children.length > 0;
                return parentAvailable || hasAvailableChildren;
            });
    }, [categories, usedCategoryIds]);

    const hasAvailableCategories = availableCategories.length > 0;

    const handleAddLine = (category: Category) => {
        if (usedCategoryIds.includes(category.id)) return;

        setLines([
            ...lines,
            {
                category_id: category.id,
                category_name: category.name,
                amount: 0,
                alert_at_50: false,
                alert_at_80: true,
                alert_at_100: true,
            },
        ]);
    };

    const handleUpdateLine = (index: number, data: Partial<BudgetLineFormData>) => {
        const updated = [...lines];
        updated[index] = { ...updated[index], ...data };
        setLines(updated);
    };

    const handleRemoveLine = (index: number) => {
        setLines(lines.filter((_, i) => i !== index));
    };

    const handleAddCreditsLine = () => {
        if (!creditsInfo?.category_id || !creditsInfo?.category_name) return;

        const roundedAmount = Math.round(creditsInfo.monthly_total);
        const existingIndex = lines.findIndex((l) => l.category_id === creditsInfo.category_id);

        if (existingIndex >= 0) {
            // Update existing line with new credits amount
            const updated = [...lines];
            updated[existingIndex] = {
                ...updated[existingIndex],
                amount: roundedAmount,
            };
            setLines(updated);
        } else {
            // Add new line
            setLines([
                ...lines,
                {
                    category_id: creditsInfo.category_id,
                    category_name: creditsInfo.category_name,
                    amount: roundedAmount,
                    alert_at_50: false,
                    alert_at_80: true,
                    alert_at_100: true,
                },
            ]);
        }
    };

    const handleRecalculateCredits = () => {
        if (!creditsInfo?.category_id) return;

        const roundedAmount = Math.round(creditsInfo.monthly_total);
        const existingIndex = lines.findIndex((l) => l.category_id === creditsInfo.category_id);
        if (existingIndex >= 0) {
            const updated = [...lines];
            updated[existingIndex] = {
                ...updated[existingIndex],
                amount: roundedAmount,
            };
            setLines(updated);
        }
    };

    const handleSubmit = () => {
        onSubmit({ name, type, lines });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: planning?.currency || 'CLP',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const totalBudgeted = lines.reduce((sum, l) => sum + (l.amount || 0), 0);

    return (
        <div>
            <Form layout="vertical">
                <Form.Item label="Nombre del presupuesto" required>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Presupuesto Mensual"
                        size="large"
                        disabled={disabled}
                    />
                </Form.Item>

                <Form.Item label="Tipo">
                    <Select
                        value={type}
                        onChange={setType}
                        options={[
                            { value: 'monthly', label: 'Mensual' },
                            { value: 'custom', label: 'Personalizado' },
                        ]}
                        size="large"
                        disabled={disabled}
                    />
                </Form.Item>
            </Form>

            {/* Budget Lines */}
            <div style={{ marginTop: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Typography.Text strong>Categorías ({lines.length})</Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                        Total: ${totalBudgeted.toLocaleString('es-CL')}
                    </Typography.Text>
                </div>

                {lines.length === 0 ? (
                    <Empty
                        description="Agrega categorías a tu presupuesto"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                ) : (
                    lines.map((line, index) => (
                        <BudgetLineItem
                            key={`${line.category_id}-${index}`}
                            line={line}
                            categories={categories}
                            onChange={(data) => handleUpdateLine(index, data)}
                            onRemove={() => handleRemoveLine(index)}
                            disabled={disabled}
                        />
                    ))
                )}

                {hasAvailableCategories && (
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => setShowCategoryPicker(true)}
                        style={{ width: '100%', marginTop: 8 }}
                        size="large"
                        disabled={disabled}
                    >
                        Agregar categoría
                    </Button>
                )}

                {/* Credits Section */}
                {creditsInfo && creditsInfo.active_count > 0 && creditsInfo.category_id && (
                    <Card
                        size="small"
                        style={{ marginTop: 16, backgroundColor: 'var(--ant-color-fill-tertiary)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <CreditCardOutlined style={{ fontSize: 16 }} />
                            <Typography.Text strong>Cuotas de Créditos</Typography.Text>
                        </div>
                        <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
                            Tienes {creditsInfo.active_count} crédito{creditsInfo.active_count > 1 ? 's' : ''} activo{creditsInfo.active_count > 1 ? 's' : ''} con
                            un total de <strong>{formatCurrency(creditsInfo.monthly_total)}</strong> en cuotas mensuales.
                        </Typography.Text>
                        {creditsLineExists ? (
                            <Space>
                                <Typography.Text type="success">
                                    <CheckOutlined /> Incluido en el presupuesto
                                </Typography.Text>
                                <Button
                                    icon={<SyncOutlined />}
                                    onClick={handleRecalculateCredits}
                                    disabled={disabled}
                                    size="small"
                                >
                                    Recalcular monto
                                </Button>
                            </Space>
                        ) : (
                            <Button
                                type="primary"
                                icon={<CreditCardOutlined />}
                                onClick={handleAddCreditsLine}
                                disabled={disabled}
                                size="small"
                            >
                                Agregar al presupuesto
                            </Button>
                        )}
                    </Card>
                )}

                <CategoryPicker
                    open={showCategoryPicker}
                    onClose={() => setShowCategoryPicker(false)}
                    onSelect={handleAddLine}
                    categories={availableCategories}
                    title="Agregar categoría al presupuesto"
                />
            </div>

            <Button
                type="primary"
                size="large"
                block
                onClick={handleSubmit}
                loading={processing}
                disabled={disabled || !name || lines.length === 0 || lines.some((l) => !l.amount)}
            >
                {budget ? 'Actualizar Presupuesto' : 'Crear Presupuesto'}
            </Button>
        </div>
    );
}
