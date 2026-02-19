import React from 'react';
import { Form, Input, InputNumber, Select, DatePicker, Steps, Button } from 'antd';
import dayjs from 'dayjs';
import type { Credit, CreditTypeOption, Account } from '@/app/types';

interface CreditFormData {
    name: string;
    type: string;
    entity?: string;
    account_id?: number;
    original_amount: number;
    interest_rate: number;
    interest_rate_type: 'annual' | 'monthly';
    rate_type: string;
    term_months: number;
    start_date: string;
    payment_day: number;
    monthly_payment?: number;
    reference_number?: string;
    credit_limit?: number;
    billing_day?: number;
    notes?: string;
}

interface CreditFormProps {
    data: CreditFormData;
    errors: Partial<Record<keyof CreditFormData, string>>;
    processing: boolean;
    setData: (key: string, value: unknown) => void;
    onSubmit: () => void;
    creditTypes: CreditTypeOption[];
    accounts: Account[];
    isEdit?: boolean;
}

export function CreditForm({
    data,
    errors,
    processing,
    setData,
    onSubmit,
    creditTypes,
    accounts,
    isEdit = false,
}: CreditFormProps) {
    const [step, setStep] = React.useState(0);
    const isCreditCard = data.type === 'credit_card';

    const handleNext = () => setStep(Math.min(step + 1, 2));
    const handlePrev = () => setStep(Math.max(step - 1, 0));

    return (
        <div>
            <Steps
                current={step}
                size="small"
                items={[
                    { title: 'Tipo' },
                    { title: 'Detalles' },
                    { title: 'Condiciones' },
                ]}
                style={{ marginBottom: 24 }}
            />

            <Form layout="vertical">
                {/* Step 1: Basic info */}
                {step === 0 && (
                    <>
                        <Form.Item
                            label="Tipo de crédito"
                            required
                            validateStatus={errors.type ? 'error' : undefined}
                            help={errors.type}
                        >
                            <Select
                                value={data.type}
                                onChange={(value) => setData('type', value)}
                                options={creditTypes.map((t) => ({
                                    value: t.value,
                                    label: t.label,
                                }))}
                                size="large"
                                placeholder="Selecciona el tipo"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Nombre"
                            required
                            validateStatus={errors.name ? 'error' : undefined}
                            help={errors.name}
                        >
                            <Input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                size="large"
                                placeholder="Ej: Hipotecario Banco Estado"
                            />
                        </Form.Item>

                        <Form.Item label="Institución/Banco">
                            <Input
                                value={data.entity || ''}
                                onChange={(e) => setData('entity', e.target.value)}
                                size="large"
                                placeholder="Ej: Banco Estado"
                            />
                        </Form.Item>

                        <Form.Item label="Cuenta asociada">
                            <Select
                                value={data.account_id}
                                onChange={(value) => setData('account_id', value)}
                                options={[
                                    { value: undefined, label: 'Ninguna' },
                                    ...accounts.map((a) => ({
                                        value: a.id,
                                        label: a.name,
                                    })),
                                ]}
                                size="large"
                                allowClear
                            />
                        </Form.Item>
                    </>
                )}

                {/* Step 2: Financial details */}
                {step === 1 && (
                    <>
                        <Form.Item
                            label={isCreditCard ? 'Línea de crédito' : 'Monto original'}
                            required
                            validateStatus={errors.original_amount ? 'error' : undefined}
                            help={errors.original_amount}
                        >
                            <InputNumber
                                value={data.original_amount}
                                onChange={(value) => setData('original_amount', value || 0)}
                                min={0}
                                step={100000}
                                style={{ width: '100%' }}
                                size="large"
                                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                parser={(value) => Number(value?.replace(/\$\s?|(\.*)/g, '') || 0)}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Tasa de interés (%)"
                            required
                            validateStatus={errors.interest_rate ? 'error' : undefined}
                            help={errors.interest_rate}
                        >
                            <div style={{ display: 'flex', gap: 8 }}>
                                <InputNumber
                                    value={data.interest_rate}
                                    onChange={(value) => setData('interest_rate', value || 0)}
                                    min={0}
                                    max={100}
                                    step={0.1}
                                    style={{ flex: 1 }}
                                    size="large"
                                    addonAfter="%"
                                />
                                <Select
                                    value={data.interest_rate_type}
                                    onChange={(value) => setData('interest_rate_type', value)}
                                    style={{ width: 120 }}
                                    size="large"
                                    options={[
                                        { value: 'annual', label: 'Anual' },
                                        { value: 'monthly', label: 'Mensual' },
                                    ]}
                                />
                            </div>
                        </Form.Item>

                        <Form.Item label="Tipo de tasa">
                            <Select
                                value={data.rate_type}
                                onChange={(value) => setData('rate_type', value)}
                                options={[
                                    { value: 'fixed', label: 'Fija' },
                                    { value: 'variable', label: 'Variable' },
                                ]}
                                size="large"
                            />
                        </Form.Item>

                        {isCreditCard && (
                            <>
                                <Form.Item label="Límite de crédito">
                                    <InputNumber
                                        value={data.credit_limit || 0}
                                        onChange={(value) => setData('credit_limit', value || 0)}
                                        min={0}
                                        style={{ width: '100%' }}
                                        size="large"
                                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                        parser={(value) => Number(value?.replace(/\$\s?|(\.*)/g, '') || 0)}
                                    />
                                </Form.Item>

                                <Form.Item label="Día de facturación">
                                    <InputNumber
                                        value={data.billing_day || 1}
                                        onChange={(value) => setData('billing_day', value || 1)}
                                        min={1}
                                        max={31}
                                        style={{ width: '100%' }}
                                        size="large"
                                    />
                                </Form.Item>
                            </>
                        )}
                    </>
                )}

                {/* Step 3: Conditions */}
                {step === 2 && (
                    <>
                        <Form.Item
                            label="Plazo (meses)"
                            required
                            validateStatus={errors.term_months ? 'error' : undefined}
                            help={errors.term_months}
                        >
                            <InputNumber
                                value={data.term_months}
                                onChange={(value) => setData('term_months', value || 1)}
                                min={1}
                                max={600}
                                style={{ width: '100%' }}
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Fecha de inicio"
                            required
                            validateStatus={errors.start_date ? 'error' : undefined}
                            help={errors.start_date}
                        >
                            <DatePicker
                                value={data.start_date ? dayjs(data.start_date) : undefined}
                                onChange={(date) => setData('start_date', date?.format('YYYY-MM-DD') || '')}
                                style={{ width: '100%' }}
                                size="large"
                                format="DD/MM/YYYY"
                            />
                        </Form.Item>

                        <Form.Item label="Día de pago">
                            <InputNumber
                                value={data.payment_day}
                                onChange={(value) => setData('payment_day', value || 1)}
                                min={1}
                                max={31}
                                style={{ width: '100%' }}
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item label="Cuota mensual (dejar vacío para calcular)">
                            <InputNumber
                                value={data.monthly_payment || undefined}
                                onChange={(value) => setData('monthly_payment', value || undefined)}
                                min={0}
                                style={{ width: '100%' }}
                                size="large"
                                formatter={(value) => value ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
                                parser={(value) => Number(value?.replace(/\$\s?|(\.*)/g, '') || 0)}
                            />
                        </Form.Item>

                        <Form.Item label="Número de referencia">
                            <Input
                                value={data.reference_number || ''}
                                onChange={(e) => setData('reference_number', e.target.value)}
                                size="large"
                                placeholder="Opcional"
                            />
                        </Form.Item>

                        <Form.Item label="Notas">
                            <Input.TextArea
                                value={data.notes || ''}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows={3}
                                placeholder="Notas adicionales..."
                            />
                        </Form.Item>
                    </>
                )}
            </Form>

            {/* Navigation buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                {step > 0 ? (
                    <Button size="large" onClick={handlePrev}>
                        Anterior
                    </Button>
                ) : (
                    <div />
                )}

                {step < 2 ? (
                    <Button type="primary" size="large" onClick={handleNext}>
                        Siguiente
                    </Button>
                ) : (
                    <Button
                        type="primary"
                        size="large"
                        onClick={onSubmit}
                        loading={processing}
                        disabled={!data.name || !data.type || !data.original_amount || !data.start_date}
                    >
                        {isEdit ? 'Actualizar' : 'Crear Crédito'}
                    </Button>
                )}
            </div>
        </div>
    );
}
