import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Form, Input, Button, Checkbox, Typography, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { AuthLayout } from '@/app/components/common/AuthLayout';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const handleSubmit = () => {
        post('/register');
    };

    return (
        <AuthLayout title="Crear cuenta" subtitle="Comienza a organizar tus finanzas">
            <Head title="Registrarse" />

            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Nombre"
                    validateStatus={errors.name ? 'error' : ''}
                    help={errors.name}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Tu nombre"
                        size="large"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                </Form.Item>

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
                        placeholder="Mínimo 8 caracteres"
                        size="large"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                    />
                </Form.Item>

                <Form.Item
                    label="Confirmar contraseña"
                    validateStatus={errors.password_confirmation ? 'error' : ''}
                    help={errors.password_confirmation}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Repite tu contraseña"
                        size="large"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />
                </Form.Item>

                <Form.Item>
                    <Checkbox
                        checked={data.terms}
                        onChange={(e) => setData('terms', e.target.checked)}
                    >
                        Acepto los{' '}
                        <Typography.Link href="#" target="_blank">
                            términos y condiciones
                        </Typography.Link>
                    </Checkbox>
                </Form.Item>

                <Form.Item style={{ marginBottom: 16 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={processing}
                        disabled={!data.terms}
                    >
                        Crear cuenta
                    </Button>
                </Form.Item>
            </Form>

            <Divider plain>
                <Typography.Text type="secondary">o</Typography.Text>
            </Divider>

            <div style={{ textAlign: 'center' }}>
                <Typography.Text type="secondary">
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/login">
                        <Typography.Text strong style={{ color: 'inherit' }}>
                            Inicia sesión
                        </Typography.Text>
                    </Link>
                </Typography.Text>
            </div>
        </AuthLayout>
    );
}
