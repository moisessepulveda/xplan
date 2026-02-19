import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { AppLayout } from '@/app/components/common/AppLayout';
import { InviteForm } from '@/app/components/members';
import type { MemberRole, RoleOption } from '@/app/types';

interface Props {
    roles: RoleOption[];
}

export default function MembersInvite({ roles }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        role: 'editor' as MemberRole,
    });

    const handleSubmit = () => {
        post('/members/invite');
    };

    return (
        <AppLayout title="Invitar Miembro" showBack>
            <Head title="Invitar Miembro" />

            <div style={{ padding: 16 }}>
                <InviteForm
                    data={data}
                    errors={errors}
                    processing={processing}
                    setData={(key, value) => setData(key as keyof typeof data, value as never)}
                    onSubmit={handleSubmit}
                    roles={roles}
                />
            </div>
        </AppLayout>
    );
}
