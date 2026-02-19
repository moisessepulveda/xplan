import React from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { message } from 'antd';
import { AppLayout } from '@/app/components/common/AppLayout';
import { BudgetForm } from '@/app/components/budgets';
import type { Budget, Category } from '@/app/types';
import type { BudgetLineFormData } from '@/app/components/budgets/BudgetLineItem';

interface Props {
    budget: Budget | null;
    categories: Category[];
}

export default function BudgetsConfigure({ budget, categories }: Props) {
    const { processing, post, put } = useForm();

    const handleSubmit = (data: { name: string; type: string; lines: BudgetLineFormData[] }) => {
        const payload = {
            name: data.name,
            type: data.type,
            lines: data.lines.map((line) => ({
                ...(line.id ? { id: line.id } : {}),
                category_id: line.category_id,
                amount: line.amount,
                alert_at_50: line.alert_at_50,
                alert_at_80: line.alert_at_80,
                alert_at_100: line.alert_at_100,
                notes: line.notes,
            })),
        };

        if (budget) {
            router.put(`/budgets/${budget.id}`, payload, {
                onSuccess: () => message.success('Presupuesto actualizado'),
                onError: () => message.error('Error al actualizar el presupuesto'),
            });
        } else {
            router.post('/budgets', payload, {
                onSuccess: () => message.success('Presupuesto creado'),
                onError: () => message.error('Error al crear el presupuesto'),
            });
        }
    };

    return (
        <AppLayout title={budget ? 'Editar Presupuesto' : 'Nuevo Presupuesto'} showBack>
            <Head title={budget ? 'Editar Presupuesto' : 'Nuevo Presupuesto'} />

            <div style={{ padding: 16 }}>
                <BudgetForm
                    budget={budget || undefined}
                    categories={categories}
                    processing={processing}
                    onSubmit={handleSubmit}
                />
            </div>
        </AppLayout>
    );
}
