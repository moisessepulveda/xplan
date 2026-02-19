import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Button, Card, Typography, Row, Col } from 'antd';
import { PlusOutlined, WalletOutlined } from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { AccountList } from '@/app/components/accounts';
import { Account, AccountTypeOption, AccountsSummary } from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';

interface Props {
    accounts: Account[];
    summary: AccountsSummary;
    accountTypes: AccountTypeOption[];
}

export default function AccountsIndex({ accounts, summary, accountTypes }: Props) {
    const { planning } = usePlanning();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const handleSelectAccount = (account: Account) => {
        router.visit(`/accounts/${account.id}`);
    };

    return (
        <AppLayout title="Cuentas" showBack>
            <Head title="Cuentas" />

            <div style={{ padding: 16 }}>
                {/* Summary Card */}
                <Card
                    style={{
                        background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                        borderRadius: 16,
                        marginBottom: 16,
                    }}
                    styles={{ body: { padding: 20 } }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 12,
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <WalletOutlined style={{ color: '#fff', fontSize: 24 }} />
                        </div>
                        <div>
                            <Typography.Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                                BALANCE TOTAL
                            </Typography.Text>
                            <Typography.Title level={3} style={{ color: '#fff', margin: 0 }}>
                                {formatCurrency(summary.total_balance)}
                            </Typography.Title>
                        </div>
                    </div>

                    <Row gutter={16}>
                        <Col span={12}>
                            <div
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: 8,
                                    padding: 12,
                                }}
                            >
                                <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
                                    Activos
                                </Typography.Text>
                                <Typography.Text
                                    strong
                                    style={{ color: '#fff', display: 'block' }}
                                >
                                    {formatCurrency(summary.total_assets)}
                                </Typography.Text>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: 8,
                                    padding: 12,
                                }}
                            >
                                <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
                                    Pasivos
                                </Typography.Text>
                                <Typography.Text
                                    strong
                                    style={{ color: '#fff', display: 'block' }}
                                >
                                    {formatCurrency(summary.total_liabilities)}
                                </Typography.Text>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Accounts List */}
                <div style={{ marginBottom: 16 }}>
                    <Typography.Title level={5} style={{ marginBottom: 12 }}>
                        Mis Cuentas ({summary.count})
                    </Typography.Title>
                    <AccountList
                        accounts={accounts}
                        onSelect={handleSelectAccount}
                        emptyText="No tienes cuentas creadas"
                    />
                </div>

                {/* Add Account Button */}
                <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    block
                    size="large"
                    onClick={() => router.visit('/accounts/create')}
                    style={{ marginTop: 8 }}
                >
                    Nueva Cuenta
                </Button>
            </div>
        </AppLayout>
    );
}
