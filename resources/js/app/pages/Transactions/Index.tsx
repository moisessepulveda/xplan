import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button, Card, Typography, Input, Row, Col, List, Tag, Space, Popconfirm, Avatar } from 'antd';
import {
    PlusOutlined,
    FilterOutlined,
    SearchOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    CheckOutlined,
    CloseOutlined,
    MailOutlined,
    SyncOutlined,
    LeftOutlined,
    RightOutlined,
    CreditCardOutlined,
} from '@ant-design/icons';
import * as Icons from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { TransactionList, TransactionFilters, RecurringPendingItem, InstallmentPendingItem } from '@/app/components/transactions';
import {
    Transaction,
    RecurringTransaction,
    TransactionTypeOption,
    TransactionSummary,
    Account,
    Category,
    PaginatedData,
    PendingInstallment,
} from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';

interface Props {
    transactions: PaginatedData<Transaction>;
    pendingTransactions: Transaction[];
    pendingRecurring: RecurringTransaction[];
    pendingInstallments: PendingInstallment[];
    filters: Record<string, string | number>;
    period: string;
    summary: TransactionSummary;
    transactionTypes: TransactionTypeOption[];
    accounts: Account[];
    categories: Category[];
}

function formatPeriodLabel(period: string): string {
    const [year, month] = period.split('-');
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ];
    return `${months[parseInt(month) - 1]} ${year}`;
}

export default function TransactionsIndex({
    transactions,
    pendingTransactions,
    pendingRecurring,
    pendingInstallments,
    filters,
    period,
    summary,
    transactionTypes,
    accounts,
    categories,
}: Props) {
    const { planning } = usePlanning();
    const [showFilters, setShowFilters] = useState(false);
    const [searchValue, setSearchValue] = useState(filters.search as string || '');
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [processingRecurringId, setProcessingRecurringId] = useState<number | null>(null);
    const [processingInstallmentId, setProcessingInstallmentId] = useState<number | null>(null);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const getIconComponent = (iconName?: string) => {
        if (!iconName) return null;
        const IconComponent = (Icons as Record<string, React.ComponentType<{ style?: React.CSSProperties }>>)[iconName];
        return IconComponent ? <IconComponent style={{ color: '#fff', fontSize: 16 }} /> : null;
    };

    const navigatePeriod = (direction: 'prev' | 'next') => {
        const [year, month] = period.split('-').map(Number);
        let newYear = year;
        let newMonth = month + (direction === 'next' ? 1 : -1);

        if (newMonth > 12) {
            newMonth = 1;
            newYear++;
        } else if (newMonth < 1) {
            newMonth = 12;
            newYear--;
        }

        const newPeriod = `${newYear}-${String(newMonth).padStart(2, '0')}`;
        router.visit('/transactions', {
            data: { period: newPeriod },
            preserveState: true,
        });
    };

    const handleSelectTransaction = (transaction: Transaction) => {
        router.visit(`/transactions/${transaction.id}`);
    };

    const handleApprove = (transaction: Transaction) => {
        setProcessingId(transaction.id);
        router.post(`/transactions/${transaction.id}/approve`, {}, {
            preserveScroll: true,
            onFinish: () => setProcessingId(null),
        });
    };

    const handleReject = (transaction: Transaction) => {
        setProcessingId(transaction.id);
        router.post(`/transactions/${transaction.id}/reject`, {}, {
            preserveScroll: true,
            onFinish: () => setProcessingId(null),
        });
    };

    const handleApplyRecurring = (recurring: RecurringTransaction) => {
        setProcessingRecurringId(recurring.id);
        router.post(`/recurring/${recurring.id}/apply`, { period }, {
            preserveScroll: true,
            onFinish: () => setProcessingRecurringId(null),
        });
    };

    const handleSkipRecurring = (recurring: RecurringTransaction) => {
        setProcessingRecurringId(recurring.id);
        router.post(`/recurring/${recurring.id}/skip`, { period }, {
            preserveScroll: true,
            onFinish: () => setProcessingRecurringId(null),
        });
    };

    const handleModifyRecurring = (recurring: RecurringTransaction) => {
        // Navegar al formulario de creación pre-llenado con los datos de la recurrente
        router.visit(`/transactions/create?from_recurring=${recurring.id}&period=${period}`);
    };

    const handleSearch = () => {
        router.visit('/transactions', {
            data: { ...filters, period, search: searchValue || undefined },
            preserveState: true,
        });
    };

    const handleApplyFilters = (newFilters: Record<string, unknown>) => {
        router.visit('/transactions', {
            data: { ...newFilters, period } as Record<string, string>,
            preserveState: true,
        });
    };

    const handleClearFilters = () => {
        router.visit('/transactions', {
            data: { period },
        });
    };

    const hasActiveFilters = Object.keys(filters).some(
        (key) => key !== 'page' && key !== 'per_page' && key !== 'period' && filters[key]
    );

    return (
        <AppLayout title="Transacciones" showBack>
            <Head title="Transacciones" />

            <div style={{ padding: 16 }}>
                {/* Period Navigator */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 16,
                    }}
                >
                    <Button
                        type="text"
                        icon={<LeftOutlined />}
                        onClick={() => navigatePeriod('prev')}
                    />
                    <Typography.Text strong style={{ fontSize: 16 }}>
                        {formatPeriodLabel(period)}
                    </Typography.Text>
                    <Button
                        type="text"
                        icon={<RightOutlined />}
                        onClick={() => navigatePeriod('next')}
                    />
                </div>

                {/* Monthly Summary */}
                <Card
                    style={{
                        background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                        borderRadius: 16,
                        marginBottom: 16,
                    }}
                    styles={{ body: { padding: 16 } }}
                >
                    <Typography.Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                        RESUMEN DEL MES
                    </Typography.Text>
                    <Typography.Title level={3} style={{ color: '#fff', margin: '4px 0 12px' }}>
                        {formatCurrency(summary.monthly_balance)}
                    </Typography.Title>

                    <Row gutter={12}>
                        <Col span={12}>
                            <div
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: 8,
                                    padding: 10,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                }}
                            >
                                <ArrowUpOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                                <div>
                                    <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, display: 'block' }}>
                                        Ingresos
                                    </Typography.Text>
                                    <Typography.Text strong style={{ color: '#fff', fontSize: 13 }}>
                                        {formatCurrency(summary.monthly_income)}
                                    </Typography.Text>
                                </div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: 8,
                                    padding: 10,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                }}
                            >
                                <ArrowDownOutlined style={{ color: '#ff4d4f', fontSize: 16 }} />
                                <div>
                                    <Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, display: 'block' }}>
                                        Gastos
                                    </Typography.Text>
                                    <Typography.Text strong style={{ color: '#fff', fontSize: 13 }}>
                                        {formatCurrency(summary.monthly_expense)}
                                    </Typography.Text>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Search & Filters */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    <Input
                        placeholder="Buscar transacciones..."
                        prefix={<SearchOutlined />}
                        size="large"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onPressEnter={handleSearch}
                        style={{ flex: 1 }}
                        allowClear
                    />
                    <Button
                        size="large"
                        icon={<FilterOutlined />}
                        onClick={() => setShowFilters(true)}
                        type={hasActiveFilters ? 'primary' : 'default'}
                    />
                </div>

                {/* Pending Recurring Transactions */}
                {pendingRecurring && pendingRecurring.length > 0 && (
                    <Card
                        size="small"
                        title={
                            <Space>
                                <SyncOutlined style={{ color: colors.primary[500] }} />
                                <span>Transacciones recurrentes de este mes</span>
                                <Tag color="blue">{pendingRecurring.length}</Tag>
                            </Space>
                        }
                        extra={
                            <Button
                                type="link"
                                size="small"
                                onClick={() => router.visit('/transactions-recurring')}
                            >
                                Gestionar
                            </Button>
                        }
                        style={{ marginBottom: 16 }}
                    >
                        <List
                            dataSource={pendingRecurring}
                            renderItem={(recurring) => (
                                <RecurringPendingItem
                                    recurring={recurring}
                                    processing={processingRecurringId === recurring.id}
                                    onApply={handleApplyRecurring}
                                    onSkip={handleSkipRecurring}
                                    onModify={handleModifyRecurring}
                                />
                            )}
                        />
                    </Card>
                )}

                {/* Pending Installments */}
                {pendingInstallments && pendingInstallments.length > 0 && (
                    <Card
                        size="small"
                        title={
                            <Space>
                                <CreditCardOutlined style={{ color: colors.error[500] }} />
                                <span>Cuotas de créditos del mes</span>
                                <Tag color="error">{pendingInstallments.length}</Tag>
                            </Space>
                        }
                        extra={
                            <Button
                                type="link"
                                size="small"
                                onClick={() => router.visit('/credits')}
                            >
                                Ver créditos
                            </Button>
                        }
                        style={{ marginBottom: 16 }}
                    >
                        <List
                            dataSource={pendingInstallments}
                            renderItem={(installment) => (
                                <InstallmentPendingItem
                                    installment={installment}
                                    accounts={accounts}
                                    processing={processingInstallmentId === installment.id}
                                />
                            )}
                        />
                    </Card>
                )}

                {/* Pending Transactions */}
                {pendingTransactions && pendingTransactions.length > 0 && (
                    <Card
                        size="small"
                        title={
                            <Space>
                                <MailOutlined style={{ color: colors.warning[500] }} />
                                <span>Transacciones pendientes de aprobación</span>
                                <Tag color="warning">{pendingTransactions.length}</Tag>
                            </Space>
                        }
                        style={{ marginBottom: 16 }}
                    >
                        <List
                            dataSource={pendingTransactions}
                            renderItem={(tx) => (
                                <List.Item
                                    style={{ padding: '8px 0' }}
                                    actions={[
                                        <Button
                                            key="approve"
                                            type="primary"
                                            size="small"
                                            icon={<CheckOutlined />}
                                            loading={processingId === tx.id}
                                            onClick={() => handleApprove(tx)}
                                            style={{ backgroundColor: colors.success[500] }}
                                        />,
                                        <Popconfirm
                                            key="reject"
                                            title="¿Rechazar transacción?"
                                            description="Esta transacción será eliminada"
                                            onConfirm={() => handleReject(tx)}
                                            okText="Sí, rechazar"
                                            cancelText="Cancelar"
                                            okButtonProps={{ danger: true }}
                                        >
                                            <Button
                                                danger
                                                size="small"
                                                icon={<CloseOutlined />}
                                                loading={processingId === tx.id}
                                            />
                                        </Popconfirm>,
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                size={40}
                                                style={{
                                                    backgroundColor: tx.category?.color || (tx.type === 'expense' ? colors.error[500] : colors.success[500]),
                                                }}
                                                icon={getIconComponent(tx.category?.icon)}
                                            />
                                        }
                                        title={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <Typography.Text
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleSelectTransaction(tx)}
                                                >
                                                    {tx.description || 'Sin descripción'}
                                                </Typography.Text>
                                                <Tag color={tx.type === 'expense' ? 'red' : 'green'} style={{ fontSize: 11 }}>
                                                    {tx.type_label}
                                                </Tag>
                                            </div>
                                        }
                                        description={
                                            <Space size={4} wrap>
                                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                                    {tx.date}
                                                </Typography.Text>
                                                {tx.account && (
                                                    <>
                                                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>•</Typography.Text>
                                                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                                            {tx.account.name}
                                                        </Typography.Text>
                                                    </>
                                                )}
                                                {tx.category && (
                                                    <>
                                                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>•</Typography.Text>
                                                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                                            {tx.category.name}
                                                        </Typography.Text>
                                                    </>
                                                )}
                                            </Space>
                                        }
                                    />
                                    <Typography.Text
                                        strong
                                        style={{
                                            color: tx.type === 'expense' ? colors.error[500] : colors.success[500],
                                            marginRight: 8,
                                        }}
                                    >
                                        {tx.type === 'expense' ? '-' : '+'}{formatCurrency(tx.amount)}
                                    </Typography.Text>
                                </List.Item>
                            )}
                        />
                    </Card>
                )}

                {/* Transactions List */}
                <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <Typography.Title level={5} style={{ margin: 0 }}>
                            Transacciones ({transactions.meta.total})
                        </Typography.Title>
                    </div>
                    <TransactionList
                        transactions={transactions.data}
                        onSelect={handleSelectTransaction}
                        emptyText="No hay transacciones registradas"
                    />
                </div>

                {/* Pagination */}
                {transactions.meta.last_page > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
                        {transactions.links.prev && (
                            <Button onClick={() => router.visit(transactions.links.prev!)}>
                                Anterior
                            </Button>
                        )}
                        <Typography.Text type="secondary" style={{ lineHeight: '32px' }}>
                            Página {transactions.meta.current_page} de {transactions.meta.last_page}
                        </Typography.Text>
                        {transactions.links.next && (
                            <Button onClick={() => router.visit(transactions.links.next!)}>
                                Siguiente
                            </Button>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={() => router.visit('/transactions/create')}
                        style={{ flex: 1 }}
                    >
                        Nueva Transacción
                    </Button>
                    <Button
                        icon={<SyncOutlined />}
                        size="large"
                        onClick={() => router.visit('/transactions-recurring')}
                    >
                        Recurrentes
                    </Button>
                </div>
            </div>

            {/* Filters Drawer */}
            <TransactionFilters
                open={showFilters}
                onClose={() => setShowFilters(false)}
                filters={filters}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
                transactionTypes={transactionTypes}
                accounts={accounts}
                categories={categories}
            />
        </AppLayout>
    );
}
