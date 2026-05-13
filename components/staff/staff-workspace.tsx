'use client';

import { AccountSelector, CategorySelector, PaymentMethodSelector } from '@/components/finance/finance-selectors';
import { useQueryClient } from '@tanstack/react-query';

import { useEffect, useState } from 'react';
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
  { view: 'dashboard', label: 'Overview', icon: LayoutDashboard, href: '/staff/dashboard' },
  { view: 'transactions', label: 'Ledger Feed', icon: CreditCard, href: '/staff/transactions' },
  { view: 'expenses', label: 'Outflows', icon: ArrowUpRight, href: '/staff/expenses' },
  { view: 'income', label: 'Inflows', icon: ArrowDownLeft, href: '/staff/income' },
  { view: 'tasks', label: 'Queue', icon: CheckCircle2, href: '/staff/tasks' },
  { view: 'reports', label: 'Telemetry', icon: FileText, href: '/staff/reports' },
  { view: 'notifications', label: 'Signals', icon: Bell, href: '/staff/notifications' },
  { view: 'profile', label: 'Signature', icon: UserCircle, href: '/staff/profile' },
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
    return (
      <div className="grid min-h-screen place-items-center bg-[#0B1020] font-sans text-[10px] font-black uppercase tracking-widest text-cyan select-none animate-pulse">
         Authorizing operational channel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1020] text-on-surface xl:flex font-sans selection:bg-cyan/30">
      <StaffSidebar active={view} onNavigate={(href) => router.push(href)} onLogout={() => { logout(); router.replace('/'); }} />
      <main className="min-w-0 flex-1 pb-20 xl:pb-0">
        <header className="sticky top-0 z-30 border-b border-white/[0.04] bg-[#0B1020]/80 px-container-margin py-4.5 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <BrandMark tone="dark" />
              <BranchIdentityBadge branchName={dashboard?.branchName ?? user.branchName} department={dashboard?.department ?? user.department} />
            </div>
            <StaffQuickActions onExpense={() => setModalType('Expense')} onIncome={() => setModalType('Income')} />
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto xl:hidden no-scrollbar pb-1">
            {navItems.map((item) => (
              <button 
                key={item.view} 
                onClick={() => router.push(item.href)} 
                className={`shrink-0 rounded-full px-4 py-2 text-[10px] font-black font-label-caps tracking-widest uppercase border transition-all ${view === item.view ? 'bg-cyan border-white/[0.1] text-black shadow-[0_0_12px_#06B6D4]' : 'border-white/[0.05] bg-[#111827]/50 text-on-surface-variant'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </header>

        <section className="mx-auto max-w-7xl space-y-8 p-container-margin md:p-8 animate-in fade-in duration-500">
          {error ? <ErrorCard message={error} onRetry={load} /> : null}
          {loading ? <StaffSkeleton /> : dashboard ? renderView(view, dashboard, transactions, setTransactions, setModalType) : <EmptyState title="Node workspace not provisioned." action="Pending direct assignment from master owner." />}
        </section>
      </main>
      {modalType && dashboard ? <StaffTransactionModal type={modalType} dashboard={dashboard} onClose={() => setModalType(null)} onSaved={load} /> : null}
    </div>
  );
}

function StaffSidebar({ active, onNavigate, onLogout }: { active: StaffView; onNavigate: (href: string) => void; onLogout: () => void }) {
  return (
    <aside className="hidden h-screen w-[270px] shrink-0 flex-col border-r border-white/[0.04] bg-[#111827]/40 p-5 backdrop-blur-md xl:flex relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />
      <div className="mb-8 mt-2 flex h-12 items-center gap-3 px-3">
        <BrandMark tone="dark" />
        <span className="rounded-full border border-cyan/20 bg-[#111827] px-3 py-1 text-[9px] font-black font-label-caps tracking-widest uppercase text-cyan shadow-[0_0_8px_rgba(6,182,212,0.15)]">Staff</span>
      </div>
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isCurrent = active === item.view;
          return (
            <button 
              key={item.view} 
              onClick={() => onNavigate(item.href)} 
              className={`flex h-[46px] w-full items-center gap-3.5 rounded-[18px] px-4 text-xs font-bold transition-all duration-200 relative group ${isCurrent ? 'text-cyan font-black bg-[#111827] border border-white/[0.04] shadow-sm' : 'text-on-surface-variant hover:bg-[#111827]/40 hover:text-on-surface'}`}
            >
              {isCurrent && <div className="absolute left-2 w-1 h-4 rounded-full bg-cyan shadow-[0_0_6px_#06B6D4]" />}
              <Icon className={`h-4 w-4 flex-shrink-0 ${isCurrent ? 'text-cyan animate-pulse ml-1.5' : 'group-hover:scale-105 transition-transform'}`} />
              <span className={isCurrent ? 'ml-1 tracking-wide' : 'tracking-wide'}>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <button onClick={onLogout} className="flex h-[48px] items-center justify-center gap-2.5 rounded-full border border-white/[0.04] bg-[#111827]/20 text-[10px] font-black font-label-caps tracking-widest uppercase text-on-surface-variant hover:border-danger/30 hover:bg-danger/5 hover:text-danger active:scale-95 transition-all mt-4 select-none shadow-inner">
        <LogOut className="h-3.5 w-3.5" /> Disconnect Link
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <StaffWelcomeHero dashboard={dashboard} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="Consolidated Inflow" value={money(dashboard.summary.income)} icon={ArrowDownLeft} tone="success" />
        <MetricCard label="Operational Outflow" value={money(dashboard.summary.expense)} icon={ArrowUpRight} tone="expense" />
        <MetricCard label="Active Delta" value={money(dashboard.summary.net)} icon={Wallet} tone="primary" />
        <MetricCard label="Queued Tasks" value={String(dashboard.tasks.length)} icon={Inbox} tone="cyan" />
      </div>
      <StaffQuickActions onExpense={() => setModalType('Expense')} onIncome={() => setModalType('Income')} compact />
      {transactions.length === 0 ? (
         <EmptyState title="Operational tracking idle." action="Record node activity." onAction={() => setModalType('Expense')} />
      ) : (
         <TransactionList transactions={transactions.slice(0, 8)} categories={dashboard.categories} accounts={dashboard.accounts} />
      )}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StaffTaskPanel tasks={dashboard.tasks.slice(0, 3)} />
        <StaffNotificationCenter notifications={dashboard.notifications.slice(0, 3)} />
      </div>
    </div>
  );
}

export function StaffWelcomeHero({ dashboard }: { dashboard: StaffDashboardDto }) {
  const user = useAuthStore((state) => state.user);
  return (
    <section className="overflow-hidden rounded-[28px] border border-white/[0.05] bg-[#111827]/40 p-6 md:p-7 relative shadow-lg">
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-cyan/5 blur-3xl rounded-full pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-2 relative z-10">
         <p className="font-label-caps text-[10px] text-cyan tracking-widest uppercase font-black">Synchronous Interface Active</p>
         <div className="w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_8px_#06B6D4]" />
      </div>
      <h1 className="mt-1 font-headline text-3xl font-extrabold tracking-tight md:text-4xl text-on-surface relative z-10">Greetings, {user?.displayName}.</h1>
      <p className="mt-2 text-[11px] text-on-surface-variant font-semibold font-sans tracking-wide opacity-80 relative z-10 uppercase tracking-widest font-label-caps">{dashboard.department || 'Operations'} Cluster · {dashboard.branchName}</p>
      <div className="mt-6 flex flex-wrap gap-2.5 relative z-10">
        <span className="rounded-lg border border-white/[0.05] bg-[#111827] px-3 py-1 text-[9px] font-black font-label-caps tracking-wider uppercase text-cyan shadow-inner">AUTHORIZED OPERATOR</span>
        <span className="rounded-lg border border-emerald/20 bg-emerald/5 px-3 py-1 text-[9px] font-black font-label-caps tracking-wider uppercase text-emerald select-none">LIVE SUBSYSTEM</span>
      </div>
    </section>
  );
}

export function StaffQuickActions({ onExpense, onIncome, compact = false }: { onExpense: () => void; onIncome: () => void; compact?: boolean }) {
  return (
    <div className={`grid gap-3 relative z-10 ${compact ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:flex md:items-center'}`}>
      <QuickButton label="Record Outflow" icon={ArrowUpRight} onClick={onExpense} customClass="bg-indigo" />
      <QuickButton label="Record Inflow" icon={ArrowDownLeft} onClick={onIncome} customClass="bg-[#111827] border border-white/[0.05] hover:border-cyan/30 text-cyan" />
      <QuickButton label="Scan Receipt" icon={Receipt} onClick={onExpense} customClass="bg-[#111827] border border-white/[0.04] text-on-surface-variant" />
      <QuickButton label="Fast Ingest" icon={Plus} onClick={onExpense} customClass="bg-[#111827] border border-white/[0.04] text-on-surface-variant" />
    </div>
  );
}

function QuickButton({ label, icon: Icon, onClick, customClass = 'bg-cyan text-black' }: { label: string; icon: LucideIcon; onClick: () => void; customClass?: string }) {
  return (
    <button 
      onClick={onClick} 
      className={`h-[46px] rounded-full px-4.5 text-[10px] font-black font-label-caps tracking-widest uppercase flex items-center justify-center select-none active:scale-[0.98] hover:brightness-110 transition-all shadow-sm whitespace-nowrap ${customClass}`}
    >
      <Icon className="mr-2 flex-shrink-0 h-3.5 w-3.5" />
      {label}
    </button>
  );
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-3.5 md:flex-row">
        <div className="flex h-13 flex-1 items-center gap-3 rounded-[20px] border border-white/[0.05] bg-[#111827]/60 focus-within:border-cyan/30 transition-all px-4 shadow-inner">
          <Search className="h-4 w-4 text-cyan flex-shrink-0" />
          <input 
            value={query} 
            onChange={(event) => setQuery(event.target.value)} 
            placeholder="Search merchant, logs, categories, nodes..." 
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-on-surface-variant/60 font-medium" 
          />
        </div>
        <select 
          value={type} 
          onChange={(event) => setType(event.target.value as 'All' | TransactionType)} 
          className="h-13 rounded-[20px] border border-white/[0.05] bg-[#111827]/60 px-4 text-[10px] font-black tracking-widest font-label-caps uppercase text-cyan focus:border-cyan/30 cursor-pointer outline-none shadow-inner"
        >
          {['All', 'Income', 'Expense', 'Transfer'].map((item) => <option key={item} className="bg-[#111827] text-on-surface">{item === 'All' ? 'All Types' : item}</option>)}
        </select>
        <button 
          onClick={refresh} 
          className="h-13 rounded-[20px] border border-white/[0.05] hover:border-cyan/20 transition-all px-5 text-[10px] font-black tracking-widest font-label-caps uppercase flex items-center justify-center text-on-surface hover:text-cyan bg-[#111827]/40 active:scale-95 shadow-sm"
        >
          <RefreshCw className="mr-2 h-3.5 w-3.5" />Synchronize
        </button>
      </div>
      {filtered.length === 0 ? (
         <EmptyState title="Filtered log stream is empty." action="No transactions aligned to current parameters." />
      ) : (
         <TransactionList transactions={filtered} categories={categories} accounts={accounts} />
      )}
    </div>
  );
}

function TypeView({ type, dashboard, transactions, onAdd }: { type: EntryType; dashboard: StaffDashboardDto; transactions: Transaction[]; onAdd: () => void }) {
  const rows = transactions.filter((transaction) => transaction.type === type);
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <MetricCard label={`Accumulated ${type}`} value={money(rows.reduce((sum, item) => sum + item.amount, 0))} icon={type === 'Income' ? ArrowDownLeft : ArrowUpRight} tone={type === 'Income' ? 'success' : 'expense'} />
      {rows.length === 0 ? (
         <EmptyState title={`No active ${type.toLowerCase()} telemetry present.`} action={`Provision a new ${type.toLowerCase()} record.`} onAction={onAdd} />
      ) : (
         <TransactionList transactions={rows} categories={dashboard.categories} accounts={dashboard.accounts} />
      )}
    </div>
  );
}

export function StaffTaskPanel({ tasks }: { tasks: StaffTask[] }) {
  return (
    <Panel title="Assigned Backlog">
      {tasks.map((task) => (
        <div key={task.id} className="rounded-[20px] border border-white/[0.04] bg-[#111827]/30 p-4 hover:border-cyan/10 transition-all group flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-on-surface group-hover:text-cyan transition-colors font-sans">{task.title}</p>
            <p className="mt-1 text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider font-label-caps opacity-70">Due {shortDate(task.due)}</p>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-[#111827] border border-white/[0.03] text-[9px] font-black tracking-wider uppercase font-label-caps text-on-surface-variant group-hover:text-cyan transition-colors select-none shadow-inner">{task.status}</div>
        </div>
      ))}
      {tasks.length === 0 && (
         <div className="py-6 text-center text-xs italic text-on-surface-variant/70">All operational task buffers clear.</div>
      )}
    </Panel>
  );
}

export function StaffNotificationCenter({ notifications }: { notifications: StaffNotification[] }) {
  return (
    <Panel title="Incoming Telemetry Signals">
      {notifications.map((item) => (
        <div key={item.id} className="rounded-[20px] border border-white/[0.04] bg-[#111827]/30 p-4 group hover:border-cyan/10 transition-all">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-1.5 bg-cyan rounded-full shadow-[0_0_4px_#06B6D4] opacity-80 group-hover:animate-pulse" />
            <p className="text-xs font-bold text-on-surface group-hover:text-cyan transition-colors">{item.title}</p>
          </div>
          <p className="text-[11px] text-on-surface-variant font-medium pl-3 leading-relaxed">{item.message}</p>
        </div>
      ))}
      {notifications.length === 0 && (
         <div className="py-6 text-center text-xs italic text-on-surface-variant/70">Inbox signals synchronized and clear.</div>
      )}
    </Panel>
  );
}

export function StaffProfileCard({ dashboard }: { dashboard: StaffDashboardDto }) {
  const user = useAuthStore((state) => state.user);
  return (
    <div className="rounded-[28px] border border-white/[0.05] bg-[#111827]/40 p-6 md:p-8 relative overflow-hidden shadow-lg animate-in fade-in duration-500 max-w-3xl">
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#cfbcff]/5 blur-3xl rounded-full pointer-events-none" />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-[#111827] flex items-center justify-center text-cyan border border-white/[0.04] shadow-inner">
          <UserCircle size={36} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-wide text-on-surface font-sans">{user?.displayName}</h1>
          <p className="text-xs font-mono-data text-on-surface-variant mt-0.5 opacity-80 select-all">{user?.email}</p>
        </div>
      </div>
      
      <div className="mt-8 grid gap-4 md:grid-cols-2 relative z-10">
        <Info label="Access Authority" value="Cluster Staff" />
        <Info label="Segment Sector" value={dashboard.department || 'Operations Core'} />
        <Info label="Active Subnode" value={dashboard.branchName} />
        <Info label="Direct Control" value="Subsystem Head" />
      </div>
    </div>
  );
}

function StaffReports({ dashboard, transactions }: { dashboard: StaffDashboardDto; transactions: Transaction[] }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Active Inflow Volume" value={money(dashboard.summary.income)} icon={ArrowDownLeft} tone="success" />
        <MetricCard label="Active Outflow Volume" value={money(dashboard.summary.expense)} icon={ArrowUpRight} tone="expense" />
        <MetricCard label="Net Core Velocity" value={money(dashboard.summary.net)} icon={Wallet} tone="primary" />
      </div>
      <Panel title="Sub-sector Flux Vector Stream">
        {transactions.slice(0, 10).map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between rounded-[18px] border border-white/[0.03] bg-[#111827]/30 px-4 py-3.5 group hover:border-white/[0.08] transition-all">
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-wider font-label-caps text-on-surface uppercase">{transaction.type} ENTRY</span>
              <span className="text-[10px] text-on-surface-variant font-semibold mt-0.5">{shortDate(transaction.occurredOn)}</span>
            </div>
            <strong className={`font-mono-data font-black text-[13px] tracking-tight ${transaction.type === 'Income' ? 'text-emerald' : 'text-danger'}`}>
              {transaction.type === 'Income' ? '+' : '-'}{money(transaction.amount, transaction.currency)}
            </strong>
          </div>
        ))}
        {transactions.length === 0 && (
           <div className="py-10 text-center text-xs italic text-on-surface-variant/60 select-none">Zero fluxes compiled in trace buffer.</div>
        )}
      </Panel>
    </div>
  );
}

export function BranchIdentityBadge({ branchName, department }: { branchName?: string | null; department?: string | null }) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/20 bg-cyan/5 px-3 py-1 text-[9px] font-black font-label-caps tracking-wider uppercase text-cyan shadow-sm">
        <Building2 className="h-3 w-3" />
        {branchName || 'Mapping context...'}
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.04] bg-[#111827]/50 px-3 py-1 text-[9px] font-black font-label-caps tracking-wider uppercase text-on-surface-variant select-none">
        <Briefcase className="h-3 w-3" />
        {department || 'Standard Ops'}
      </span>
    </div>
  );
}

function StaffTransactionModal({ type, dashboard, onClose, onSaved }: { type: EntryType; dashboard: StaffDashboardDto; onClose: () => void; onSaved: () => void }) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    amount: '',
    accountId: '',
    categoryId: '',
    merchant: '',
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
      currency: 'USD',
      merchant: form.merchant || undefined,
      note: form.note || undefined,
      occurredOn: form.occurredOn,
      tagIds: [],
      idempotencyKey: crypto.randomUUID()
    };
    try {
      if (type === 'Income') await hexaTrackApi.staff.createIncome(payload);
      else await hexaTrackApi.staff.createExpense(payload);
      
      await queryClient.invalidateQueries({ queryKey: ['accounts', 'available'] });
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
      
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Ingestion sequence halted.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/80 backdrop-blur-md md:items-center md:p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-t-[28px] md:rounded-[28px] border border-white/[0.06] bg-[#0B1020] p-6 md:p-7 shadow-2xl scale-in duration-300">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
        
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
             <div className={`w-2 h-4 rounded-full ${type === 'Income' ? 'bg-emerald shadow-[0_0_8px_#10B981]' : 'bg-danger shadow-[0_0_8px_#EF4444]'}`} />
             <h2 className="text-lg font-black tracking-wide text-on-surface font-sans">Ingest {type} Telemetry</h2>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl bg-[#111827] border border-white/[0.04] text-on-surface-variant hover:text-cyan active:scale-90 transition-all">
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
        
        <div className="grid gap-4.5 md:grid-cols-2">
          <InputField label="Metric Weight (Amount)">
            <input 
              className="input-finance w-full text-[15px] font-mono-data font-extrabold text-cyan py-3 tracking-tight h-[52px]" 
              type="number" 
              min="0.01" 
              step="0.01" 
              placeholder="0.00"
              value={form.amount} 
              onChange={(e) => setForm({ ...form, amount: e.target.value })} 
            />
          </InputField>
          <InputField label="Source Cluster (Account)">
            <div className="h-[52px]">
              <AccountSelector 
                value={form.accountId} 
                onChange={(val) => setForm({ ...form, accountId: val })} 
              />
            </div>
          </InputField>
          <InputField label="Operational Sector (Category)">
            <div className="h-[52px]">
              <CategorySelector 
                type={type} 
                value={form.categoryId} 
                onChange={(val) => setForm({ ...form, categoryId: val })} 
              />
            </div>
          </InputField>
          <InputField label={type === 'Expense' ? 'Ingestion Target' : 'Transfer Method'}>
            {type === 'Expense' ? (
              <input 
                className="input-finance w-full h-[52px]" 
                placeholder="Destination entity..." 
                value={form.merchant} 
                onChange={(e) => setForm({ ...form, merchant: e.target.value })} 
              />
            ) : (
              <div className="h-[52px]">
                 <PaymentMethodSelector 
                   value={form.merchant} 
                   onChange={(val) => setForm({ ...form, merchant: val })} 
                 />
              </div>
            )}
          </InputField>
          <InputField label="Temporal Signature (Date)">
            <input 
              className="input-finance w-full h-[52px] text-xs uppercase tracking-wider font-label-caps font-black text-cyan cursor-pointer" 
              type="date" 
              value={form.occurredOn} 
              onChange={(e) => setForm({ ...form, occurredOn: e.target.value })} 
            />
          </InputField>
          <div className="flex h-[52px] items-end pb-0.5">
             <label className="flex items-center gap-3 rounded-[18px] border border-white/[0.04] bg-[#111827] px-4 h-full w-full text-[10px] font-black uppercase font-label-caps tracking-widest text-on-surface-variant hover:border-white/[0.08] cursor-pointer transition-all group shadow-inner select-none">
               <input 
                 type="checkbox" 
                 checked={form.recurring} 
                 onChange={(e) => setForm({ ...form, recurring: e.target.checked })} 
                 className="rounded focus:ring-0 accent-cyan text-cyan border-white/[0.1] bg-transparent w-4 h-4"
               /> 
               <span>Auto Loop Flux</span>
             </label>
          </div>
          {type === 'Expense' ? (
            <InputField label="Encrypted Verification (Receipt)">
              <input 
                className="input-finance w-full h-[52px] pt-3 text-[9px] font-black tracking-widest font-label-caps uppercase file:hidden hover:border-white/[0.1] cursor-pointer" 
                type="file" 
                accept="image/*,.pdf" 
                onChange={(e) => setForm({ ...form, receiptName: e.target.files?.[0]?.name ?? '' })} 
              />
            </InputField>
          ) : null}
          <InputField label="Static Ledger Notes">
            <input 
              className="input-finance w-full h-[52px]" 
              placeholder="Telemetry footnotes..." 
              value={form.note} 
              onChange={(e) => setForm({ ...form, note: e.target.value })} 
            />
          </InputField>
        </div>
        
        <button 
          disabled={saving || !isValid} 
          onClick={save} 
          className={`mt-8 h-[56px] w-full rounded-full text-[10px] font-black tracking-widest uppercase font-label-caps transition-all select-none border shadow-lg active:scale-[0.99] ${isValid ? 'bg-indigo hover:brightness-110 shadow-indigo/20 border-white/[0.1] text-white' : 'bg-white/[0.05] text-on-surface-variant border-white/[0.02] cursor-not-allowed opacity-50'}`}
        >
          {saving ? <Loader2 className="mx-auto h-5 w-5 animate-spin text-white" /> : `Execute ${type} Ingestion`}
        </button>
      </div>
    </div>
  );
}

function TransactionList({ transactions, categories, accounts }: { transactions: Transaction[]; categories: Category[]; accounts: Account[] }) {
  return (
    <div className="space-y-3.5">
      {transactions.map((transaction) => {
         const isInc = transaction.type === 'Income';
         return (
            <div key={transaction.id} className="rounded-[22px] border border-white/[0.04] bg-[#111827]/40 p-4.5 hover:border-cyan/15 hover:bg-[#111827]/60 transition-all shadow-sm group flex items-center justify-between gap-5 select-none">
               <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-11 h-11 rounded-2xl border border-white/[0.03] flex items-center justify-center shrink-0 shadow-inner ${isInc ? 'bg-emerald/5 text-emerald' : 'bg-danger/5 text-danger'} group-hover:scale-105 transition-transform`}>
                     {isInc ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>
                  <div className="min-w-0">
                     <p className="text-xs font-extrabold text-on-surface font-sans tracking-wide truncate group-hover:text-cyan transition-colors">
                        {categories.find((cat) => cat.id === transaction.categoryId)?.name ?? transaction.merchant ?? transaction.type}
                     </p>
                     <p className="mt-1 text-[10px] text-on-surface-variant font-medium truncate">
                        {accounts.find((acc) => acc.id === transaction.accountId)?.name ?? 'Internal Vault'} · {shortDate(transaction.occurredOn)}
                     </p>
                  </div>
               </div>
               <p className={`font-mono-data font-extrabold text-sm tracking-tight whitespace-nowrap ml-2 ${isInc ? 'text-emerald' : 'text-on-surface'}`}>
                  {isInc ? '+' : '-'}{money(transaction.amount, transaction.currency)}
               </p>
            </div>
         );
      })}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5 rounded-[28px] border border-white/[0.04] bg-[#111827]/30 p-6 backdrop-blur-md shadow-sm">
      <h2 className="text-[15px] font-extrabold tracking-wide text-on-surface font-sans mb-1 flex items-center gap-2">
         <div className="w-1 h-3 bg-cyan rounded-full opacity-75 shadow-[0_0_6px_#06B6D4]" />
         {title}
      </h2>
      <div className="space-y-3">
         {children}
      </div>
    </section>
  );
}

function MetricCard({ label, value, icon: Icon, tone }: { label: string; value: string; icon: LucideIcon; tone: 'primary' | 'success' | 'expense' | 'cyan' }) {
  const colorClass = tone === 'success' ? 'text-emerald drop-shadow-[0_0_6px_#10B981]' : tone === 'expense' ? 'text-danger drop-shadow-[0_0_6px_#EF4444]' : tone === 'cyan' ? 'text-cyan drop-shadow-[0_0_6px_#06B6D4]' : 'text-indigo drop-shadow-[0_0_6px_#6366F1]';
  
  return (
    <div className="rounded-[28px] border border-white/[0.04] bg-[#111827]/40 p-6 shadow-md relative overflow-hidden group hover:border-cyan/10 transition-all cursor-default">
       <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/[0.01] rounded-full blur-xl pointer-events-none transition-all group-hover:bg-white/[0.03]" />
       <Icon className={`mb-4 h-5 w-5 relative z-10 ${colorClass} group-hover:scale-110 transition-transform`} />
       <p className="text-[9px] font-black uppercase tracking-widest font-label-caps text-on-surface-variant relative z-10 opacity-70">{label}</p>
       <p className="mt-2 font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight leading-none relative z-10 select-all">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-white/[0.04] bg-[#111827] p-5 shadow-sm hover:border-cyan/10 transition-all cursor-default select-none">
      <p className="text-[9px] font-black uppercase tracking-widest font-label-caps text-on-surface-variant opacity-60 mb-1">{label}</p>
      <p className="font-bold text-sm tracking-wide text-on-surface">{value}</p>
    </div>
  );
}

function InputField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-[9px] font-black uppercase tracking-widest font-label-caps text-on-surface-variant opacity-75 select-none">
      {label}
      <div className="mt-2 normal-case tracking-normal font-sans">
         {children}
      </div>
    </label>
  );
}

function EmptyState({ title, action, onAction }: { title: string; action: string; onAction?: () => void }) {
  return (
    <div className="rounded-[28px] border border-dashed border-white/[0.08] bg-[#111827]/20 px-6 py-16 text-center select-none">
      <div className="w-14 h-14 rounded-2xl bg-[#111827] border border-white/[0.04] flex items-center justify-center text-on-surface-variant mx-auto mb-5 shadow-inner">
         <Wallet className="h-6 w-6 opacity-70" />
      </div>
      <h2 className="text-[15px] font-extrabold text-on-surface font-sans tracking-wide">{title}</h2>
      <p className="mt-2 text-[11px] font-medium text-on-surface-variant max-w-sm mx-auto">{action}</p>
      {onAction ? (
         <button 
           onClick={onAction} 
           className="mt-6.5 h-11 rounded-full bg-cyan border border-white/[0.1] text-black px-5.5 text-[10px] font-black tracking-widest uppercase font-label-caps active:scale-95 transition-all shadow-md shadow-cyan/20 hover:brightness-110"
         >
           Provision Flux Entry
         </button>
      ) : null}
    </div>
  );
}

function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-[22px] border border-danger/20 bg-danger/5 p-4 text-[13px] text-danger font-bold font-sans select-none shadow-sm">
      <span className="tracking-wide">{message}</span>
      <button 
        onClick={onRetry} 
        className="font-black font-label-caps text-[10px] uppercase tracking-widest text-white bg-[#111827] border border-white/[0.05] px-3.5 py-1.5 rounded-lg shadow-sm hover:border-danger/30 transition-colors active:scale-95 ml-3 shrink-0"
      >
        Reboot Interface
      </button>
    </div>
  );
}

function StaffSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      {[1, 2, 3, 4].map((item) => (
         <div key={item} className="h-24 rounded-[24px] bg-[#111827]/40 border border-white/[0.03]" />
      ))}
    </div>
  );
}

