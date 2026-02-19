import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Typography } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { colors } from '@/app/styles/theme';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/dashboard';
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 24,
                        backgroundColor: '#f5f5f5',
                    }}
                >
                    <div style={{ textAlign: 'center', maxWidth: 360 }}>
                        <div
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: 16,
                                backgroundColor: colors.warning.light,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                            }}
                        >
                            <WarningOutlined style={{ fontSize: 28, color: colors.warning.main }} />
                        </div>
                        <Typography.Title level={4} style={{ marginBottom: 8 }}>
                            Algo salió mal
                        </Typography.Title>
                        <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                            Ha ocurrido un error inesperado. Puedes intentar recargar la página o volver al inicio.
                        </Typography.Text>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                            <Button onClick={this.handleReload}>Recargar</Button>
                            <Button type="primary" onClick={this.handleGoHome}>
                                Ir al inicio
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
