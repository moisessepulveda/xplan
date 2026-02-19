import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Form, Input, Button, Typography, Result } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { AuthLayout } from '@/app/components/common/AuthLayout';

interface Props {
    status?: string;
}

export default function ForgotPassword({ status }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = () => {
        post('/forgot-password');
    };

    if (status) {
        return (
            <AuthLayout title="Revisa tu correo" subtitle="">
                <Head title="Recuperar Contraseña" />

                <Result
                    status="success"
                    title="Enlace enviado"
                    subTitle="Hemos enviado un enlace de recuperación a tu correo electrónico. Revisa tu bandeja de entrada."
                    extra={[
                        <Link key="back" href="/login">
                            <Button type="primary" size="large">
                                Volver al inicio
                            </Button>
                        </Link>,
                    ]}
                />
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="¿Olvidaste tu clave?"
            subtitle="Te enviaremos un enlace para restablecerla"
        >
            <Head title="Recuperar Contraseña" />

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

                <Form.Item style={{ marginBottom: 16 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={processing}
                    >
                        Enviar enlace de recuperación
                    </Button>
                </Form.Item>
            </Form>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Link href="/login">
                    <Button type="link" icon={<ArrowLeftOutlined />}>
                        Volver a iniciar sesión
                    </Button>
                </Link>
            </div>
        </AuthLayout>
    );
}
