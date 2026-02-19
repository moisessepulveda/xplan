import React from 'react';
import { Form, Input, Select, Button } from 'antd';
import { Category, CategoryTypeOption } from '@/app/types';

interface Props {
    category?: Category;
    categoryTypes: CategoryTypeOption[];
    parentCategories: Category[];
    data: {
        name: string;
        type: string;
        parent_id?: number | null;
        icon?: string;
        color?: string;
    };
    errors: Partial<Record<string, string>>;
    processing: boolean;
    setData: (key: string, value: unknown) => void;
    onSubmit: () => void;
}

const colorOptions = [
    '#1677ff', '#52c41a', '#eb2f96', '#722ed1', '#fa8c16',
    '#13c2c2', '#f5222d', '#faad14', '#2f54eb', '#a0d911',
    '#597ef7', '#36cfc9', '#ffc53d', '#ff7a45', '#9254de',
];

const iconOptions = [
    { value: 'dollar', label: '💵 Dinero' },
    { value: 'shopping-cart', label: '🛒 Compras' },
    { value: 'home', label: '🏠 Hogar' },
    { value: 'car', label: '🚗 Transporte' },
    { value: 'heart', label: '❤️ Salud' },
    { value: 'book', label: '📚 Educación' },
    { value: 'smile', label: '😊 Entretenimiento' },
    { value: 'gift', label: '🎁 Regalos' },
    { value: 'coffee', label: '☕ Comida' },
    { value: 'star', label: '⭐ Otros' },
];

export function CategoryForm({
    category,
    categoryTypes,
    parentCategories,
    data,
    errors,
    processing,
    setData,
    onSubmit,
}: Props) {
    // Filter parent categories by selected type
    const availableParents = parentCategories.filter(
        (cat) => cat.type === data.type && cat.id !== category?.id
    );

    return (
        <Form layout="vertical" onFinish={onSubmit}>
            <Form.Item
                label="Nombre"
                validateStatus={errors.name ? 'error' : ''}
                help={errors.name}
                required
            >
                <Input
                    placeholder="Ej: Supermercado"
                    size="large"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                />
            </Form.Item>

            {!category && (
                <Form.Item
                    label="Tipo"
                    validateStatus={errors.type ? 'error' : ''}
                    help={errors.type}
                    required
                >
                    <Select
                        size="large"
                        value={data.type}
                        onChange={(value) => {
                            setData('type', value);
                            setData('parent_id', null);
                        }}
                        options={categoryTypes.map((type) => ({
                            value: type.value,
                            label: (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div
                                        style={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: 3,
                                            backgroundColor: type.color,
                                        }}
                                    />
                                    {type.label}
                                </div>
                            ),
                        }))}
                    />
                </Form.Item>
            )}

            <Form.Item
                label="Categoría Padre (opcional)"
                extra="Deja vacío para crear una categoría principal"
            >
                <Select
                    size="large"
                    value={data.parent_id}
                    onChange={(value) => setData('parent_id', value)}
                    allowClear
                    placeholder="Sin categoría padre"
                    options={availableParents.map((cat) => ({
                        value: cat.id,
                        label: cat.name,
                    }))}
                />
            </Form.Item>

            <Form.Item label="Icono">
                <Select
                    size="large"
                    value={data.icon}
                    onChange={(value) => setData('icon', value)}
                    options={iconOptions}
                    placeholder="Selecciona un icono"
                />
            </Form.Item>

            <Form.Item label="Color">
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {colorOptions.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => setData('color', color)}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 8,
                                backgroundColor: color,
                                border: data.color === color
                                    ? '3px solid var(--ant-color-text)'
                                    : '3px solid transparent',
                                cursor: 'pointer',
                            }}
                        />
                    ))}
                </div>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={processing}
                >
                    {category ? 'Guardar Cambios' : 'Crear Categoría'}
                </Button>
            </Form.Item>
        </Form>
    );
}
