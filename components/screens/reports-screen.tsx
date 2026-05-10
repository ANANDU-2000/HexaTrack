'use client';

import { ArrowDownLeft, ArrowUpRight, Loader2, RefreshCw, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ApiError, hexaTrackApi } from '@/lib/api';
import type { ReportSummary } from '@/lib/types';
import { money, percent } from '@/lib/format';

type Period = 'week' | 'month' | 'year' | 'all';

function periodRange(period: Period): { from: string; to: string } {
  const to = new Date();
  const toStr = to.toISOString().slice(0, 10);
  if (period === 'all') {
    return { from: '2000-01-01', to: toStr };
  }
  const from = new Date(to);
  if (period === 'week') {
    from.setDate(from.getDate() - 6);
  } else if (period === 'month') {
    from.setDate(1);
  } else {
    from.setMonth(0, 1);
  }
  return { from: from.toISOString().slice(0, 10), to: toStr };
}

const emptyReport: ReportSummary = {
  income: 0,
  expense: 0,
  net: 0,
  cashflow: [],
  spendingByCategory: [],
};

const CATEGORY_BAR = ['bg-[#4F8CFF]', 'bg-[#1FD18B]', 'bg-[#FF5C75]', 'bg-[#8B9BB4]/80'] as const;

export function ReportsScreen() {
  const [period, setPeriod] = useState<Period>('month');
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { from, to } = useMemo(() => periodRange(period), [period]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await hexaTrackApi.reportSummary(from, to);
        if (!cancelled) setReport(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Unable to load reports.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [from, to]);

  const activeReport = report ?? emptyReport;
  const cashflowBars = activeReport.cashflow.slice(-12);
  const maxCashflow = Math.max(...cashflowBars.map((point) => Math.max(point.income, point.expense)), 1);
  const displayedCategories = activeReport.spendingByCategory.slice(0, 8);
  const maxSpend = Math.max(...displayedCategories.map((item) => item.amount), 1);

  const periodLabels: { key: Period; label: string }[] = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
    { key: 'all', label: 'All' },
  ];

  const insightLine =
    activeReport.spendingByCategory.length === 0
      ? 'No expense transactions in this period.'
      : `${activeReport.spendingByCategory[0].categoryName} is the largest expense category in this period.`;

  const handleRetry = () => {
    setError(null);
    setReport(null);
    setLoading(true);
    void hexaTrackApi
      .reportSummary(from, to)
      .then(setReport)
      .catch((err: unknown) => setError(err instanceof ApiError ? err.message : 'Unable to load reports.'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="eyebrow">Insights</p>
        <h1 className="text-2xl font-bold text-[#F5F7FA]">Reports</h1>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/[0.06] bg-[#121A22] p-1 shadow-[0_12px_30px_rgba(0,0,0,0.25)] sm:grid-cols-4">
        {periodLabels.map(({ key, label }) => (
          <button
            key={key}
            className={`rounded-xl py-2 text-xs font-semibold transition ${
              period === key ? 'bg-[#4F8CFF] text-white shadow-sm' : 'text-[#8B9BB4]'
            }`}
            onClick={() => setPeriod(key)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-3xl border border-[#FF5C75]/25 bg-[#FF5C75]/10 p-4 text-sm text-[#FF5C75]">
          <p>{error}</p>
          <button className="mt-3 inline-flex items-center gap-2 font-semibold text-[#F5F7FA]" onClick={handleRetry} type="button">
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      ) : null}

      {loading && !report ? (
        <div className="space-y-4">
          <div className="h-10 animate-pulse rounded-xl bg-white/10" />
          <div className="grid gap-3 sm:grid-cols-3">
            {[1, 2, 3].map((key) => (
              <div key={key} className="h-28 animate-pulse rounded-3xl bg-white/5" />
            ))}
          </div>
          <div className="h-56 animate-pulse rounded-3xl bg-white/5" />
        </div>
      ) : null}

      {report !== null ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Metric icon={TrendingUp} label="Net" value={money(activeReport.net)} />
            <Metric icon={ArrowDownLeft} label="Income" value={money(activeReport.income)} tone="success" />
            <Metric icon={ArrowUpRight} label="Expense" value={money(activeReport.expense)} tone="danger" />
          </div>

          <section className="card p-4">
            <h2 className="text-base font-semibold text-[#F5F7FA]">Cashflow trend</h2>
            <p className="mt-1 text-xs text-[#8B9BB4]">Income and expense by month (last {cashflowBars.length} periods)</p>
            {cashflowBars.length === 0 ? (
              <p className="mt-8 text-sm text-[#8B9BB4]">No cashflow data for this range.</p>
            ) : (
              <div className="mt-5 flex h-48 items-end gap-3 overflow-x-auto overflow-y-hidden pb-1">
                {cashflowBars.map((point) => (
                  <div key={point.period} className="flex min-w-[2.5rem] flex-1 flex-col items-center gap-2">
                    <div className="flex h-36 w-full items-end justify-center gap-1">
                      <div
                        className="w-4 rounded-t bg-[#1FD18B] transition-all"
                        style={{ height: `${Math.max((point.income / maxCashflow) * 100, 4)}%` }}
                      />
                      <div
                        className="w-4 rounded-t bg-[#FF5C75] transition-all"
                        style={{ height: `${Math.max((point.expense / maxCashflow) * 100, 4)}%` }}
                      />
                    </div>
                    <p className="truncate text-xs text-[#8B9BB4]">{new Date(point.period).toLocaleDateString('en-US', { month: 'short' })}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card p-4">
            <h2 className="text-base font-semibold text-[#F5F7FA]">Spending by category</h2>
            <div className="mt-4 space-y-4">
              {displayedCategories.map((item, index) => (
                <div key={item.categoryId}>
                  <div className="mb-2 flex justify-between gap-3 text-sm">
                    <span className="truncate font-medium text-[#F5F7FA]">{item.categoryName}</span>
                    <span className="shrink-0 text-[#8B9BB4]">
                      {money(item.amount)} {' · '} {percent((item.amount / maxSpend) * 100)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.08]">
                    <div
                      className={`${CATEGORY_BAR[index % CATEGORY_BAR.length]} h-2 rounded-full transition-all`}
                      style={{ width: `${Math.max((item.amount / maxSpend) * 100, 6)}%` }}
                    />
                  </div>
                </div>
              ))}
              {displayedCategories.length === 0 ? <p className="text-sm text-[#8B9BB4]">Add expenses to generate category reports.</p> : null}
            </div>
          </section>

          <section className="rounded-3xl border border-white/[0.06] bg-[#121A22] p-4">
            <div className="flex gap-3">
              <TrendingUp className="mt-1 h-5 w-5 shrink-0 text-[#4F8CFF]" />
              <p className="text-sm font-medium leading-6 text-[#8B9BB4]">{insightLine}</p>
            </div>
          </section>

          {loading && report ? (
            <div className="flex items-center gap-2 text-xs text-[#8B9BB4]">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Updating…
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function Metric({ icon: Icon, label, value, tone = 'default' }: { icon: React.ElementType; label: string; value: string; tone?: 'default' | 'success' | 'danger' }) {
  const toneClass =
    tone === 'success'
      ? 'bg-[#1FD18B]/15 text-[#1FD18B]'
      : tone === 'danger'
        ? 'bg-[#FF5C75]/15 text-[#FF5C75]'
        : 'bg-[#4F8CFF]/12 text-[#4F8CFF]';
  return (
    <section className="card p-4">
      <div className={`grid h-10 w-10 place-items-center rounded-2xl ${toneClass}`}>
        <Icon size={18} />
      </div>
      <p className="mt-3 text-xs text-[#8B9BB4]">{label}</p>
      <p className="mt-1 truncate text-xl font-bold text-[#F5F7FA]">{value}</p>
    </section>
  );
}
