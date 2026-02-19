import React from 'react';
import { Empty } from 'antd';
import { MemberCard } from './MemberCard';
import type { PlanningMember, MemberRole, RoleOption } from '@/app/types';

interface MemberListProps {
    members: PlanningMember[];
    roles: RoleOption[];
    canManage: boolean;
    currentUserId: number;
    onChangeRole?: (memberId: number, role: MemberRole) => void;
    onRemove?: (memberId: number) => void;
}

export function MemberList({
    members,
    roles,
    canManage,
    currentUserId,
    onChangeRole,
    onRemove,
}: MemberListProps) {
    if (members.length === 0) {
        return (
            <Empty
                description="No hay miembros"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
        );
    }

    return (
        <div>
            {members.map((member) => (
                <MemberCard
                    key={member.id}
                    member={member}
                    roles={roles}
                    canManage={canManage}
                    isSelf={member.user_id === currentUserId}
                    onChangeRole={onChangeRole}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
}
