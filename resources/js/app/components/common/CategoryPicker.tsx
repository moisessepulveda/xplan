import React, { useMemo } from 'react';
import { Typography, Empty } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { BottomSheet } from './BottomSheet';
import { Category } from '@/app/types';
import { getIcon } from '@/app/utils/icons';
import { colors } from '@/app/styles/theme';

interface CategoryPickerProps {
    open: boolean;
    onClose: () => void;
    onSelect: (category: Category) => void;
    categories: Category[];
    selectedId?: number;
    type?: 'income' | 'expense';
    title?: string;
}

interface CategoryItemProps {
    category: Category;
    isSelected: boolean;
    onSelect: (category: Category) => void;
}

function CategoryItem({ category, isSelected, onSelect }: CategoryItemProps) {
    return (
        <div
            onClick={() => onSelect(category)}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 72,
                cursor: 'pointer',
            }}
        >
            <div
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: category.color || category.type_color || colors.primary[500],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 20,
                    position: 'relative',
                    border: isSelected ? '3px solid var(--ant-color-primary)' : '3px solid transparent',
                    boxShadow: isSelected ? '0 0 0 2px var(--ant-color-primary-bg)' : 'none',
                    transition: 'all 0.2s ease',
                }}
            >
                {getIcon(category.icon)}
                {isSelected && (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: -2,
                            right: -2,
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            backgroundColor: 'var(--ant-color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: 10,
                        }}
                    >
                        <CheckOutlined />
                    </div>
                )}
            </div>
            <Typography.Text
                style={{
                    fontSize: 11,
                    textAlign: 'center',
                    marginTop: 6,
                    lineHeight: 1.3,
                    width: 72,
                    wordWrap: 'break-word',
                    hyphens: 'auto',
                }}
                type={isSelected ? undefined : 'secondary'}
            >
                {category.name}
            </Typography.Text>
        </div>
    );
}

export function CategoryPicker({
    open,
    onClose,
    onSelect,
    categories,
    selectedId,
    type,
    title = 'Seleccionar Categoría',
}: CategoryPickerProps) {
    // Filter by type if specified and group categories
    const groupedCategories = useMemo(() => {
        let filtered = type
            ? categories.filter((c) => c.type === type)
            : categories;

        // Separate parent categories (no parent_id) and child categories
        const parents = filtered.filter((c) => !c.parent_id);
        const groups: { parent: Category; children: Category[] }[] = [];

        parents.forEach((parent) => {
            const children = parent.children || [];
            groups.push({
                parent,
                children: children.filter((child) => !type || child.type === type),
            });
        });

        return groups;
    }, [categories, type]);

    const handleSelect = (category: Category) => {
        onSelect(category);
        onClose();
    };

    const isEmpty = groupedCategories.length === 0;

    return (
        <BottomSheet
            open={open}
            onClose={onClose}
            title={title}
            height="70vh"
        >
            {isEmpty ? (
                <div style={{ padding: '24px 0' }}>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No hay categorías disponibles"
                    />
                </div>
            ) : (
                <div
                    style={{
                        overflowY: 'auto',
                        maxHeight: 'calc(70vh - 80px)',
                        paddingBottom: 16,
                    }}
                >
                    {groupedCategories.map(({ parent, children }) => (
                        <div key={parent.id} style={{ marginBottom: 28 }}>
                            {/* Parent category as header */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    marginBottom: 16,
                                    paddingBottom: 10,
                                    borderBottom: '1px solid var(--color-border, #f0f0f0)',
                                }}
                            >
                                <div
                                    style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: 8,
                                        backgroundColor: parent.color || parent.type_color || colors.primary[500],
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontSize: 14,
                                    }}
                                >
                                    {getIcon(parent.icon)}
                                </div>
                                <Typography.Text strong style={{ fontSize: 15 }}>
                                    {parent.name}
                                </Typography.Text>
                            </div>

                            {/* Category items grid */}
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                    gap: '20px 12px',
                                    justifyItems: 'center',
                                }}
                            >
                                {/* Parent as selectable option if no children */}
                                {children.length === 0 && (
                                    <CategoryItem
                                        category={parent}
                                        isSelected={selectedId === parent.id}
                                        onSelect={handleSelect}
                                    />
                                )}

                                {/* Children categories */}
                                {children.map((child) => (
                                    <CategoryItem
                                        key={child.id}
                                        category={child}
                                        isSelected={selectedId === child.id}
                                        onSelect={handleSelect}
                                    />
                                ))}

                                {/* Also show parent as option when it has children */}
                                {children.length > 0 && (
                                    <CategoryItem
                                        category={{ ...parent, name: 'General' }}
                                        isSelected={selectedId === parent.id}
                                        onSelect={() => handleSelect(parent)}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </BottomSheet>
    );
}
