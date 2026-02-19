import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Alert, Button, Modal, message } from 'antd';
import { WarningOutlined, CalendarOutlined } from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { BudgetForm } from '@/app/components/budgets';
import type { Budget, Category } from '@/app/types';
import type { BudgetLineFormData } from '@/app/components/budgets/BudgetLineItem';

interface UnclosedPeriod {
    period: string;
    label: string;
}

interface CreditsInfo {
    monthly_total: number;
    active_count: number;
    category_id: number | null;
    category_name: string | null;
}

interface Props {
    budget: Budget | null;
    categories: Category[];
    unclosedPeriods: UnclosedPeriod[];
    creditsInfo: CreditsInfo;
}

export default function BudgetsConfigure({ budget, categories, unclosedPeriods = [], creditsInfo }: Props) {
    const { processing } = useForm();
    const [closingPeriod, setClosingPeriod] = useState<UnclosedPeriod | null>(null);
    const [isClosing, setIsClosing] = useState(false);
    const [localUnclosedPeriods, setLocalUnclosedPeriods] = useState(unclosedPeriods);

    const hasUnclosedPeriods = localUnclosedPeriods.length > 0;

    const handleClosePeriod = (period: UnclosedPeriod) => {
        setClosingPeriod(period);
    };

    const confirmClosePeriod = () => {
        if (!closingPeriod || !budget) return;

        setIsClosing(true);
        router.post(`/budgets/${budget.id}/close-period`, { period: closingPeriod.period }, {
            onSuccess: () => {
                message.success(`Período ${closingPeriod.label} cerrado exitosamente`);
                setLocalUnclosedPeriods(prev => prev.filter(p => p.period !== closingPeriod.period));
                setClosingPeriod(null);
            },
            onError: () => {
                message.error('Error al cerrar el período');
            },
            onFinish: () => {
                setIsClosing(false);
            },
        });
    };

    const handleSubmit = (data: { name: string; type: string; lines: BudgetLineFormData[] }) => {
        if (hasUnclosedPeriods && budget) {
            Modal.warning({
                title: 'Períodos sin cerrar',
                content: 'Debes cerrar los períodos anteriores antes de modificar el presupuesto.',
                okText: 'Entendido',
            });
            return;
        }

        const payload = {
            name: data.name,
            type: data.type,
            lines: data.lines.map((line) => ({
                ...(line.id ? { id: line.id } : {}),
                category_id: line.category_id,
                amount: line.amount,
                alert_at_50: line.alert_at_50,
                alert_at_80: line.alert_at_80,
                alert_at_100: line.alert_at_100,
                notes: line.notes,
            })),
        };

        if (budget) {
            router.put(`/budgets/${budget.id}`, payload, {
                onSuccess: () => message.success('Presupuesto actualizado'),
                onError: () => message.error('Error al actualizar el presupuesto'),
            });
        } else {
            router.post('/budgets', payload, {
                onSuccess: () => message.success('Presupuesto creado'),
                onError: () => message.error('Error al crear el presupuesto'),
            });
        }
    };

    return (
        <AppLayout title={budget ? 'Editar Presupuesto' : 'Nuevo Presupuesto'} showBack>
            <Head title={budget ? 'Editar Presupuesto' : 'Nuevo Presupuesto'} />

            <div style={{ padding: 16 }}>
                {hasUnclosedPeriods && budget && (
                    <Alert
                        type="warning"
                        icon={<WarningOutlined />}
                        showIcon
                        style={{ marginBottom: 16 }}
                        message="Períodos sin cerrar"
                        description={
                            <div>
                                <p style={{ marginBottom: 12 }}>
                                    Tienes {localUnclosedPeriods.length} período{localUnclosedPeriods.length > 1 ? 's' : ''} sin cerrar.
                                    Para modificar el presupuesto, primero debes cerrar los períodos anteriores.
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {localUnclosedPeriods.map((period) => (
                                        <div
                                            key={period.period}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '8px 12px',
                                                backgroundColor: 'var(--ant-color-bg-container)',
                                                borderRadius: 8,
                                                border: '1px solid var(--ant-color-border)',
                                            }}
                                        >
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <CalendarOutlined />
                                                {period.label}
                                            </span>
                                            <Button
                                                type="primary"
                                                size="small"
                                                onClick={() => handleClosePeriod(period)}
                                            >
                                                Cerrar período
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }
                    />
                )}

                <BudgetForm
                    budget={budget || undefined}
                    categories={categories}
                    processing={processing}
                    onSubmit={handleSubmit}
                    disabled={hasUnclosedPeriods && !!budget}
                    creditsInfo={creditsInfo}
                />
            </div>

            <Modal
                title="Cerrar período"
                open={!!closingPeriod}
                onCancel={() => setClosingPeriod(null)}
                onOk={confirmClosePeriod}
                confirmLoading={isClosing}
                okText="Cerrar período"
                cancelText="Cancelar"
            >
                <p>
                    ¿Deseas cerrar el presupuesto de <strong>{closingPeriod?.label}</strong>?
                </p>
                <p style={{ color: 'var(--ant-color-text-secondary)', fontSize: 13 }}>
                    Al cerrar el período, se guardará una copia del estado actual del presupuesto con los gastos realizados.
                    Una vez cerrado, no se podrá modificar.
                </p>
            </Modal>
        </AppLayout>
    );
}
