import React, { useRef, useState } from 'react';
import { Button } from 'antd';
import { EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import { colors } from '@/app/styles/theme';

interface SwipeAction {
    key: string;
    icon: React.ReactNode;
    color: string;
    backgroundColor: string;
    onClick: () => void;
}

interface Props {
    children: React.ReactNode;
    leftActions?: SwipeAction[];
    rightActions?: SwipeAction[];
    onEdit?: () => void;
    onDelete?: () => void;
    onDuplicate?: () => void;
    threshold?: number;
}

export function SwipeableItem({
    children,
    leftActions,
    rightActions,
    onEdit,
    onDelete,
    onDuplicate,
    threshold = 60,
}: Props) {
    const [offsetX, setOffsetX] = useState(0);
    const startXRef = useRef(0);
    const isDragging = useRef(false);

    // Build default right actions if individual handlers provided
    const resolvedRightActions = rightActions || [
        ...(onEdit ? [{
            key: 'edit',
            icon: <EditOutlined />,
            color: '#fff',
            backgroundColor: colors.primary[500],
            onClick: onEdit,
        }] : []),
        ...(onDuplicate ? [{
            key: 'duplicate',
            icon: <CopyOutlined />,
            color: '#fff',
            backgroundColor: colors.warning.main,
            onClick: onDuplicate,
        }] : []),
        ...(onDelete ? [{
            key: 'delete',
            icon: <DeleteOutlined />,
            color: '#fff',
            backgroundColor: colors.expense.main,
            onClick: onDelete,
        }] : []),
    ];

    const totalActionsWidth = resolvedRightActions.length * 56;

    const handleTouchStart = (e: React.TouchEvent) => {
        startXRef.current = e.touches[0].clientX;
        isDragging.current = false;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const diff = e.touches[0].clientX - startXRef.current;
        isDragging.current = true;

        if (diff < 0) {
            // Swiping left to reveal right actions
            setOffsetX(Math.max(diff, -totalActionsWidth));
        } else if (offsetX < 0) {
            // Swiping back
            setOffsetX(Math.min(0, offsetX + diff));
            startXRef.current = e.touches[0].clientX;
        }
    };

    const handleTouchEnd = () => {
        if (Math.abs(offsetX) > threshold) {
            setOffsetX(-totalActionsWidth);
        } else {
            setOffsetX(0);
        }
    };

    const handleActionClick = (action: SwipeAction) => {
        setOffsetX(0);
        action.onClick();
    };

    return (
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 12 }}>
            {/* Right actions */}
            {resolvedRightActions.length > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'stretch',
                    }}
                >
                    {resolvedRightActions.map((action) => (
                        <button
                            key={action.key}
                            onClick={() => handleActionClick(action)}
                            style={{
                                width: 56,
                                border: 'none',
                                backgroundColor: action.backgroundColor,
                                color: action.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: 18,
                            }}
                        >
                            {action.icon}
                        </button>
                    ))}
                </div>
            )}

            {/* Content */}
            <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    transform: `translateX(${offsetX}px)`,
                    transition: isDragging.current ? 'none' : 'transform 0.3s ease',
                    position: 'relative',
                    zIndex: 1,
                    backgroundColor: 'var(--color-bg-card, #fff)',
                }}
            >
                {children}
            </div>
        </div>
    );
}
