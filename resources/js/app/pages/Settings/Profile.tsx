import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card, Typography, Input, Button, Form, Divider, Avatar } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
    };
}

export default function Profile({ user }: Props) {
    const profileForm = useForm({
        name: user.name,
        email: user.email,
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleUpdateProfile = () => {
        profileForm.put('/settings/profile', {
            preserveScroll: true,
            onSuccess: () => {
                // Reset will clear any errors
            },
        });
    };

    const handleUpdatePassword = () => {
        passwordForm.put('/settings/password', {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
            },
        });
    };

    return (
        <AppLayout title="Perfil" showBack>
            <Head title="Perfil" />

            <div style={{ padding: 16 }}>
                {/* Avatar */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Avatar size={80} icon={<UserOutlined />} src={user.avatar} />
                    <Typography.Text strong style={{ display: 'block', marginTop: 8, fontSize: 16 }}>
                        {user.name}
                    </Typography.Text>
                </div>

                {/* Profile Form */}
                <Card
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <UserOutlined />
                            <span>Información personal</span>
                        </div>
                    }
                    style={{ borderRadius: 12, marginBottom: 16 }}
                    styles={{ body: { padding: 16 } }}
                >
                    <Form layout="vertical">
                        <Form.Item
                            label="Nombre"
                            validateStatus={profileForm.errors.name ? 'error' : ''}
                            help={profileForm.errors.name}
                        >
                            <Input
                                value={profileForm.data.name}
                                onChange={(e) => profileForm.setData('name', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Correo electrónico"
                            validateStatus={profileForm.errors.email ? 'error' : ''}
                            help={profileForm.errors.email}
                        >
                            <Input
                                type="email"
                                value={profileForm.data.email}
                                onChange={(e) => profileForm.setData('email', e.target.value)}
                            />
                        </Form.Item>
                        <Button
                            type="primary"
                            block
                            loading={profileForm.processing}
                            onClick={handleUpdateProfile}
                        >
                            Guardar cambios
                        </Button>
                    </Form>
                </Card>

                {/* Password Form */}
                <Card
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <LockOutlined />
                            <span>Cambiar contraseña</span>
                        </div>
                    }
                    style={{ borderRadius: 12 }}
                    styles={{ body: { padding: 16 } }}
                >
                    <Form layout="vertical">
                        <Form.Item
                            label="Contraseña actual"
                            validateStatus={passwordForm.errors.current_password ? 'error' : ''}
                            help={passwordForm.errors.current_password}
                        >
                            <Input.Password
                                value={passwordForm.data.current_password}
                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Nueva contraseña"
                            validateStatus={passwordForm.errors.password ? 'error' : ''}
                            help={passwordForm.errors.password}
                        >
                            <Input.Password
                                value={passwordForm.data.password}
                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Confirmar contraseña"
                            validateStatus={passwordForm.errors.password_confirmation ? 'error' : ''}
                            help={passwordForm.errors.password_confirmation}
                        >
                            <Input.Password
                                value={passwordForm.data.password_confirmation}
                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                            />
                        </Form.Item>
                        <Button
                            type="primary"
                            block
                            loading={passwordForm.processing}
                            onClick={handleUpdatePassword}
                        >
                            Cambiar contraseña
                        </Button>
                    </Form>
                </Card>
            </div>
        </AppLayout>
    );
}
