# XPlan - Plan Técnico de Implementación

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| Frontend | React + TypeScript | 18.x |
| UI Framework | Ant Design | 5.x |
| Bridge | Inertia.js | 2.x |
| Backend | Laravel | 11.x |
| Base de Datos | PostgreSQL | 16.x |
| Autenticación | Laravel Sanctum | - |
| Cache | Redis | - |

---

## Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                           FRONTEND                               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    React + TypeScript                        ││
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ ││
│  │  │  Pages  │  │  Comps  │  │  Hooks  │  │  Context/Store  │ ││
│  │  └────┬────┘  └────┬────┘  └────┬────┘  └────────┬────────┘ ││
│  │       └────────────┴────────────┴────────────────┘          ││
│  │                           │                                  ││
│  │                    Ant Design Theme                          ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│                        Inertia.js 2                              │
│                              │                                   │
├─────────────────────────────────────────────────────────────────┤
│                           BACKEND                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                         Laravel 11                           ││
│  │                                                              ││
│  │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   ││
│  │  │  Controllers │───►│   Requests   │    │  Resources   │   ││
│  │  └──────┬───────┘    └──────────────┘    └──────────────┘   ││
│  │         │                                                    ││
│  │         ▼                                                    ││
│  │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   ││
│  │  │   Actions    │───►│   Services   │───►│    Models    │   ││
│  │  └──────────────┘    └──────────────┘    └──────────────┘   ││
│  │                                                              ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│                    PostgreSQL + Redis                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Estructura de Carpetas

### Backend (Laravel)

```
app/
├── Actions/
│   ├── Auth/
│   │   ├── RegisterUserAction.php
│   │   ├── LoginUserAction.php
│   │   └── ResetPasswordAction.php
│   ├── Planning/
│   │   ├── CreatePlanningAction.php
│   │   ├── UpdatePlanningAction.php
│   │   ├── DeletePlanningAction.php
│   │   └── SwitchActivePlanningAction.php
│   ├── Account/
│   │   ├── CreateAccountAction.php
│   │   ├── UpdateAccountAction.php
│   │   ├── AdjustBalanceAction.php
│   │   └── TransferBetweenAccountsAction.php
│   ├── Category/
│   │   ├── CreateCategoryAction.php
│   │   ├── UpdateCategoryAction.php
│   │   └── ReorderCategoriesAction.php
│   ├── Transaction/
│   │   ├── CreateTransactionAction.php
│   │   ├── UpdateTransactionAction.php
│   │   ├── DeleteTransactionAction.php
│   │   ├── DuplicateTransactionAction.php
│   │   └── ProcessRecurringTransactionsAction.php
│   ├── Receivable/
│   │   ├── CreateReceivableAction.php
│   │   ├── UpdateReceivableAction.php
│   │   ├── RegisterPaymentAction.php
│   │   └── SendReminderAction.php
│   ├── Budget/
│   │   ├── CreateBudgetAction.php
│   │   ├── UpdateBudgetAction.php
│   │   ├── CopyBudgetFromPreviousMonthAction.php
│   │   └── CloseBudgetPeriodAction.php
│   ├── Credit/
│   │   ├── CreateCreditAction.php
│   │   ├── UpdateCreditAction.php
│   │   ├── PayInstallmentAction.php
│   │   ├── RegisterExtraPaymentAction.php
│   │   ├── GenerateAmortizationTableAction.php
│   │   └── SimulatePrepaymentAction.php
│   ├── Member/
│   │   ├── InviteMemberAction.php
│   │   ├── AcceptInvitationAction.php
│   │   ├── RejectInvitationAction.php
│   │   ├── ChangeMemberRoleAction.php
│   │   └── RemoveMemberAction.php
│   └── Report/
│       ├── GenerateExpensesByCategoryReportAction.php
│       ├── GenerateIncomeVsExpensesReportAction.php
│       ├── GenerateCashFlowReportAction.php
│       └── ExportReportAction.php
│
├── Http/
│   ├── Controllers/
│   │   ├── Auth/
│   │   │   ├── RegisterController.php
│   │   │   ├── LoginController.php
│   │   │   ├── LogoutController.php
│   │   │   └── PasswordResetController.php
│   │   ├── PlanningController.php
│   │   ├── AccountController.php
│   │   ├── CategoryController.php
│   │   ├── TransactionController.php
│   │   ├── ReceivableController.php
│   │   ├── BudgetController.php
│   │   ├── CreditController.php
│   │   ├── MemberController.php
│   │   ├── InvitationController.php
│   │   ├── NotificationController.php
│   │   ├── ReportController.php
│   │   ├── DashboardController.php
│   │   └── SettingsController.php
│   │
│   ├── Requests/
│   │   ├── Auth/
│   │   │   ├── RegisterRequest.php
│   │   │   ├── LoginRequest.php
│   │   │   └── ResetPasswordRequest.php
│   │   ├── Planning/
│   │   │   ├── StorePlanningRequest.php
│   │   │   ├── UpdatePlanningRequest.php
│   │   │   └── SwitchPlanningRequest.php
│   │   ├── Account/
│   │   │   ├── StoreAccountRequest.php
│   │   │   ├── UpdateAccountRequest.php
│   │   │   ├── AdjustBalanceRequest.php
│   │   │   └── TransferRequest.php
│   │   ├── Category/
│   │   │   ├── StoreCategoryRequest.php
│   │   │   ├── UpdateCategoryRequest.php
│   │   │   └── ReorderCategoriesRequest.php
│   │   ├── Transaction/
│   │   │   ├── StoreTransactionRequest.php
│   │   │   ├── UpdateTransactionRequest.php
│   │   │   └── FilterTransactionsRequest.php
│   │   ├── Receivable/
│   │   │   ├── StoreReceivableRequest.php
│   │   │   ├── UpdateReceivableRequest.php
│   │   │   └── RegisterPaymentRequest.php
│   │   ├── Budget/
│   │   │   ├── StoreBudgetRequest.php
│   │   │   └── UpdateBudgetRequest.php
│   │   ├── Credit/
│   │   │   ├── StoreCreditRequest.php
│   │   │   ├── UpdateCreditRequest.php
│   │   │   ├── PayInstallmentRequest.php
│   │   │   └── ExtraPaymentRequest.php
│   │   └── Member/
│   │       ├── InviteMemberRequest.php
│   │       └── ChangeMemberRoleRequest.php
│   │
│   ├── Middleware/
│   │   ├── EnsureActivePlanning.php
│   │   ├── CheckPlanningAccess.php
│   │   ├── CheckPlanningRole.php
│   │   └── HandleInertiaRequests.php
│   │
│   └── Resources/
│       ├── UserResource.php
│       ├── PlanningResource.php
│       ├── AccountResource.php
│       ├── CategoryResource.php
│       ├── TransactionResource.php
│       ├── ReceivableResource.php
│       ├── BudgetResource.php
│       ├── CreditResource.php
│       ├── InstallmentResource.php
│       ├── MemberResource.php
│       ├── InvitationResource.php
│       └── NotificationResource.php
│
├── Models/
│   ├── User.php
│   ├── Planning.php
│   ├── PlanningMember.php
│   ├── Invitation.php
│   ├── Account.php
│   ├── Category.php
│   ├── Transaction.php
│   ├── RecurringTransaction.php
│   ├── Receivable.php
│   ├── ReceivablePayment.php
│   ├── Reminder.php
│   ├── Budget.php
│   ├── BudgetLine.php
│   ├── BudgetHistory.php
│   ├── Credit.php
│   ├── CreditInstallment.php
│   ├── ExtraPayment.php
│   └── Notification.php
│
├── Services/
│   ├── AmortizationCalculator.php
│   ├── BudgetCalculator.php
│   ├── BalanceCalculator.php
│   ├── ReportGenerator.php
│   ├── NotificationService.php
│   └── ExportService.php
│
├── Enums/
│   ├── AccountType.php
│   ├── TransactionType.php
│   ├── CategoryType.php
│   ├── ReceivableType.php
│   ├── ReceivableStatus.php
│   ├── CreditType.php
│   ├── CreditStatus.php
│   ├── InstallmentStatus.php
│   ├── MemberRole.php
│   ├── InvitationStatus.php
│   ├── Frequency.php
│   └── NotificationType.php
│
├── Traits/
│   ├── BelongsToPlanning.php
│   ├── HasCreator.php
│   └── Orderable.php
│
└── Policies/
    ├── PlanningPolicy.php
    ├── AccountPolicy.php
    ├── CategoryPolicy.php
    ├── TransactionPolicy.php
    ├── ReceivablePolicy.php
    ├── BudgetPolicy.php
    ├── CreditPolicy.php
    └── MemberPolicy.php

database/
├── migrations/
│   ├── 0001_01_01_000000_create_users_table.php
│   ├── 0001_01_01_000001_create_plannings_table.php
│   ├── 0001_01_01_000002_create_planning_members_table.php
│   ├── 0001_01_01_000003_create_invitations_table.php
│   ├── 0001_01_01_000004_create_accounts_table.php
│   ├── 0001_01_01_000005_create_categories_table.php
│   ├── 0001_01_01_000006_create_transactions_table.php
│   ├── 0001_01_01_000007_create_recurring_transactions_table.php
│   ├── 0001_01_01_000008_create_receivables_table.php
│   ├── 0001_01_01_000009_create_receivable_payments_table.php
│   ├── 0001_01_01_000010_create_reminders_table.php
│   ├── 0001_01_01_000011_create_budgets_table.php
│   ├── 0001_01_01_000012_create_budget_lines_table.php
│   ├── 0001_01_01_000013_create_budget_histories_table.php
│   ├── 0001_01_01_000014_create_credits_table.php
│   ├── 0001_01_01_000015_create_credit_installments_table.php
│   ├── 0001_01_01_000016_create_extra_payments_table.php
│   └── 0001_01_01_000017_create_notifications_table.php
│
└── seeders/
    ├── DatabaseSeeder.php
    ├── DefaultCategoriesSeeder.php
    └── DemoDataSeeder.php
```

### Frontend (React + TypeScript)

```
resources/js/
├── app/
│   ├── components/
│   │   ├── common/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── BottomNavigation.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── PlanningSelector.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   ├── ConfirmModal.tsx
│   │   │   ├── FloatingActionButton.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   ├── AmountInput.tsx
│   │   │   ├── MoneyDisplay.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── IconPicker.tsx
│   │   │   ├── ColorPicker.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   ├── FilterSheet.tsx
│   │   │   ├── SwipeableItem.tsx
│   │   │   └── PullToRefresh.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── BalanceCard.tsx
│   │   │   ├── MonthSummary.tsx
│   │   │   ├── BudgetProgress.tsx
│   │   │   ├── UpcomingPayments.tsx
│   │   │   └── QuickStats.tsx
│   │   │
│   │   ├── transactions/
│   │   │   ├── TransactionList.tsx
│   │   │   ├── TransactionItem.tsx
│   │   │   ├── TransactionForm.tsx
│   │   │   ├── TransactionFilters.tsx
│   │   │   ├── CategorySelector.tsx
│   │   │   ├── AccountSelector.tsx
│   │   │   ├── TransferForm.tsx
│   │   │   └── RecurringBadge.tsx
│   │   │
│   │   ├── accounts/
│   │   │   ├── AccountList.tsx
│   │   │   ├── AccountCard.tsx
│   │   │   ├── AccountForm.tsx
│   │   │   ├── AccountDetail.tsx
│   │   │   └── AdjustBalanceModal.tsx
│   │   │
│   │   ├── categories/
│   │   │   ├── CategoryList.tsx
│   │   │   ├── CategoryItem.tsx
│   │   │   ├── CategoryForm.tsx
│   │   │   └── CategoryTree.tsx
│   │   │
│   │   ├── receivables/
│   │   │   ├── ReceivableList.tsx
│   │   │   ├── ReceivableCard.tsx
│   │   │   ├── ReceivableForm.tsx
│   │   │   ├── ReceivableDetail.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   ├── PaymentHistory.tsx
│   │   │   └── ReminderForm.tsx
│   │   │
│   │   ├── budgets/
│   │   │   ├── BudgetDashboard.tsx
│   │   │   ├── BudgetCategoryCard.tsx
│   │   │   ├── BudgetForm.tsx
│   │   │   ├── BudgetLineItem.tsx
│   │   │   └── BudgetHistory.tsx
│   │   │
│   │   ├── credits/
│   │   │   ├── CreditList.tsx
│   │   │   ├── CreditCard.tsx
│   │   │   ├── CreditForm.tsx
│   │   │   ├── CreditDetail.tsx
│   │   │   ├── AmortizationTable.tsx
│   │   │   ├── InstallmentItem.tsx
│   │   │   ├── PayInstallmentForm.tsx
│   │   │   ├── ExtraPaymentForm.tsx
│   │   │   ├── PrepaymentSimulator.tsx
│   │   │   └── CreditCardDetail.tsx
│   │   │
│   │   ├── members/
│   │   │   ├── MemberList.tsx
│   │   │   ├── MemberCard.tsx
│   │   │   ├── InviteForm.tsx
│   │   │   ├── InvitationList.tsx
│   │   │   ├── InvitationCard.tsx
│   │   │   └── RoleSelector.tsx
│   │   │
│   │   ├── reports/
│   │   │   ├── ReportList.tsx
│   │   │   ├── ExpensesByCategoryChart.tsx
│   │   │   ├── IncomeVsExpensesChart.tsx
│   │   │   ├── CashFlowChart.tsx
│   │   │   ├── BudgetVsRealChart.tsx
│   │   │   ├── DebtSummary.tsx
│   │   │   └── ExportButton.tsx
│   │   │
│   │   ├── notifications/
│   │   │   ├── NotificationCenter.tsx
│   │   │   ├── NotificationItem.tsx
│   │   │   └── NotificationBadge.tsx
│   │   │
│   │   └── settings/
│   │       ├── SettingsMenu.tsx
│   │       ├── ProfileForm.tsx
│   │       ├── PlanningSettings.tsx
│   │       ├── NotificationSettings.tsx
│   │       ├── SecuritySettings.tsx
│   │       ├── ThemeToggle.tsx
│   │       └── ExportData.tsx
│   │
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   └── ResetPassword.tsx
│   │   │
│   │   ├── Onboarding/
│   │   │   ├── Welcome.tsx
│   │   │   ├── CreatePlanning.tsx
│   │   │   └── AddFirstAccount.tsx
│   │   │
│   │   ├── Dashboard/
│   │   │   └── Index.tsx
│   │   │
│   │   ├── Transactions/
│   │   │   ├── Index.tsx
│   │   │   ├── Create.tsx
│   │   │   ├── Edit.tsx
│   │   │   ├── Show.tsx
│   │   │   └── Recurring.tsx
│   │   │
│   │   ├── Accounts/
│   │   │   ├── Index.tsx
│   │   │   ├── Create.tsx
│   │   │   ├── Edit.tsx
│   │   │   └── Show.tsx
│   │   │
│   │   ├── Categories/
│   │   │   ├── Index.tsx
│   │   │   ├── Create.tsx
│   │   │   └── Edit.tsx
│   │   │
│   │   ├── Receivables/
│   │   │   ├── Index.tsx
│   │   │   ├── Create.tsx
│   │   │   ├── Edit.tsx
│   │   │   └── Show.tsx
│   │   │
│   │   ├── Budgets/
│   │   │   ├── Index.tsx
│   │   │   ├── Configure.tsx
│   │   │   ├── Category.tsx
│   │   │   └── History.tsx
│   │   │
│   │   ├── Credits/
│   │   │   ├── Index.tsx
│   │   │   ├── Create.tsx
│   │   │   ├── Edit.tsx
│   │   │   ├── Show.tsx
│   │   │   ├── Amortization.tsx
│   │   │   └── Simulate.tsx
│   │   │
│   │   ├── Members/
│   │   │   ├── Index.tsx
│   │   │   ├── Invite.tsx
│   │   │   └── Invitations.tsx
│   │   │
│   │   ├── Plannings/
│   │   │   ├── Index.tsx
│   │   │   ├── Create.tsx
│   │   │   └── Edit.tsx
│   │   │
│   │   ├── Reports/
│   │   │   ├── Index.tsx
│   │   │   ├── ExpensesByCategory.tsx
│   │   │   ├── IncomeVsExpenses.tsx
│   │   │   ├── CashFlow.tsx
│   │   │   └── Debts.tsx
│   │   │
│   │   ├── Notifications/
│   │   │   └── Index.tsx
│   │   │
│   │   └── Settings/
│   │       ├── Index.tsx
│   │       ├── Profile.tsx
│   │       ├── Planning.tsx
│   │       ├── Notifications.tsx
│   │       └── Security.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── usePlanning.ts
│   │   ├── useTheme.ts
│   │   ├── useNotifications.ts
│   │   ├── useMoney.ts
│   │   ├── useDebounce.ts
│   │   ├── useInfiniteScroll.ts
│   │   ├── usePullToRefresh.ts
│   │   ├── useSwipe.ts
│   │   └── useOffline.ts
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── PlanningContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── NotificationContext.tsx
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── api.ts
│   │   ├── forms.ts
│   │   └── enums.ts
│   │
│   ├── utils/
│   │   ├── money.ts
│   │   ├── date.ts
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   ├── colors.ts
│   │   └── storage.ts
│   │
│   ├── styles/
│   │   ├── theme/
│   │   │   ├── index.ts
│   │   │   ├── colors.ts
│   │   │   ├── tokens.ts
│   │   │   ├── light.ts
│   │   │   └── dark.ts
│   │   ├── global.css
│   │   └── antd-overrides.css
│   │
│   └── config/
│       ├── routes.ts
│       ├── menu.ts
│       └── constants.ts
│
├── app.tsx
├── ssr.tsx
└── bootstrap.ts
```

---

## Diseño de Base de Datos

### Diagrama ER Simplificado

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│    users    │       │    plannings    │       │  accounts   │
├─────────────┤       ├─────────────────┤       ├─────────────┤
│ id          │◄──┐   │ id              │◄──────│ planning_id │
│ name        │   │   │ name            │       │ name        │
│ email       │   │   │ currency        │       │ type        │
│ password    │   │   │ month_start_day │       │ balance     │
│ active_     │   │   │ creator_id      │───────│ currency    │
│ planning_id │───┘   │ created_at      │       │ ...         │
│ settings    │       └────────┬────────┘       └─────────────┘
│ ...         │                │
└─────────────┘                │
                               │
┌──────────────────┐           │         ┌─────────────────┐
│ planning_members │           │         │   categories    │
├──────────────────┤           │         ├─────────────────┤
│ id               │           │         │ id              │
│ planning_id      │───────────┤◄────────│ planning_id     │
│ user_id          │           │         │ parent_id       │
│ role             │           │         │ name            │
│ invited_by_id    │           │         │ type            │
│ joined_at        │           │         │ icon            │
└──────────────────┘           │         │ color           │
                               │         └─────────────────┘
┌──────────────────┐           │
│   invitations    │           │         ┌─────────────────┐
├──────────────────┤           │         │  transactions   │
│ id               │           │         ├─────────────────┤
│ planning_id      │───────────┤◄────────│ planning_id     │
│ email            │           │         │ account_id      │
│ role             │           │         │ category_id     │
│ token            │           │         │ type            │
│ status           │           │         │ amount          │
│ created_by_id    │           │         │ description     │
│ expires_at       │           │         │ date            │
└──────────────────┘           │         │ created_by_id   │
                               │         └─────────────────┘
                               │
┌──────────────────┐           │         ┌─────────────────┐
│   receivables    │           │         │    budgets      │
├──────────────────┤           │         ├─────────────────┤
│ id               │           │         │ id              │
│ planning_id      │───────────┤◄────────│ planning_id     │
│ type             │           │         │ name            │
│ person_name      │           │         │ type            │
│ original_amount  │           │         │ active          │
│ pending_amount   │           │         └─────────────────┘
│ due_date         │           │
│ status           │           │         ┌─────────────────┐
└──────────────────┘           │         │    credits      │
                               │         ├─────────────────┤
                               │◄────────│ planning_id     │
                                         │ name            │
                                         │ type            │
                                         │ original_amount │
                                         │ pending_amount  │
                                         │ interest_rate   │
                                         │ term_months     │
                                         │ monthly_payment │
                                         │ status          │
                                         └─────────────────┘
```

### Migraciones Detalladas

```php
// 0001_01_01_000000_create_users_table.php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->string('avatar')->nullable();
    $table->foreignId('active_planning_id')->nullable()->constrained('plannings')->nullOnDelete();
    $table->json('settings')->default('{}');
    $table->rememberToken();
    $table->timestamps();
});

// 0001_01_01_000001_create_plannings_table.php
Schema::create('plannings', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->text('description')->nullable();
    $table->string('currency', 3)->default('CLP');
    $table->string('icon')->default('home');
    $table->string('color', 7)->default('#1890ff');
    $table->unsignedTinyInteger('month_start_day')->default(1);
    $table->boolean('show_decimals')->default(false);
    $table->foreignId('creator_id')->constrained('users')->cascadeOnDelete();
    $table->timestamps();
    $table->softDeletes();
});

// 0001_01_01_000002_create_planning_members_table.php
Schema::create('planning_members', function (Blueprint $table) {
    $table->id();
    $table->foreignId('planning_id')->constrained()->cascadeOnDelete();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('role')->default('viewer'); // owner, admin, editor, viewer
    $table->foreignId('invited_by_id')->nullable()->constrained('users')->nullOnDelete();
    $table->timestamp('joined_at');
    $table->timestamps();

    $table->unique(['planning_id', 'user_id']);
});

// 0001_01_01_000003_create_invitations_table.php
Schema::create('invitations', function (Blueprint $table) {
    $table->id();
    $table->foreignId('planning_id')->constrained()->cascadeOnDelete();
    $table->string('email');
    $table->string('role')->default('editor');
    $table->string('token', 64)->unique();
    $table->string('status')->default('pending'); // pending, accepted, rejected, expired
    $table->foreignId('created_by_id')->constrained('users')->cascadeOnDelete();
    $table->timestamp('expires_at');
    $table->timestamp('responded_at')->nullable();
    $table->timestamps();

    $table->index(['email', 'status']);
});

// 0001_01_01_000004_create_accounts_table.php
Schema::create('accounts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('planning_id')->constrained()->cascadeOnDelete();
    $table->string('name');
    $table->string('type'); // cash, bank, debit_card, digital_wallet, investment, other
    $table->decimal('initial_balance', 15, 2)->default(0);
    $table->decimal('current_balance', 15, 2)->default(0);
    $table->string('currency', 3)->default('CLP');
    $table->string('color', 7)->default('#1890ff');
    $table->string('icon')->default('wallet');
    $table->boolean('include_in_total')->default(true);
    $table->boolean('active')->default(true);
    $table->unsignedSmallInteger('order')->default(0);
    $table->text('notes')->nullable();
    $table->foreignId('created_by_id')->constrained('users')->cascadeOnDelete();
    $table->timestamps();
    $table->softDeletes();

    $table->index(['planning_id', 'active']);
});

// 0001_01_01_000005_create_categories_table.php
Schema::create('categories', function (Blueprint $table) {
    $table->id();
    $table->foreignId('planning_id')->constrained()->cascadeOnDelete();
    $table->foreignId('parent_id')->nullable()->constrained('categories')->cascadeOnDelete();
    $table->string('name');
    $table->string('type'); // income, expense
    $table->string('icon')->default('folder');
    $table->string('color', 7)->default('#1890ff');
    $table->unsignedSmallInteger('order')->default(0);
    $table->boolean('active')->default(true);
    $table->foreignId('created_by_id')->constrained('users')->cascadeOnDelete();
    $table->timestamps();

    $table->index(['planning_id', 'type', 'active']);
});

// 0001_01_01_000006_create_transactions_table.php
Schema::create('transactions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('planning_id')->constrained()->cascadeOnDelete();
    $table->string('type'); // income, expense, transfer, adjustment
    $table->decimal('amount', 15, 2);
    $table->foreignId('account_id')->constrained()->cascadeOnDelete();
    $table->foreignId('destination_account_id')->nullable()->constrained('accounts')->nullOnDelete();
    $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
    $table->string('description')->nullable();
    $table->date('date');
    $table->time('time')->nullable();
    $table->boolean('is_recurring')->default(false);
    $table->foreignId('recurring_transaction_id')->nullable()->constrained()->nullOnDelete();
    $table->json('tags')->default('[]');
    $table->json('attachments')->default('[]');
    $table->point('location')->nullable();
    $table->foreignId('created_by_id')->constrained('users')->cascadeOnDelete();
    $table->timestamps();
    $table->softDeletes();

    $table->index(['planning_id', 'date']);
    $table->index(['planning_id', 'type']);
    $table->index(['account_id', 'date']);
    $table->index(['category_id', 'date']);
});

// 0001_01_01_000007_create_recurring_transactions_table.php
Schema::create('recurring_transactions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('planning_id')->constrained()->cascadeOnDelete();
    $table->string('type'); // income, expense
    $table->decimal('amount', 15, 2);
    $table->foreignId('account_id')->constrained()->cascadeOnDelete();
    $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
    $table->string('description')->nullable();
    $table->string('frequency'); // daily, weekly, biweekly, monthly, yearly
    $table->unsignedTinyInteger('execution_day')->nullable();
    $table->date('start_date');
    $table->date('end_date')->nullable();
    $table->boolean('active')->default(true);
    $table->date('last_execution')->nullable();
    $table->date('next_execution')->nullable();
    $table->foreignId('created_by_id')->constrained('users')->cascadeOnDelete();
    $table->timestamps();

    $table->index(['active', 'next_execution']);
});

// 0001_01_01_000008_create_receivables_table.php
Schema::create('receivables', function (Blueprint $table) {
    $table->id();
    $table->foreignId('planning_id')->constrained()->cascadeOnDelete();
    $table->string('type'); // receivable, payable
    $table->string('person_name');
    $table->string('person_contact')->nullable();
    $table->decimal('original_amount', 15, 2);
    $table->decimal('pending_amount', 15, 2);
    $table->string('currency', 3)->default('CLP');
    $table->string('concept');
    $table->date('due_date')->nullable();
    $table->string('status')->default('pending'); // pending, partial, paid, cancelled
    $table->text('notes')->nullable();
    $table->foreignId('created_by_id')->constrained('users')->cascadeOnDelete();
    $table->timestamps();
    $table->softDeletes();

    $table->index(['planning_id', 'type', 'status']);
});

// 0001_01_01_000009_create_receivable_payments_table.php
Schema::create('receivable_payments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('receivable_id')->constrained()->cascadeOnDelete();
    $table->decimal('amount', 15, 2);
    $table->date('date');
    $table->foreignId('account_id')->constrained()->cascadeOnDelete();
    $table->foreignId('transaction_id')->nullable()->constrained()->nullOnDelete();
    $table->text('notes')->nullable();
    $table->foreignId('registered_by_id')->constrained('users')->cascadeOnDelete();
    $table->timestamps();
});

// 0001_01_01_000010_create_reminders_table.php
Schema::create('reminders', function (Blueprint $table) {
    $table->id();
    $table->foreignId('receivable_id')->constrained()->cascadeOnDelete();
    $table->dateTime('remind_at');
    $table->string('message')->nullable();
    $table->boolean('sent')->default(false);
    $table->timestamp('sent_at')->nullable();
    $table->timestamps();

    $table->index(['sent', 'remind_at']);
});

// 0001_01_01_000011_create_budgets_table.php
Schema::create('budgets', function (Blueprint $table) {
    $table->id();
    $table->foreignId('planning_id')->constrained()->cascadeOnDelete();
    $table->string('name');
    $table->string('type')->default('monthly'); // monthly, custom
    $table->date('start_date')->nullable();
    $table->date('end_date')->nullable();
    $table->boolean('active')->default(true);
    $table->foreignId('created_by_id')->constrained('users')->cascadeOnDelete();
    $table->timestamps();

    $table->index(['planning_id', 'active']);
});

// 0001_01_01_000012_create_budget_lines_table.php
Schema::create('budget_lines', function (Blueprint $table) {
    $table->id();
    $table->foreignId('budget_id')->constrained()->cascadeOnDelete();
    $table->foreignId('category_id')->constrained()->cascadeOnDelete();
    $table->decimal('amount', 15, 2);
    $table->boolean('alert_at_50')->default(false);
    $table->boolean('alert_at_80')->default(true);
    $table->boolean('alert_at_100')->default(true);
    $table->text('notes')->nullable();
    $table->timestamps();

    $table->unique(['budget_id', 'category_id']);
});

// 0001_01_01_000013_create_budget_histories_table.php
Schema::create('budget_histories', function (Blueprint $table) {
    $table->id();
    $table->foreignId('budget_id')->constrained()->cascadeOnDelete();
    $table->string('period', 7); // YYYY-MM
    $table->decimal('total_budgeted', 15, 2);
    $table->decimal('total_spent', 15, 2);
    $table->json('lines_snapshot');
    $table->timestamp('closed_at');
    $table->timestamps();

    $table->unique(['budget_id', 'period']);
});

// 0001_01_01_000014_create_credits_table.php
Schema::create('credits', function (Blueprint $table) {
    $table->id();
    $table->foreignId('planning_id')->constrained()->cascadeOnDelete();
    $table->string('name');
    $table->string('type'); // consumer, mortgage, auto, credit_card, personal, other
    $table->string('entity')->nullable();
    $table->decimal('original_amount', 15, 2);
    $table->decimal('pending_amount', 15, 2);
    $table->string('currency', 3)->default('CLP');
    $table->decimal('interest_rate', 5, 2);
    $table->string('rate_type')->default('fixed'); // fixed, variable
    $table->unsignedSmallInteger('term_months');
    $table->date('start_date');
    $table->date('estimated_end_date');
    $table->unsignedTinyInteger('payment_day');
    $table->decimal('monthly_payment', 15, 2);
    $table->string('status')->default('active'); // active, paid, refinanced, defaulted
    $table->string('reference_number')->nullable();
    $table->text('notes')->nullable();
    $table->foreignId('charge_account_id')->nullable()->constrained('accounts')->nullOnDelete();
    // Específico para tarjetas de crédito
    $table->decimal('credit_limit', 15, 2)->nullable();
    $table->unsignedTinyInteger('billing_day')->nullable();
    $table->foreignId('created_by_id')->constrained('users')->cascadeOnDelete();
    $table->timestamps();
    $table->softDeletes();

    $table->index(['planning_id', 'status']);
});

// 0001_01_01_000015_create_credit_installments_table.php
Schema::create('credit_installments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('credit_id')->constrained()->cascadeOnDelete();
    $table->unsignedSmallInteger('number');
    $table->date('due_date');
    $table->decimal('amount', 15, 2);
    $table->decimal('principal', 15, 2);
    $table->decimal('interest', 15, 2);
    $table->decimal('insurance', 15, 2)->default(0);
    $table->decimal('other_charges', 15, 2)->default(0);
    $table->string('status')->default('pending'); // pending, paid, overdue, partial
    $table->date('paid_date')->nullable();
    $table->decimal('paid_amount', 15, 2)->default(0);
    $table->foreignId('transaction_id')->nullable()->constrained()->nullOnDelete();
    $table->text('notes')->nullable();
    $table->timestamps();

    $table->unique(['credit_id', 'number']);
    $table->index(['status', 'due_date']);
});

// 0001_01_01_000016_create_extra_payments_table.php
Schema::create('extra_payments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('credit_id')->constrained()->cascadeOnDelete();
    $table->date('date');
    $table->decimal('amount', 15, 2);
    $table->string('type'); // principal, advance_installments, full_prepayment
    $table->json('applied_installments')->nullable();
    $table->foreignId('transaction_id')->nullable()->constrained()->nullOnDelete();
    $table->text('notes')->nullable();
    $table->timestamps();
});

// 0001_01_01_000017_create_notifications_table.php
Schema::create('notifications', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->foreignId('planning_id')->nullable()->constrained()->cascadeOnDelete();
    $table->string('type');
    $table->string('title');
    $table->text('message');
    $table->json('data')->default('{}');
    $table->boolean('read')->default(false);
    $table->timestamp('read_at')->nullable();
    $table->timestamps();

    $table->index(['user_id', 'read', 'created_at']);
});
```

---

## Paleta de Colores y Tema

### Archivo: `resources/js/app/styles/theme/colors.ts`

```typescript
// Paleta de colores principal
export const colors = {
  // Brand
  primary: {
    50: '#e6f4ff',
    100: '#bae0ff',
    200: '#91caff',
    300: '#69b1ff',
    400: '#4096ff',
    500: '#1677ff', // Principal
    600: '#0958d9',
    700: '#003eb3',
    800: '#002c8c',
    900: '#001d66',
  },

  // Semánticos
  success: {
    light: '#f6ffed',
    main: '#52c41a',
    dark: '#389e0d',
  },
  warning: {
    light: '#fffbe6',
    main: '#faad14',
    dark: '#d48806',
  },
  error: {
    light: '#fff2f0',
    main: '#ff4d4f',
    dark: '#cf1322',
  },
  info: {
    light: '#e6f4ff',
    main: '#1677ff',
    dark: '#0958d9',
  },

  // Transacciones
  income: {
    light: '#f6ffed',
    main: '#52c41a',
    dark: '#389e0d',
    text: '#135200',
  },
  expense: {
    light: '#fff2f0',
    main: '#ff4d4f',
    dark: '#cf1322',
    text: '#820014',
  },
  transfer: {
    light: '#e6f4ff',
    main: '#1677ff',
    dark: '#0958d9',
    text: '#002c8c',
  },

  // Categorías (predefinidos)
  category: {
    home: '#fa8c16',
    food: '#eb2f96',
    transport: '#722ed1',
    entertainment: '#13c2c2',
    health: '#f5222d',
    education: '#1890ff',
    personal: '#faad14',
    savings: '#52c41a',
    salary: '#52c41a',
    freelance: '#722ed1',
    investments: '#13c2c2',
    other: '#8c8c8c',
  },

  // Créditos
  credit: {
    mortgage: '#1890ff',
    consumer: '#722ed1',
    auto: '#13c2c2',
    creditCard: '#eb2f96',
    personal: '#fa8c16',
  },

  // Estados
  status: {
    pending: '#faad14',
    partial: '#1890ff',
    paid: '#52c41a',
    overdue: '#ff4d4f',
    cancelled: '#8c8c8c',
  },

  // Neutros (para ambos temas)
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e8e8e8',
    300: '#d9d9d9',
    400: '#bfbfbf',
    500: '#8c8c8c',
    600: '#595959',
    700: '#434343',
    800: '#262626',
    900: '#1f1f1f',
    950: '#141414',
    1000: '#000000',
  },
};

// Alias para uso rápido
export const semanticColors = {
  positive: colors.income.main,
  negative: colors.expense.main,
  neutral: colors.neutral[500],
};
```

### Archivo: `resources/js/app/styles/theme/light.ts`

```typescript
import { ThemeConfig } from 'antd';
import { colors } from './colors';

export const lightTheme: ThemeConfig = {
  token: {
    // Colores
    colorPrimary: colors.primary[500],
    colorSuccess: colors.success.main,
    colorWarning: colors.warning.main,
    colorError: colors.error.main,
    colorInfo: colors.info.main,

    // Backgrounds
    colorBgContainer: colors.neutral[0],
    colorBgElevated: colors.neutral[0],
    colorBgLayout: colors.neutral[100],
    colorBgSpotlight: colors.neutral[50],

    // Texto
    colorText: colors.neutral[800],
    colorTextSecondary: colors.neutral[600],
    colorTextTertiary: colors.neutral[500],
    colorTextQuaternary: colors.neutral[400],

    // Bordes
    colorBorder: colors.neutral[200],
    colorBorderSecondary: colors.neutral[100],

    // Tipografía
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,
    fontSizeHeading1: 28,
    fontSizeHeading2: 24,
    fontSizeHeading3: 20,
    fontSizeHeading4: 16,

    // Espaciado
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,

    // Bordes
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,

    // Sombras
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
    boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',

    // Animaciones
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
  },
  components: {
    Button: {
      controlHeight: 44,
      controlHeightLG: 52,
      controlHeightSM: 36,
      paddingContentHorizontal: 20,
    },
    Input: {
      controlHeight: 44,
      controlHeightLG: 52,
      controlHeightSM: 36,
    },
    Select: {
      controlHeight: 44,
    },
    Card: {
      paddingLG: 20,
    },
    List: {
      itemPadding: '12px 0',
    },
    Modal: {
      paddingContentHorizontalLG: 24,
    },
  },
};
```

### Archivo: `resources/js/app/styles/theme/dark.ts`

```typescript
import { ThemeConfig } from 'antd';
import { colors } from './colors';

export const darkTheme: ThemeConfig = {
  token: {
    // Colores
    colorPrimary: colors.primary[400],
    colorSuccess: colors.success.main,
    colorWarning: colors.warning.main,
    colorError: colors.error.main,
    colorInfo: colors.info.main,

    // Backgrounds
    colorBgContainer: colors.neutral[900],
    colorBgElevated: colors.neutral[800],
    colorBgLayout: colors.neutral[950],
    colorBgSpotlight: colors.neutral[800],

    // Texto
    colorText: colors.neutral[100],
    colorTextSecondary: colors.neutral[300],
    colorTextTertiary: colors.neutral[400],
    colorTextQuaternary: colors.neutral[500],

    // Bordes
    colorBorder: colors.neutral[700],
    colorBorderSecondary: colors.neutral[800],

    // Tipografía (mismos que light)
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,

    // Espaciado (mismos que light)
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,

    // Bordes (mismos que light)
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,

    // Sombras (adaptadas para dark)
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
    boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.32), 0 3px 6px -4px rgba(0, 0, 0, 0.48), 0 9px 28px 8px rgba(0, 0, 0, 0.2)',
  },
  components: {
    Button: {
      controlHeight: 44,
      controlHeightLG: 52,
      controlHeightSM: 36,
      paddingContentHorizontal: 20,
    },
    Input: {
      controlHeight: 44,
      controlHeightLG: 52,
      controlHeightSM: 36,
    },
    Select: {
      controlHeight: 44,
    },
    Card: {
      paddingLG: 20,
    },
    List: {
      itemPadding: '12px 0',
    },
  },
};
```

### Archivo: `resources/js/app/styles/theme/index.ts`

```typescript
import { ThemeConfig } from 'antd';
import { lightTheme } from './light';
import { darkTheme } from './dark';
import { colors, semanticColors } from './colors';

export { colors, semanticColors };

export type ThemeMode = 'light' | 'dark' | 'system';

export const themes: Record<'light' | 'dark', ThemeConfig> = {
  light: lightTheme,
  dark: darkTheme,
};

export const getTheme = (mode: 'light' | 'dark'): ThemeConfig => themes[mode];

// Tokens CSS personalizados para uso fuera de Ant Design
export const cssVariables = {
  light: {
    '--color-income': colors.income.main,
    '--color-income-bg': colors.income.light,
    '--color-expense': colors.expense.main,
    '--color-expense-bg': colors.expense.light,
    '--color-transfer': colors.transfer.main,
    '--color-transfer-bg': colors.transfer.light,
    '--color-bg-page': colors.neutral[100],
    '--color-bg-card': colors.neutral[0],
    '--color-text-primary': colors.neutral[800],
    '--color-text-secondary': colors.neutral[600],
    '--color-border': colors.neutral[200],
  },
  dark: {
    '--color-income': colors.income.main,
    '--color-income-bg': 'rgba(82, 196, 26, 0.1)',
    '--color-expense': colors.expense.main,
    '--color-expense-bg': 'rgba(255, 77, 79, 0.1)',
    '--color-transfer': colors.transfer.main,
    '--color-transfer-bg': 'rgba(22, 119, 255, 0.1)',
    '--color-bg-page': colors.neutral[950],
    '--color-bg-card': colors.neutral[900],
    '--color-text-primary': colors.neutral[100],
    '--color-text-secondary': colors.neutral[400],
    '--color-border': colors.neutral[700],
  },
};
```

---

## Ejemplos de Código Clave

### Patrón: Controller → Request → Action

```php
// app/Http/Controllers/TransactionController.php
<?php

namespace App\Http\Controllers;

use App\Actions\Transaction\CreateTransactionAction;
use App\Actions\Transaction\UpdateTransactionAction;
use App\Actions\Transaction\DeleteTransactionAction;
use App\Http\Requests\Transaction\StoreTransactionRequest;
use App\Http\Requests\Transaction\UpdateTransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(): Response
    {
        $planning = auth()->user()->activePlanning;

        $transactions = $planning->transactions()
            ->with(['account', 'category', 'createdBy'])
            ->latest('date')
            ->latest('created_at')
            ->paginate(50);

        return Inertia::render('Transactions/Index', [
            'transactions' => TransactionResource::collection($transactions),
            'accounts' => $planning->accounts()->active()->get(),
            'categories' => $planning->categories()->active()->get(),
        ]);
    }

    public function create(): Response
    {
        $planning = auth()->user()->activePlanning;

        return Inertia::render('Transactions/Create', [
            'accounts' => $planning->accounts()->active()->get(),
            'categories' => $planning->categories()->active()->get(),
        ]);
    }

    public function store(
        StoreTransactionRequest $request,
        CreateTransactionAction $action
    ): RedirectResponse {
        $transaction = $action->execute(
            planning: auth()->user()->activePlanning,
            data: $request->validated(),
            user: auth()->user()
        );

        return redirect()
            ->route('transactions.index')
            ->with('success', 'Transacción creada exitosamente');
    }

    public function show(Transaction $transaction): Response
    {
        $this->authorize('view', $transaction);

        return Inertia::render('Transactions/Show', [
            'transaction' => new TransactionResource(
                $transaction->load(['account', 'category', 'createdBy'])
            ),
        ]);
    }

    public function edit(Transaction $transaction): Response
    {
        $this->authorize('update', $transaction);

        $planning = auth()->user()->activePlanning;

        return Inertia::render('Transactions/Edit', [
            'transaction' => new TransactionResource($transaction),
            'accounts' => $planning->accounts()->active()->get(),
            'categories' => $planning->categories()->active()->get(),
        ]);
    }

    public function update(
        UpdateTransactionRequest $request,
        Transaction $transaction,
        UpdateTransactionAction $action
    ): RedirectResponse {
        $this->authorize('update', $transaction);

        $action->execute(
            transaction: $transaction,
            data: $request->validated(),
            user: auth()->user()
        );

        return redirect()
            ->route('transactions.index')
            ->with('success', 'Transacción actualizada');
    }

    public function destroy(
        Transaction $transaction,
        DeleteTransactionAction $action
    ): RedirectResponse {
        $this->authorize('delete', $transaction);

        $action->execute($transaction);

        return redirect()
            ->route('transactions.index')
            ->with('success', 'Transacción eliminada');
    }
}
```

### Request Personalizado

```php
// app/Http/Requests/Transaction/StoreTransactionRequest.php
<?php

namespace App\Http\Requests\Transaction;

use App\Enums\TransactionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        // El usuario debe poder crear transacciones en su planificación activa
        $planning = $this->user()->activePlanning;

        return $planning && $this->user()->canEditPlanning($planning);
    }

    public function rules(): array
    {
        $planning = $this->user()->activePlanning;

        return [
            'type' => ['required', Rule::enum(TransactionType::class)],
            'amount' => ['required', 'numeric', 'min:0.01', 'max:999999999999.99'],
            'account_id' => [
                'required',
                'integer',
                Rule::exists('accounts', 'id')->where('planning_id', $planning->id),
            ],
            'destination_account_id' => [
                'nullable',
                'integer',
                'different:account_id',
                Rule::exists('accounts', 'id')->where('planning_id', $planning->id),
                Rule::requiredIf($this->type === TransactionType::TRANSFER->value),
            ],
            'category_id' => [
                'nullable',
                'integer',
                Rule::exists('categories', 'id')->where('planning_id', $planning->id),
                Rule::requiredIf(in_array($this->type, [
                    TransactionType::INCOME->value,
                    TransactionType::EXPENSE->value,
                ])),
            ],
            'description' => ['nullable', 'string', 'max:255'],
            'date' => ['required', 'date', 'before_or_equal:today'],
            'time' => ['nullable', 'date_format:H:i'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'attachments' => ['nullable', 'array'],
            'attachments.*' => ['string', 'max:255'],
            'is_recurring' => ['boolean'],
            'recurring_config' => ['nullable', 'array', 'required_if:is_recurring,true'],
            'recurring_config.frequency' => ['required_with:recurring_config', 'string'],
            'recurring_config.end_date' => ['nullable', 'date', 'after:date'],
        ];
    }

    public function messages(): array
    {
        return [
            'type.required' => 'Selecciona el tipo de transacción',
            'amount.required' => 'Ingresa el monto',
            'amount.min' => 'El monto debe ser mayor a 0',
            'account_id.required' => 'Selecciona una cuenta',
            'account_id.exists' => 'La cuenta seleccionada no es válida',
            'destination_account_id.different' => 'La cuenta destino debe ser diferente',
            'destination_account_id.required_if' => 'Selecciona la cuenta destino',
            'category_id.required_if' => 'Selecciona una categoría',
            'date.required' => 'Ingresa la fecha',
            'date.before_or_equal' => 'La fecha no puede ser futura',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_recurring' => $this->boolean('is_recurring'),
        ]);
    }
}
```

### Action con Métodos Reutilizables

```php
// app/Actions/Transaction/CreateTransactionAction.php
<?php

namespace App\Actions\Transaction;

use App\Enums\TransactionType;
use App\Models\Planning;
use App\Models\Transaction;
use App\Models\User;
use App\Services\BalanceCalculator;
use Illuminate\Support\Facades\DB;

class CreateTransactionAction
{
    public function __construct(
        private BalanceCalculator $balanceCalculator
    ) {}

    /**
     * Ejecuta la creación de una transacción completa.
     */
    public function execute(Planning $planning, array $data, User $user): Transaction
    {
        return DB::transaction(function () use ($planning, $data, $user) {
            // Crear la transacción
            $transaction = $this->createTransaction($planning, $data, $user);

            // Actualizar saldos
            $this->updateBalances($transaction);

            // Si es recurrente, crear la configuración
            if (!empty($data['is_recurring']) && !empty($data['recurring_config'])) {
                $this->createRecurringConfig($transaction, $data['recurring_config']);
            }

            return $transaction;
        });
    }

    /**
     * Crea solo el registro de transacción.
     * Útil para importaciones masivas o procesamiento de recurrentes.
     */
    public function createTransaction(Planning $planning, array $data, User $user): Transaction
    {
        return Transaction::create([
            'planning_id' => $planning->id,
            'type' => $data['type'],
            'amount' => $data['amount'],
            'account_id' => $data['account_id'],
            'destination_account_id' => $data['destination_account_id'] ?? null,
            'category_id' => $data['category_id'] ?? null,
            'description' => $data['description'] ?? null,
            'date' => $data['date'],
            'time' => $data['time'] ?? null,
            'tags' => $data['tags'] ?? [],
            'attachments' => $data['attachments'] ?? [],
            'is_recurring' => $data['is_recurring'] ?? false,
            'created_by_id' => $user->id,
        ]);
    }

    /**
     * Actualiza los saldos de las cuentas afectadas.
     * Método público para reutilización en ajustes y correcciones.
     */
    public function updateBalances(Transaction $transaction): void
    {
        $type = TransactionType::from($transaction->type);

        match ($type) {
            TransactionType::INCOME => $this->balanceCalculator->addToAccount(
                $transaction->account_id,
                $transaction->amount
            ),
            TransactionType::EXPENSE => $this->balanceCalculator->subtractFromAccount(
                $transaction->account_id,
                $transaction->amount
            ),
            TransactionType::TRANSFER => $this->processTransfer($transaction),
            TransactionType::ADJUSTMENT => $this->balanceCalculator->setAccountBalance(
                $transaction->account_id,
                $transaction->amount
            ),
        };
    }

    /**
     * Procesa una transferencia entre cuentas.
     */
    private function processTransfer(Transaction $transaction): void
    {
        $this->balanceCalculator->subtractFromAccount(
            $transaction->account_id,
            $transaction->amount
        );

        $this->balanceCalculator->addToAccount(
            $transaction->destination_account_id,
            $transaction->amount
        );
    }

    /**
     * Crea la configuración de recurrencia.
     */
    private function createRecurringConfig(Transaction $transaction, array $config): void
    {
        $transaction->recurringTransaction()->create([
            'planning_id' => $transaction->planning_id,
            'type' => $transaction->type,
            'amount' => $transaction->amount,
            'account_id' => $transaction->account_id,
            'category_id' => $transaction->category_id,
            'description' => $transaction->description,
            'frequency' => $config['frequency'],
            'execution_day' => $config['execution_day'] ?? $transaction->date->day,
            'start_date' => $transaction->date,
            'end_date' => $config['end_date'] ?? null,
            'active' => true,
            'last_execution' => $transaction->date,
            'next_execution' => $this->calculateNextExecution($transaction->date, $config['frequency']),
            'created_by_id' => $transaction->created_by_id,
        ]);
    }

    /**
     * Calcula la próxima fecha de ejecución.
     */
    public function calculateNextExecution(\DateTimeInterface $from, string $frequency): \DateTimeInterface
    {
        $date = \Carbon\Carbon::parse($from);

        return match ($frequency) {
            'daily' => $date->addDay(),
            'weekly' => $date->addWeek(),
            'biweekly' => $date->addWeeks(2),
            'monthly' => $date->addMonth(),
            'yearly' => $date->addYear(),
            default => $date->addMonth(),
        };
    }
}
```

### Componente React con Tema

```tsx
// resources/js/app/components/transactions/TransactionItem.tsx
import React from 'react';
import { List, Typography, Tag, Space } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  SwapOutlined
} from '@ant-design/icons';
import { Transaction } from '@/app/types/models';
import { MoneyDisplay } from '@/app/components/common/MoneyDisplay';
import { useTheme } from '@/app/hooks/useTheme';
import { colors } from '@/app/styles/theme/colors';
import { formatDate } from '@/app/utils/date';

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: (transaction: Transaction) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onClick,
}) => {
  const { isDark } = useTheme();

  const typeConfig = {
    income: {
      icon: <ArrowUpOutlined />,
      color: colors.income.main,
      bgColor: isDark ? 'rgba(82, 196, 26, 0.1)' : colors.income.light,
      sign: '+',
    },
    expense: {
      icon: <ArrowDownOutlined />,
      color: colors.expense.main,
      bgColor: isDark ? 'rgba(255, 77, 79, 0.1)' : colors.expense.light,
      sign: '-',
    },
    transfer: {
      icon: <SwapOutlined />,
      color: colors.transfer.main,
      bgColor: isDark ? 'rgba(22, 119, 255, 0.1)' : colors.transfer.light,
      sign: '',
    },
  };

  const config = typeConfig[transaction.type] || typeConfig.expense;

  return (
    <List.Item
      onClick={() => onClick?.(transaction)}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        padding: '12px 16px',
      }}
    >
      <List.Item.Meta
        avatar={
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: config.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: config.color,
              fontSize: 18,
            }}
          >
            {transaction.category?.icon || config.icon}
          </div>
        }
        title={
          <Space>
            <Typography.Text strong>
              {transaction.category?.name || transaction.description || 'Transferencia'}
            </Typography.Text>
            {transaction.is_recurring && (
              <Tag color="blue" style={{ fontSize: 10 }}>
                Recurrente
              </Tag>
            )}
          </Space>
        }
        description={
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {transaction.account?.name}
            {transaction.destination_account && (
              <> → {transaction.destination_account.name}</>
            )}
          </Typography.Text>
        }
      />
      <div style={{ textAlign: 'right' }}>
        <MoneyDisplay
          amount={transaction.amount}
          sign={config.sign}
          color={config.color}
          style={{ fontWeight: 600 }}
        />
        <Typography.Text
          type="secondary"
          style={{ fontSize: 11, display: 'block' }}
        >
          {formatDate(transaction.date, 'short')}
        </Typography.Text>
      </div>
    </List.Item>
  );
};
```

### Página Inertia

```tsx
// resources/js/app/pages/Transactions/Index.tsx
import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { List, Button, FloatButton, Empty, Segmented } from 'antd';
import { PlusOutlined, FilterOutlined } from '@ant-design/icons';
import { AppLayout } from '@/app/components/common/AppLayout';
import { TransactionItem } from '@/app/components/transactions/TransactionItem';
import { TransactionFilters } from '@/app/components/transactions/TransactionFilters';
import { QuickActions } from '@/app/components/common/QuickActions';
import { PullToRefresh } from '@/app/components/common/PullToRefresh';
import { Transaction, Account, Category, PaginatedData } from '@/app/types/models';
import { usePlanning } from '@/app/hooks/usePlanning';
import { groupTransactionsByDate } from '@/app/utils/transactions';

interface Props {
  transactions: PaginatedData<Transaction>;
  accounts: Account[];
  categories: Category[];
}

export default function TransactionsIndex({
  transactions,
  accounts,
  categories
}: Props) {
  const { planning } = usePlanning();
  const [showFilters, setShowFilters] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const groupedTransactions = groupTransactionsByDate(
    transactions.data.filter(t => filter === 'all' || t.type === filter)
  );

  const handleRefresh = async () => {
    router.reload({ only: ['transactions'] });
  };

  const handleTransactionClick = (transaction: Transaction) => {
    router.visit(route('transactions.show', transaction.id));
  };

  const handleLoadMore = () => {
    if (transactions.next_page_url) {
      router.visit(transactions.next_page_url, {
        preserveState: true,
        preserveScroll: true,
      });
    }
  };

  return (
    <AppLayout>
      <Head title="Transacciones" />

      <div style={{ padding: '0 16px' }}>
        {/* Filtros rápidos */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          paddingTop: 16,
        }}>
          <Segmented
            value={filter}
            onChange={(value) => setFilter(value as typeof filter)}
            options={[
              { label: 'Todas', value: 'all' },
              { label: 'Ingresos', value: 'income' },
              { label: 'Gastos', value: 'expense' },
            ]}
          />
          <Button
            icon={<FilterOutlined />}
            onClick={() => setShowFilters(true)}
          />
        </div>

        <PullToRefresh onRefresh={handleRefresh}>
          {transactions.data.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No hay transacciones"
              style={{ marginTop: 60 }}
            >
              <Button
                type="primary"
                onClick={() => setShowQuickActions(true)}
              >
                Registrar primera transacción
              </Button>
            </Empty>
          ) : (
            <>
              {Object.entries(groupedTransactions).map(([date, items]) => (
                <div key={date} style={{ marginBottom: 24 }}>
                  <Typography.Text
                    type="secondary"
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    {date}
                  </Typography.Text>
                  <List
                    dataSource={items}
                    renderItem={(transaction) => (
                      <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                        onClick={handleTransactionClick}
                      />
                    )}
                    style={{
                      backgroundColor: 'var(--color-bg-card)',
                      borderRadius: 12,
                      marginTop: 8,
                    }}
                  />
                </div>
              ))}

              {transactions.next_page_url && (
                <Button
                  block
                  onClick={handleLoadMore}
                  style={{ marginBottom: 80 }}
                >
                  Cargar más
                </Button>
              )}
            </>
          )}
        </PullToRefresh>
      </div>

      {/* FAB */}
      <FloatButton
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setShowQuickActions(true)}
        style={{ bottom: 80, right: 16 }}
      />

      {/* Modales */}
      <TransactionFilters
        open={showFilters}
        onClose={() => setShowFilters(false)}
        accounts={accounts}
        categories={categories}
      />

      <QuickActions
        open={showQuickActions}
        onClose={() => setShowQuickActions(false)}
      />
    </AppLayout>
  );
}
```

---

## Fases de Implementación

### Fase 1: Fundamentos (Semana 1-2) ✅ COMPLETADA

#### Objetivos
- Configuración del proyecto
- Sistema de autenticación
- Estructura base de planificaciones

#### Tareas

**Backend**
- [x] Crear proyecto Laravel 11
- [x] Configurar PostgreSQL
- [x] Instalar y configurar Inertia.js 2
- [x] Instalar Sanctum para autenticación
- [x] Crear migraciones: `users`, `plannings`, `planning_members`, `invitations`
- [x] Crear modelos base con relaciones
- [x] Crear Enums: `MemberRole`, `InvitationStatus`
- [x] Implementar middleware `HandleInertiaRequests`
- [x] Implementar middleware `EnsureActivePlanning`
- [x] Crear Actions de Auth:
  - `RegisterUserAction`
  - `LoginUserAction`
  - `ResetPasswordAction`
- [x] Crear Actions de Planning:
  - `CreatePlanningAction`
  - `UpdatePlanningAction`
  - `SwitchActivePlanningAction`
- [x] Crear Requests de validación
- [x] Crear Controllers de Auth y Planning
- [x] Configurar rutas

**Frontend**
- [x] Configurar Vite + React + TypeScript
- [x] Instalar y configurar Ant Design 5
- [x] Configurar sistema de temas (light/dark)
- [x] Crear estructura de carpetas
- [x] Implementar `ThemeContext` y `ThemeProvider`
- [x] Implementar `AuthContext`
- [x] Implementar `PlanningContext`
- [x] Crear layouts: `AuthLayout`, `AppLayout`
- [x] Crear componentes comunes:
  - `BottomNavigation`
  - `Header`
  - `PlanningSelector`
- [x] Crear páginas de Auth:
  - `Login`
  - `Register`
  - `ForgotPassword`
- [x] Crear páginas de Onboarding:
  - `Welcome`
  - `CreatePlanning`
- [x] Crear página `Plannings/Index`

**Entregables**
- Usuario puede registrarse e iniciar sesión
- Usuario puede crear su primera planificación
- Usuario puede cambiar entre planificaciones
- Tema claro/oscuro funcionando

---

### Fase 2: Cuentas y Categorías (Semana 3) ✅ COMPLETADA

#### Objetivos
- CRUD completo de cuentas
- CRUD completo de categorías
- Sistema de saldos

#### Tareas

**Backend**
- [x] Crear migraciones: `accounts`, `categories`
- [x] Crear modelos con traits `BelongsToPlanning`
- [x] Crear Enums: `AccountType`, `CategoryType`
- [x] Crear Service: `BalanceCalculator`
- [x] Crear Actions de Account:
  - `CreateAccountAction`
  - `UpdateAccountAction`
  - `AdjustBalanceAction`
  - `TransferBetweenAccountsAction`
- [x] Crear Actions de Category:
  - `CreateCategoryAction`
  - `UpdateCategoryAction`
  - `ReorderCategoriesAction`
- [x] Crear Requests de validación
- [x] Crear Resources: `AccountResource`, `CategoryResource`
- [x] Crear Controllers
- [x] Crear Seeder: `DefaultCategoriesSeeder`
- [x] Crear Policy: `AccountPolicy`, `CategoryPolicy`

**Frontend**
- [x] Crear componentes de Account:
  - `AccountList`
  - `AccountCard`
  - `AccountForm`
  - `AccountDetail`
  - `AdjustBalanceModal`
- [x] Crear componentes de Category:
  - `CategoryList`
  - `CategoryTree`
  - `CategoryForm`
  - `CategoryItem`
- [x] Crear páginas:
  - `Accounts/Index`
  - `Accounts/Create`
  - `Accounts/Edit`
  - `Accounts/Show`
  - `Categories/Index`
  - `Categories/Create`
  - `Categories/Edit`
- [x] Integrar en onboarding: `AddFirstAccount`

**Entregables**
- Usuario puede crear/editar/archivar cuentas
- Usuario puede ver saldo de cada cuenta
- Usuario puede ajustar saldo manualmente
- Usuario puede crear categorías jerárquicas
- Categorías por defecto al crear planificación

---

### Fase 3: Transacciones (Semana 4-5)

#### Objetivos
- CRUD completo de transacciones
- Transferencias entre cuentas
- Sistema de recurrencias
- Actualización automática de saldos

#### Tareas

**Backend**
- [ ] Crear migraciones: `transactions`, `recurring_transactions`
- [ ] Crear modelos con relaciones
- [ ] Crear Enum: `TransactionType`, `Frequency`
- [ ] Crear Actions de Transaction:
  - `CreateTransactionAction` (con métodos reutilizables)
  - `UpdateTransactionAction`
  - `DeleteTransactionAction`
  - `DuplicateTransactionAction`
  - `ProcessRecurringTransactionsAction`
- [ ] Crear Requests de validación
- [ ] Crear Resource: `TransactionResource`
- [ ] Crear Controller con filtros y paginación
- [ ] Crear Policy: `TransactionPolicy`

**Frontend**
- [ ] Crear componentes:
  - `TransactionList`
  - `TransactionItem`
  - `TransactionForm` (con calculadora)
  - `TransactionFilters`
  - `CategorySelector`
  - `AccountSelector`
  - `TransferForm`
  - `AmountInput` (teclado numérico)
  - `RecurringBadge`
- [ ] Crear componentes comunes:
  - `FloatingActionButton`
  - `QuickActions`
  - `SwipeableItem`
  - `PullToRefresh`
- [ ] Crear páginas:
  - `Transactions/Index`
  - `Transactions/Create`
  - `Transactions/Edit`
  - `Transactions/Show`
  - `Transactions/Recurring`
- [ ] Implementar gestos (swipe para editar/eliminar)

**Entregables**
- Usuario puede registrar ingresos/gastos
- Usuario puede hacer transferencias
- Saldos se actualizan automáticamente
- Transacciones recurrentes se procesan automáticamente
- Filtros y búsqueda funcionando

---

### Fase 4: Cuentas Pendientes (Semana 6)

#### Objetivos
- Gestión de cuentas por cobrar
- Gestión de cuentas por pagar
- Sistema de pagos parciales
- Recordatorios

#### Tareas

**Backend**
- [ ] Crear migraciones: `receivables`, `receivable_payments`, `reminders`
- [ ] Crear modelos con relaciones
- [ ] Crear Enums: `ReceivableType`, `ReceivableStatus`
- [ ] Crear Actions:
  - `CreateReceivableAction`
  - `UpdateReceivableAction`
  - `RegisterPaymentAction` (crea transacción automática)
  - `SendReminderAction`
- [ ] Crear Requests de validación
- [ ] Crear Resources
- [ ] Crear Controller

**Frontend**
- [ ] Crear componentes:
  - `ReceivableList`
  - `ReceivableCard`
  - `ReceivableForm`
  - `ReceivableDetail`
  - `PaymentForm`
  - `PaymentHistory`
  - `ReminderForm`
- [ ] Crear páginas:
  - `Receivables/Index` (con tabs cobrar/pagar)
  - `Receivables/Create`
  - `Receivables/Edit`
  - `Receivables/Show`

**Entregables**
- Usuario puede registrar deudas a favor/en contra
- Usuario puede registrar pagos parciales o totales
- Se genera transacción al registrar pago
- Recordatorios programables

---

### Fase 5: Presupuestos (Semana 7)

#### Objetivos
- Presupuesto mensual por categorías
- Seguimiento en tiempo real
- Alertas de consumo
- Histórico de presupuestos

#### Tareas

**Backend**
- [ ] Crear migraciones: `budgets`, `budget_lines`, `budget_histories`
- [ ] Crear modelos
- [ ] Crear Service: `BudgetCalculator`
- [ ] Crear Actions:
  - `CreateBudgetAction`
  - `UpdateBudgetAction`
  - `CopyBudgetFromPreviousMonthAction`
  - `CloseBudgetPeriodAction`
- [ ] Crear Requests de validación
- [ ] Crear Resources
- [ ] Crear Controller
- [ ] Crear Job para alertas de presupuesto

**Frontend**
- [ ] Crear componentes:
  - `BudgetDashboard`
  - `BudgetCategoryCard` (con barra de progreso)
  - `BudgetForm`
  - `BudgetLineItem`
  - `BudgetHistory`
  - `ProgressBar` (personalizado)
- [ ] Crear páginas:
  - `Budgets/Index`
  - `Budgets/Configure`
  - `Budgets/Category`
  - `Budgets/History`

**Entregables**
- Usuario puede configurar presupuesto mensual
- Ver progreso en tiempo real por categoría
- Alertas al alcanzar umbrales
- Histórico de meses anteriores

---

### Fase 6: Créditos y Préstamos (Semana 8-9)

#### Objetivos
- Registro de diferentes tipos de créditos
- Tabla de amortización
- Seguimiento de cuotas
- Simulador de prepago

#### Tareas

**Backend**
- [ ] Crear migraciones: `credits`, `credit_installments`, `extra_payments`
- [ ] Crear modelos
- [ ] Crear Enums: `CreditType`, `CreditStatus`, `InstallmentStatus`
- [ ] Crear Service: `AmortizationCalculator`
- [ ] Crear Actions:
  - `CreateCreditAction` (genera tabla amortización)
  - `UpdateCreditAction`
  - `PayInstallmentAction`
  - `RegisterExtraPaymentAction`
  - `GenerateAmortizationTableAction`
  - `SimulatePrepaymentAction`
- [ ] Crear Requests de validación
- [ ] Crear Resources
- [ ] Crear Controller

**Frontend**
- [ ] Crear componentes:
  - `CreditList`
  - `CreditCard`
  - `CreditForm` (multi-step)
  - `CreditDetail`
  - `AmortizationTable`
  - `InstallmentItem`
  - `PayInstallmentForm`
  - `ExtraPaymentForm`
  - `PrepaymentSimulator`
  - `CreditCardDetail` (específico para tarjetas)
- [ ] Crear páginas:
  - `Credits/Index`
  - `Credits/Create`
  - `Credits/Edit`
  - `Credits/Show`
  - `Credits/Amortization`
  - `Credits/Simulate`

**Entregables**
- Usuario puede registrar créditos de cualquier tipo
- Tabla de amortización generada automáticamente
- Pago de cuotas genera transacción
- Simulador de prepago funcional
- Soporte para tarjetas de crédito

---

### Fase 7: Colaboración (Semana 10)

#### Objetivos
- Sistema de invitaciones
- Roles y permisos
- Actividad colaborativa

#### Tareas

**Backend**
- [ ] Completar Actions de Member:
  - `InviteMemberAction`
  - `AcceptInvitationAction`
  - `RejectInvitationAction`
  - `ChangeMemberRoleAction`
  - `RemoveMemberAction`
- [ ] Crear middleware `CheckPlanningRole`
- [ ] Implementar sistema de correos para invitaciones
- [ ] Crear notificaciones de colaboración
- [ ] Crear Resources de miembro e invitación
- [ ] Crear Controllers

**Frontend**
- [ ] Crear componentes:
  - `MemberList`
  - `MemberCard`
  - `InviteForm`
  - `InvitationList`
  - `InvitationCard`
  - `RoleSelector`
- [ ] Crear páginas:
  - `Members/Index`
  - `Members/Invite`
  - `Members/Invitations` (recibidas)
- [ ] Crear página de aceptar invitación (link público)

**Entregables**
- Usuario puede invitar por email o link
- Sistema de roles funcionando
- Invitaciones con expiración
- Notificaciones de colaboración

---

### Fase 8: Dashboard y Reportes (Semana 11)

#### Objetivos
- Dashboard principal con resumen
- Reportes con gráficos
- Exportación de datos

#### Tareas

**Backend**
- [ ] Crear Service: `ReportGenerator`
- [ ] Crear Service: `ExportService`
- [ ] Crear Actions de Report:
  - `GenerateExpensesByCategoryReportAction`
  - `GenerateIncomeVsExpensesReportAction`
  - `GenerateCashFlowReportAction`
  - `ExportReportAction`
- [ ] Crear Controller de Dashboard (agregaciones)
- [ ] Crear Controller de Reports

**Frontend**
- [ ] Instalar librería de gráficos (recharts o @ant-design/plots)
- [ ] Crear componentes de Dashboard:
  - `BalanceCard`
  - `MonthSummary`
  - `BudgetProgress`
  - `UpcomingPayments`
  - `QuickStats`
- [ ] Crear componentes de Reports:
  - `ExpensesByCategoryChart`
  - `IncomeVsExpensesChart`
  - `CashFlowChart`
  - `BudgetVsRealChart`
  - `DebtSummary`
  - `ExportButton`
- [ ] Crear páginas:
  - `Dashboard/Index`
  - `Reports/Index`
  - `Reports/ExpensesByCategory`
  - `Reports/IncomeVsExpenses`
  - `Reports/CashFlow`
  - `Reports/Debts`

**Entregables**
- Dashboard con métricas clave
- Gráficos interactivos
- Exportación a PDF/Excel
- Filtros por período

---

### Fase 9: Notificaciones y Configuración (Semana 12)

#### Objetivos
- Centro de notificaciones
- Push notifications
- Configuraciones personales y de planificación

#### Tareas

**Backend**
- [ ] Crear migración: `notifications`
- [ ] Crear modelo y Service: `NotificationService`
- [ ] Implementar eventos y listeners para notificaciones
- [ ] Crear Controller de Notifications
- [ ] Crear Controller de Settings
- [ ] Implementar push notifications (Firebase/Laravel Echo)

**Frontend**
- [ ] Crear componentes:
  - `NotificationCenter`
  - `NotificationItem`
  - `NotificationBadge`
  - `SettingsMenu`
  - `ProfileForm`
  - `PlanningSettings`
  - `NotificationSettings`
  - `SecuritySettings`
  - `ThemeToggle`
  - `ExportData`
- [ ] Crear páginas:
  - `Notifications/Index`
  - `Settings/Index`
  - `Settings/Profile`
  - `Settings/Planning`
  - `Settings/Notifications`
  - `Settings/Security`
- [ ] Implementar service worker para PWA

**Entregables**
- Centro de notificaciones funcional
- Push notifications configurables
- Configuración de perfil
- Configuración de planificación
- Exportación de datos

---

### Fase 10: PWA y Pulido Final (Semana 13-14)

#### Objetivos
- Convertir en PWA completa
- Optimización de rendimiento
- Testing
- Documentación

#### Tareas

**PWA**
- [ ] Configurar manifest.json
- [ ] Implementar service worker completo
- [ ] Configurar caching de assets
- [ ] Implementar sync en background
- [ ] Splash screens para iOS/Android
- [ ] Iconos en todos los tamaños

**Optimización**
- [ ] Implementar lazy loading de páginas
- [ ] Optimizar queries con eager loading
- [ ] Implementar cache de Redis
- [ ] Optimizar imágenes y assets
- [ ] Implementar infinite scroll donde aplique

**Testing**
- [ ] Tests unitarios de Actions
- [ ] Tests de integración de Controllers
- [ ] Tests de Components con React Testing Library
- [ ] Tests E2E básicos con Cypress/Playwright

**Documentación**
- [ ] README.md completo
- [ ] Documentación de API
- [ ] Guía de despliegue
- [ ] Guía de contribución

**Entregables**
- App instalable en móviles
- Funcionamiento offline básico
- Performance optimizado
- Suite de tests
- Documentación completa

---

## Resumen de Fases

| Fase | Nombre | Duración | Entregable Principal |
|------|--------|----------|---------------------|
| 1 | Fundamentos | 2 sem | Auth + Planificaciones |
| 2 | Cuentas y Categorías | 1 sem | CRUD Cuentas/Categorías |
| 3 | Transacciones | 2 sem | Sistema completo de transacciones |
| 4 | Cuentas Pendientes | 1 sem | Cobrar/Pagar con pagos parciales |
| 5 | Presupuestos | 1 sem | Presupuesto mensual con tracking |
| 6 | Créditos | 2 sem | Gestión de créditos y amortización |
| 7 | Colaboración | 1 sem | Invitaciones y roles |
| 8 | Dashboard y Reportes | 1 sem | Visualización y exportación |
| 9 | Notificaciones | 1 sem | Push y configuración |
| 10 | PWA y Pulido | 2 sem | App lista para producción |

**Total estimado: 14 semanas**

---

## Comandos de Inicio

```bash
# Backend
composer create-project laravel/laravel xplan
cd xplan
composer require inertiajs/inertia-laravel
composer require laravel/sanctum
composer require tightenco/ziggy

# Frontend
npm install react react-dom @types/react @types/react-dom
npm install @inertiajs/react
npm install antd @ant-design/icons
npm install typescript @types/node
npm install -D @vitejs/plugin-react

# Base de datos
php artisan migrate
php artisan db:seed
```

---

## Notas Importantes

1. **Siempre usar Requests personalizados** para validación en store/update
2. **Siempre usar Actions** para lógica de negocio
3. **Actions deben tener métodos públicos reutilizables** para consola/jobs
4. **Nunca poner lógica de negocio en Controllers**
5. **Usar Resources** para transformar datos hacia el frontend
6. **Usar Policies** para autorización
7. **Mantener componentes pequeños** y reutilizables
8. **Mobile-first** en todo el diseño
9. **Probar en dispositivos reales** frecuentemente
10. **Documentar decisiones arquitectónicas**
