'use client';

import { Loader2, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ApiError, hexaTrackApi } from '@/lib/api';
import type { Transaction, TransactionType } from '@/lib/types';
import { TransactionList } from '@/components/transactions/transaction-list';
import { useFinanceStore } from '@/store/finance-store';
import { money } from '@/lib/format';

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


  const report = useFinanceStore((state) => state.report);

  const filters: TypeFilter[] = ['All', 'Income', 'Expense', 'Transfers'];

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      
      {/* Header Banner Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1">
          <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-[#F5F7FA]">Financial Pulse</h1>
          <p className="text-body-lg text-on-surface-variant mt-2 opacity-70">Intelligent mapping and audit trail for digital ledger flow.</p>
        </div>
        <div className="glass-card p-6 rounded-3xl flex flex-col gap-1 min-w-[260px] relative overflow-hidden border border-primary/10">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 blur-2xl rounded-full" />
          <span className="font-label-mono text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-80 relative z-10">Gross Outflow (Period)</span>
          <div className="flex items-baseline gap-1 mt-1 relative z-10">
             <span className="font-display-lg text-2xl md:text-3xl text-primary font-bold">{money(report.expense).split('.')[0]}</span>
             <span className="font-label-mono text-xs font-bold text-secondary opacity-80">.{money(report.expense).split('.')[1] || '00'}</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-4">
        
        {/* Column 1: Central Ledger & Filters */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Search & Filter Inline Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
             <div className="relative w-full sm:flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60" />
                <input 
                  type="text"
                  className="w-full bg-surface-container-low border border-white/5 focus:border-primary/30 px-11 py-3.5 rounded-2xl text-sm font-medium text-[#F5F7FA] outline-none transition-all placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/10"
                  placeholder="Query merchant or audit trail..."
                  onChange={(e) => setQueryInput(e.target.value)}
                  value={queryInput}
                />
                {loading && items.length > 0 && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-primary opacity-70" />}
             </div>
             <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full sm:w-auto">
                {filters.map(f => (
                  <button 
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-5 py-2.5 rounded-full font-bold text-[11px] font-label-mono tracking-widest whitespace-nowrap active:scale-95 transition-all duration-200 ${
                      activeFilter === f ? 'bg-secondary-container text-on-secondary-container shadow-sm' : 'glass-card hover:bg-white/5 opacity-80'
                    }`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
             </div>
          </div>

          {/* Result Container */}
          <div className="mt-4">
            {error && (
              <div className="glass-card rounded-2xl border-error/30 p-5 flex items-center justify-between mb-6 bg-error/5">
                 <p className="text-sm font-medium text-[#F5F7FA]">{error}</p>
                 <button onClick={handleRetry} className="text-xs font-bold underline text-[#F5F7FA]">Reload</button>
              </div>
            )}

            {loading && items.length === 0 && !error && (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-20 rounded-2xl glass-card animate-pulse bg-white/[0.02]" />)}
              </div>
            )}

            {!loading && items.length === 0 && !error && (
               <div className="glass-card rounded-3xl p-16 text-center">
                  <p className="font-bold text-[#F5F7FA] text-lg">Query yield empty.</p>
                  <p className="text-sm text-on-surface-variant mt-1">Refine filters or keyword constraints.</p>
               </div>
            )}

            {items.length > 0 && (
               <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <TransactionList categories={categories} transactions={items} />
                  {hasMore && (
                     <button 
                       onClick={handleLoadMore}
                       disabled={loading}
                       className="w-full mt-8 py-4 rounded-2xl glass-card text-body-sm font-bold text-primary hover:bg-primary/5 transition-all duration-200 disabled:opacity-50 border border-primary/10 flex items-center justify-center gap-2"
                     >
                       {loading ? <Loader2 className="animate-spin" size={16} /> : 'SYNC REMAINING LEDGER'}
                     </button>
                  )}
               </div>
            )}
          </div>
        </div>

        {/* Column 2: Sidebar Utilities (Spending Velocity / Upcoming) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           
           {/* Spending Velocity Visual */}
           <div className="glass-card rounded-3xl overflow-hidden flex flex-col shadow-lg relative">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-background to-transparent opacity-90 z-10 pointer-events-none" />
             <div className="p-6 z-20 relative">
               <h3 className="font-label-mono text-[10px] font-bold uppercase tracking-widest text-secondary">Burn Velocity</h3>
             </div>
             
             {/* Dynamic Line Art placeholder visualization mimicking the design requirement */}
             <div className="h-40 w-full relative z-0 bg-primary-container/20">
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-40 scale-105 overflow-visible" preserveAspectRatio="none">
                   <path d="M0,100 C20,80 40,90 60,40 S80,20 100,10 L100,100 Z" fill="url(#velocityGrad)" />
                   <path d="M0,100 C20,80 40,90 60,40 S80,20 100,10" stroke="#c1c1fc" strokeWidth="1.5" fill="none" />
                   <defs>
                     <linearGradient id="velocityGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#c1c1fc" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#c1c1fc" stopOpacity="0" />
                     </linearGradient>
                   </defs>
                </svg>
             </div>

             <div className="p-6 pt-0 z-20 relative -mt-8">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-body-sm font-medium text-on-surface">Average Cadence</span>
                   <span className="font-label-mono font-bold text-primary">$320.50</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-primary h-full w-[65%] rounded-full shadow-glow-sm shadow-primary/40" />
                </div>
             </div>
           </div>

           {/* Smart Tip or Activity Alerts container matching existing dashboard consistency */}
           <div className="glass-card p-6 rounded-3xl relative overflow-hidden border border-white/5">
             <h3 className="font-label-mono text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-6">Audit Controls</h3>
             <div className="space-y-3">
                <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-body-sm font-bold text-[#F5F7FA] border border-white/[0.03]">
                  Generate PDF Statement
                </button>
                <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-body-sm font-bold text-[#F5F7FA] border border-white/[0.03]">
                  Export TSV Audit Log
                </button>
             </div>
           </div>

        </div>
      </div>
    </div>
  );
}

