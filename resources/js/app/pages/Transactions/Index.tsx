import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button, Card, Typography, Input, Row, Col } from 'antd';
import {
    PlusOutlined,
    FilterOutlined,
    SearchOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
} from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { TransactionList, TransactionFilters } from '@/app/components/transactions';
import {
    Transaction,
    TransactionTypeOption,
    TransactionSummary,
    Account,
    Category,
    PaginatedData,
} from '@/app/types';
import { usePlanning } from '@/app/hooks/usePlanning';
import { colors } from '@/app/styles/theme';

interface Props {
    transactions: PaginatedData<Transaction>;
    filters: Record<string, string | number>;
    summary: TransactionSummary;
    transactionTypes: TransactionTypeOption[];
    accounts: Account[];
    categories: Category[];
}

export default function TransactionsIndex({
    transactions,
    filters,
    summary,
    transactionTypes,
    accounts,
    categories,
}: Props) {
    const { planning } = usePlanning();
    const [showFilters, setShowFilters] = useState(false);
    const [searchValue, setSearchValue] = useState(filters.search as string || '');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const handleSelectTransaction = (transaction: Transaction) => {
        router.visit(`/transactions/${transaction.id}`);
    };

    const handleSearch = () => {
        router.visit('/transactions', {
            data: { ...filters, search: searchValue || undefined },
            preserveState: true,
        });
    };

    const handleApplyFilters = (newFilters: Record<string, unknown>) => {
        router.visit('/transactions', {
            data: newFilters as Record<string, string>,
            preserveState: true,
        });
    };

    const handleClearFilters = () => {
        router.visit('/transactions');
    };

    const hasActiveFilters = Object.keys(filters).some(
        (key) => key !== 'page' && key !== 'per_page' && filters[key]
    );

    return (
        <AppLayout title="Transacciones" showBack>
            <Head title="Transacciones" />

            <div style={{ padding: 16 }}>
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

                {/* Transactions List */}
                <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <Typography.Title level={5} style={{ margin: 0 }}>
                            Transacciones ({transactions.total})
                        </Typography.Title>
                    </div>
                    <TransactionList
                        transactions={transactions.data}
                        onSelect={handleSelectTransaction}
                        emptyText="No hay transacciones registradas"
                    />
                </div>

                {/* Pagination */}
                {transactions.last_page > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
                        {transactions.prev_page_url && (
                            <Button onClick={() => router.visit(transactions.prev_page_url!)}>
                                Anterior
                            </Button>
                        )}
                        <Typography.Text type="secondary" style={{ lineHeight: '32px' }}>
                            Página {transactions.current_page} de {transactions.last_page}
                        </Typography.Text>
                        {transactions.next_page_url && (
                            <Button onClick={() => router.visit(transactions.next_page_url!)}>
                                Siguiente
                            </Button>
                        )}
                    </div>
                )}

                {/* Add Transaction Button */}
                <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    block
                    size="large"
                    onClick={() => router.visit('/transactions/create')}
                    style={{ marginTop: 8 }}
                >
                    Nueva Transacción
                </Button>
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
