import React, { useState, useMemo } from 'react';
import { Modal, List, Typography, Empty, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Category } from '@/app/types';
import { getIcon } from '@/app/utils/icons';

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
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        let result = type
            ? categories.filter((c) => c.type === type)
            : categories;

        if (search.trim()) {
            const searchLower = search.toLowerCase().trim();
            result = result
                .map((category) => {
                    // Check if parent matches
                    const parentMatches = category.name.toLowerCase().includes(searchLower);
                    // Filter children that match
                    const matchingChildren = category.children?.filter((child) =>
                        child.name.toLowerCase().includes(searchLower)
                    );

                    // Include category if parent matches or has matching children
                    if (parentMatches || (matchingChildren && matchingChildren.length > 0)) {
                        return {
                            ...category,
                            // If parent matches, show all children; otherwise show only matching children
                            children: parentMatches ? category.children : matchingChildren,
                        };
                    }
                    return null;
                })
                .filter(Boolean) as Category[];
        }

        return result;
    }, [categories, type, search]);

    const handleSelect = (category: Category) => {
        onSelect(category.id);
        setSearch('');
        onClose();
    };

    const handleClose = () => {
        setSearch('');
        onClose();
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            title="Seleccionar Categoría"
            centered
            styles={{
                body: { padding: 0, maxHeight: 450, overflowY: 'auto' },
                content: { borderRadius: 16 },
            }}
        >
            {/* Search input */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--ant-color-border)' }}>
                <Input
                    placeholder="Buscar categoría..."
                    prefix={<SearchOutlined style={{ color: 'var(--ant-color-text-quaternary)' }} />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    allowClear
                    autoFocus
                />
            </div>

            {filtered.length === 0 ? (
                <div style={{ padding: 24 }}>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={search ? `No se encontró "${search}"` : 'Sin categorías disponibles'}
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
                                            {getIcon(category.icon)}
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
