import { ArrowDownLeft, ArrowUpRight, Bell, Plus, Sparkles, WalletCards } from 'lucide-react';
import { money } from '@/lib/format';
import type { RecurringTransaction, ReportSummary } from '@/lib/types';
import { useFinanceStore } from '@/store/finance-store';
import { TransactionList } from '@/components/transactions/transaction-list';
import { BrandMark } from '@/components/ui/brand';

function recurringDueWithinWeek(all: RecurringTransaction[]): RecurringTransaction[] {
  const today = new Date();
  const end = new Date(today);
  end.setDate(end.getDate() + 6);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const from = iso(today);
  const to = iso(end);
  return all
    .filter((r) => r.isActive && r.nextRunOn >= from && r.nextRunOn <= to && (!r.endsOn || r.endsOn >= r.nextRunOn))
    .sort((a, b) => a.nextRunOn.localeCompare(b.nextRunOn))
    .slice(0, 5);
}

const BAR_COLORS = ['bg-[#4F8CFF]', 'bg-[#1FD18B]', 'bg-[#FF5C75]', 'bg-[#8B9BB4]/80'] as const;

export function DashboardScreen({ compact = false, onAddTransaction }: { compact?: boolean; onAddTransaction: () => void }) {
  const loading = useFinanceStore((state) => state.loading);
  const accounts = useFinanceStore((state) => state.accounts);
  const categories = useFinanceStore((state) => state.categories);
  const transactions = useFinanceStore((state) => state.transactions);
  const recurring = useFinanceStore((state) => state.recurring);
  const report = useFinanceStore((state) => state.report);
  const dashboard = useFinanceStore((state) => state.dashboard);
  const totalBalanceFromAccounts = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalBalance = dashboard?.totalBalance ?? totalBalanceFromAccounts;
  const recentTransactions = dashboard?.recentTransactions ?? transactions.slice(0, 5);
  const recurringDue = dashboard?.recurringDueSoon ?? recurringDueWithinWeek(recurring);
  const spending = report.spendingByCategory.length
    ? report.spendingByCategory
    : categories
        .filter((category) => category.type === 'Expense')
        .slice(0, 4)
        .map((category) => ({
          categoryId: category.id,
          categoryName: category.name,
          amount: transactions.filter((transaction) => transaction.categoryId === category.id).reduce((sum, transaction) => sum + transaction.amount, 0),
        }))
        .filter((item) => item.amount > 0);
  const maxSpend = Math.max(...spending.map((item) => item.amount), 1);

  const showInitialSkeleton = loading && accounts.length === 0 && categories.length === 0;

  if (showInitialSkeleton) {
    return (
      <div className="space-y-5">
        {!compact && (
          <div className="hidden lg:block">
            <div className="h-6 w-40 animate-pulse rounded-lg bg-white/10" />
            <div className="mt-3 h-10 w-56 animate-pulse rounded-xl bg-white/10" />
          </div>
        )}
        <div className="h-40 animate-pulse rounded-3xl bg-white/5" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <div className="h-28 animate-pulse rounded-3xl bg-white/5" />
          <div className="h-28 animate-pulse rounded-3xl bg-white/5" />
          <div className="hidden h-28 animate-pulse rounded-3xl bg-white/5 md:block" />
        </div>
        <div className="h-24 animate-pulse rounded-3xl bg-white/5" />
        <div className="h-48 animate-pulse rounded-3xl bg-white/5" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {!compact && (
        <header className="hidden items-center justify-between lg:flex">
          <div>
            <p className="text-sm text-[#8B9BB4]">Welcome back</p>
            <BrandMark tone="dark" className="mt-2" />
          </div>
          <button className="icon-button" type="button" aria-label="Notifications">
            <Bell size={19} />
          </button>
        </header>
      )}

      <section className="overflow-hidden glass-card rounded-3xl p-6 accent-glow relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="flex items-start justify-between gap-4 relative z-10">
          <div className="min-w-0">
            <p className="font-label-mono text-xs uppercase tracking-widest text-on-surface-variant/70">Total Assets</p>
            <h2 className="mt-2 font-display-lg text-3xl sm:text-4xl text-on-surface font-bold">{money(totalBalance)}</h2>
            <p className="mt-3 text-sm font-medium flex items-center gap-1">
              <span className={report.net >= 0 ? 'text-secondary' : 'text-danger'}>
                {report.net >= 0 ? '+' : ''}{money(report.net)}
              </span>
              <span className="text-on-surface-variant/60 text-xs ml-1 font-normal font-label-mono">Net Flow</span>
            </p>
          </div>
          <button
            aria-label="Add transaction"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary text-on-secondary shadow-[0_0_20px_rgba(173,198,255,0.3)] hover:opacity-90 transition active:scale-95"
            onClick={onAddTransaction}
            type="button"
          >
            <Plus size={22} />
          </button>
        </div>
        <div className="relative z-10">
          <MiniLine cashflow={report.cashflow} />
        </div>
      </section>

      {!compact && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <Insight label="Accounts" value={accounts.length.toString()} detail="Connected sources" icon={WalletCards} />
          <Insight label="Income" value={money(report.income)} detail="This month" icon={ArrowDownLeft} tone="success" />
          <Insight label="Expense" value={money(report.expense)} detail="Tracked spend" icon={ArrowUpRight} tone="danger" />
        </div>
      )}

      <section className="rounded-3xl border border-white/[0.06] bg-gradient-to-br from-primary-container/40 to-surface-container/40 p-5 border-l-primary/30 border-l-2">
        <div className="flex gap-3 items-start">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles size={18} />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-on-surface font-headline-md flex items-center gap-1.5">Smart Tip</h2>
            <p className="mt-1.5 text-sm font-medium leading-relaxed text-on-surface-variant">
              {dashboard?.insightLine ?? 'Connect your transaction stream to initialize smart wealth patterns.'}
            </p>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-3xl p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-on-surface font-headline-md">Analytics Pulse</h2>
            <p className="mt-1 text-xs font-medium text-on-surface-variant/70 font-label-mono tracking-wider uppercase">Top Spend Classes</p>
          </div>
          <Donut amounts={spending.slice(0, 4).map((item) => item.amount)} />
        </div>
        <div className="space-y-5">
          {spending.slice(0, 4).map((item, index) => (
            <div key={item.categoryId} className="group">
              <div className="mb-2 flex justify-between gap-3 text-sm">
                <span className="truncate font-semibold text-on-surface group-hover:text-primary transition-colors">{item.categoryName}</span>
                <span className="shrink-0 text-on-surface-variant font-label-mono font-medium">{money(item.amount)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                <div
                  className={`${BAR_COLORS[index % BAR_COLORS.length]} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${Math.max((item.amount / maxSpend) * 100, 4)}%` }}
                />
              </div>
            </div>
          ))}
          {spending.length === 0 && <p className="text-sm text-on-surface-variant">Add transactions to initialize insights.</p>}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-2 px-2">
            <h2 className="text-base font-bold text-on-surface font-headline-md">Recent Flow</h2>
            <span className="shrink-0 text-xs font-label-mono font-bold text-secondary">{transactions.length} TOTAL</span>
          </div>
          <div className="glass-card p-2 rounded-3xl">
            <TransactionList categories={categories} transactions={recentTransactions} />
          </div>
        </section>

        <section className="glass-card p-6 rounded-3xl h-fit">
          <div className="flex items-center justify-between gap-2 mb-6">
            <h2 className="text-base font-bold text-on-surface font-headline-md">Schedule Reminders</h2>
            <span className="shrink-0 rounded-full bg-primary/15 px-3 py-1 text-[10px] font-bold font-label-mono text-primary uppercase tracking-wider">{recurringDue.length} ACTIVE</span>
          </div>
          <div className="space-y-3">
            {recurringDue.slice(0, 3).map((item) => {
              const category = categories.find((categoryItem) => categoryItem.id === item.categoryId);
              return (
                <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.05] bg-surface-container-low hover:bg-surface-container transition-colors p-4 cursor-pointer group">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{category?.name ?? 'Subscription'}</p>
                    <p className="text-[11px] font-label-mono text-on-surface-variant/70 mt-1 uppercase tracking-wider">Next: {item.nextRunOn}</p>
                  </div>
                  <p className="shrink-0 text-sm font-bold font-label-mono text-on-surface">{money(item.amount)}</p>
                </div>
              );
            })}
            {recurringDue.length === 0 && <p className="text-sm text-on-surface-variant font-medium text-center py-4 bg-surface-container-low/50 rounded-2xl border border-dashed border-white/10">No upcoming cycles</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

function Insight({ label, value, detail, icon: Icon, tone = 'default' }: { label: string; value: string; detail: string; icon: React.ElementType; tone?: 'default' | 'success' | 'danger' }) {
  const toneClass =
    tone === 'success'
      ? 'bg-success/15 text-success'
      : tone === 'danger'
        ? 'bg-danger/15 text-danger'
        : 'bg-primary/15 text-primary';
  return (
    <section className="glass-card p-5 rounded-3xl group hover:border-white/20 transition-all duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold font-label-mono text-on-surface-variant uppercase tracking-wider">{label}</p>
          <p className="mt-2 truncate text-xl font-bold text-on-surface tracking-tight font-headline-md">{value}</p>
        </div>
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl transition-transform group-hover:scale-110 duration-300 ${toneClass}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="mt-3 text-[11px] font-medium text-on-surface-variant/70 uppercase tracking-tight">{detail}</p>
    </section>
  );
}


function MiniLine({ cashflow }: { cashflow: ReportSummary['cashflow'] }) {
  const points = cashflow.slice(-8);
  const heights =
    points.length > 0
      ? (() => {
          const max = Math.max(...points.map((p) => Math.abs(p.net)), 1);
          return points.map((p) => 8 + Math.round((Math.abs(p.net) / max) * 44));
        })()
      : [24, 36, 30, 44, 38, 52, 48, 60];

  return (
    <div className="mt-6 flex h-12 items-end gap-2">
      {heights.map((height, index) => (
        <span key={index} className="flex-1 rounded-full bg-[#4F8CFF]/25" style={{ height }} />
      ))}
    </div>
  );
}

const DONUT_COLORS = ['#4F8CFF', '#1FD18B', '#FF5C75', '#8B9BB4'];

function Donut({ amounts }: { amounts: number[] }) {
  const total = amounts.reduce((sum, amount) => sum + amount, 0);
  if (total <= 0) {
    return (
      <div className="h-16 w-16 shrink-0 rounded-full border-2 border-white/[0.08] bg-[#0B1015] p-3">
        <div className="h-full w-full rounded-full bg-[#121A22]" />
      </div>
    );
  }

  let start = 0;
  const parts: string[] = [];
  amounts.forEach((amount, index) => {
    const pct = (amount / total) * 100;
    const color = DONUT_COLORS[index % DONUT_COLORS.length];
    parts.push(`${color} ${start}% ${start + pct}%`);
    start += pct;
  });

  return (
    <div className="h-16 w-16 shrink-0 rounded-full p-3" style={{ background: `conic-gradient(${parts.join(',')})` }}>
      <div className="h-full w-full rounded-full bg-[#121A22]" />
    </div>
  );
}
