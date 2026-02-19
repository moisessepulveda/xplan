import React from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { message } from 'antd';
import { AppLayout } from '@/app/components/common/AppLayout';
import { EmailAccountForm } from '@/app/components/email/EmailAccountForm';
import type { EmailAccount, EmailProviderOption, EmailSyncModeOption } from '@/app/types';

interface Props {
    account: EmailAccount;
    providers: EmailProviderOption[];
    syncModes: EmailSyncModeOption[];
}

export default function EditEmailAccount({ account, providers, syncModes }: Props) {
    const { processing } = useForm();

    const handleSubmit = (data: Record<string, unknown>) => {
        router.put(`/settings/email-accounts/${account.id}`, data, {
            onSuccess: () => message.success('Cuenta de correo actualizada'),
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                message.error(typeof firstError === 'string' ? firstError : 'Error al actualizar la cuenta');
            },
        });
    };

    return (
        <AppLayout title="Editar Cuenta de Correo" showBack backUrl="/settings/email-accounts">
            <Head title="Editar Cuenta de Correo" />

            <div style={{ padding: 16 }}>
                <EmailAccountForm
                    account={account}
                    providers={providers}
                    syncModes={syncModes}
                    processing={processing}
                    onSubmit={handleSubmit}
                />
            </div>
        </AppLayout>
    );
}
