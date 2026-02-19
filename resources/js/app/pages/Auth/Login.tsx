import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Form, Input, Button, Checkbox, Typography, Divider } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { AuthLayout } from '@/app/components/common/AuthLayout';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = () => {
        post('/login');
    };

    return (
        <AuthLayout title="Bienvenido" subtitle="Ingresa a tu cuenta">
            <Head title="Iniciar Sesión" />

            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Email"
                    validateStatus={errors.email ? 'error' : ''}
                    help={errors.email}
                >
                    <Input
                        prefix={<MailOutlined />}
                        type="email"
                        placeholder="tu@email.com"
                        size="large"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                </Form.Item>

                <Form.Item
                    label="Contraseña"
                    validateStatus={errors.password ? 'error' : ''}
                    help={errors.password}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="••••••••"
                        size="large"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                    />
                </Form.Item>

                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Checkbox
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        >
                            Recordarme
                        </Checkbox>
                        <Link href="/forgot-password">
                            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                                ¿Olvidaste tu clave?
                            </Typography.Text>
                        </Link>
                    </div>
                </Form.Item>

                <Form.Item style={{ marginBottom: 16 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={processing}
                    >
                        Iniciar Sesión
                    </Button>
                </Form.Item>
            </Form>

            <Divider plain>
                <Typography.Text type="secondary">o</Typography.Text>
            </Divider>

            <div style={{ textAlign: 'center' }}>
                <Typography.Text type="secondary">
                    ¿No tienes cuenta?{' '}
                    <Link href="/register">
                        <Typography.Text strong style={{ color: 'inherit' }}>
                            Regístrate
                        </Typography.Text>
                    </Link>
                </Typography.Text>
            </div>
        </AuthLayout>
    );
}
