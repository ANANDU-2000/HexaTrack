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
            <div className="h-6 w-40 animate-pulse rounded-lg bg-[#E5E7EB]" />
            <div className="mt-3 h-10 w-56 animate-pulse rounded-xl bg-[#E5E7EB]" />
          </div>
        )}
        <div className="h-40 animate-pulse rounded-2xl bg-[#ECFDF5]" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <div className="h-28 animate-pulse rounded-2xl bg-[#F3F4F6]" />
          <div className="h-28 animate-pulse rounded-2xl bg-[#F3F4F6]" />
          <div className="hidden h-28 animate-pulse rounded-2xl bg-[#F3F4F6] md:block" />
        </div>
        <div className="h-24 animate-pulse rounded-2xl bg-[#F3F4F6]" />
        <div className="h-48 animate-pulse rounded-2xl bg-[#F3F4F6]" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {!compact && (
        <header className="hidden items-center justify-between lg:flex">
          <div>
            <p className="text-sm text-[#6B7280]">Welcome back</p>
            <BrandMark className="mt-2" />
          </div>
          <button className="icon-button" type="button" aria-label="Notifications">
            <Bell size={19} />
          </button>
        </header>
      )}

      <section className="overflow-hidden rounded-2xl border border-[#10B981]/20 bg-gradient-to-br from-[#10B981] via-[#059669] to-[#064E3B] p-5 text-white shadow-xl shadow-emerald-500/20">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-emerald-50/85">Total balance</p>
            <p className="mt-2 break-words text-4xl font-bold tracking-normal">{money(totalBalance)}</p>
            <p className="mt-3 text-sm font-medium text-emerald-50/85">
              Net cashflow <span className={report.net >= 0 ? 'text-white' : 'text-red-100'}>{money(report.net)}</span>
            </p>
          </div>
          <button aria-label="Add transaction" className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-[#059669] shadow-lg shadow-black/15 transition active:scale-95" onClick={onAddTransaction} type="button">
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

      <section className="rounded-2xl border border-[#D1FAE5] bg-[#ECFDF5] p-4">
        <div className="flex gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#D1FAE5] text-[#059669]">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#111827]">Where money goes</h2>
            <p className="mt-1 text-sm font-medium leading-6 text-[#6B7280]">
              {dashboard?.insightLine ?? 'Connect spending data to see category insights for this month.'}
            </p>
          </div>
        </div>
      </section>

      <section className="card p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#111827]">Top spending categories</h2>
            <p className="mt-1 text-xs text-[#6B7280]">Instant category breakdown</p>
          </div>
          <Donut amounts={spending.slice(0, 4).map((item) => item.amount)} />
        </div>
        <div className="mt-4 space-y-4">
          {spending.slice(0, 4).map((item, index) => (
            <div key={item.categoryId}>
              <div className="mb-2 flex justify-between gap-3 text-sm">
                <span className="truncate font-medium text-[#111827]">{item.categoryName}</span>
                <span className="shrink-0 text-[#6B7280]">{money(item.amount)}</span>
              </div>
              <div className="h-2 rounded-full bg-[#E5E7EB]">
                <div className={['bg-[#10B981]', 'bg-[#059669]', 'bg-amber-400', 'bg-sky-400'][index] + ' h-2 rounded-full'} style={{ width: `${Math.max((item.amount / maxSpend) * 100, 8)}%` }} />
              </div>
            </div>
          ))}
          {spending.length === 0 && <p className="text-sm text-[#6B7280]">Add a transaction to see spending patterns.</p>}
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#111827]">Recent transactions</h2>
            <span className="text-xs font-medium text-[#059669]">{transactions.length} total</span>
          </div>
          <TransactionList categories={categories} transactions={recentTransactions} />
        </section>

        <section className="card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#111827]">Recurring reminders</h2>
            <span className="rounded-full bg-[#D1FAE5] px-3 py-1 text-xs font-semibold text-[#059669]">{recurringDue.length} due</span>
          </div>
          <div className="mt-4 space-y-3">
            {recurringDue.slice(0, 3).map((item) => {
              const category = categories.find((categoryItem) => categoryItem.id === item.categoryId);
              return (
                <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-[#F8FAFC] p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#111827]">{category?.name ?? 'Recurring item'}</p>
                    <p className="text-xs text-[#6B7280]">Next {item.nextRunOn}</p>
                  </div>
                  <p className="text-sm font-bold text-[#111827]">{money(item.amount)}</p>
                </div>
              );
            })}
            {recurringDue.length === 0 && <p className="text-sm text-[#6B7280]">No recurring bills due yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

function Insight({ label, value, detail, icon: Icon, tone = 'default' }: { label: string; value: string; detail: string; icon: React.ElementType; tone?: 'default' | 'success' | 'danger' }) {
  const toneClass = tone === 'success' ? 'bg-[#D1FAE5] text-[#059669]' : tone === 'danger' ? 'bg-red-50 text-red-600' : 'bg-[#ECFDF5] text-[#059669]';
  return (
    <section className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-[#6B7280]">{label}</p>
          <p className="mt-2 truncate text-xl font-bold text-[#111827]">{value}</p>
        </div>
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${toneClass}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="mt-3 text-xs text-[#6B7280]">{detail}</p>
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
        <span key={index} className="flex-1 rounded-full bg-white/25" style={{ height }} />
      ))}
    </div>
  );
}

const DONUT_COLORS = ['#4F8CFF', '#1FD18B', '#FF5C75', '#8B9BB4'];

function Donut({ amounts }: { amounts: number[] }) {
  const total = amounts.reduce((sum, amount) => sum + amount, 0);
  if (total <= 0) {
    return (
      <div className="h-16 w-16 rounded-full border-2 border-white/30 bg-white/10 p-3">
        <div className="h-full w-full rounded-full bg-white" />
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
    <div
      className="h-16 w-16 rounded-full p-3"
      style={{ background: `conic-gradient(${parts.join(',')})` }}
    >
      <div className="h-full w-full rounded-full bg-white" />
    </div>
  );
}
