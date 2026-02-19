import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Form, Input, Select, Button, Typography } from 'antd';
import { useTheme } from '@/app/contexts/ThemeContext';
import { colors } from '@/app/styles/theme';

const currencies = [
    { value: 'CLP', label: 'CLP - Peso Chileno' },
    { value: 'USD', label: 'USD - Dólar Estadounidense' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'MXN', label: 'MXN - Peso Mexicano' },
    { value: 'ARS', label: 'ARS - Peso Argentino' },
    { value: 'COP', label: 'COP - Peso Colombiano' },
    { value: 'PEN', label: 'PEN - Sol Peruano' },
];

export default function CreatePlanning() {
    const { isDark } = useTheme();
    const { data, setData, post, processing, errors } = useForm({
        name: 'Mis finanzas',
        description: '',
        currency: 'CLP',
        icon: 'home',
        color: '#1677ff',
        month_start_day: 1,
    });

    const handleSubmit = () => {
        post('/plannings');
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                padding: 24,
                backgroundColor: isDark ? colors.neutral[950] : colors.neutral[100],
            }}
        >
            <Head title="Crear Planificación" />

            <div style={{ flex: 1, maxWidth: 400, margin: '0 auto', width: '100%' }}>
                {/* Icon */}
                <div style={{ textAlign: 'center', marginBottom: 24, marginTop: 32 }}>
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: 16,
                            backgroundColor: data.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            fontSize: 28,
                        }}
                    >
                        🏠
                    </div>
                    <Typography.Title level={4} style={{ marginBottom: 4 }}>
                        Crea tu primera planificación
                    </Typography.Title>
                    <Typography.Text type="secondary">
                        Una planificación es tu espacio personal para organizar tus finanzas.
                    </Typography.Text>
                </div>

                <div
                    style={{
                        backgroundColor: isDark ? colors.neutral[900] : colors.neutral[0],
                        borderRadius: 16,
                        padding: 24,
                    }}
                >
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            label="Nombre"
                            validateStatus={errors.name ? 'error' : ''}
                            help={errors.name}
                        >
                            <Input
                                placeholder="Ej: Mis finanzas personales"
                                size="large"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Moneda principal"
                            validateStatus={errors.currency ? 'error' : ''}
                            help={errors.currency}
                        >
                            <Select
                                size="large"
                                value={data.currency}
                                onChange={(value) => setData('currency', value)}
                                options={currencies}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Día de inicio del mes"
                            extra="El día en que comienza tu ciclo mensual (ej: día de pago)"
                            validateStatus={errors.month_start_day ? 'error' : ''}
                            help={errors.month_start_day}
                        >
                            <Select
                                size="large"
                                value={data.month_start_day}
                                onChange={(value) => setData('month_start_day', value)}
                                options={Array.from({ length: 28 }, (_, i) => ({
                                    value: i + 1,
                                    label: `Día ${i + 1}`,
                                }))}
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                block
                                loading={processing}
                            >
                                Crear planificación
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

                {/* Indicators */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            style={{
                                width: i === 1 ? 24 : 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: i === 1 ? colors.primary[500] : colors.neutral[300],
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
