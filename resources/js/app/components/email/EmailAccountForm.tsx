import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Alert, InputNumber, Switch, Card, Typography, Spin } from 'antd';
import {
    MailOutlined,
    LockOutlined,
    GoogleOutlined,
    WindowsOutlined,
    AppleOutlined,
    SettingOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    LoadingOutlined,
} from '@ant-design/icons';
import type { EmailAccount, EmailProviderOption, EmailSyncModeOption } from '@/app/types';
import { colors } from '@/app/styles/theme';

interface EmailAccountFormProps {
    account?: EmailAccount;
    providers: EmailProviderOption[];
    syncModes: EmailSyncModeOption[];
    processing: boolean;
    onSubmit: (data: Record<string, unknown>) => void;
}

const providerIcons: Record<string, React.ReactNode> = {
    google: <GoogleOutlined />,
    windows: <WindowsOutlined />,
    apple: <AppleOutlined />,
    yahoo: <MailOutlined />,
    setting: <SettingOutlined />,
};

export function EmailAccountForm({ account, providers, syncModes, processing, onSubmit }: EmailAccountFormProps) {
    const [form] = Form.useForm();
    const [selectedProvider, setSelectedProvider] = useState<EmailProviderOption | undefined>(
        account ? providers.find(p => p.value === account.provider) : undefined
    );
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
    const [testing, setTesting] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    useEffect(() => {
        if (selectedProvider && selectedProvider.value !== 'custom') {
            form.setFieldsValue({
                imap_host: selectedProvider.imap_config.host,
                imap_port: selectedProvider.imap_config.port,
                imap_encryption: selectedProvider.imap_config.encryption,
            });
        }
    }, [selectedProvider, form]);

    const handleProviderChange = (value: string) => {
        const provider = providers.find(p => p.value === value);
        setSelectedProvider(provider);
        setTestResult(null);

        if (provider && provider.value !== 'custom') {
            form.setFieldsValue({
                imap_host: provider.imap_config.host,
                imap_port: provider.imap_config.port,
                imap_encryption: provider.imap_config.encryption,
            });
        }
    };

    const handleTestConnection = async () => {
        try {
            await form.validateFields(['email', 'password', 'imap_host', 'imap_port', 'imap_encryption']);
            const values = form.getFieldsValue();

            setTesting(true);
            setTestResult(null);

            const response = await fetch('/settings/email-accounts/test-connection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    provider: values.provider,
                    email: values.email,
                    password: values.password,
                    imap_host: values.imap_host,
                    imap_port: values.imap_port,
                    imap_encryption: values.imap_encryption,
                    folder: values.folder || 'INBOX',
                }),
            });

            const data = await response.json();
            setTestResult(data);
        } catch (error) {
            setTestResult({
                success: false,
                message: 'Por favor completa todos los campos requeridos',
            });
        } finally {
            setTesting(false);
        }
    };

    const handleSubmit = (values: Record<string, unknown>) => {
        onSubmit(values);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
                name: account?.name || '',
                email: account?.email || '',
                provider: account?.provider || undefined,
                imap_host: account?.imap_host || '',
                imap_port: account?.imap_port || 993,
                imap_encryption: account?.imap_encryption || 'ssl',
                folder: account?.folder || 'INBOX',
                is_active: account?.is_active ?? true,
                sync_frequency: account?.sync_frequency || 15,
                sync_mode: account?.sync_mode || 'new_only',
            }}
        >
            {/* Provider Selection */}
            <Form.Item
                name="provider"
                label="Proveedor de correo"
                rules={[{ required: true, message: 'Selecciona un proveedor' }]}
            >
                <Select
                    placeholder="Selecciona tu proveedor"
                    onChange={handleProviderChange}
                    size="large"
                    options={providers.map(p => ({
                        value: p.value,
                        label: (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {providerIcons[p.icon]}
                                {p.label}
                            </span>
                        ),
                    }))}
                />
            </Form.Item>

            {/* Help Text */}
            {selectedProvider && (
                <Alert
                    type="info"
                    message={selectedProvider.help_text}
                    style={{ marginBottom: 16 }}
                    showIcon
                />
            )}

            {/* Name */}
            <Form.Item
                name="name"
                label="Nombre descriptivo"
                rules={[{ required: true, message: 'Ingresa un nombre' }]}
            >
                <Input
                    placeholder="Ej: Gmail Personal"
                    size="large"
                />
            </Form.Item>

            {/* Email */}
            <Form.Item
                name="email"
                label="Correo electrónico"
                rules={[
                    { required: true, message: 'Ingresa tu correo' },
                    { type: 'email', message: 'Correo no válido' },
                ]}
            >
                <Input
                    prefix={<MailOutlined />}
                    placeholder="tu@correo.com"
                    size="large"
                />
            </Form.Item>

            {/* Password */}
            <Form.Item
                name="password"
                label={account ? "Contraseña (dejar vacío para mantener)" : "Contraseña de aplicación"}
                rules={account ? [] : [{ required: true, message: 'Ingresa la contraseña' }]}
                extra={!account && selectedProvider?.value === 'gmail' && (
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        Para Gmail, necesitas una contraseña de aplicación.{' '}
                        <a href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noopener noreferrer">
                            ¿Cómo obtenerla?
                        </a>
                    </Typography.Text>
                )}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder={account ? "••••••••" : "Contraseña de aplicación"}
                    size="large"
                />
            </Form.Item>

            {/* Advanced Settings Toggle */}
            <div style={{ marginBottom: 16 }}>
                <Button type="link" onClick={() => setShowAdvanced(!showAdvanced)} style={{ padding: 0 }}>
                    {showAdvanced ? 'Ocultar configuración avanzada' : 'Mostrar configuración avanzada'}
                </Button>
            </div>

            {/* Advanced Settings */}
            {(showAdvanced || selectedProvider?.value === 'custom') && (
                <Card
                    style={{ marginBottom: 16, borderRadius: 12 }}
                    styles={{ body: { padding: 16 } }}
                >
                    <Typography.Text strong style={{ display: 'block', marginBottom: 16 }}>
                        Configuración IMAP
                    </Typography.Text>

                    <Form.Item
                        name="imap_host"
                        label="Servidor IMAP"
                        rules={[{ required: true, message: 'Requerido' }]}
                    >
                        <Input placeholder="imap.ejemplo.com" />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: 16 }}>
                        <Form.Item
                            name="imap_port"
                            label="Puerto"
                            rules={[{ required: true, message: 'Requerido' }]}
                            style={{ flex: 1 }}
                        >
                            <InputNumber min={1} max={65535} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            name="imap_encryption"
                            label="Encriptación"
                            rules={[{ required: true, message: 'Requerido' }]}
                            style={{ flex: 1 }}
                        >
                            <Select
                                options={[
                                    { value: 'ssl', label: 'SSL' },
                                    { value: 'tls', label: 'TLS' },
                                ]}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="folder"
                        label="Carpeta"
                    >
                        <Input placeholder="INBOX" />
                    </Form.Item>

                    <Form.Item
                        name="sync_frequency"
                        label="Frecuencia de sincronización (minutos)"
                    >
                        <InputNumber min={5} max={1440} style={{ width: '100%' }} />
                    </Form.Item>
                </Card>
            )}

            {/* Sync Mode - Only show when creating or initial sync not done */}
            {(!account || !account.initial_sync_done) && (
                <Form.Item
                    name="sync_mode"
                    label="Modo de sincronización inicial"
                    rules={[{ required: true, message: 'Selecciona un modo' }]}
                    extra={
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            Define cómo se procesarán los emails la primera vez que sincronices esta cuenta.
                        </Typography.Text>
                    }
                >
                    <Select
                        size="large"
                        options={syncModes.map(mode => ({
                            value: mode.value,
                            label: (
                                <div>
                                    <div>{mode.label}</div>
                                    <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                                        {mode.description}
                                    </Typography.Text>
                                </div>
                            ),
                        }))}
                        optionRender={(option) => {
                            const mode = syncModes.find(m => m.value === option.value);
                            return (
                                <div style={{ padding: '4px 0' }}>
                                    <div style={{ fontWeight: 500 }}>{mode?.label}</div>
                                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                        {mode?.description}
                                    </Typography.Text>
                                </div>
                            );
                        }}
                    />
                </Form.Item>
            )}

            {/* Show current sync mode info if already configured */}
            {account && account.initial_sync_done && (
                <Alert
                    type="info"
                    message={`Modo de sincronización: ${account.sync_mode_label || 'Solo emails nuevos'}`}
                    description="El modo de sincronización ya fue configurado en la primera sincronización y no puede cambiarse."
                    style={{ marginBottom: 16 }}
                    showIcon
                />
            )}

            {/* Active Switch */}
            <Form.Item
                name="is_active"
                label="Cuenta activa"
                valuePropName="checked"
            >
                <Switch />
            </Form.Item>

            {/* Test Connection */}
            <Card
                style={{ marginBottom: 16, borderRadius: 12 }}
                styles={{ body: { padding: 16 } }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Typography.Text strong>Probar conexión</Typography.Text>
                        <Typography.Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                            Verifica que la configuración sea correcta
                        </Typography.Text>
                    </div>
                    <Button
                        onClick={handleTestConnection}
                        loading={testing}
                        icon={testing ? <LoadingOutlined /> : undefined}
                    >
                        Probar
                    </Button>
                </div>

                {testResult && (
                    <div style={{ marginTop: 12 }}>
                        <Alert
                            type={testResult.success ? 'success' : 'error'}
                            message={testResult.message}
                            icon={testResult.success ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                            showIcon
                        />
                    </div>
                )}
            </Card>

            {/* Submit Button */}
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={processing}
                    block
                    size="large"
                >
                    {account ? 'Actualizar cuenta' : 'Crear cuenta'}
                </Button>
            </Form.Item>
        </Form>
    );
}
