export type AccountType = 'Cash' | 'Bank' | 'Wallet' | 'Credit' | 'Savings' | 'Investment';
export type TransactionType = 'Income' | 'Expense' | 'Transfer';
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

export type WorkspaceRoleName = 'Owner' | 'Member' | 'Viewer';

export type InviteAcceptRequest = {
  token: string;
  password: string;
};

/** Matches API `SubscriptionPlan` (JSON string enum). */
export type SubscriptionPlan = 'Free' | 'Basic' | 'Pro' | 'ProMax';

export type AdminUserListItem = {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
  isSuperAdmin: boolean;
  isLocked: boolean;
  subscriptionPlan: SubscriptionPlan | null;
};

export type AdminUserListResult = {
  items: AdminUserListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
};

export type AdminCreateUserRequest = {
  email: string;
  password: string;
  workspaceName: string;
  workspaceType: WorkspaceType;
  currency: 'USD' | 'INR' | 'EUR' | 'AED';
  isSuperAdmin: boolean;
  /** Workspace membership for the seeded default workspace (API default: Owner). */
  initialWorkspaceRole?: 'Owner' | 'Member' | 'Viewer';
};

export type AdminCreateUserResponse = {
  id: string;
  email: string;
  displayName: string;
  isSuperAdmin: boolean;
};

export type AdminWorkspaceListItem = {
  id: string;
  name: string;
  type: WorkspaceType;
  ownerUserId: string;
  ownerEmail: string;
  createdAt: string;
  memberCount: number;
  ownerSubscriptionPlan: SubscriptionPlan | null;
};

export type AdminWorkspaceListResult = {
  items: AdminWorkspaceListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
};

export type FeatureFlagDto = {
  key: string;
  value: string;
  updatedAt: string;
};

export type AdminAuditLogDto = {
  id: string;
  actorUserId: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  ipAddress: string | null;
  createdAt: string;
};

export type AdminAuditListResult = {
  items: AdminAuditLogDto[];
  page: number;
  pageSize: number;
  totalCount: number;
};

export type AiUsageSummaryRow = {
  userId: string;
  email: string;
  totalPromptTokens: number;
  totalCompletionTokens: number;
};

export type AiUsageSummaryResult = {
  rows: AiUsageSummaryRow[];
};

export type AdminAnalyticsOverview = {
  totalUsers: number;
  superAdminUsers: number;
  lockedUsers: number;
  totalWorkspaces: number;
  activeSubscriptions: number;
  aiPromptTokensLast30Days: number;
  aiCompletionTokensLast30Days: number;
};

export type AdminTimeSeriesPoint = {
  date: string;
  value: number;
};

export type AdminTokenUsageDay = {
  date: string;
  promptTokens: number;
  completionTokens: number;
};

export type AdminSubscriptionTier = {
  plan: string;
  count: number;
};

export type AdminTokenCostDay = {
  date: string;
  estimatedCostUsd: number;
};

export type AdminExpenseCategoryAgg = {
  categoryName: string;
  currency: string;
  totalAmount: number;
  transactionCount: number;
};

export type AdminAnalyticsDashboard = {
  newUsersByDay: AdminTimeSeriesPoint[];
  cumulativeUsersByDay: AdminTimeSeriesPoint[];
  newWorkspacesByDay: AdminTimeSeriesPoint[];
  cumulativeWorkspacesByDay: AdminTimeSeriesPoint[];
  tokenUsageByDay: AdminTokenUsageDay[];
  activeSubscriptionsByPlan: AdminSubscriptionTier[];
  estimatedMrrInr: number;
  payingSubscriptionCount: number;
  averageRevenuePerPayingUserInr: number;
  activeUsersByDay: AdminTimeSeriesPoint[];
  transactionsByDay: AdminTimeSeriesPoint[];
  newPayingSubscriptionsByDay: AdminTimeSeriesPoint[];
  tokenEstimatedCostByDay: AdminTokenCostDay[];
  expenseCategoryTotals: AdminExpenseCategoryAgg[];
};

export type GlobalSettingDto = {
  key: string;
  value: string;
  updatedAt: string;
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
