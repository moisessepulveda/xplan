import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, Button, Popconfirm, Divider, Alert } from 'antd';
import { DeleteOutlined, InboxOutlined, UndoOutlined } from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { CategoryForm } from '@/app/components/categories';
import { Category, CategoryTypeOption } from '@/app/types';

interface Props {
    category: Category;
    categoryTypes: CategoryTypeOption[];
    parentCategories: Category[];
}

export default function EditCategory({ category, categoryTypes, parentCategories }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        type: category.type,
        parent_id: category.parent_id || null,
        icon: category.icon || '',
        color: category.color || '#1677ff',
    });

    const handleSubmit = () => {
        put(`/categories/${category.id}`);
    };

    const handleArchive = () => {
        router.post(`/categories/${category.id}/archive`);
    };

    const handleRestore = () => {
        router.post(`/categories/${category.id}/restore`);
    };

    const handleDelete = () => {
        router.delete(`/categories/${category.id}`);
    };

    return (
        <AppLayout title="Editar Categoría" showBack showBottomNav={false}>
            <Head title="Editar Categoría" />

            <div style={{ padding: 16 }}>
                {category.is_system && (
                    <Alert
                        message="Categoría del sistema"
                        description="Esta es una categoría predefinida. Puedes editarla pero no eliminarla."
                        type="info"
                        showIcon
                        style={{ marginBottom: 16, borderRadius: 8 }}
                    />
                )}

                <Card style={{ borderRadius: 12 }}>
                    <CategoryForm
                        category={category}
                        categoryTypes={categoryTypes}
                        parentCategories={parentCategories}
                        data={data}
                        errors={errors}
                        processing={processing}
                        setData={setData}
                        onSubmit={handleSubmit}
                    />

                    <Divider />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {category.is_archived ? (
                            <Button
                                icon={<UndoOutlined />}
                                block
                                onClick={handleRestore}
                            >
                                Restaurar Categoría
                            </Button>
                        ) : (
                            <Button
                                icon={<InboxOutlined />}
                                block
                                onClick={handleArchive}
                            >
                                Archivar Categoría
                            </Button>
                        )}

                        {!category.is_system && (
                            <Popconfirm
                                title="Eliminar categoría"
                                description="¿Estás seguro de eliminar esta categoría? Esta acción no se puede deshacer."
                                onConfirm={handleDelete}
                                okText="Eliminar"
                                cancelText="Cancelar"
                                okButtonProps={{ danger: true }}
                            >
                                <Button danger icon={<DeleteOutlined />} block>
                                    Eliminar Categoría
                                </Button>
                            </Popconfirm>
                        )}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
