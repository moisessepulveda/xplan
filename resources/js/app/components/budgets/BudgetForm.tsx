import React, { useState, useMemo } from 'react';
import { Form, Input, Select, Button, Typography, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { BudgetLineItem, type BudgetLineFormData } from './BudgetLineItem';
import { CategoryPicker } from '@/app/components/common/CategoryPicker';
import type { Category, Budget } from '@/app/types';

interface BudgetFormProps {
    budget?: Budget;
    categories: Category[];
    processing: boolean;
    onSubmit: (data: { name: string; type: string; lines: BudgetLineFormData[] }) => void;
    disabled?: boolean;
}

export function BudgetForm({ budget, categories, processing, onSubmit, disabled = false }: BudgetFormProps) {
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

    const usedCategoryIds = lines.map((l) => l.category_id);

    // Filter available categories (not already used) - including children
    const availableCategories = useMemo(() => {
        return categories
            .map((cat) => ({
                ...cat,
                children: cat.children?.filter((child) => !usedCategoryIds.includes(child.id)) || [],
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

    const handleSubmit = () => {
        onSubmit({ name, type, lines });
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
