import React from 'react';
import { Drawer, Typography } from 'antd';
import type { DrawerProps } from 'antd';

export interface BottomSheetProps extends Omit<DrawerProps, 'placement'> {
    title?: React.ReactNode;
    subtitle?: string;
    headerExtra?: React.ReactNode;
    children: React.ReactNode;
    height?: string | number;
    showHandle?: boolean;
}

export function BottomSheet({
    title,
    subtitle,
    headerExtra,
    children,
    height = 'auto',
    showHandle = true,
    open,
    onClose,
    ...drawerProps
}: BottomSheetProps) {
    return (
        <Drawer
            placement="bottom"
            open={open}
            onClose={onClose}
            height={height}
            closable={false}
            styles={{
                wrapper: {
                    maxHeight: '90vh',
                },
                content: {
                    borderRadius: '16px 16px 0 0',
                },
                header: {
                    borderBottom: 'none',
                    padding: '12px 16px 0',
                },
                body: {
                    padding: '0 16px 16px',
                },
            }}
            title={
                <div>
                    {showHandle && (
                        <div
                            style={{
                                width: 36,
                                height: 4,
                                backgroundColor: 'var(--color-border, #e5e5e5)',
                                borderRadius: 2,
                                margin: '0 auto 12px',
                            }}
                        />
                    )}
                    {(title || subtitle || headerExtra) && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                {title && (
                                    typeof title === 'string' ? (
                                        <Typography.Title level={5} style={{ margin: 0 }}>
                                            {title}
                                        </Typography.Title>
                                    ) : title
                                )}
                                {subtitle && (
                                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                        {subtitle}
                                    </Typography.Text>
                                )}
                            </div>
                            {headerExtra}
                        </div>
                    )}
                </div>
            }
            {...drawerProps}
        >
            {children}
        </Drawer>
    );
}
