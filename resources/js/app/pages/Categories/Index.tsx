import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { CategoryList } from '@/app/components/categories';
import { Category, CategoryTypeOption } from '@/app/types';

interface Props {
    incomeCategories: Category[];
    expenseCategories: Category[];
    categoryTypes: CategoryTypeOption[];
}

export default function CategoriesIndex({ incomeCategories, expenseCategories, categoryTypes }: Props) {
    return (
        <AppLayout title="Categorías" showBack>
            <Head title="Categorías" />

            <div style={{ padding: 16 }}>
                <CategoryList
                    incomeCategories={incomeCategories}
                    expenseCategories={expenseCategories}
                />

                <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    block
                    size="large"
                    onClick={() => router.visit('/categories/create')}
                    style={{ marginTop: 16 }}
                >
                    Nueva Categoría
                </Button>
            </div>
        </AppLayout>
    );
}
