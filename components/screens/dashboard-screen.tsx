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

      <section className="overflow-hidden rounded-3xl border border-white/[0.06] bg-[#121A22] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-[#8B9BB4]">Total balance</p>
            <p className="mt-2 break-words text-4xl font-bold tracking-normal text-[#F5F7FA]">{money(totalBalance)}</p>
            <p className="mt-3 text-sm font-medium text-[#8B9BB4]">
              Net cashflow{' '}
              <span className={report.net >= 0 ? 'text-[#1FD18B]' : 'text-[#FF5C75]'}>{money(report.net)}</span>
            </p>
          </div>
          <button
            aria-label="Add transaction"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#4F8CFF] text-white shadow-[0_12px_28px_rgba(79,140,255,0.3)] transition active:scale-95"
            onClick={onAddTransaction}
            type="button"
          >
            <Plus size={22} />
          </button>
        </div>
        <MiniLine cashflow={report.cashflow} />
      </section>

      {!compact && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <Insight label="Accounts" value={accounts.length.toString()} detail="Connected sources" icon={WalletCards} />
          <Insight label="Income" value={money(report.income)} detail="This month" icon={ArrowDownLeft} tone="success" />
          <Insight label="Expense" value={money(report.expense)} detail="Tracked spend" icon={ArrowUpRight} tone="danger" />
        </div>
      )}

      <section className="rounded-3xl border border-white/[0.06] bg-[#121A22] p-4">
        <div className="flex gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#4F8CFF]/15 text-[#4F8CFF]">
            <Sparkles size={18} />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-[#F5F7FA]">Where money goes</h2>
            <p className="mt-1 text-sm font-medium leading-6 text-[#8B9BB4]">
              {dashboard?.insightLine ?? 'Connect spending data to see category insights for this month.'}
            </p>
          </div>
        </div>
      </section>

      <section className="card p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#F5F7FA]">Top spending categories</h2>
            <p className="mt-1 text-xs text-[#8B9BB4]">Instant category breakdown</p>
          </div>
          <Donut amounts={spending.slice(0, 4).map((item) => item.amount)} />
        </div>
        <div className="mt-4 space-y-4">
          {spending.slice(0, 4).map((item, index) => (
            <div key={item.categoryId}>
              <div className="mb-2 flex justify-between gap-3 text-sm">
                <span className="truncate font-medium text-[#F5F7FA]">{item.categoryName}</span>
                <span className="shrink-0 text-[#8B9BB4]">{money(item.amount)}</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.08]">
                <div
                  className={`${BAR_COLORS[index % BAR_COLORS.length]} h-2 rounded-full transition-all`}
                  style={{ width: `${Math.max((item.amount / maxSpend) * 100, 8)}%` }}
                />
              </div>
            </div>
          ))}
          {spending.length === 0 && <p className="text-sm text-[#8B9BB4]">Add a transaction to see spending patterns.</p>}
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-[#F5F7FA]">Recent transactions</h2>
            <span className="shrink-0 text-xs font-medium text-[#4F8CFF]">{transactions.length} total</span>
          </div>
          <TransactionList categories={categories} transactions={recentTransactions} />
        </section>

        <section className="card p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-[#F5F7FA]">Recurring reminders</h2>
            <span className="shrink-0 rounded-full bg-[#4F8CFF]/15 px-3 py-1 text-xs font-semibold text-[#4F8CFF]">{recurringDue.length} due</span>
          </div>
          <div className="mt-4 space-y-3">
            {recurringDue.slice(0, 3).map((item) => {
              const category = categories.find((categoryItem) => categoryItem.id === item.categoryId);
              return (
                <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-[#0B1015] p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#F5F7FA]">{category?.name ?? 'Recurring item'}</p>
                    <p className="text-xs text-[#8B9BB4]">Next {item.nextRunOn}</p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-[#F5F7FA]">{money(item.amount)}</p>
                </div>
              );
            })}
            {recurringDue.length === 0 && <p className="text-sm text-[#8B9BB4]">No recurring bills due yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

function Insight({ label, value, detail, icon: Icon, tone = 'default' }: { label: string; value: string; detail: string; icon: React.ElementType; tone?: 'default' | 'success' | 'danger' }) {
  const toneClass =
    tone === 'success'
      ? 'bg-[#1FD18B]/15 text-[#1FD18B]'
      : tone === 'danger'
        ? 'bg-[#FF5C75]/15 text-[#FF5C75]'
        : 'bg-[#4F8CFF]/12 text-[#4F8CFF]';
  return (
    <section className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-[#8B9BB4]">{label}</p>
          <p className="mt-2 truncate text-xl font-bold text-[#F5F7FA]">{value}</p>
        </div>
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${toneClass}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="mt-3 text-xs text-[#8B9BB4]">{detail}</p>
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
