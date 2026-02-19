// Tipos de los modelos de la aplicación

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  active_planning_id?: number;
  settings: UserSettings;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  currency?: string;
  date_format?: string;
  locale?: string;
  theme?: 'light' | 'dark' | 'system';
  notifications_enabled?: boolean;
  notification_budget_alerts?: boolean;
  notification_due_dates?: boolean;
  notification_overdue?: boolean;
  notification_members?: boolean;
}

export interface Planning {
  id: number;
  name: string;
  description?: string;
  currency: string;
  icon: string;
  color: string;
  month_start_day: number;
  show_decimals: boolean;
  creator_id: number;
  created_at: string;
  updated_at: string;
  members_count?: number;
  role?: MemberRole;
}

export type MemberRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface PlanningMember {
  id: number;
  planning_id: number;
  user_id: number;
  role: MemberRole;
  role_label: string;
  is_owner: boolean;
  invited_by_id?: number;
  joined_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  invited_by?: {
    id: number;
    name: string;
  };
  created_at: string;
}

export interface RoleOption {
  value: MemberRole;
  label: string;
}

export interface Invitation {
  id: number;
  planning_id: number;
  email: string;
  role: MemberRole;
  role_label: string;
  status: InvitationStatus;
  status_label: string;
  token: string;
  is_expired: boolean;
  is_pending: boolean;
  expires_at: string;
  responded_at?: string;
  created_at: string;
  planning?: {
    id: number;
    name: string;
    icon: string;
    color: string;
  };
  created_by?: {
    id: number;
    name: string;
  };
}

export type InvitationStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

export interface Account {
  id: number;
  planning_id?: number;
  name: string;
  type: AccountType;
  type_label: string;
  type_icon: string;
  initial_balance: number;
  current_balance: number;
  currency: string;
  color?: string;
  icon?: string;
  description?: string;
  include_in_total: boolean;
  is_archived: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export type AccountType = 'checking' | 'savings' | 'cash' | 'credit_card' | 'investment' | 'other';

export interface AccountTypeOption {
  value: AccountType;
  label: string;
  icon: string;
}

export interface AccountsSummary {
  total_balance: number;
  total_assets: number;
  total_liabilities: number;
  count: number;
}

export interface Category {
  id: number;
  planning_id?: number;
  parent_id?: number;
  name: string;
  full_name: string;
  type: CategoryType;
  type_label: string;
  type_color: string;
  icon?: string;
  color?: string;
  is_system: boolean;
  is_archived: boolean;
  order: number;
  children?: Category[];
  parent?: Category;
  created_at: string;
  updated_at: string;
}

export type CategoryType = 'income' | 'expense';

export interface CategoryTypeOption {
  value: CategoryType;
  label: string;
  color: string;
}

export interface Transaction {
  id: number;
  planning_id?: number;
  type: TransactionType;
  type_label: string;
  type_color: string;
  type_icon: string;
  amount: number;
  account_id: number;
  destination_account_id?: number;
  category_id?: number;
  description?: string;
  date: string;
  time?: string;
  is_recurring: boolean;
  pending_approval: boolean;
  source?: string;
  tags: string[];
  attachments: string[];
  created_by: number;
  created_at: string;
  updated_at: string;
  account?: Account;
  destination_account?: Account;
  category?: Category;
  creator?: User;
}

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface TransactionTypeOption {
  value: TransactionType;
  label: string;
  color: string;
  icon: string;
}

export interface TransactionSummary {
  monthly_income: number;
  monthly_expense: number;
  monthly_balance: number;
}

export type FrequencyType = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';

export interface FrequencyOption {
  value: FrequencyType;
  label: string;
}

export interface RecurringTransaction {
  id: number;
  planning_id?: number;
  type: TransactionType;
  type_label: string;
  type_color: string;
  type_icon: string;
  amount: number;
  account_id: number;
  destination_account_id?: number;
  category_id?: number;
  description?: string;
  frequency: FrequencyType;
  frequency_label: string;
  start_date: string;
  end_date?: string;
  next_run_date: string;
  last_run_date?: string;
  is_active: boolean;
  tags: string[];
  applied_months?: string[];
  skipped_months?: string[];
  account?: Account;
  destination_account?: Account;
  category?: Category;
  created_by?: number;
  creator?: User;
  created_at?: string;
  updated_at?: string;
}

export interface Receivable {
  id: number;
  planning_id?: number;
  type: ReceivableType;
  type_label: string;
  type_color: string;
  status: ReceivableStatus;
  status_label: string;
  status_color: string;
  person_name: string;
  person_contact?: string;
  original_amount: number;
  pending_amount: number;
  paid_amount: number;
  progress: number;
  currency: string;
  concept: string;
  due_date?: string;
  is_overdue: boolean;
  notes?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  payments?: ReceivablePayment[];
  reminders?: Reminder[];
}

export type ReceivableType = 'receivable' | 'payable';
export type ReceivableStatus = 'pending' | 'partial' | 'paid' | 'cancelled';

export interface ReceivableTypeOption {
  value: ReceivableType;
  label: string;
  color: string;
  icon: string;
}

export interface ReceivableStatusOption {
  value: ReceivableStatus;
  label: string;
  color: string;
}

export interface ReceivableSummary {
  total_receivable: number;
  total_payable: number;
  net_balance: number;
  overdue_count: number;
}

export interface ReceivablePayment {
  id: number;
  receivable_id: number;
  amount: number;
  date: string;
  account_id: number;
  transaction_id?: number;
  notes?: string;
  registered_by: number;
  account?: Account;
  created_at: string;
}

export interface Reminder {
  id: number;
  receivable_id: number;
  remind_at: string;
  message?: string;
  sent: boolean;
  sent_at?: string;
}

export interface Budget {
  id: number;
  planning_id: number;
  name: string;
  type: 'monthly' | 'custom';
  start_date?: string;
  end_date?: string;
  active: boolean;
  total_budgeted: number;
  created_by: number;
  lines?: BudgetLine[];
  created_at: string;
  updated_at: string;
}

export interface BudgetLine {
  id: number;
  budget_id: number;
  category_id: number;
  amount: number;
  alert_at_50: boolean;
  alert_at_80: boolean;
  alert_at_100: boolean;
  notes?: string;
  spent?: number;
  remaining?: number;
  percentage?: number;
  status?: BudgetLineStatus;
  category?: Category;
}

export type BudgetLineStatus = 'normal' | 'caution' | 'warning' | 'exceeded';

export interface BudgetProgress {
  budget: Budget;
  period: string;
  lines: BudgetProgressLine[];
  total_budgeted: number;
  total_spent: number;
  total_remaining: number;
  total_percentage: number;
}

export interface BudgetProgressLine {
  id: number;
  category_id: number;
  category?: Category;
  amount: number;
  spent: number;
  remaining: number;
  percentage: number;
  alert_at_50: boolean;
  alert_at_80: boolean;
  alert_at_100: boolean;
  status: BudgetLineStatus;
  notes?: string;
}

export interface BudgetHistoryItem {
  id: number;
  budget_id: number;
  budget_name?: string;
  period: string;
  total_budgeted: number;
  total_spent: number;
  usage_percentage: number;
  lines_snapshot: BudgetSnapshotLine[];
  closed_at: string;
}

export interface BudgetSnapshotLine {
  category_id: number;
  category_name?: string;
  amount: number;
  spent: number;
  percentage: number;
}

export interface Credit {
  id: number;
  planning_id: number;
  account_id?: number;
  name: string;
  type: CreditType;
  type_label: string;
  type_color: string;
  type_icon: string;
  entity?: string;
  original_amount: number;
  pending_amount: number;
  paid_amount: number;
  progress: number;
  currency: string;
  interest_rate: number;
  rate_type: 'fixed' | 'variable';
  term_months: number;
  start_date: string;
  estimated_end_date: string;
  payment_day: number;
  monthly_payment: number;
  status: CreditStatus;
  status_label: string;
  status_color: string;
  reference_number?: string;
  credit_limit?: number;
  billing_day?: number;
  is_credit_card: boolean;
  notes?: string;
  paid_installments_count: number;
  pending_installments_count: number;
  total_interest: number;
  account?: Account;
  installments?: CreditInstallment[];
  extra_payments?: ExtraPayment[];
  next_installment?: CreditInstallment;
  created_at: string;
  updated_at: string;
}

export type CreditType = 'consumer' | 'mortgage' | 'auto' | 'credit_card' | 'personal' | 'other';
export type CreditStatus = 'active' | 'paid' | 'refinanced' | 'defaulted';

export interface CreditTypeOption {
  value: CreditType;
  label: string;
  color: string;
  icon: string;
}

export interface CreditStatusOption {
  value: CreditStatus;
  label: string;
  color: string;
}

export interface CreditInstallment {
  id: number;
  credit_id: number;
  number: number;
  due_date: string;
  amount: number;
  principal: number;
  interest: number;
  insurance: number;
  other_charges: number;
  status: InstallmentStatus;
  status_label: string;
  status_color: string;
  paid_date?: string;
  paid_amount: number;
  remaining_amount: number;
  is_overdue: boolean;
  notes?: string;
}

export type InstallmentStatus = 'pending' | 'paid' | 'overdue' | 'partial';

export interface ExtraPayment {
  id: number;
  credit_id: number;
  account_id?: number;
  transaction_id?: number;
  amount: number;
  date: string;
  type: 'principal' | 'full';
  notes?: string;
  account?: Account;
  created_at: string;
}

export interface CreditSummary {
  total_debt: number;
  total_monthly_payment: number;
  active_credits_count: number;
  upcoming_installments: CreditInstallment[];
}

export interface PrepaymentSimulation {
  new_pending: number;
  original_remaining_months: number;
  new_remaining_months: number;
  original_monthly_payment: number;
  new_monthly_payment: number;
  total_interest_saved: number;
  months_saved: number;
  payment_reduction?: number;
  strategy: 'reduce_term' | 'reduce_payment';
}

export interface Notification {
  id: number;
  user_id: number;
  planning_id?: number;
  type: string;
  title: string;
  message: string;
  data: Record<string, unknown>;
  read: boolean;
  read_at?: string;
  created_at: string;
}

// Dashboard & Reports
export interface DashboardStats {
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

export interface QuickStats {
  expense_change: number;
  transaction_count: number;
  accounts_count: number;
  active_credits_count: number;
}

export interface UpcomingPayment {
  id: number;
  type: 'credit_installment' | 'payable';
  description: string;
  amount: number;
  due_date: string | null;
  status: string;
  is_overdue: boolean;
}

export interface ExpenseByCategoryItem {
  category_id: number;
  category_name: string;
  category_icon?: string;
  category_color?: string;
  total: number;
  percentage: number;
}

export interface ExpensesByCategoryReport {
  data: ExpenseByCategoryItem[];
  total: number;
  start_date: string;
  end_date: string;
}

export interface IncomeVsExpensesMonth {
  month: string;
  month_label: string;
  income: number;
  expense: number;
  balance: number;
}

export interface IncomeVsExpensesReport {
  data: IncomeVsExpensesMonth[];
  total_income: number;
  total_expense: number;
  average_income: number;
  average_expense: number;
}

export interface CashFlowDay {
  date: string;
  date_label: string;
  income: number;
  expense: number;
  net: number;
  accumulated: number;
}

export interface CashFlowReport {
  data: CashFlowDay[];
  total_income: number;
  total_expense: number;
  net_flow: number;
  start_date: string;
  end_date: string;
}

export interface BudgetVsRealLine {
  category_id: number;
  category_name: string;
  category_icon?: string;
  category_color?: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: string;
}

export interface BudgetVsRealReport {
  has_budget: boolean;
  data: BudgetVsRealLine[];
  total_budgeted: number;
  total_spent: number;
  total_remaining: number;
  total_percentage: number;
  period?: string;
}

export interface DebtByType {
  type: string;
  type_label: string;
  type_color: string;
  count: number;
  total_debt: number;
  total_monthly: number;
}

export interface DebtReport {
  credits: {
    count: number;
    total_debt: number;
    total_monthly_payment: number;
    total_interest: number;
    by_type: DebtByType[];
  };
  payables: {
    count: number;
    total_amount: number;
    overdue_count: number;
  };
  total_debt: number;
}

// Email Account Types
export type EmailProvider = 'gmail' | 'outlook' | 'yahoo' | 'icloud' | 'custom';
export type EmailTransactionStatus = 'pending' | 'processed' | 'ignored' | 'failed';
export type EmailSyncMode = 'new_only' | 'unread_7_days';

export interface EmailProviderOption {
  value: EmailProvider;
  label: string;
  icon: string;
  imap_config: {
    host: string;
    port: number;
    encryption: string;
  };
  help_text: string;
}

export interface EmailSyncModeOption {
  value: EmailSyncMode;
  label: string;
  description: string;
}

export interface EmailAccount {
  id: number;
  planning_id: number;
  name: string;
  email: string;
  provider: EmailProvider;
  provider_label: string;
  provider_icon: string;
  imap_host: string;
  imap_port: number;
  imap_encryption: string;
  folder: string;
  last_sync_at?: string;
  last_sync_at_human?: string;
  last_sync_error?: string;
  is_active: boolean;
  is_syncing: boolean;
  sync_started_at?: string;
  sync_started_at_human?: string;
  sync_frequency: number;
  sync_mode?: EmailSyncMode;
  sync_mode_label?: string;
  initial_sync_done: boolean;
  created_at: string;
  email_transactions_count?: number;
  recent_transactions?: EmailTransaction[];
}

export interface EmailTransaction {
  id: number;
  email_account_id: number;
  message_uid: string;
  subject?: string;
  from_email?: string;
  received_at?: string;
  received_at_human?: string;
  parsed_data?: EmailParsedData;
  transaction_id?: number;
  status: EmailTransactionStatus;
  status_label: string;
  status_color: string;
  status_icon: string;
  error_message?: string;
  is_transaction: boolean;
  confidence: number;
  created_at: string;
  transaction?: Transaction;
}

export interface EmailParsedData {
  is_transaction: boolean;
  type?: 'expense' | 'income';
  amount?: number;
  description?: string;
  merchant?: string;
  date?: string;
  suggested_category_id?: number;
  confidence: number;
}
