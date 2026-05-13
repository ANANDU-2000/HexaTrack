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
    <div className="space-y-10 pb-28 lg:pb-10 px-container-margin lg:px-gutter pt-6 font-sans animate-in fade-in duration-500">
      
      {/* Header Outflow Overview */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
           <div className="flex items-center gap-2 mb-2">
              <p className="font-label-caps text-[11px] text-cyan tracking-widest uppercase font-black">Ledger Audit</p>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse shadow-[0_0_8px_#06B6D4]" />
           </div>
           <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">Historical Activity</h1>
        </div>
        <div className="glass-card p-5.5 rounded-[28px] flex flex-col gap-1 min-w-[240px] relative overflow-hidden border border-white/[0.05]">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan/10 blur-2xl rounded-full pointer-events-none" />
          <span className="font-label-caps text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-80 relative z-10">Net Outflows (P)</span>
          <div className="flex items-baseline gap-1 mt-1 relative z-10">
             <span className="font-headline text-display-balance text-2xl md:text-3xl text-on-surface font-extrabold tracking-tight">{money(report.expense).split('.')[0]}</span>
             <span className="font-mono-data text-sm font-bold text-cyan opacity-90">.{money(report.expense).split('.')[1] || '00'}</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-stack-lg mt-4">
        
        {/* Column 1: Feed Stream */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Control Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
             <div className="relative w-full sm:flex-1">
                <Search size={18} className="absolute left-4.5 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60" />
                <input 
                  type="text"
                  className="w-full bg-[#111827] border border-white/[0.05] focus:border-cyan/30 px-12 py-4 rounded-[20px] text-[13px] font-semibold text-on-surface outline-none transition-all placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-cyan/20 shadow-inner font-sans tracking-wide"
                  placeholder="Scan audit keys or nodes..."
                  onChange={(e) => setQueryInput(e.target.value)}
                  value={queryInput}
                />
                {loading && items.length > 0 && <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-cyan opacity-80" />}
             </div>
             <div className="flex items-center gap-1.5 p-1.5 bg-[#111827] border border-white/[0.04] rounded-[20px] overflow-x-auto hide-scrollbar w-full sm:w-auto shrink-0">
                {filters.map(f => (
                  <button 
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-4.5 py-2.5 rounded-xl font-black text-[9px] font-label-caps tracking-widest whitespace-nowrap active:scale-95 transition-all ${
                      activeFilter === f 
                        ? 'bg-white/5 text-cyan shadow-[0_0_10px_rgba(6,182,212,0.2)] border border-white/[0.03]' 
                        : 'text-on-surface-variant opacity-60 hover:opacity-100'
                    }`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
             </div>
          </div>

          {/* Feed Output */}
          <div className="mt-4">
            {error && (
              <div className="glass-card rounded-[28px] border-danger/30 p-5 flex items-center justify-between mb-6 bg-danger/5">
                 <p className="text-sm font-medium text-on-surface font-sans">{error}</p>
                 <button onClick={handleRetry} className="text-xs font-bold underline text-on-surface uppercase font-label-caps tracking-widest">Re-Sync</button>
              </div>
            )}

            {loading && items.length === 0 && !error && (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-20 rounded-[28px] glass-card animate-pulse bg-[#111827]/40 border border-white/[0.02]" />)}
              </div>
            )}

            {!loading && items.length === 0 && !error && (
               <div className="glass-card rounded-[28px] p-16 text-center border border-white/[0.04]">
                  <p className="font-bold text-on-surface text-lg font-sans">Query yields no data.</p>
                  <p className="text-[11px] font-label-caps text-on-surface-variant tracking-wider mt-1.5 uppercase opacity-60">Adjust scan parameters</p>
               </div>
            )}

            {items.length > 0 && (
               <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <TransactionList categories={categories} transactions={items} />
                  {hasMore && (
                     <button 
                       onClick={handleLoadMore}
                       disabled={loading}
                       className="w-full mt-8 py-4.5 rounded-[28px] bg-[#111827]/80 hover:bg-white/5 border border-white/[0.05] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest text-cyan font-label-caps shadow-md active:scale-[0.99]"
                     >
                       {loading ? <Loader2 className="animate-spin" size={16} /> : 'Download Sequential Pages'}
                     </button>
                  )}
               </div>
            )}
          </div>
        </div>

        {/* Column 2: Side Analytics */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-stack-lg">
           
           {/* Velocity Card */}
           <div className="glass-card rounded-[28px] overflow-hidden flex flex-col border border-white/[0.05] shadow-lg relative">
             <div className="absolute inset-0 bg-gradient-to-t from-[#0b1020] to-transparent opacity-80 z-10 pointer-events-none" />
             
             <div className="p-6 z-20 relative">
                <div className="flex items-center gap-2">
                   <h3 className="font-label-caps text-[10px] font-black uppercase tracking-widest text-cyan">Spending Rate</h3>
                   <div className="w-1.5 h-1.5 bg-cyan animate-ping rounded-full opacity-70" />
                </div>
             </div>
             
             <div className="h-36 w-full relative z-0 bg-cyan/5 border-b border-white/[0.03]">
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-30 overflow-visible" preserveAspectRatio="none">
                   <path d="M0,100 C20,80 40,90 60,45 S80,25 100,12 L100,100 Z" fill="url(#cyanVelocityGrad)" />
                   <path d="M0,100 C20,80 40,90 60,45 S80,25 100,12" stroke="#06B6D4" strokeWidth="2" fill="none" />
                   <defs>
                     <linearGradient id="cyanVelocityGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
                     </linearGradient>
                   </defs>
                </svg>
             </div>

             <div className="p-6 pt-0 z-20 relative -mt-6">
                <div className="flex justify-between items-center mb-3">
                   <span className="text-[11px] font-semibold uppercase font-label-caps text-on-surface-variant tracking-wider">Avg Cadence</span>
                   <span className="font-mono-data font-extrabold text-cyan text-sm">$320.50</span>
                </div>
                <div className="w-full bg-[#111827] h-2 rounded-full overflow-hidden border border-white/[0.03]">
                   <div className="bg-cyan h-full w-[65%] rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                </div>
             </div>
           </div>

           {/* Statement Actions */}
           <div className="glass-card p-6 md:p-7 rounded-[28px] relative overflow-hidden border border-white/[0.05]">
             <h3 className="font-label-caps text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-6">Administrative Controls</h3>
             <div className="space-y-3">
                <button className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all text-[11px] font-black uppercase tracking-widest text-on-surface border border-white/[0.04] font-label-caps">
                  Generate PDF Vault
                </button>
                <button className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all text-[11px] font-black uppercase tracking-widest text-on-surface border border-white/[0.04] font-label-caps">
                  Extract CSV Schema
                </button>
             </div>
           </div>

        </div>
      </div>
    </div>
  );
}


