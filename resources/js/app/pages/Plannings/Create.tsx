import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Form, Input, Select, Button, Typography, Card } from 'antd';
import { AppLayout } from '@/app/components/common/AppLayout';
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

const iconOptions = [
    { value: 'home', label: '🏠 Casa' },
    { value: 'briefcase', label: '💼 Trabajo' },
    { value: 'heart', label: '❤️ Familia' },
    { value: 'plane', label: '✈️ Viajes' },
    { value: 'star', label: '⭐ Proyectos' },
];

const colorOptions = [
    '#1677ff', '#52c41a', '#eb2f96', '#722ed1', '#fa8c16',
    '#13c2c2', '#f5222d', '#faad14',
];

export default function CreatePlanning() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        currency: 'CLP',
        icon: 'home',
        color: '#1677ff',
        month_start_day: 1,
        show_decimals: false,
    });

    const handleSubmit = () => {
        post('/plannings');
    };

    return (
        <AppLayout title="Nueva Planificación" showBack showBottomNav={false}>
            <Head title="Nueva Planificación" />

            <div style={{ padding: 16 }}>
                {/* Preview */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: 16,
                            backgroundColor: data.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 12px',
                            fontSize: 28,
                        }}
                    >
                        {data.icon === 'home' && '🏠'}
                        {data.icon === 'briefcase' && '💼'}
                        {data.icon === 'heart' && '❤️'}
                        {data.icon === 'plane' && '✈️'}
                        {data.icon === 'star' && '⭐'}
                    </div>
                    <Typography.Text strong style={{ fontSize: 16 }}>
                        {data.name || 'Mi planificación'}
                    </Typography.Text>
                </div>

                <Card style={{ borderRadius: 12 }}>
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            label="Nombre"
                            validateStatus={errors.name ? 'error' : ''}
                            help={errors.name}
                            required
                        >
                            <Input
                                placeholder="Ej: Finanzas personales"
                                size="large"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item label="Descripción">
                            <Input.TextArea
                                placeholder="Descripción opcional"
                                rows={2}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item label="Icono">
                            <Select
                                size="large"
                                value={data.icon}
                                onChange={(value) => setData('icon', value)}
                                options={iconOptions}
                            />
                        </Form.Item>

                        <Form.Item label="Color">
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {colorOptions.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setData('color', color)}
                                        style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 8,
                                            backgroundColor: color,
                                            border: data.color === color
                                                ? '3px solid var(--ant-color-text)'
                                                : '3px solid transparent',
                                            cursor: 'pointer',
                                        }}
                                    />
                                ))}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Moneda"
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
                            extra="El día en que comienza tu ciclo mensual"
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
                </Card>
            </div>
        </AppLayout>
    );
}
