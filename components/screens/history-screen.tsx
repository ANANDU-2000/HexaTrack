'use client';

import { Loader2, RefreshCw, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ApiError, hexaTrackApi } from '@/lib/api';
import type { Transaction, TransactionType } from '@/lib/types';
import { TransactionList } from '@/components/transactions/transaction-list';
import { useFinanceStore } from '@/store/finance-store';

type TypeFilter = 'All' | 'Income' | 'Expense' | 'Transfers';

const PAGE_SIZE = 30;

function mapFilterToSearch(filter: TypeFilter): { type?: TransactionType; transfersOnly?: boolean } {
  if (filter === 'Income') return { type: 'Income' };
  if (filter === 'Expense') return { type: 'Expense' };
  if (filter === 'Transfers') return { transfersOnly: true };
  return {};
}

export function HistoryScreen() {
  const categories = useFinanceStore((state) => state.categories);
  const [queryInput, setQueryInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<TypeFilter>('All');
  const [page, setPage] = useState(1);
  const [refetchKey, setRefetchKey] = useState(0);
  const [items, setItems] = useState<Transaction[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(queryInput.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [queryInput]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, activeFilter]);

  const typeParams = useMemo(() => mapFilterToSearch(activeFilter), [activeFilter]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const result = await hexaTrackApi.transactions.search({
          query: debouncedQuery || undefined,
          page,
          pageSize: PAGE_SIZE,
          ...typeParams,
        });
        if (cancelled) return;
        setTotalCount(result.totalCount);
        setItems((prev) => {
          if (page === 1) return [...result.items];
          const seen = new Set(prev.map((x) => x.id));
          const next = [...prev];
          for (const tx of result.items) {
            if (!seen.has(tx.id)) next.push(tx);
          }
          return next;
        });
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Unable to load transactions.';
        setError(message);
        if (page === 1) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, activeFilter, page, typeParams, refetchKey]);

  const hasMore = items.length < totalCount;

  const handleRetry = () => {
    setError(null);
    setPage(1);
    setRefetchKey((k) => k + 1);
  };

  const handleLoadMore = () => {
    if (!hasMore || loading) return;
    setPage((p) => p + 1);
  };

  const filters: TypeFilter[] = ['All', 'Income', 'Expense', 'Transfers'];

  return (
    <div className="space-y-5">
      <div>
        <p className="eyebrow">Ledger</p>
        <h1 className="text-2xl font-bold text-[#111827]">History timeline</h1>
      </div>

      <label className="flex h-12 items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
        <Search size={18} className="text-[#6B7280]" />
        <input
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#111827] outline-none placeholder:text-[#9CA3AF]"
          onChange={(event) => setQueryInput(event.target.value)}
          placeholder="Search merchant, notes"
          value={queryInput}
          autoComplete="off"
        />
        {loading && items.length > 0 ? <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#6B7280]" aria-hidden /> : null}
      </label>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`rounded-full px-3 py-2 text-xs font-medium transition active:scale-95 ${
              activeFilter === filter ? 'bg-[#10B981] text-white shadow-lg shadow-emerald-500/20' : 'border border-[#E5E7EB] bg-white text-[#6B7280]'
            }`}
            onClick={() => setActiveFilter(filter)}
            type="button"
          >
            {filter}
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

      {loading && items.length === 0 && !error ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((key) => (
            <div key={key} className="h-16 animate-pulse rounded-2xl bg-[#E5E7EB]" />
          ))}
        </div>
      ) : null}

      {!loading && !error && items.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-12 text-center">
          <p className="text-sm font-medium text-[#111827]">No transactions match</p>
          <p className="mt-2 text-sm text-[#6B7280]">Try another search or filter.</p>
        </div>
      ) : null}

      {items.length > 0 ? (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase text-[#6B7280]">Results ({totalCount})</h2>
          <TransactionList categories={categories} transactions={items} />
          {hasMore ? (
            <button
              className="mt-5 w-full rounded-[18px] border border-[#E5E7EB] bg-white py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#F8FAFC] disabled:opacity-50"
              disabled={loading}
              onClick={handleLoadMore}
              type="button"
            >
              {loading ? 'Loading…' : 'Load more'}
            </button>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
