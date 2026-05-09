export type AccountType = 'Cash' | 'Bank' | 'Wallet' | 'Credit';
export type TransactionType = 'Income' | 'Expense' | 'TransferOut' | 'TransferIn';
export type RecurrenceFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
export type SplitMethod = 'Equal' | 'Custom' | 'Percentage';

export type User = {
  id: string;
  email: string;
  displayName: string;
};

export type WorkspaceType = 'Personal' | 'Business' | 'Family';

export type Workspace = {
  id: string;
  name: string;
  type: WorkspaceType;
  currency: string;
  isDefault: boolean;
};

export type AuthResponse = {
  accessToken: string;
  expiresAt: string;
  user: User;
};

export type AuthMeResponse = {
  user: User;
  isSuperAdmin: boolean;
};

export type WorkspaceRoleName = 'Owner' | 'Admin' | 'Editor' | 'Viewer';

export type InviteAcceptRequest = {
  token: string;
  password: string;
};

export type AdminUserListItem = {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
  isSuperAdmin: boolean;
  isLocked: boolean;
};

export type AdminUserListResult = {
  items: AdminUserListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = LoginRequest & {
  displayName: string;
};

export type Account = {
  id: string;
  name: string;
  type: AccountType;
  currency: string;
  balance: number;
};

export type TransferRequest = {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  currency: string;
  feeAmount?: number;
  note?: string;
  transferOn: string;
  idempotencyKey: string;
};

export type Transfer = {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  currency: string;
  feeAmount?: number;
  transferOn: string;
};

export type Category = {
  id: string;
  name: string;
  type: TransactionType;
  parentCategoryId?: string;
  color: string;
  icon: string;
};

export type Tag = {
  id: string;
  name: string;
};

export type Transaction = {
  id: string;
  accountId: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  merchant?: string;
  note?: string;
  occurredOn: string;
  tags: Tag[];
};

export type PagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
};

export type TransactionSearchParams = {
  from?: string;
  to?: string;
  accountId?: string;
  categoryId?: string;
  tagId?: string;
  query?: string;
  page?: number;
  pageSize?: number;
  type?: TransactionType;
  transfersOnly?: boolean;
};

export type RecurringTransaction = {
  id: string;
  accountId: string;
  categoryId: string;
  type: TransactionType;
  frequency: RecurrenceFrequency;
  amount: number;
  currency: string;
  note?: string | null;
  nextRunOn: string;
  endsOn?: string | null;
  isActive: boolean;
};

export type GroupExpense = {
  id: string;
  description: string;
  amount: number;
  currency: string;
  splitMethod: SplitMethod;
  expenseOn: string;
  people: string[];
};

export type ReportSummary = {
  income: number;
  expense: number;
  net: number;
  cashflow: Array<{ period: string; income: number; expense: number; net: number }>;
  spendingByCategory: Array<{ categoryId: string; categoryName: string; amount: number }>;
};

export type DashboardSummary = {
  totalBalance: number;
  report: ReportSummary;
  recentTransactions: Transaction[];
  recurringDueSoon: RecurringTransaction[];
  insightLine: string;
};
