import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Form, Input, Select, InputNumber, Button, Typography } from 'antd';
import { WalletOutlined } from '@ant-design/icons';
import { useTheme } from '@/app/contexts/ThemeContext';
import { usePlanning } from '@/app/hooks/usePlanning';
import { AccountTypeOption } from '@/app/types';
import { colors } from '@/app/styles/theme';

interface Props {
    accountTypes: AccountTypeOption[];
}

export default function AddFirstAccount({ accountTypes }: Props) {
    const { isDark } = useTheme();
    const { planning } = usePlanning();

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'checking',
        initial_balance: 0,
        color: '#1677ff',
    });

    const handleSubmit = () => {
        post('/accounts', {
            onSuccess: () => {
                router.visit('/dashboard');
            },
        });
    };

    const handleSkip = () => {
        router.visit('/dashboard');
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
            <Head title="Agregar Cuenta" />

            <div style={{ flex: 1, maxWidth: 400, margin: '0 auto', width: '100%' }}>
                {/* Icon */}
                <div style={{ textAlign: 'center', marginBottom: 24, marginTop: 32 }}>
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: 16,
                            backgroundColor: colors.primary[500],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            fontSize: 28,
                        }}
                    >
                        <WalletOutlined style={{ color: '#fff' }} />
                    </div>
                    <Typography.Title level={4} style={{ marginBottom: 4 }}>
                        Agrega tu primera cuenta
                    </Typography.Title>
                    <Typography.Text type="secondary">
                        Una cuenta representa donde guardas tu dinero: banco, efectivo, tarjeta, etc.
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
                            label="Nombre de la cuenta"
                            validateStatus={errors.name ? 'error' : ''}
                            help={errors.name}
                        >
                            <Input
                                placeholder="Ej: Cuenta Corriente BCI"
                                size="large"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Tipo de cuenta"
                            validateStatus={errors.type ? 'error' : ''}
                            help={errors.type}
                        >
                            <Select
                                size="large"
                                value={data.type}
                                onChange={(value) => setData('type', value)}
                                options={accountTypes.map((type) => ({
                                    value: type.value,
                                    label: type.label,
                                }))}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Saldo actual"
                            extra="El saldo que tiene la cuenta en este momento"
                            validateStatus={errors.initial_balance ? 'error' : ''}
                            help={errors.initial_balance}
                        >
                            <InputNumber
                                size="large"
                                style={{ width: '100%' }}
                                value={data.initial_balance}
                                onChange={(value) => setData('initial_balance', value || 0)}
                                formatter={(value) =>
                                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                                }
                                parser={(value) =>
                                    Number(value?.replace(/\$\s?|(\.)/g, '') || 0)
                                }
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
                                Agregar cuenta
                            </Button>
                        </Form.Item>

                        <Button
                            type="link"
                            block
                            onClick={handleSkip}
                            style={{ marginTop: 8 }}
                        >
                            Omitir por ahora
                        </Button>
                    </Form>
                </div>

                {/* Indicators */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            style={{
                                width: i === 2 ? 24 : 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: i === 2 ? colors.primary[500] : colors.neutral[300],
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
