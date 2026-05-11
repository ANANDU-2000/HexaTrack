import { create } from 'zustand';
import { hexaTrackApi } from '@/lib/api';
import type {
  Account,
  Category,
  DashboardSummary,
  GroupExpense,
  RecurrenceFrequency,
  RecurringTransaction,
  ReportSummary,
  Tag,
  Transaction,
  TransactionType,
} from '@/lib/types';

type FinanceState = {
  currency: string;
  accounts: Account[];
  categories: Category[];
  tags: Tag[];
  transactions: Transaction[];
  recurring: RecurringTransaction[];
  groupExpenses: GroupExpense[];
  report: ReportSummary;
  dashboard: DashboardSummary | null;
  loading: boolean;
  error: string | null;
  setError: (message: string | null) => void;
  loadWorkspace: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'tags'> & { tagNames?: string[] }) => Promise<void>;
  addRecurring: (payload: {
    accountId: string;
    categoryId: string;
    type: TransactionType;
    frequency: RecurrenceFrequency;
    amount: number;
    currency: string;
    note?: string;
    nextRunOn: string;
    endsOn?: string;
  }) => Promise<void>;
  clearError: () => void;
};

type PersistedFinanceWorkspace = Pick<
  FinanceState,
  'accounts' | 'categories' | 'tags' | 'transactions' | 'recurring' | 'groupExpenses' | 'report' | 'dashboard'
> & {
  savedAt: string;
};

const FINANCE_STORAGE_KEY = 'hexatrack.finance-cache.v1';
const recurring: RecurringTransaction[] = [];

const groupExpenses: GroupExpense[] = [
  { id: 'group-1', description: 'Team dinner', amount: 186, currency: 'USD', splitMethod: 'Equal', expenseOn: '2026-05-02', people: ['You', 'Asha', 'Ravi'] },
  { id: 'group-2', description: 'Weekend stay', amount: 420, currency: 'USD', splitMethod: 'Custom', expenseOn: '2026-04-26', people: ['You', 'Maya', 'Dev'] },
];

function makeReport(rows: Transaction[]): ReportSummary {
  const income = rows.filter((row) => row.type === 'Income').reduce((sum, row) => sum + row.amount, 0);
  const expense = rows.filter((row) => row.type === 'Expense').reduce((sum, row) => sum + row.amount, 0);
  return {
    income,
    expense,
    net: income - expense,
    cashflow: [
      { period: '2026-02-01', income: 6900, expense: 3720, net: 3180 },
      { period: '2026-03-01', income: 7100, expense: 4020, net: 3080 },
      { period: '2026-04-01', income: 7200, expense: 3860, net: 3340 },
      { period: '2026-05-01', income, expense, net: income - expense },
    ],
    spendingByCategory: [],
  };
}

function readCachedWorkspace(): PersistedFinanceWorkspace | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(FINANCE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedFinanceWorkspace) : null;
  } catch {
    window.localStorage.removeItem(FINANCE_STORAGE_KEY);
    return null;
  }
}

function monthToDateRange(): { from: string; to: string } {
  const today = new Date();
  const from = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
  const to = today.toISOString().slice(0, 10);
  return { from, to };
}

function cacheWorkspace(workspace: Omit<PersistedFinanceWorkspace, 'savedAt'>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(
    FINANCE_STORAGE_KEY,
    JSON.stringify({
      ...workspace,
      savedAt: new Date().toISOString(),
    }),
  );
}

const cachedWorkspace = readCachedWorkspace();

export const useFinanceStore = create<FinanceState>((set) => ({
  currency: 'USD',
  accounts: cachedWorkspace?.accounts ?? [],
  categories: cachedWorkspace?.categories ?? [],
  tags: cachedWorkspace?.tags ?? [],
  transactions: cachedWorkspace?.transactions ?? [],
  recurring: cachedWorkspace?.recurring ?? recurring,
  groupExpenses: cachedWorkspace?.groupExpenses ?? groupExpenses,
  report: cachedWorkspace?.report ?? makeReport([]),
  dashboard: cachedWorkspace?.dashboard ?? null,
  loading: false,
  error: null,
  clearError: () => set({ error: null }),
  setError: (message) => set({ error: message }),
  loadWorkspace: async () => {
    set({ loading: true, error: null });
    try {
      const { from, to } = monthToDateRange();
      const [nextAccounts, nextCategories, nextTags, nextRecurring, nextTransactions, dash] = await Promise.all([
        hexaTrackApi.accounts(),
        hexaTrackApi.categories.list(),
        hexaTrackApi.tags.list(),
        hexaTrackApi.recurring.list(),
        hexaTrackApi.transactions.list(from, to),
        hexaTrackApi.dashboard.summary(from, to),
      ]);

      const workspace = {
        accounts: nextAccounts,
        categories: nextCategories,
        tags: nextTags,
        recurring: nextRecurring as RecurringTransaction[],
        transactions: nextTransactions,
        groupExpenses,
        report: dash.report,
        dashboard: dash,
      };

      cacheWorkspace(workspace);
      set({ ...workspace, loading: false });
    } catch (error) {
      const cached = readCachedWorkspace();
      set((state) => {
        const offline = typeof navigator !== 'undefined' && !navigator.onLine;
        const message = offline
          ? 'Offline mode. Showing your last saved HexaTrack workspace.'
          : error instanceof Error
            ? error.message
            : 'Unable to load workspace';

        return {
          accounts: cached?.accounts ?? state.accounts,
          categories: cached?.categories ?? state.categories,
          tags: cached?.tags ?? state.tags,
          recurring: cached?.recurring ?? state.recurring,
          transactions: cached?.transactions ?? state.transactions,
          groupExpenses: cached?.groupExpenses ?? state.groupExpenses,
          report: cached?.report ?? state.report,
          dashboard: cached?.dashboard ?? state.dashboard,
          error: message,
          loading: false,
        };
      });
    }
  },
  addTransaction: async (transaction) => {
    set({ loading: true, error: null });
    try {
      const tagIds =
        transaction.tagNames && transaction.tagNames.length
          ? await Promise.all(
              transaction.tagNames.map(async (name) => {
                const tag = await hexaTrackApi.tags.upsert(name);
                return tag.id;
              }),
            )
          : [];

      const created = await hexaTrackApi.createTransaction({
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        type: transaction.type,
        amount: transaction.amount,
        currency: transaction.currency,
        merchant: transaction.merchant,
        note: transaction.note,
        occurredOn: transaction.occurredOn,
        tagIds,
      });

      const { from, to } = monthToDateRange();
      const [dash, nextAccounts] = await Promise.all([
        hexaTrackApi.dashboard.summary(from, to),
        hexaTrackApi.accounts(),
      ]);

      set((state) => {
        const nextTransactions = [created, ...state.transactions];
        cacheWorkspace({
          accounts: nextAccounts,
          categories: state.categories,
          tags: state.tags,
          recurring: state.recurring,
          groupExpenses: state.groupExpenses,
          transactions: nextTransactions,
          report: dash.report,
          dashboard: dash,
        });
        return {
          accounts: nextAccounts,
          transactions: nextTransactions,
          report: dash.report,
          dashboard: dash,
          loading: false,
        };
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Unable to persist transaction.',
      });
    }
  },
  addRecurring: async (payload) => {
    set({ loading: true, error: null });
    try {
      const created = (await hexaTrackApi.recurring.create({
        accountId: payload.accountId,
        categoryId: payload.categoryId,
        type: payload.type,
        frequency: payload.frequency,
        amount: payload.amount,
        currency: payload.currency,
        note: payload.note,
        nextRunOn: payload.nextRunOn,
        endsOn: payload.endsOn,
      })) as RecurringTransaction;

      const { from, to } = monthToDateRange();
      const dash = await hexaTrackApi.dashboard.summary(from, to);

      set((state) => {
        const nextRecurring = [...state.recurring, created].sort((a, b) => a.nextRunOn.localeCompare(b.nextRunOn));
        cacheWorkspace({
          accounts: state.accounts,
          categories: state.categories,
          tags: state.tags,
          recurring: nextRecurring,
          groupExpenses: state.groupExpenses,
          transactions: state.transactions,
          report: dash.report,
          dashboard: dash,
        });
        return {
          recurring: nextRecurring,
          report: dash.report,
          dashboard: dash,
          loading: false,
        };
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unable to create recurring schedule',
        loading: false,
      });
    }
  },
}));
