import React, { useRef, useState, useCallback } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { router } from '@inertiajs/react';

interface Props {
    children: React.ReactNode;
    onRefresh?: () => void;
    threshold?: number;
}

export function PullToRefresh({
    children,
    onRefresh,
    threshold = 80,
}: Props) {
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const startYRef = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleRefresh = useCallback(() => {
        if (onRefresh) {
            onRefresh();
        } else {
            // Default: reload using Inertia
            router.reload();
        }
    }, [onRefresh]);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (containerRef.current && containerRef.current.scrollTop === 0) {
            startYRef.current = e.touches[0].clientY;
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isRefreshing) return;
        if (!startYRef.current) return;

        const diff = e.touches[0].clientY - startYRef.current;

        if (diff > 0 && containerRef.current && containerRef.current.scrollTop === 0) {
            setPullDistance(Math.min(diff * 0.5, threshold * 1.5));
        }
    };

    const handleTouchEnd = () => {
        if (pullDistance >= threshold) {
            setIsRefreshing(true);
            handleRefresh();
            setTimeout(() => {
                setIsRefreshing(false);
                setPullDistance(0);
            }, 1000);
        } else {
            setPullDistance(0);
        }
        startYRef.current = 0;
    };

    const progress = Math.min(pullDistance / threshold, 1);

    return (
        <div
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ position: 'relative', overflow: 'auto', flex: 1 }}
        >
            {/* Pull indicator */}
            <div
                style={{
                    height: pullDistance > 0 || isRefreshing ? Math.max(pullDistance, isRefreshing ? 48 : 0) : 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    transition: pullDistance === 0 ? 'height 0.3s ease' : 'none',
                }}
            >
                {isRefreshing ? (
                    <LoadingOutlined style={{ fontSize: 20, color: 'var(--ant-color-primary)' }} spin />
                ) : (
                    <div
                        style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            border: '2px solid var(--ant-color-primary)',
                            borderTopColor: 'transparent',
                            transform: `rotate(${progress * 360}deg)`,
                            opacity: progress,
                        }}
                    />
                )}
            </div>

            {children}
        </div>
    );
}
