import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import {
    BalanceCard,
    MonthSummary,
    BudgetProgress,
    UpcomingPayments,
    QuickStats,
    RecentTransactions,
} from '@/app/components/dashboard';
import { usePlanning } from '@/app/hooks/usePlanning';
import type { Transaction } from '@/app/types';

interface DashboardStats {
    total_balance: number;
    month_income: number;
    month_expense: number;
    month_balance: number;
    total_debt: number;
    total_receivable: number;
    budget_used: number;
    budget_total: number;
    budget_spent: number;
}

interface QuickStatsData {
    expense_change: number;
    transaction_count: number;
    accounts_count: number;
    active_credits_count: number;
}

interface UpcomingPayment {
    id: number;
    type: 'credit_installment' | 'payable';
    description: string;
    amount: number;
    due_date: string | null;
    status: string;
    is_overdue: boolean;
}

interface Props {
    stats: DashboardStats;
    upcomingPayments: UpcomingPayment[];
    quickStats: QuickStatsData;
    recentTransactions: { data: Transaction[] };
}

export default function Dashboard({ stats, upcomingPayments, quickStats, recentTransactions }: Props) {
    const { planning } = usePlanning();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: planning?.currency || 'CLP',
            maximumFractionDigits: planning?.show_decimals ? 2 : 0,
        }).format(amount);
    };

    const headerRight = (
        <Button
            type="text"
            icon={<BarChartOutlined style={{ color: '#fff', fontSize: 18 }} />}
            onClick={() => router.visit('/reports')}
        />
    );

    return (
        <AppLayout headerRight={headerRight}>
            <Head title="Inicio" />

            <div style={{ padding: 16 }}>
                <BalanceCard
                    totalBalance={stats.total_balance}
                    totalDebt={stats.total_debt}
                    totalReceivable={stats.total_receivable}
                    formatCurrency={formatCurrency}
                />

                <MonthSummary
                    monthIncome={stats.month_income}
                    monthExpense={stats.month_expense}
                    formatCurrency={formatCurrency}
                />

                <QuickStats
                    expenseChange={quickStats.expense_change}
                    transactionCount={quickStats.transaction_count}
                    accountsCount={quickStats.accounts_count}
                    activeCreditsCount={quickStats.active_credits_count}
                />

                <BudgetProgress
                    budgetUsed={stats.budget_used}
                    budgetTotal={stats.budget_total}
                    budgetSpent={stats.budget_spent}
                    formatCurrency={formatCurrency}
                />

                <UpcomingPayments
                    payments={upcomingPayments}
                    formatCurrency={formatCurrency}
                />

                <RecentTransactions
                    transactions={recentTransactions?.data || []}
                    formatCurrency={formatCurrency}
                />
            </div>
        </AppLayout>
    );
}
