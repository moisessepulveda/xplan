import React from 'react';
import { Form, Input, Button } from 'antd';
import { MailOutlined, SendOutlined } from '@ant-design/icons';
import { RoleSelector } from './RoleSelector';
import type { MemberRole, RoleOption } from '@/app/types';

interface InviteFormProps {
    data: {
        email: string;
        role: MemberRole;
    };
    errors: Record<string, string>;
    processing: boolean;
    setData: (key: string, value: unknown) => void;
    onSubmit: () => void;
    roles: RoleOption[];
}

export function InviteForm({ data, errors, processing, setData, onSubmit, roles }: InviteFormProps) {
    return (
        <Form layout="vertical">
            <Form.Item
                label="Email del invitado"
                required
                validateStatus={errors.email ? 'error' : undefined}
                help={errors.email}
            >
                <Input
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    size="large"
                    prefix={<MailOutlined />}
                    placeholder="ejemplo@correo.com"
                    type="email"
                />
            </Form.Item>

            <Form.Item
                label="Rol"
                required
                validateStatus={errors.role ? 'error' : undefined}
                help={errors.role}
            >
                <RoleSelector
                    value={data.role}
                    onChange={(role) => setData('role', role)}
                    roles={roles}
                    size="large"
                />
            </Form.Item>

            <div style={{ marginTop: 8, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: '#595959' }}>
                    <li><strong>Administrador:</strong> Puede gestionar miembros y configuración</li>
                    <li><strong>Editor:</strong> Puede crear y editar transacciones, cuentas, etc.</li>
                    <li><strong>Visor:</strong> Solo puede ver la información</li>
                </ul>
            </div>

            <Button
                type="primary"
                size="large"
                block
                icon={<SendOutlined />}
                onClick={onSubmit}
                loading={processing}
                disabled={!data.email}
                style={{ marginTop: 16 }}
            >
                Enviar Invitación
            </Button>
        </Form>
    );
}
