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
  joined_at: string;
  user?: User;
}

export interface Invitation {
  id: number;
  planning_id: number;
  email: string;
  role: MemberRole;
  status: InvitationStatus;
  created_by_id: number;
  expires_at: string;
  created_at: string;
  planning?: Planning;
  created_by?: User;
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
  amount: number;
  account_id: number;
  destination_account_id?: number;
  category_id?: number;
  description?: string;
  frequency: FrequencyType;
  start_date: string;
  end_date?: string;
  next_run_date: string;
  last_run_date?: string;
  is_active: boolean;
  tags: string[];
  account?: Account;
  destination_account?: Account;
  category?: Category;
}

export interface Receivable {
  id: number;
  planning_id: number;
  type: ReceivableType;
  person_name: string;
  person_contact?: string;
  original_amount: number;
  pending_amount: number;
  currency: string;
  concept: string;
  due_date?: string;
  status: ReceivableStatus;
  notes?: string;
  created_at: string;
  payments?: ReceivablePayment[];
}

export type ReceivableType = 'receivable' | 'payable';
export type ReceivableStatus = 'pending' | 'partial' | 'paid' | 'cancelled';

export interface ReceivablePayment {
  id: number;
  receivable_id: number;
  amount: number;
  date: string;
  account_id: number;
  notes?: string;
}

export interface Budget {
  id: number;
  planning_id: number;
  name: string;
  type: 'monthly' | 'custom';
  start_date?: string;
  end_date?: string;
  active: boolean;
  lines?: BudgetLine[];
}

export interface BudgetLine {
  id: number;
  budget_id: number;
  category_id: number;
  amount: number;
  spent?: number;
  percentage?: number;
  category?: Category;
}

export interface Credit {
  id: number;
  planning_id: number;
  name: string;
  type: CreditType;
  entity?: string;
  original_amount: number;
  pending_amount: number;
  currency: string;
  interest_rate: number;
  rate_type: 'fixed' | 'variable';
  term_months: number;
  start_date: string;
  estimated_end_date: string;
  payment_day: number;
  monthly_payment: number;
  status: CreditStatus;
  reference_number?: string;
  credit_limit?: number;
  billing_day?: number;
  installments?: CreditInstallment[];
}

export type CreditType = 'consumer' | 'mortgage' | 'auto' | 'credit_card' | 'personal' | 'other';
export type CreditStatus = 'active' | 'paid' | 'refinanced' | 'defaulted';

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
  paid_date?: string;
  paid_amount: number;
}

export type InstallmentStatus = 'pending' | 'paid' | 'overdue' | 'partial';

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
