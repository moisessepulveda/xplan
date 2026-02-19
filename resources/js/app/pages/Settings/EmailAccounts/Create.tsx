import React from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { message } from 'antd';
import { AppLayout } from '@/app/components/common/AppLayout';
import { EmailAccountForm } from '@/app/components/email/EmailAccountForm';
import type { EmailProviderOption, EmailSyncModeOption } from '@/app/types';

interface Props {
    providers: EmailProviderOption[];
    syncModes: EmailSyncModeOption[];
}

export default function CreateEmailAccount({ providers, syncModes }: Props) {
    const { processing } = useForm();

    const handleSubmit = (data: Record<string, unknown>) => {
        router.post('/settings/email-accounts', data, {
            onSuccess: () => message.success('Cuenta de correo creada'),
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                message.error(typeof firstError === 'string' ? firstError : 'Error al crear la cuenta');
            },
        });
    };

    return (
        <AppLayout title="Nueva Cuenta de Correo" showBack backUrl="/settings/email-accounts">
            <Head title="Nueva Cuenta de Correo" />

            <div style={{ padding: 16 }}>
                <EmailAccountForm
                    providers={providers}
                    syncModes={syncModes}
                    processing={processing}
                    onSubmit={handleSubmit}
                />
            </div>
        </AppLayout>
    );
}
