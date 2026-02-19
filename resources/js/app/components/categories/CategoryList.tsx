import React from 'react';
import { Empty, Typography, Collapse } from 'antd';
import { router } from '@inertiajs/react';
import { Category } from '@/app/types';
import { CategoryItem } from './CategoryItem';
import { colors } from '@/app/styles/theme';

interface Props {
    incomeCategories: Category[];
    expenseCategories: Category[];
}

export function CategoryList({ incomeCategories, expenseCategories }: Props) {
    const handleEdit = (category: Category) => {
        router.visit(`/categories/${category.id}/edit`);
    };

    const items = [
        {
            key: 'income',
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                        style={{
                            width: 12,
                            height: 12,
                            borderRadius: 3,
                            backgroundColor: colors.income.main,
                        }}
                    />
                    <Typography.Text strong>Ingresos</Typography.Text>
                    <Typography.Text type="secondary">({incomeCategories.length})</Typography.Text>
                </div>
            ),
            children: incomeCategories.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {incomeCategories.map((category) => (
                        <CategoryItem
                            key={category.id}
                            category={category}
                            onEdit={() => handleEdit(category)}
                        />
                    ))}
                </div>
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No hay categorías de ingreso"
                />
            ),
        },
        {
            key: 'expense',
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                        style={{
                            width: 12,
                            height: 12,
                            borderRadius: 3,
                            backgroundColor: colors.expense.main,
                        }}
                    />
                    <Typography.Text strong>Gastos</Typography.Text>
                    <Typography.Text type="secondary">({expenseCategories.length})</Typography.Text>
                </div>
            ),
            children: expenseCategories.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {expenseCategories.map((category) => (
                        <CategoryItem
                            key={category.id}
                            category={category}
                            onEdit={() => handleEdit(category)}
                        />
                    ))}
                </div>
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No hay categorías de gasto"
                />
            ),
        },
    ];

    return (
        <Collapse
            defaultActiveKey={['income', 'expense']}
            items={items}
            ghost
            style={{ backgroundColor: 'transparent' }}
        />
    );
}
