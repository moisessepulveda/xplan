import React from 'react';
import { Select, Tag } from 'antd';
import type { MemberRole, RoleOption } from '@/app/types';

interface RoleSelectorProps {
    value: MemberRole;
    onChange: (role: MemberRole) => void;
    roles: RoleOption[];
    disabled?: boolean;
    size?: 'small' | 'middle' | 'large';
}

const roleColors: Record<string, string> = {
    owner: '#722ed1',
    admin: '#1677ff',
    editor: '#52c41a',
    viewer: '#8c8c8c',
};

export function RoleSelector({ value, onChange, roles, disabled = false, size = 'middle' }: RoleSelectorProps) {
    return (
        <Select
            value={value}
            onChange={onChange}
            disabled={disabled}
            size={size}
            style={{ minWidth: 130 }}
            options={roles.map((r) => ({
                value: r.value,
                label: <Tag color={roleColors[r.value]}>{r.label}</Tag>,
            }))}
        />
    );
}

export function RoleTag({ role, label }: { role: MemberRole; label?: string }) {
    return (
        <Tag color={roleColors[role]} style={{ margin: 0 }}>
            {label || role}
        </Tag>
    );
}
