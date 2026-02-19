import React from 'react';
import { colors } from '@/app/styles/theme';

interface ProgressBarProps {
    percentage: number;
    height?: number;
    showLabel?: boolean;
    status?: 'normal' | 'caution' | 'warning' | 'exceeded';
}

const statusColors: Record<string, string> = {
    normal: colors.success.main,
    caution: colors.warning.main,
    warning: '#fa8c16',
    exceeded: colors.error.main,
};

function getStatusFromPercentage(percentage: number): string {
    if (percentage >= 100) return 'exceeded';
    if (percentage >= 80) return 'warning';
    if (percentage >= 50) return 'caution';
    return 'normal';
}

export function ProgressBar({ percentage, height = 8, showLabel = false, status }: ProgressBarProps) {
    const resolvedStatus = status || getStatusFromPercentage(percentage);
    const barColor = statusColors[resolvedStatus] || statusColors.normal;
    const clampedPercentage = Math.min(percentage, 100);

    return (
        <div style={{ width: '100%' }}>
            <div
                style={{
                    width: '100%',
                    height,
                    backgroundColor: colors.neutral[200],
                    borderRadius: height / 2,
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        width: `${clampedPercentage}%`,
                        height: '100%',
                        backgroundColor: barColor,
                        borderRadius: height / 2,
                        transition: 'width 0.3s ease, background-color 0.3s ease',
                    }}
                />
            </div>
            {showLabel && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: 4,
                    }}
                >
                    <span
                        style={{
                            fontSize: 12,
                            color: barColor,
                            fontWeight: 600,
                        }}
                    >
                        {percentage.toFixed(1)}%
                    </span>
                </div>
            )}
        </div>
    );
}
