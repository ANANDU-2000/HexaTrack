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
        <h1 className="text-2xl font-bold text-[#111827]">Reports</h1>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[#E5E7EB] bg-white p-1 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:grid-cols-4">
        {periodLabels.map(({ key, label }) => (
          <button
            key={key}
            className={`rounded-xl py-2 text-xs font-semibold transition ${period === key ? 'bg-[#10B981] text-white shadow-sm' : 'text-[#6B7280]'}`}
            onClick={() => setPeriod(key)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-800">
          <p>{error}</p>
          <button className="mt-3 inline-flex items-center gap-2 font-semibold text-red-900" onClick={handleRetry} type="button">
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      ) : null}

      {loading && !report ? (
        <div className="space-y-4">
          <div className="h-10 animate-pulse rounded-xl bg-[#E5E7EB]" />
          <div className="grid gap-3 sm:grid-cols-3">
            {[1, 2, 3].map((key) => (
              <div key={key} className="h-28 animate-pulse rounded-2xl bg-[#F3F4F6]" />
            ))}
          </div>
          <div className="h-56 animate-pulse rounded-2xl bg-[#F3F4F6]" />
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
            <h2 className="text-base font-semibold text-[#111827]">Cashflow trend</h2>
            <p className="mt-1 text-xs text-[#6B7280]">Income and expense by month (last {cashflowBars.length} periods)</p>
            {cashflowBars.length === 0 ? (
              <p className="mt-8 text-sm text-[#6B7280]">No cashflow data for this range.</p>
            ) : (
              <div className="mt-5 flex h-48 items-end gap-3 overflow-hidden">
                {cashflowBars.map((point) => (
                  <div key={point.period} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                    <div className="flex h-36 w-full items-end justify-center gap-1">
                      <div className="w-4 rounded-t bg-[#10B981] transition-all" style={{ height: `${Math.max((point.income / maxCashflow) * 100, 4)}%` }} />
                      <div className="w-4 rounded-t bg-[#EF4444] transition-all" style={{ height: `${Math.max((point.expense / maxCashflow) * 100, 4)}%` }} />
                    </div>
                    <p className="truncate text-xs text-[#6B7280]">{new Date(point.period).toLocaleDateString('en-US', { month: 'short' })}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card p-4">
            <h2 className="text-base font-semibold text-[#111827]">Spending by category</h2>
            <div className="mt-4 space-y-4">
              {displayedCategories.map((item, index) => (
                <div key={item.categoryId}>
                  <div className="mb-2 flex justify-between gap-3 text-sm">
                    <span className="truncate font-medium text-[#111827]">{item.categoryName}</span>
                    <span className="shrink-0 text-[#6B7280]">
                      {money(item.amount)} {' · '} {percent((item.amount / maxSpend) * 100)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#E5E7EB]">
                    <div className={['bg-[#10B981]', 'bg-[#059669]', 'bg-amber-400', 'bg-sky-400'][index % 4] + ' h-2 rounded-full transition-all'} style={{ width: `${Math.max((item.amount / maxSpend) * 100, 6)}%` }} />
                  </div>
                </div>
              ))}
              {displayedCategories.length === 0 ? <p className="text-sm text-[#6B7280]">Add expenses to generate category reports.</p> : null}
            </div>
          </section>

          <section className="rounded-2xl border border-[#D1FAE5] bg-[#ECFDF5] p-4">
            <div className="flex gap-3">
              <TrendingUp className="mt-1 h-5 w-5 shrink-0 text-[#059669]" />
              <p className="text-sm font-medium leading-6 text-[#6B7280]">{insightLine}</p>
            </div>
          </section>

          {loading && report ? (
            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
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
  const toneClass = tone === 'success' ? 'bg-[#D1FAE5] text-[#059669]' : tone === 'danger' ? 'bg-red-50 text-red-600' : 'bg-[#ECFDF5] text-[#059669]';
  return (
    <section className="card p-4">
      <div className={`grid h-10 w-10 place-items-center rounded-2xl ${toneClass}`}>
        <Icon size={18} />
      </div>
      <p className="mt-3 text-xs text-[#6B7280]">{label}</p>
      <p className="mt-1 truncate text-xl font-bold text-[#111827]">{value}</p>
    </section>
  );
}
