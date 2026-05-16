'use client';

import { Loader2, Search, Filter, TrendingUp, FileSpreadsheet, Download } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ApiError, hexaTrackApi } from '@/lib/api';
import type { Transaction, TransactionType } from '@/lib/types';
import { TransactionList } from '@/components/transactions/transaction-list';
import { useFinanceStore } from '@/store/finance-store';
import { money } from '@/lib/format';
import { motion } from 'framer-motion';

type TypeFilter = 'All' | 'Income' | 'Expense';

const PAGE_SIZE = 30;

function mapFilterToSearch(filter: TypeFilter): { type?: TransactionType } {
  if (filter === 'Income') return { type: 'Income' };
  if (filter === 'Expense') return { type: 'Expense' };
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
          err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Unable to load ledger records.';
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

  const report = useFinanceStore((state) => state.report);
  const filters: TypeFilter[] = ['All', 'Income', 'Expense'];

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-5 pt-4 select-none font-sans">
      
      {/* Clean Header */}
      <div className="flex flex-col gap-4">
         <div className="px-1">
            <div className="flex items-center gap-2 mb-1">
               <span className="text-[9px] font-black text-emerald tracking-[0.2em] uppercase font-label-caps block leading-none">Ledger Activity</span>
               <span className="w-1 h-1 rounded-full bg-emerald shadow-[0_0_4px_#10B981]" />
            </div>
            <h2 className="text-xl font-extrabold text-on-surface tracking-tight">Transaction Records</h2>
         </div>

         {/* Expense Highlight Capsule */}
         <div className="bg-[#0E152B] border border-outline-variant/20 rounded-xl p-4 flex justify-between items-center shadow-sm">
            <div className="flex flex-col gap-0.5">
               <span className="text-[9px] font-bold uppercase font-label-caps text-on-surface-variant/60 tracking-wider">Interval Expenditures</span>
               <span className="text-xl font-extrabold text-on-surface tracking-tight">{money(report.expense)}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#1D1F27] border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:text-emerald transition-colors active:scale-95">
               <Download size={15} />
            </div>
         </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 px-0.5">
         <div className="relative w-full">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input 
               type="text"
               value={queryInput}
               onChange={(e) => setQueryInput(e.target.value)}
               placeholder="Search vendor, notes, or tags..."
               className="w-full h-11 bg-[#0E152B] border border-outline-variant/20 focus:border-emerald/30 rounded-xl pl-10 pr-10 text-xs font-bold text-on-surface placeholder:text-on-surface-variant/40 outline-none shadow-sm"
            />
            {loading && items.length > 0 && <Loader2 size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-emerald/80" />}
         </div>

         <div className="flex gap-1.5 p-0.5 bg-[#1D1F27] border border-outline-variant/10 rounded-xl w-fit shadow-sm self-start overflow-x-auto hide-scrollbar">
            {filters.map((f) => (
               <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 rounded-lg font-bold text-[9px] font-label-caps tracking-wider uppercase whitespace-nowrap transition-all active:scale-[0.97] ${
                     activeFilter === f
                       ? 'bg-[#0E152B] text-emerald shadow-sm border border-outline-variant/20'
                       : 'text-on-surface-variant/60 hover:text-on-surface'
                  }`}
               >
                  {f}
               </button>
            ))}
         </div>
      </div>

      {/* Main ledger feed */}
      <div className="flex flex-col">
         {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-xl p-4 flex items-center justify-between mb-4">
               <span className="text-[11px] font-bold text-on-surface leading-tight">{error}</span>
               <button onClick={handleRetry} className="text-[9px] font-black font-label-caps text-emerald uppercase tracking-widest underline ml-3 shrink-0">Retry</button>
            </div>
         )}

         {loading && items.length === 0 && !error && (
            <div className="flex flex-col gap-2">
               {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-[#0E152B]/40 border border-outline-variant/10 rounded-xl animate-pulse" />
               ))}
            </div>
         )}

         {!loading && items.length === 0 && !error && (
            <div className="bg-[#0E152B] border border-outline-variant/20 rounded-xl py-12 text-center shadow-sm">
               <p className="text-xs font-bold text-on-surface-variant/70 tracking-wide">No operational matches found.</p>
               <p className="text-[9px] font-label-caps uppercase text-on-surface-variant/50 tracking-wider mt-1">Refine your query tags</p>
            </div>
         )}

         {items.length > 0 && (
            <div className="flex flex-col border border-outline-variant/20 rounded-xl overflow-hidden bg-[#0E152B] shadow-sm">
               <TransactionList categories={categories} transactions={items} />
            </div>
         )}

         {items.length > 0 && hasMore && (
            <button
               onClick={handleLoadMore}
               disabled={loading}
               className="w-full h-11 mt-4 bg-[#0E152B] border border-outline-variant/20 rounded-xl text-[9px] font-black uppercase tracking-wider font-label-caps text-on-surface-variant/80 flex items-center justify-center gap-2 shadow-sm hover:text-emerald active:scale-[0.98] transition-all"
            >
               {loading ? <Loader2 className="animate-spin" size={12} /> : 'Fetch Sequential Logs'}
            </button>
         )}
      </div>

      {/* Simple Average Indicator footer */}
      <div className="bg-[#0E152B] border border-outline-variant/20 rounded-xl p-4 flex items-center gap-4 shadow-sm shrink-0">
         <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center text-teal shrink-0 border border-teal/20">
            <TrendingUp size={14} />
         </div>
         <div className="flex-grow flex flex-col">
            <span className="text-[9px] font-bold font-label-caps text-on-surface-variant/60 uppercase tracking-wider">Ledger Cadence</span>
            <span className="text-xs font-bold text-on-surface">Average cycle spending resides optimal at $420.00</span>
         </div>
      </div>

    </div>
  );
}
