'use client';

import { useEffect, useMemo, useState } from 'react';
import { AccountSelector, CategorySelector, PaymentMethodSelector } from '@/components/finance/finance-selectors';
import { useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  Building2,
  CreditCard,
  Download,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Wallet,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { BranchSwitcher } from '@/components/branches/branch-switcher';
import { BrandMark } from '@/components/ui/brand';
import { hexaTrackApi } from '@/lib/api';
import { money, shortDate } from '@/lib/format';
import type { Account, Category, Transaction, TransactionType } from '@/lib/types';
import { useAuthStore } from '@/store/auth-store';
import { useFinanceStore } from '@/store/finance-store';
import { useWorkspaceStore } from '@/store/workspace-store';

type FinanceKind = 'income' | 'expenses' | 'accounts' | 'transactions' | 'analytics' | 'ledger' | 'categories';
type TxFormType = Extract<TransactionType, 'Income' | 'Expense'>;

const incomeDefaults = ['Sales', 'Services', 'Investments', 'Transfers', 'Refunds', 'Other'];
const expenseDefaults = ['Salary', 'Utilities', 'Marketing', 'Operations', 'Software', 'Travel', 'Cloud'];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function titleFor(kind: FinanceKind) {
  return {
    income: 'Income',
    expenses: 'Expenses',
    accounts: 'Accounts',
    transactions: 'Transactions',
    analytics: 'Financial Analytics',
    ledger: 'Global Ledger',
    categories: 'Category Management',
  }[kind];
}

export function IncomeManagementPage() {
  return <OwnerFinanceShell kind="income" />;
}

export function ExpenseManagementPage() {
  return <OwnerFinanceShell kind="expenses" />;
}

export function AccountManagementPage() {
  return <OwnerFinanceShell kind="accounts" />;
}

export function TransactionManagementPage() {
  return <OwnerFinanceShell kind="transactions" />;
}

export function FinancialAnalyticsPage() {
  return <OwnerFinanceShell kind="analytics" />;
}

export function GlobalLedgerPage() {
  return <OwnerFinanceShell kind="ledger" />;
}

export function CategoryManagementPage() {
  return <OwnerFinanceShell kind="categories" />;
}


function OwnerFinanceShell({ kind }: { kind: FinanceKind }) {
  const router = useRouter();
  const { user, hydrated } = useAuthStore();
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const loadWorkspace = useFinanceStore((state) => state.loadWorkspace);
  const loading = useFinanceStore((state) => state.loading);
  const error = useFinanceStore((state) => state.error);
  const [quickOpen, setQuickOpen] = useState<TxFormType | null>(null);

  useEffect(() => {
    if (hydrated && (!user || user.organizationRole?.toLowerCase() !== 'owner')) {
      router.replace('/');
    }
  }, [hydrated, router, user]);

  useEffect(() => {
    if (activeWorkspaceId) void loadWorkspace();
  }, [activeWorkspaceId, loadWorkspace]);

  if (!hydrated || !user) {
    return <div className="min-h-screen bg-[#0B1015] text-[#8B9BB4] grid place-items-center text-xs font-black uppercase tracking-widest">Authorizing owner finance</div>;
  }

  return (
    <div className="min-h-screen bg-[#0B1015] text-[#F5F7FA]">
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0B1015]/85 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <BrandMark tone="dark" />
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-[#4F8CFF]">Owner finance</p>
              <h1 className="text-2xl font-black tracking-tight">{titleFor(kind)}</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <BranchSwitcher />
            {kind !== 'analytics' && kind !== 'ledger' ? (
              <button
                type="button"
                onClick={() => setQuickOpen(kind === 'expenses' ? 'Expense' : 'Income')}
                className="h-11 rounded-[18px] bg-[#4F8CFF] px-5 text-sm font-bold text-white active:scale-95"
              >
                <Plus className="mr-2 inline h-4 w-4" />
                {kind === 'accounts' ? 'Quick Record' : `Add ${kind === 'expenses' ? 'Expense' : 'Income'}`}
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
        {!activeWorkspaceId && kind !== 'analytics' && kind !== 'ledger' ? (
          <EmptyState title="Select a branch to begin" action="Branch context is required for balance-safe writes." />
        ) : null}
        {error ? <ErrorCard message={error} onRetry={() => activeWorkspaceId && loadWorkspace()} /> : null}
        {loading ? <FinanceSkeleton /> : renderModule(kind, setQuickOpen)}
      </main>

      {quickOpen ? <QuickTransactionModal type={quickOpen} onClose={() => setQuickOpen(null)} /> : null}
    </div>
  );
}

function renderModule(kind: FinanceKind, openQuick: (type: TxFormType | null) => void) {
  if (kind === 'income') return <IncomeExpenseModule type="Income" onAdd={() => openQuick('Income')} />;
  if (kind === 'expenses') return <IncomeExpenseModule type="Expense" onAdd={() => openQuick('Expense')} />;
  if (kind === 'accounts') return <AccountsModule onQuick={() => openQuick('Income')} />;
  if (kind === 'transactions') return <TransactionsModule onAdd={() => openQuick('Income')} />;
  if (kind === 'analytics') return <AnalyticsModule />;
  if (kind === 'categories') return <CategoriesModule />;
  return <LedgerModule />;
}

function CategoriesModule() {
  const categories = useFinanceStore((state) => state.categories);
  const loadWorkspace = useFinanceStore((state) => state.loadWorkspace);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-5">
       <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-[#8B9BB4]">Organize transactions with hierarchy and colors.</p>
          <button onClick={() => setOpen(true)} className="h-11 rounded-[18px] bg-[#4F8CFF] px-5 text-sm font-bold text-white">
             <Plus className="mr-2 inline h-4 w-4" /> Create Category
          </button>
       </div>
       {categories.length === 0 ? (
         <EmptyState title="No categories defined yet." action="Start by creating one." />
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
           {categories.filter(c => !c.parentCategoryId).map((cat) => (
             <div key={cat.id} className="rounded-3xl border border-white/[0.06] bg-[#121A22] p-6">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{backgroundColor: `${cat.color || '#4F8CFF'}20`, color: cat.color || '#4F8CFF'}}>
                         <TagIcon className="h-5 w-5" />
                      </div>
                      <div>
                         <h3 className="font-black">{cat.name}</h3>
                         <p className="text-xs font-bold text-[#8B9BB4] uppercase tracking-widest mt-0.5">{cat.type}</p>
                      </div>
                   </div>
                </div>
                <div className="mt-4 space-y-2">
                   {categories.filter(sub => sub.parentCategoryId === cat.id).map(sub => (
                     <div key={sub.id} className="text-sm px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04] flex justify-between items-center">
                        <span>{sub.name}</span>
                     </div>
                   ))}
                </div>
             </div>
           ))}
         </div>
       )}
       {open && <CategoryModal onClose={() => setOpen(false)} onSaved={() => { setOpen(false); loadWorkspace(); }} />}
    </div>
  );
}

import { Tag as TagIcon } from 'lucide-react';

function CategoryModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ name: '', type: 'Expense' as Category['type'], color: '#4F8CFF', parentCategoryId: '' });
  const [saving, setSaving] = useState(false);
  const parentOptions = useFinanceStore((state) => state.categories.filter(c => !c.parentCategoryId));

  async function save() {
    setSaving(true);
    try {
      await hexaTrackApi.categories.create({
        name: form.name,
        type: form.type,
        parentCategoryId: form.parentCategoryId || null,
        color: form.color,
      });
      onSaved();
    } catch(e) {
       alert(e instanceof Error ? e.message : 'Failed to create category.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[999] grid place-items-end bg-black/70 p-0 backdrop-blur-sm md:place-items-center md:p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-t-[32px] border border-white/[0.08] bg-[#0B1015] p-6 md:rounded-[32px]">
        <div className="flex justify-between items-center mb-5"><h2 className="text-xl font-black">Create Category</h2><button onClick={onClose}><X className="h-5 w-5" /></button></div>
        <div className="space-y-4">
          <Field label="Category Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-finance w-full" placeholder="e.g. Marketing" /></Field>
          <Field label="Type">
             <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Category['type'] })} className="input-finance w-full">
               <option value="Expense">Expense</option>
               <option value="Income">Income</option>
             </select>
          </Field>
          <Field label="Parent Category (Optional)">
             <select value={form.parentCategoryId} onChange={(e) => setForm({ ...form, parentCategoryId: e.target.value })} className="input-finance w-full">
               <option value="">-- None (Top Level) --</option>
               {parentOptions.filter(p => p.type === form.type).map(p => (
                 <option key={p.id} value={p.id}>{p.name}</option>
               ))}
             </select>
          </Field>
          <Field label="Pick Color">
             <input type="color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} className="w-full h-10 rounded-xl bg-transparent border-0" />
          </Field>
        </div>
        <button disabled={saving || !form.name} onClick={save} className="mt-6 h-12 w-full rounded-[18px] bg-[#4F8CFF] font-bold text-white disabled:opacity-50">{saving ? 'Saving...' : 'Create category'}</button>
      </div>
    </div>
  );
}

function IncomeExpenseModule({ type, onAdd }: { type: TxFormType; onAdd: () => void }) {
  const transactions = useFinanceStore((state) => state.transactions);
  const categories = useFinanceStore((state) => state.categories);
  const accounts = useFinanceStore((state) => state.accounts);
  const rows = transactions.filter((tx) => tx.type === type);
  const total = rows.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label={type === 'Income' ? 'Branch revenue' : 'Branch expenses'} value={money(total, accounts[0]?.currency)} icon={type === 'Income' ? ArrowDownLeft : ArrowUpRight} tone={type === 'Income' ? 'success' : 'expense'} />
        <MetricCard label="Records" value={rows.length.toString()} icon={BarChart3} tone="primary" />
        <MetricCard label="Payment accounts" value={accounts.length.toString()} icon={CreditCard} tone="primary" />
      </div>
      {rows.length === 0 ? (
        <EmptyState title={`Start tracking branch ${type.toLowerCase()}.`} action={`Add first ${type.toLowerCase()}`} onAction={onAdd} />
      ) : (
        <TransactionTable transactions={rows} categories={categories} accounts={accounts} />
      )}
    </div>
  );
}

function AccountsModule({ onQuick }: { onQuick: () => void }) {
  const accounts = useFinanceStore((state) => state.accounts);
  const transactions = useFinanceStore((state) => state.transactions);
  const loadWorkspace = useFinanceStore((state) => state.loadWorkspace);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold text-[#8B9BB4]">Create accounts, track recent activity, and reconcile branch balances.</p>
        </div>
        <button type="button" onClick={() => setOpen(true)} className="h-11 rounded-[18px] bg-[#4F8CFF] px-5 text-sm font-bold text-white">
          <Plus className="mr-2 inline h-4 w-4" /> Create Account
        </button>
      </div>
      {accounts.length === 0 ? (
        <EmptyState title="Start tracking branch finances." action="Create first account" onAction={() => setOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {accounts.map((account) => (
            <AccountBalanceCard key={account.id} account={account} recentCount={transactions.filter((tx) => tx.accountId === account.id).length} onQuick={onQuick} />
          ))}
        </div>
      )}
      {open ? <AccountModal onClose={() => setOpen(false)} onSaved={() => { setOpen(false); void loadWorkspace(); }} /> : null}
    </div>
  );
}

function TransactionsModule({ onAdd }: { onAdd: () => void }) {
  const transactions = useFinanceStore((state) => state.transactions);
  const categories = useFinanceStore((state) => state.categories);
  const accounts = useFinanceStore((state) => state.accounts);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'All' | TransactionType>('All');
  const filtered = transactions.filter((tx) => {
    const category = categories.find((item) => item.id === tx.categoryId)?.name ?? '';
    const account = accounts.find((item) => item.id === tx.accountId)?.name ?? '';
    const term = query.toLowerCase();
    return (type === 'All' || tx.type === type) && [tx.merchant, tx.note, category, account].some((value) => value?.toLowerCase().includes(term));
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="flex h-12 flex-1 items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#121A22] px-4">
          <Search className="h-4 w-4 text-[#8B9BB4]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search merchant, notes, category, account" className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#8B9BB4]" />
        </label>
        <select value={type} onChange={(event) => setType(event.target.value as 'All' | TransactionType)} className="h-12 rounded-2xl border border-white/[0.06] bg-[#121A22] px-4 text-sm font-bold">
          {['All', 'Income', 'Expense', 'Transfer'].map((item) => <option key={item}>{item}</option>)}
        </select>
        <ExportButtons rows={filtered} />
      </div>
      {filtered.length === 0 ? <EmptyState title="Start tracking branch finances." action="Add First Transaction" onAction={onAdd} /> : <TransactionTimeline transactions={filtered} categories={categories} accounts={accounts} />}
    </div>
  );
}

function LedgerModule() {
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hexaTrackApi.ledger().then((result) => {
      setRows(result.items);
      setBalance(result.consolidatedBalance);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <FinanceSkeleton />;
  return (
    <div className="space-y-5">
      <MetricCard label="Consolidated balance" value={money(balance)} icon={Wallet} tone="primary" />
      {rows.length === 0 ? <EmptyState title="No ledger movements yet." action="Record branch transactions to build the global ledger." /> : <LedgerTable rows={rows} />}
    </div>
  );
}

function AnalyticsModule() {
  const [data, setData] = useState<{ revenue: number; expenses: number; profit: number; branchPerformance: Array<{ id: string; name: string; revenue: number; expenses: number; profit: number }> } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hexaTrackApi.analytics().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <FinanceSkeleton />;
  const active = data ?? { revenue: 0, expenses: 0, profit: 0, branchPerformance: [] };
  return (
    <div className="space-y-5">
      <FinancialAnalyticsCards revenue={active.revenue} expenses={active.expenses} profit={active.profit} />
      <BranchRevenueChart rows={active.branchPerformance} />
    </div>
  );
}

export function QuickTransactionModal({ type, onClose }: { type: TxFormType; onClose: () => void }) {
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const loadWorkspace = useFinanceStore((state) => state.loadWorkspace);
  const queryClient = useQueryClient();
  
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    amount: '',
    accountId: '',
    categoryId: '',
    merchant: '',
    note: '',
    occurredOn: today(),
    recurring: false,
  });

  const isValid = form.amount && Number(form.amount) > 0 && form.accountId && form.categoryId;

  async function save(addAnother = false) {
    if (!isValid) return;
    setSaving(true);
    try {
      await addTransaction({
        accountId: form.accountId,
        categoryId: form.categoryId,
        type,
        amount: Number(form.amount),
        currency: 'USD', // Auto Lookup later if needed
        merchant: form.merchant || undefined,
        note: form.note || undefined,
        occurredOn: form.occurredOn,
      });
      
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['accounts'] }),
        loadWorkspace()
      ]);

      if (addAnother) {
        setForm((current) => ({ ...current, amount: '', merchant: '', note: '' }));
      } else {
        onClose();
      }
    } catch (err) {
       alert(err instanceof Error ? err.message : 'Submission failed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/70 backdrop-blur-sm md:items-center md:p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-t-[32px] border border-white/[0.08] bg-[#0B1015] p-6 shadow-2xl md:rounded-[32px]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-[#4F8CFF]">Quick transaction</p>
            <h2 className="text-xl font-black">Add {type}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-2xl bg-white/[0.05]"><X className="h-5 w-5" /></button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Amount"><input required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} type="number" min="0.01" step="0.01" className="input-finance w-full" /></Field>
          <Field label="Account">
            <AccountSelector 
              value={form.accountId} 
              onChange={(val) => setForm({ ...form, accountId: val })} 
            />
          </Field>
          <Field label="Category">
            <CategorySelector 
              type={type} 
              value={form.categoryId} 
              onChange={(val) => setForm({ ...form, categoryId: val })} 
            />
          </Field>
          <Field label={type === 'Income' ? 'Payment method' : 'Merchant'}>
             {type === 'Income' ? (
               <PaymentMethodSelector value={form.merchant} onChange={(val) => setForm({ ...form, merchant: val })} />
             ) : (
               <input value={form.merchant} onChange={(e) => setForm({ ...form, merchant: e.target.value })} className="input-finance w-full" />
             )}
          </Field>
          <Field label="Date"><input type="date" value={form.occurredOn} onChange={(e) => setForm({ ...form, occurredOn: e.target.value })} className="input-finance w-full" /></Field>
          <div className="flex h-12 items-center">
            <label className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#121A22] px-4 w-full h-full text-sm font-bold text-[#8B9BB4]">
              <input type="checkbox" checked={form.recurring} onChange={(e) => setForm({ ...form, recurring: e.target.checked })} /> 
              Recurring
            </label>
          </div>
          {type === 'Expense' ? <ReceiptUpload /> : null}
          <Field label="Description"><input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="input-finance w-full" /></Field>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          <button 
             disabled={saving || !isValid} 
             onClick={() => save(false)} 
             className={`h-12 rounded-[18px] font-bold text-white transition-all ${isValid ? 'bg-[#4F8CFF] hover:bg-blue-600' : 'bg-white/[0.08] opacity-50 cursor-not-allowed'}`}
          >
            {saving ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : `Record ${type}`}
          </button>
          <button 
             disabled={saving || !isValid} 
             onClick={() => save(true)} 
             className={`h-12 rounded-[18px] border border-white/[0.08] font-bold text-[#F5F7FA] hover:bg-white/[0.05] transition-all disabled:opacity-50`}
          >
             Save & Add Another
          </button>
        </div>
      </div>
    </div>
  );
}

async function ensureDefaultCategories(type: TxFormType, existing: Category[]) {
  if (existing.length > 0) return;
  const names = type === 'Income' ? incomeDefaults : expenseDefaults;
  await Promise.all(names.map((name) => hexaTrackApi.categories.create({ name, type, parentCategoryId: null, color: type === 'Income' ? '#1FD18B' : '#FF5C75', icon: type === 'Income' ? 'ArrowDownLeft' : 'ArrowUpRight' }).catch(() => null)));
}

function AccountModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ name: '', type: 'Bank' as Account['type'], currency: 'USD', openingBalance: '0' });
  const [saving, setSaving] = useState(false);
  async function save() {
    setSaving(true);
    try {
      await hexaTrackApi.createAccount({ ...form, openingBalance: Number(form.openingBalance) });
      onSaved();
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="fixed inset-0 z-[999] grid place-items-end bg-black/70 p-0 backdrop-blur-sm md:place-items-center md:p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-t-[32px] border border-white/[0.08] bg-[#0B1015] p-6 md:rounded-[32px]">
        <h2 className="text-xl font-black">Create account</h2>
        <div className="mt-5 space-y-4">
          <Field label="Account name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-finance" /></Field>
          <Field label="Account type"><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Account['type'] })} className="input-finance">{['Bank', 'Wallet', 'Cash', 'Credit', 'Savings'].map((type) => <option key={type}>{type}</option>)}</select></Field>
          <Field label="Opening balance"><input value={form.openingBalance} onChange={(e) => setForm({ ...form, openingBalance: e.target.value })} type="number" className="input-finance" /></Field>
        </div>
        <button disabled={saving || !form.name} onClick={save} className="mt-6 h-12 w-full rounded-[18px] bg-[#4F8CFF] font-bold text-white disabled:opacity-50">{saving ? 'Saving...' : 'Create account'}</button>
      </div>
    </div>
  );
}

function TransactionTable({ transactions, categories, accounts }: { transactions: Transaction[]; categories: Category[]; accounts: Account[] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/[0.06] bg-[#121A22]">
      <table className="w-full text-left text-sm">
        <thead className="text-[11px] uppercase tracking-widest text-[#8B9BB4]"><tr><th className="p-4">Amount</th><th className="p-4">Category</th><th className="p-4">Account</th><th className="p-4">Status</th><th className="p-4">Created date</th><th className="p-4 text-right">Actions</th></tr></thead>
        <tbody className="divide-y divide-white/[0.05]">
          {transactions.map((tx) => <tr key={tx.id}><td className="p-4 font-black">{money(tx.amount, tx.currency)}</td><td className="p-4">{categories.find((c) => c.id === tx.categoryId)?.name ?? 'Uncategorized'}</td><td className="p-4">{accounts.find((a) => a.id === tx.accountId)?.name ?? 'Account'}</td><td className="p-4 text-[#1FD18B]">Posted</td><td className="p-4">{shortDate(tx.occurredOn)}</td><td className="p-4 text-right"><Trash2 className="ml-auto h-4 w-4 text-[#8B9BB4]" /></td></tr>)}
        </tbody>
      </table>
    </div>
  );
}

export function TransactionTimeline({ transactions, categories, accounts }: { transactions: Transaction[]; categories: Category[]; accounts: Account[] }) {
  const groups = useMemo(() => groupTransactions(transactions), [transactions]);
  return <div className="space-y-5">{groups.map((group) => <section key={group.label}><h2 className="mb-3 text-xs font-black uppercase tracking-widest text-[#8B9BB4]">{group.label}</h2><TransactionTable transactions={group.items} categories={categories} accounts={accounts} /></section>)}</div>;
}

function groupTransactions(rows: Transaction[]) {
  const now = new Date();
  return [
    { label: 'Today', items: rows.filter((row) => row.occurredOn === today()) },
    { label: 'This Week', items: rows.filter((row) => daysAgo(row.occurredOn, now) <= 7 && row.occurredOn !== today()) },
    { label: 'This Month', items: rows.filter((row) => daysAgo(row.occurredOn, now) > 7 && daysAgo(row.occurredOn, now) <= 31) },
  ].filter((group) => group.items.length > 0);
}

function daysAgo(date: string, now: Date) {
  return Math.floor((now.getTime() - new Date(`${date}T00:00:00`).getTime()) / 86400000);
}

export function AccountBalanceCard({ account, recentCount, onQuick }: { account: Account; recentCount: number; onQuick: () => void }) {
  return <div className="rounded-3xl border border-white/[0.06] bg-[#121A22] p-6"><div className="flex items-center justify-between"><Wallet className="h-6 w-6 text-[#4F8CFF]" /><span className="rounded-full bg-white/[0.04] px-3 py-1 text-[11px] font-bold text-[#8B9BB4]">{account.type}</span></div><h3 className="mt-4 text-lg font-black">{account.name}</h3><p className="mt-2 text-3xl font-black">{money(account.balance, account.currency)}</p><p className="mt-2 text-sm text-[#8B9BB4]">{recentCount} recent movements • Branch mapped</p><button onClick={onQuick} className="mt-5 h-10 rounded-[18px] border border-[#4F8CFF]/25 px-4 text-sm font-bold text-[#4F8CFF]">Record movement</button></div>;
}

function LedgerTable({ rows }: { rows: Array<Record<string, unknown>> }) {
  return <div className="overflow-hidden rounded-3xl border border-white/[0.06] bg-[#121A22]"><table className="w-full text-left text-sm"><thead className="text-[11px] uppercase tracking-widest text-[#8B9BB4]"><tr><th className="p-4">Date</th><th className="p-4">Branch</th><th className="p-4">Account</th><th className="p-4">Category</th><th className="p-4">Amount</th></tr></thead><tbody className="divide-y divide-white/[0.05]">{rows.map((row) => <tr key={String(row.id)}><td className="p-4">{String(row.occurredOn)}</td><td className="p-4">{String(row.branchName)}</td><td className="p-4">{String(row.account)}</td><td className="p-4">{String(row.category)}</td><td className="p-4 font-black">{money(Number(row.amount), String(row.currency ?? 'USD'))}</td></tr>)}</tbody></table></div>;
}

export function FinancialAnalyticsCards({ revenue, expenses, profit }: { revenue: number; expenses: number; profit: number }) {
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-3"><MetricCard label="Revenue" value={money(revenue)} icon={ArrowDownLeft} tone="success" /><MetricCard label="Expenses" value={money(expenses)} icon={ArrowUpRight} tone="expense" /><MetricCard label="Profit" value={money(profit)} icon={BarChart3} tone="primary" /></div>;
}

export function BranchRevenueChart({ rows }: { rows: Array<{ id: string; name: string; revenue: number; expenses: number; profit: number }> }) {
  const max = Math.max(1, ...rows.map((row) => row.revenue));
  return <div className="rounded-3xl border border-white/[0.06] bg-[#121A22] p-6"><h2 className="mb-5 text-lg font-black">Branch performance</h2>{rows.length === 0 ? <p className="text-sm text-[#8B9BB4]">No branch finance data yet.</p> : <div className="space-y-4">{rows.map((row) => <div key={row.id}><div className="mb-2 flex justify-between text-sm"><span className="font-bold">{row.name}</span><span className="text-[#8B9BB4]">{money(row.revenue)} revenue</span></div><div className="h-3 rounded-full bg-white/[0.05]"><div className="h-full rounded-full bg-[#4F8CFF]" style={{ width: `${Math.max(4, (row.revenue / max) * 100)}%` }} /></div></div>)}</div>}</div>;
}

function MetricCard({ label, value, icon: Icon, tone }: { label: string; value: string; icon: LucideIcon; tone: 'primary' | 'success' | 'expense' }) {
  const color = tone === 'success' ? '#1FD18B' : tone === 'expense' ? '#FF5C75' : '#4F8CFF';
  return <div className="rounded-3xl border border-white/[0.06] bg-[#121A22] p-6"><Icon className="mb-4 h-6 w-6" style={{ color }} /><p className="text-[11px] font-black uppercase tracking-widest text-[#8B9BB4]">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></div>;
}

function ExportButtons({ rows }: { rows: Transaction[] }) {
  function download(ext: 'csv' | 'xls' | 'pdf') {
    const body = rows.map((row) => [row.occurredOn, row.type, row.amount, row.currency, row.merchant ?? '', row.note ?? ''].join(',')).join('\n');
    const mime = ext === 'xls' ? 'application/vnd.ms-excel' : ext === 'pdf' ? 'application/pdf' : 'text/csv';
    const blob = new Blob([`date,type,amount,currency,merchant,note\n${body}`], { type: mime });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `hexatrack-transactions.${ext}`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
  return <div className="flex gap-2"><button onClick={() => download('csv')} className="h-12 rounded-2xl border border-white/[0.06] px-3 text-xs font-bold"><Download className="mr-1 inline h-4 w-4" />CSV</button><button onClick={() => download('xls')} className="h-12 rounded-2xl border border-white/[0.06] px-3 text-xs font-bold">Excel</button><button onClick={() => download('pdf')} className="h-12 rounded-2xl border border-white/[0.06] px-3 text-xs font-bold"><FileText className="mr-1 inline h-4 w-4" />PDF</button></div>;
}

function ReceiptUpload() {
  const [name, setName] = useState('');
  return <Field label="Receipt upload"><input type="file" accept="image/*,.pdf" onChange={(e) => setName(e.target.files?.[0]?.name ?? '')} className="input-finance" />{name ? <p className="mt-1 text-xs text-[#8B9BB4]">Preview ready: {name} • OCR placeholder</p> : null}</Field>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-[11px] font-black uppercase tracking-widest text-[#8B9BB4]">{label}<div className="mt-1.5 normal-case tracking-normal">{children}</div></label>;
}

function EmptyState({ title, action, onAction }: { title: string; action: string; onAction?: () => void }) {
  return <div className="rounded-3xl border border-dashed border-white/[0.1] bg-[#121A22] px-6 py-16 text-center"><Building2 className="mx-auto mb-4 h-10 w-10 text-[#4F8CFF]" /><h2 className="text-lg font-black">{title}</h2><p className="mt-2 text-sm text-[#8B9BB4]">{action}</p>{onAction ? <button onClick={onAction} className="mt-6 h-11 rounded-[18px] bg-[#4F8CFF] px-5 text-sm font-bold text-white">Add First Transaction</button> : null}</div>;
}

function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div className="flex items-center justify-between rounded-2xl border border-[#FF5C75]/25 bg-[#FF5C75]/10 p-4 text-sm text-[#FF5C75]"><span>{message}</span><button onClick={onRetry} className="font-bold text-[#F5F7FA]"><RefreshCw className="mr-1 inline h-4 w-4" />Retry</button></div>;
}

function FinanceSkeleton() {
  return <div className="space-y-4">{[1, 2, 3].map((item) => <div key={item} className="h-24 animate-pulse rounded-3xl bg-white/[0.05]" />)}</div>;
}
