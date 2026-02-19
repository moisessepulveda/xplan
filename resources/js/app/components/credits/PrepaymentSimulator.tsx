import React from 'react';
import { Card, Typography, InputNumber, Segmented, Row, Col, Empty } from 'antd';
import {
    ClockCircleOutlined,
    DollarOutlined,
    PercentageOutlined,
} from '@ant-design/icons';
import type { PrepaymentSimulation } from '@/app/types';
import { colors } from '@/app/styles/theme';

interface PrepaymentSimulatorProps {
    maxAmount: number;
    amount: number;
    strategy: string;
    simulation: PrepaymentSimulation | null;
    onAmountChange: (amount: number) => void;
    onStrategyChange: (strategy: string) => void;
    formatCurrency: (amount: number) => string;
}

export function PrepaymentSimulator({
    maxAmount,
    amount,
    strategy,
    simulation,
    onAmountChange,
    onStrategyChange,
    formatCurrency,
}: PrepaymentSimulatorProps) {
    return (
        <div>
            {/* Input Section */}
            <Card style={{ borderRadius: 12, marginBottom: 16 }}>
                <Typography.Text strong style={{ display: 'block', marginBottom: 12 }}>
                    Monto del prepago
                </Typography.Text>
                <InputNumber
                    value={amount}
                    onChange={(v) => onAmountChange(v || 0)}
                    min={0}
                    max={maxAmount}
                    step={100000}
                    style={{ width: '100%', marginBottom: 16 }}
                    size="large"
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={(value) => Number(value?.replace(/\$\s?|(\.*)/g, '') || 0)}
                />

                <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>
                    Estrategia
                </Typography.Text>
                <Segmented
                    block
                    value={strategy}
                    onChange={onStrategyChange}
                    options={[
                        { value: 'reduce_term', label: 'Reducir plazo' },
                        { value: 'reduce_payment', label: 'Reducir cuota' },
                    ]}
                />
            </Card>

            {/* Results */}
            {simulation ? (
                <div>
                    {/* Savings Highlight */}
                    <Card
                        style={{
                            background: `linear-gradient(135deg, ${colors.success.main} 0%, ${colors.success.dark} 100%)`,
                            borderRadius: 16,
                            marginBottom: 16,
                        }}
                        styles={{ body: { padding: 16 } }}
                    >
                        <Typography.Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                            AHORRO EN INTERESES
                        </Typography.Text>
                        <Typography.Title level={2} style={{ color: '#fff', margin: '4px 0' }}>
                            {formatCurrency(simulation.total_interest_saved)}
                        </Typography.Title>
                    </Card>

                    <Row gutter={12}>
                        <Col span={12}>
                            <Card style={{ borderRadius: 12, marginBottom: 12 }} styles={{ body: { padding: 12 } }}>
                                <ClockCircleOutlined style={{ color: colors.primary[500], fontSize: 20 }} />
                                <Typography.Text type="secondary" style={{ display: 'block', fontSize: 11, marginTop: 4 }}>
                                    Plazo restante
                                </Typography.Text>
                                <Typography.Text strong style={{ fontSize: 15, display: 'block' }}>
                                    {simulation.new_remaining_months} meses
                                </Typography.Text>
                                {simulation.months_saved > 0 && (
                                    <Typography.Text style={{ fontSize: 11, color: colors.success.main }}>
                                        -{simulation.months_saved} meses
                                    </Typography.Text>
                                )}
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card style={{ borderRadius: 12, marginBottom: 12 }} styles={{ body: { padding: 12 } }}>
                                <DollarOutlined style={{ color: colors.primary[500], fontSize: 20 }} />
                                <Typography.Text type="secondary" style={{ display: 'block', fontSize: 11, marginTop: 4 }}>
                                    Nueva cuota
                                </Typography.Text>
                                <Typography.Text strong style={{ fontSize: 15, display: 'block' }}>
                                    {formatCurrency(simulation.new_monthly_payment)}
                                </Typography.Text>
                                {simulation.payment_reduction && simulation.payment_reduction > 0 && (
                                    <Typography.Text style={{ fontSize: 11, color: colors.success.main }}>
                                        -{formatCurrency(simulation.payment_reduction)}
                                    </Typography.Text>
                                )}
                            </Card>
                        </Col>
                    </Row>

                    <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 12 } }}>
                        <Row gutter={12}>
                            <Col span={12}>
                                <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
                                    Saldo actual
                                </Typography.Text>
                                <Typography.Text style={{ fontSize: 13 }}>
                                    {formatCurrency(simulation.new_pending + amount)}
                                </Typography.Text>
                            </Col>
                            <Col span={12}>
                                <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
                                    Nuevo saldo
                                </Typography.Text>
                                <Typography.Text strong style={{ fontSize: 13 }}>
                                    {formatCurrency(simulation.new_pending)}
                                </Typography.Text>
                            </Col>
                        </Row>
                    </Card>
                </div>
            ) : (
                amount <= 0 && (
                    <Empty
                        description="Ingresa un monto para simular"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                )
            )}
        </div>
    );
}
