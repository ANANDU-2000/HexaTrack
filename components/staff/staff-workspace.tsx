'use client';

import { AccountSelector, CategorySelector, PaymentMethodSelector } from '@/components/finance/finance-selectors';
import { useQueryClient } from '@tanstack/react-query';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  Briefcase,
  Building2,
  CheckCircle2,
  CreditCard,
  FileText,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  UserCircle,
  Wallet,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { BrandMark } from '@/components/ui/brand';
import { hexaTrackApi } from '@/lib/api';
import { money, shortDate } from '@/lib/format';
import type { Account, Category, PagedResult, StaffDashboardDto, StaffNotification, StaffTask, Transaction, TransactionType } from '@/lib/types';
import { useAuthStore } from '@/store/auth-store';

type StaffView = 'dashboard' | 'transactions' | 'tasks' | 'reports' | 'notifications' | 'profile' | 'expenses' | 'income';
type EntryType = Extract<TransactionType, 'Income' | 'Expense'>;

const navItems: Array<{ view: StaffView; label: string; icon: LucideIcon; href: string }> = [
  { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/staff/dashboard' },
  { view: 'transactions', label: 'Transactions', icon: CreditCard, href: '/staff/transactions' },
  { view: 'expenses', label: 'Expenses', icon: ArrowUpRight, href: '/staff/expenses' },
  { view: 'income', label: 'Income', icon: ArrowDownLeft, href: '/staff/income' },
  { view: 'tasks', label: 'Tasks', icon: CheckCircle2, href: '/staff/tasks' },
  { view: 'reports', label: 'Reports', icon: FileText, href: '/staff/reports' },
  { view: 'notifications', label: 'Notifications', icon: Bell, href: '/staff/notifications' },
  { view: 'profile', label: 'Profile', icon: UserCircle, href: '/staff/profile' },
];

export function StaffWorkspace({ view }: { view: StaffView }) {
  const router = useRouter();
  const { user, logout, hydrated } = useAuthStore();
  const [dashboard, setDashboard] = useState<StaffDashboardDto | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalType, setModalType] = useState<EntryType | null>(null);

  useEffect(() => {
    if (hydrated && (!user || user.organizationRole?.toLowerCase() !== 'staff')) {
      router.replace('/');
    }
  }, [hydrated, router, user]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [nextDashboard, nextTransactions] = await Promise.all([
        hexaTrackApi.staff.dashboard(),
        hexaTrackApi.staff.transactions({ page: 1, pageSize: 50 }),
      ]);
      setDashboard(nextDashboard);
      setTransactions(nextTransactions.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load staff workspace.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (hydrated && user?.organizationRole?.toLowerCase() === 'staff') void load();
  }, [hydrated, user?.organizationRole]);

  if (!hydrated || !user) {
    return <div className="grid min-h-screen place-items-center bg-[#0B1015] text-xs font-black uppercase tracking-widest text-[#8B9BB4]">Authorizing staff workspace</div>;
  }

  return (
    <div className="min-h-screen bg-[#0B1015] text-[#F5F7FA] xl:flex">
      <StaffSidebar active={view} onNavigate={(href) => router.push(href)} onLogout={() => { logout(); router.replace('/'); }} />
      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#0B1015]/85 px-4 py-4 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <BrandMark tone="dark" />
              <BranchIdentityBadge branchName={dashboard?.branchName ?? user.branchName} department={dashboard?.department ?? user.department} />
            </div>
            <StaffQuickActions onExpense={() => setModalType('Expense')} onIncome={() => setModalType('Income')} />
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto xl:hidden">
            {navItems.map((item) => (
              <button key={item.view} onClick={() => router.push(item.href)} className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold ${view === item.view ? 'bg-[#4F8CFF] text-white' : 'border border-white/[0.06] text-[#8B9BB4]'}`}>
                {item.label}
              </button>
            ))}
          </div>
        </header>

        <section className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
          {error ? <ErrorCard message={error} onRetry={load} /> : null}
          {loading ? <StaffSkeleton /> : dashboard ? renderView(view, dashboard, transactions, setTransactions, setModalType) : <EmptyState title="Staff branch is not ready." action="Ask your owner to assign a branch workspace." />}
        </section>
      </main>
      {modalType && dashboard ? <StaffTransactionModal type={modalType} dashboard={dashboard} onClose={() => setModalType(null)} onSaved={load} /> : null}
    </div>
  );
}

function StaffSidebar({ active, onNavigate, onLogout }: { active: StaffView; onNavigate: (href: string) => void; onLogout: () => void }) {
  return (
    <aside className="hidden h-screen w-[264px] shrink-0 flex-col border-r border-white/[0.06] bg-[#0B1015] p-4 xl:flex">
      <div className="mb-6 flex h-12 items-center gap-3 px-2">
        <BrandMark tone="dark" />
        <span className="rounded bg-[#4F8CFF]/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-[#4F8CFF]">Staff</span>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.view} onClick={() => onNavigate(item.href)} className={`flex h-11 w-full items-center gap-3 rounded-xl px-4 text-sm font-bold transition ${active === item.view ? 'bg-[#4F8CFF]/10 text-[#4F8CFF]' : 'text-[#8B9BB4] hover:bg-white/[0.04] hover:text-white'}`}>
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <button onClick={onLogout} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.06] text-xs font-black uppercase tracking-widest text-[#8B9BB4] hover:border-[#FF5C75]/25 hover:bg-[#FF5C75]/10 hover:text-[#FF5C75]">
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </aside>
  );
}

function renderView(
  view: StaffView,
  dashboard: StaffDashboardDto,
  transactions: Transaction[],
  setTransactions: (transactions: Transaction[]) => void,
  setModalType: (type: EntryType | null) => void,
) {
  if (view === 'dashboard') return <StaffDashboard dashboard={dashboard} transactions={transactions} setModalType={setModalType} />;
  if (view === 'transactions') return <StaffTransactionFeed transactions={transactions} categories={dashboard.categories} accounts={dashboard.accounts} onRefresh={setTransactions} />;
  if (view === 'expenses') return <TypeView type="Expense" dashboard={dashboard} transactions={transactions} onAdd={() => setModalType('Expense')} />;
  if (view === 'income') return <TypeView type="Income" dashboard={dashboard} transactions={transactions} onAdd={() => setModalType('Income')} />;
  if (view === 'tasks') return <StaffTaskPanel tasks={dashboard.tasks} />;
  if (view === 'notifications') return <StaffNotificationCenter notifications={dashboard.notifications} />;
  if (view === 'profile') return <StaffProfileCard dashboard={dashboard} />;
  return <StaffReports dashboard={dashboard} transactions={transactions} />;
}

export function StaffDashboard({ dashboard, transactions, setModalType }: { dashboard: StaffDashboardDto; transactions: Transaction[]; setModalType: (type: EntryType) => void }) {
  return (
    <div className="space-y-6">
      <StaffWelcomeHero dashboard={dashboard} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="Income" value={money(dashboard.summary.income)} icon={ArrowDownLeft} tone="success" />
        <MetricCard label="Expenses" value={money(dashboard.summary.expense)} icon={ArrowUpRight} tone="expense" />
        <MetricCard label="Net" value={money(dashboard.summary.net)} icon={Wallet} tone="primary" />
        <MetricCard label="Pending tasks" value={String(dashboard.tasks.length)} icon={Inbox} tone="primary" />
      </div>
      <StaffQuickActions onExpense={() => setModalType('Expense')} onIncome={() => setModalType('Income')} compact />
      {transactions.length === 0 ? <EmptyState title="Start managing branch finances." action="Add Transaction" onAction={() => setModalType('Expense')} /> : <TransactionList transactions={transactions.slice(0, 8)} categories={dashboard.categories} accounts={dashboard.accounts} />}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <StaffTaskPanel tasks={dashboard.tasks.slice(0, 3)} />
        <StaffNotificationCenter notifications={dashboard.notifications.slice(0, 3)} />
      </div>
    </div>
  );
}

export function StaffWelcomeHero({ dashboard }: { dashboard: StaffDashboardDto }) {
  const user = useAuthStore((state) => state.user);
  return (
    <section className="overflow-hidden rounded-3xl border border-white/[0.06] bg-[#121A22] p-6">
      <p className="text-[11px] font-black uppercase tracking-widest text-[#4F8CFF]">Active branch workspace</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Welcome back, {user?.displayName}.</h1>
      <p className="mt-2 text-sm font-semibold text-[#8B9BB4]">{dashboard.department || 'Operations'} Department • {dashboard.branchName}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full border border-[#4F8CFF]/25 bg-[#4F8CFF]/10 px-3 py-1.5 text-xs font-bold text-[#4F8CFF]">STAFF</span>
        <span className="rounded-full border border-[#1FD18B]/20 bg-[#1FD18B]/10 px-3 py-1.5 text-xs font-bold text-[#1FD18B]">Active session</span>
      </div>
    </section>
  );
}

export function StaffQuickActions({ onExpense, onIncome, compact = false }: { onExpense: () => void; onIncome: () => void; compact?: boolean }) {
  return (
    <div className={`grid gap-3 ${compact ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:flex'}`}>
      <QuickButton label="Add Expense" icon={ArrowUpRight} onClick={onExpense} />
      <QuickButton label="Add Income" icon={ArrowDownLeft} onClick={onIncome} />
      <QuickButton label="Upload Receipt" icon={Receipt} onClick={onExpense} />
      <QuickButton label="Create Transaction" icon={Plus} onClick={onExpense} />
    </div>
  );
}

function QuickButton({ label, icon: Icon, onClick }: { label: string; icon: LucideIcon; onClick: () => void }) {
  return <button onClick={onClick} className="h-11 rounded-[18px] bg-[#4F8CFF] px-4 text-sm font-bold text-white active:scale-95"><Icon className="mr-2 inline h-4 w-4" />{label}</button>;
}

export function StaffTransactionFeed({ transactions, categories, accounts, onRefresh }: { transactions: Transaction[]; categories: Category[]; accounts: Account[]; onRefresh: (transactions: Transaction[]) => void }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'All' | TransactionType>('All');
  const filtered = transactions.filter((transaction) => {
    const term = query.toLowerCase();
    const category = categories.find((item) => item.id === transaction.categoryId)?.name ?? '';
    const account = accounts.find((item) => item.id === transaction.accountId)?.name ?? '';
    return (type === 'All' || transaction.type === type) && [transaction.merchant, transaction.note, category, account].some((value) => value?.toLowerCase().includes(term));
  });

  async function refresh() {
    const result: PagedResult<Transaction> = await hexaTrackApi.staff.transactions({ query, type: type === 'All' ? undefined : type, page: 1, pageSize: 50 });
    onRefresh(result.items);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row">
        <label className="flex h-12 flex-1 items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#121A22] px-4">
          <Search className="h-4 w-4 text-[#8B9BB4]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search merchant, notes, category, account" className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#8B9BB4]" />
        </label>
        <select value={type} onChange={(event) => setType(event.target.value as 'All' | TransactionType)} className="h-12 rounded-2xl border border-white/[0.06] bg-[#121A22] px-4 text-sm font-bold">
          {['All', 'Income', 'Expense', 'Transfer'].map((item) => <option key={item}>{item}</option>)}
        </select>
        <button onClick={refresh} className="h-12 rounded-2xl border border-white/[0.06] px-4 text-sm font-bold"><RefreshCw className="mr-2 inline h-4 w-4" />Refresh</button>
      </div>
      {filtered.length === 0 ? <EmptyState title="Start managing branch finances." action="Add Transaction" /> : <TransactionList transactions={filtered} categories={categories} accounts={accounts} />}
    </div>
  );
}

function TypeView({ type, dashboard, transactions, onAdd }: { type: EntryType; dashboard: StaffDashboardDto; transactions: Transaction[]; onAdd: () => void }) {
  const rows = transactions.filter((transaction) => transaction.type === type);
  return <div className="space-y-5"><MetricCard label={type} value={money(rows.reduce((sum, item) => sum + item.amount, 0))} icon={type === 'Income' ? ArrowDownLeft : ArrowUpRight} tone={type === 'Income' ? 'success' : 'expense'} />{rows.length === 0 ? <EmptyState title={`Start managing branch ${type.toLowerCase()}.`} action={`Add ${type}`} onAction={onAdd} /> : <TransactionList transactions={rows} categories={dashboard.categories} accounts={dashboard.accounts} />}</div>;
}

export function StaffTaskPanel({ tasks }: { tasks: StaffTask[] }) {
  return <Panel title="Assigned tasks">{tasks.map((task) => <div key={task.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4"><p className="font-bold">{task.title}</p><p className="mt-1 text-xs text-[#8B9BB4]">{task.status} • due {shortDate(task.due)}</p></div>)}</Panel>;
}

export function StaffNotificationCenter({ notifications }: { notifications: StaffNotification[] }) {
  return <Panel title="Notifications">{notifications.map((item) => <div key={item.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4"><p className="font-bold">{item.title}</p><p className="mt-1 text-xs text-[#8B9BB4]">{item.message}</p></div>)}</Panel>;
}

export function StaffProfileCard({ dashboard }: { dashboard: StaffDashboardDto }) {
  const user = useAuthStore((state) => state.user);
  return <div className="rounded-3xl border border-white/[0.06] bg-[#121A22] p-6"><UserCircle className="h-12 w-12 text-[#4F8CFF]" /><h1 className="mt-4 text-2xl font-black">{user?.displayName}</h1><p className="text-[#8B9BB4]">{user?.email}</p><div className="mt-5 grid gap-3 md:grid-cols-2"><Info label="Role" value="Staff" /><Info label="Department" value={dashboard.department || 'Operations'} /><Info label="Assigned branch" value={dashboard.branchName} /><Info label="Assigned owner" value="Branch Owner" /></div></div>;
}

function StaffReports({ dashboard, transactions }: { dashboard: StaffDashboardDto; transactions: Transaction[] }) {
  return <div className="space-y-5"><div className="grid grid-cols-1 gap-4 md:grid-cols-3"><MetricCard label="Income" value={money(dashboard.summary.income)} icon={ArrowDownLeft} tone="success" /><MetricCard label="Expenses" value={money(dashboard.summary.expense)} icon={ArrowUpRight} tone="expense" /><MetricCard label="Net" value={money(dashboard.summary.net)} icon={Wallet} tone="primary" /></div><Panel title="Branch activity">{transactions.slice(0, 8).map((transaction) => <div key={transaction.id} className="flex justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 text-sm"><span>{shortDate(transaction.occurredOn)} • {transaction.type}</span><strong>{money(transaction.amount, transaction.currency)}</strong></div>)}</Panel></div>;
}

export function BranchIdentityBadge({ branchName, department }: { branchName?: string | null; department?: string | null }) {
  return <div className="flex flex-wrap gap-2"><span className="inline-flex items-center gap-1.5 rounded-full border border-[#4F8CFF]/25 bg-[#4F8CFF]/10 px-3 py-1.5 text-xs font-bold text-[#4F8CFF]"><Building2 className="h-3.5 w-3.5" />{branchName || 'Branch pending'}</span><span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-[#8B9BB4]"><Briefcase className="h-3.5 w-3.5" />{department || 'Operations'}</span></div>;
}



function StaffTransactionModal({ type, dashboard, onClose, onSaved }: { type: EntryType; dashboard: StaffDashboardDto; onClose: () => void; onSaved: () => void }) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    amount: '',
    accountId: '',
    categoryId: '',
    merchant: '', // used as general string holder
    note: '',
    occurredOn: new Date().toISOString().slice(0, 10),
    receiptName: '',
    recurring: false
  });

  const isValid = form.amount && Number(form.amount) > 0 && form.accountId && form.categoryId;

  async function save() {
    if (!isValid) return;
    setSaving(true);
    const payload = {
      accountId: form.accountId,
      categoryId: form.categoryId,
      type,
      amount: Number(form.amount),
      currency: 'USD', // Fallback fallback, ideal case lookup but selector provides id
      merchant: form.merchant || undefined,
      note: form.note || undefined,
      occurredOn: form.occurredOn,
      tagIds: [],
      idempotencyKey: crypto.randomUUID()
    };
    try {
      if (type === 'Income') await hexaTrackApi.staff.createIncome(payload);
      else await hexaTrackApi.staff.createExpense(payload);
      
      // Invalidate TanStack cache queries to ensure data consistency
      await queryClient.invalidateQueries({ queryKey: ['accounts', 'available'] });
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
      
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Submission failed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/70 backdrop-blur-sm md:items-center md:p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-t-[32px] border border-white/[0.08] bg-[#0B1015] p-6 md:rounded-[32px]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-black">Add {type}</h2>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-2xl bg-white/[0.05]">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="Amount">
            <input 
              className="input-finance w-full" 
              type="number" 
              min="0.01" 
              step="0.01" 
              placeholder="0.00"
              value={form.amount} 
              onChange={(e) => setForm({ ...form, amount: e.target.value })} 
            />
          </InputField>
          <InputField label="Account">
            <AccountSelector 
              value={form.accountId} 
              onChange={(val) => setForm({ ...form, accountId: val })} 
            />
          </InputField>
          <InputField label="Category">
            <CategorySelector 
              type={type} 
              value={form.categoryId} 
              onChange={(val) => setForm({ ...form, categoryId: val })} 
            />
          </InputField>
          <InputField label={type === 'Expense' ? 'Merchant' : 'Payment Method'}>
            {type === 'Expense' ? (
              <input 
                className="input-finance w-full" 
                placeholder="Enter merchant..." 
                value={form.merchant} 
                onChange={(e) => setForm({ ...form, merchant: e.target.value })} 
              />
            ) : (
              <PaymentMethodSelector 
                value={form.merchant} 
                onChange={(val) => setForm({ ...form, merchant: val })} 
              />
            )}
          </InputField>
          <InputField label="Date">
            <input 
              className="input-finance w-full" 
              type="date" 
              value={form.occurredOn} 
              onChange={(e) => setForm({ ...form, occurredOn: e.target.value })} 
            />
          </InputField>
          <div className="flex h-12 items-center">
             <label className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#121A22] px-4 h-full w-full text-sm font-bold text-[#8B9BB4]">
               <input type="checkbox" checked={form.recurring} onChange={(e) => setForm({ ...form, recurring: e.target.checked })} /> 
               Recurring
             </label>
          </div>
          {type === 'Expense' ? (
            <InputField label="Receipt">
              <input 
                className="input-finance w-full text-xs" 
                type="file" 
                accept="image/*,.pdf" 
                onChange={(e) => setForm({ ...form, receiptName: e.target.files?.[0]?.name ?? '' })} 
              />
            </InputField>
          ) : null}
          <InputField label="Notes">
            <input 
              className="input-finance w-full" 
              placeholder="Transaction notes..." 
              value={form.note} 
              onChange={(e) => setForm({ ...form, note: e.target.value })} 
            />
          </InputField>
        </div>
        <button 
          disabled={saving || !isValid} 
          onClick={save} 
          className={`mt-6 h-12 w-full rounded-[18px] font-bold text-white transition-all ${isValid ? 'bg-[#4F8CFF] shadow-lg shadow-blue-500/20 hover:bg-blue-600' : 'bg-white/[0.08] text-[#8B9BB4] cursor-not-allowed opacity-60'}`}
        >
          {saving ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : `Record ${type}`}
        </button>
      </div>
    </div>
  );
}

function TransactionList({ transactions, categories, accounts }: { transactions: Transaction[]; categories: Category[]; accounts: Account[] }) {
  return <div className="space-y-3">{transactions.map((transaction) => <div key={transaction.id} className="rounded-2xl border border-white/[0.06] bg-[#121A22] p-4"><div className="flex items-center justify-between gap-4"><div><p className="font-bold">{categories.find((category) => category.id === transaction.categoryId)?.name ?? transaction.type}</p><p className="mt-1 text-xs text-[#8B9BB4]">{accounts.find((account) => account.id === transaction.accountId)?.name ?? 'Branch account'} • {shortDate(transaction.occurredOn)}</p></div><p className={`font-black ${transaction.type === 'Income' ? 'text-[#1FD18B]' : 'text-[#FF5C75]'}`}>{transaction.type === 'Income' ? '+' : '-'}{money(transaction.amount, transaction.currency)}</p></div></div>)}</div>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="space-y-3 rounded-3xl border border-white/[0.06] bg-[#121A22] p-5"><h2 className="text-lg font-black">{title}</h2>{children}</section>;
}

function MetricCard({ label, value, icon: Icon, tone }: { label: string; value: string; icon: LucideIcon; tone: 'primary' | 'success' | 'expense' }) {
  const color = tone === 'success' ? '#1FD18B' : tone === 'expense' ? '#FF5C75' : '#4F8CFF';
  return <div className="rounded-3xl border border-white/[0.06] bg-[#121A22] p-5"><Icon className="mb-3 h-5 w-5" style={{ color }} /><p className="text-[11px] font-black uppercase tracking-widest text-[#8B9BB4]">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4"><p className="text-[11px] font-black uppercase tracking-widest text-[#8B9BB4]">{label}</p><p className="mt-1 font-bold">{value}</p></div>;
}

function InputField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-[11px] font-black uppercase tracking-widest text-[#8B9BB4]">{label}<div className="mt-1.5 normal-case tracking-normal">{children}</div></label>;
}

function EmptyState({ title, action, onAction }: { title: string; action: string; onAction?: () => void }) {
  return <div className="rounded-3xl border border-dashed border-white/[0.1] bg-[#121A22] px-6 py-14 text-center"><Wallet className="mx-auto mb-4 h-10 w-10 text-[#4F8CFF]" /><h2 className="text-lg font-black">{title}</h2><p className="mt-2 text-sm text-[#8B9BB4]">{action}</p>{onAction ? <button onClick={onAction} className="mt-6 h-11 rounded-[18px] bg-[#4F8CFF] px-5 text-sm font-bold text-white">Add Transaction</button> : null}</div>;
}

function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div className="flex items-center justify-between rounded-2xl border border-[#FF5C75]/25 bg-[#FF5C75]/10 p-4 text-sm text-[#FF5C75]"><span>{message}</span><button onClick={onRetry} className="font-bold text-[#F5F7FA]">Retry</button></div>;
}

function StaffSkeleton() {
  return <div className="space-y-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-24 animate-pulse rounded-3xl bg-white/[0.05]" />)}</div>;
}
