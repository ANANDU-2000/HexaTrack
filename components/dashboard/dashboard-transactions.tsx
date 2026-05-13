'use client';

import { ArrowDownLeft, ArrowUpRight, ChevronRight } from 'lucide-react';
import { money, shortDate } from '@/lib/format';
import { useFinanceStore } from '@/store/finance-store';

export function DashboardTransactions() {
  const transactions = useFinanceStore((state) => state.transactions);
  const categories = useFinanceStore((state) => state.categories);

  const recent = transactions.slice(0, 3); 

  return (
    <section className="glass-card rounded-[28px] p-6 md:p-7">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-headline text-lg font-bold text-on-surface tracking-tight">Activity Ledger</h3>
        <button className="text-cyan text-[10px] font-black uppercase tracking-widest hover:text-cyan/80 flex items-center gap-1 font-label-caps transition-colors">
          Full Feed <ChevronRight size={14} strokeWidth={2.5} />
        </button>
      </div>

      <div className="divide-y divide-white/[0.05]">
        {recent.map((transaction) => {
          const isIncome = transaction.type === 'Income';
          const category = categories.find(c => c.id === transaction.categoryId);
          
          return (
            <div 
              key={transaction.id}
              className="flex items-center justify-between py-3.5 hover:bg-white/[0.02] px-1 rounded-xl transition-colors cursor-pointer group first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 ${
                  isIncome 
                    ? 'bg-emerald/10 text-emerald border border-emerald/10' 
                    : 'bg-[#111827] text-on-surface-variant border border-white/[0.03]'
                }`}>
                  {isIncome ? <ArrowDownLeft size={18} strokeWidth={2.5} /> : <ArrowUpRight size={18} strokeWidth={2.5} />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-on-surface truncate max-w-[140px] sm:max-w-none font-sans tracking-wide">
                    {transaction.merchant || category?.name || 'External Ledger'}
                  </p>
                  <p className="text-[11px] text-on-surface-variant opacity-70 font-medium tracking-wider uppercase font-label-caps mt-0.5">
                    {category?.name || 'Routing'} • {shortDate(transaction.occurredOn)}
                  </p>
                </div>
              </div>

              <p className={`font-mono-data text-sm font-bold shrink-0 tracking-tight ${isIncome ? 'text-emerald' : 'text-on-surface'}`}>
                {isIncome ? '+' : '-'}{money(transaction.amount)}
              </p>
            </div>
          );
        })}

        {recent.length === 0 && (
          <div className="py-8 text-center text-on-surface-variant opacity-50 text-[10px] font-black uppercase tracking-[0.2em] font-label-caps">
            NO ENTRY FOUND
          </div>
        )}
      </div>
    </section>
  );
}


