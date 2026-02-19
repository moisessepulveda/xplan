import React from 'react';
import { Card, Typography, Button, Popconfirm, Avatar } from 'antd';
import { UserOutlined, DeleteOutlined, CrownOutlined } from '@ant-design/icons';
import { RoleSelector, RoleTag } from './RoleSelector';
import type { PlanningMember, MemberRole, RoleOption } from '@/app/types';
import { colors } from '@/app/styles/theme';

interface MemberCardProps {
    member: PlanningMember;
    roles: RoleOption[];
    canManage: boolean;
    isSelf: boolean;
    onChangeRole?: (memberId: number, role: MemberRole) => void;
    onRemove?: (memberId: number) => void;
}

export function MemberCard({ member, roles, canManage, isSelf, onChangeRole, onRemove }: MemberCardProps) {
    const initials = member.user?.name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || '?';

    return (
        <Card
            size="small"
            style={{ marginBottom: 8, borderRadius: 12 }}
            styles={{ body: { padding: '12px 16px' } }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar
                    src={member.user?.avatar}
                    icon={!member.user?.avatar && <UserOutlined />}
                    style={{
                        backgroundColor: member.is_owner ? colors.primary[500] : colors.neutral[300],
                        flexShrink: 0,
                    }}
                    size={40}
                >
                    {initials}
                </Avatar>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Typography.Text strong style={{ fontSize: 14 }} ellipsis>
                            {member.user?.name || 'Usuario'}
                        </Typography.Text>
                        {member.is_owner && (
                            <CrownOutlined style={{ color: '#faad14', fontSize: 14 }} />
                        )}
                        {isSelf && (
                            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                                (tú)
                            </Typography.Text>
                        )}
                    </div>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }} ellipsis>
                        {member.user?.email}
                    </Typography.Text>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {canManage && !member.is_owner && !isSelf ? (
                        <>
                            <RoleSelector
                                value={member.role}
                                onChange={(role) => onChangeRole?.(member.id, role)}
                                roles={roles}
                                size="small"
                            />
                            <Popconfirm
                                title="Eliminar miembro"
                                description={`¿Eliminar a ${member.user?.name}?`}
                                onConfirm={() => onRemove?.(member.id)}
                                okText="Eliminar"
                                cancelText="Cancelar"
                                okButtonProps={{ danger: true }}
                            >
                                <Button
                                    type="text"
                                    size="small"
                                    danger
                                    icon={<DeleteOutlined />}
                                />
                            </Popconfirm>
                        </>
                    ) : (
                        <RoleTag role={member.role} label={member.role_label} />
                    )}
                </div>
            </div>
        </Card>
    );
}
