import React from 'react';
import { Modal, List, Typography, Empty } from 'antd';
import { Category } from '@/app/types';

interface Props {
    open: boolean;
    onClose: () => void;
    onSelect: (categoryId: number) => void;
    categories: Category[];
    selectedId?: number;
    type?: 'income' | 'expense';
}

export function CategorySelector({
    open,
    onClose,
    onSelect,
    categories,
    selectedId,
    type,
}: Props) {
    const filtered = type
        ? categories.filter((c) => c.type === type)
        : categories;

    const handleSelect = (category: Category) => {
        onSelect(category.id);
        onClose();
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            title="Seleccionar Categoría"
            centered
            styles={{
                body: { padding: 0, maxHeight: 400, overflowY: 'auto' },
                content: { borderRadius: 16 },
            }}
        >
            {filtered.length === 0 ? (
                <div style={{ padding: 24 }}>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Sin categorías disponibles"
                    />
                </div>
            ) : (
                <List
                    dataSource={filtered}
                    renderItem={(category) => (
                        <React.Fragment key={category.id}>
                            <List.Item
                                onClick={() => handleSelect(category)}
                                style={{
                                    padding: '12px 24px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedId === category.id ? 'var(--ant-color-primary-bg)' : undefined,
                                }}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <div
                                            style={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: 8,
                                                backgroundColor: category.color || category.type_color,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#fff',
                                                fontSize: 16,
                                            }}
                                        >
                                            {category.icon || category.name.charAt(0).toUpperCase()}
                                        </div>
                                    }
                                    title={category.name}
                                />
                            </List.Item>
                            {category.children?.map((child) => (
                                <List.Item
                                    key={child.id}
                                    onClick={() => handleSelect(child)}
                                    style={{
                                        padding: '10px 24px 10px 56px',
                                        cursor: 'pointer',
                                        backgroundColor: selectedId === child.id ? 'var(--ant-color-primary-bg)' : undefined,
                                    }}
                                >
                                    <Typography.Text>{child.name}</Typography.Text>
                                </List.Item>
                            ))}
                        </React.Fragment>
                    )}
                />
            )}
        </Modal>
    );
}
