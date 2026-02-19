import React from 'react';
import { Typography, Tag, Button } from 'antd';
import { EditOutlined, RightOutlined } from '@ant-design/icons';
import { Category } from '@/app/types';
import { getIcon } from '@/app/utils/icons';

interface Props {
    category: Category;
    onEdit?: () => void;
    onClick?: () => void;
    showChildren?: boolean;
}

export function CategoryItem({ category, onEdit, onClick, showChildren = true }: Props) {
    const hasChildren = category.children && category.children.length > 0;

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    backgroundColor: 'var(--color-bg-card)',
                    borderRadius: 12,
                    marginBottom: 8,
                    cursor: onClick ? 'pointer' : 'default',
                    opacity: category.is_archived ? 0.6 : 1,
                }}
                onClick={onClick}
            >
                <div
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        backgroundColor: category.color || category.type_color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                        fontSize: 18,
                    }}
                >
                    <span style={{ color: '#fff' }}>
                        {getIcon(category.icon)}
                    </span>
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Typography.Text strong>{category.name}</Typography.Text>
                        {category.is_system && (
                            <Tag color="blue" style={{ fontSize: 10 }}>Sistema</Tag>
                        )}
                        {category.is_archived && (
                            <Tag color="default" style={{ fontSize: 10 }}>Archivada</Tag>
                        )}
                    </div>
                    {hasChildren && showChildren && (
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            {category.children!.length} subcategoría{category.children!.length > 1 ? 's' : ''}
                        </Typography.Text>
                    )}
                </div>

                {onEdit && (
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                    />
                )}

                {hasChildren && showChildren && (
                    <RightOutlined style={{ color: '#8c8c8c', marginLeft: 8 }} />
                )}
            </div>

            {showChildren && hasChildren && (
                <div style={{ marginLeft: 24, borderLeft: '2px solid #f0f0f0', paddingLeft: 16 }}>
                    {category.children!.map((child) => (
                        <CategoryItem
                            key={child.id}
                            category={child}
                            onEdit={onEdit ? () => onEdit() : undefined}
                            onClick={onClick}
                            showChildren={false}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
