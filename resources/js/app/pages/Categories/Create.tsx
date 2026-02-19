import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card } from 'antd';
import { AppLayout } from '@/app/components/common/AppLayout';
import { CategoryForm } from '@/app/components/categories';
import { Category, CategoryTypeOption } from '@/app/types';

interface Props {
    categoryTypes: CategoryTypeOption[];
    parentCategories: {
        income: Category[];
        expense: Category[];
    };
}

export default function CreateCategory({ categoryTypes, parentCategories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'expense',
        parent_id: null as number | null,
        icon: '',
        color: '#1677ff',
    });

    const handleSubmit = () => {
        post('/categories');
    };

    // Get parent categories based on selected type
    const availableParents = data.type === 'income'
        ? parentCategories.income
        : parentCategories.expense;

    return (
        <AppLayout title="Nueva Categoría" showBack showBottomNav={false}>
            <Head title="Nueva Categoría" />

            <div style={{ padding: 16 }}>
                <Card style={{ borderRadius: 12 }}>
                    <CategoryForm
                        categoryTypes={categoryTypes}
                        parentCategories={availableParents}
                        data={data}
                        errors={errors}
                        processing={processing}
                        setData={setData}
                        onSubmit={handleSubmit}
                    />
                </Card>
            </div>
        </AppLayout>
    );
}
