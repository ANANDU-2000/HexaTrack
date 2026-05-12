'use client';

import { ArrowDownLeft, ArrowUpRight, ChevronRight } from 'lucide-react';
import { money, shortDate } from '@/lib/format';
import { useFinanceStore } from '@/store/finance-store';

export function DashboardTransactions() {
  const transactions = useFinanceStore((state) => state.transactions);
  const categories = useFinanceStore((state) => state.categories);
  const accounts = useFinanceStore((state) => state.accounts);

  const recent = transactions.slice(0, 3); // Smaller count for better layout nesting

  return (
    <section className="glass-card rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline-md text-headline-md text-[#F5F7FA]">Recent Activity</h3>
        <button className="text-secondary text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-1">
          History <ChevronRight size={14} />
        </button>
      </div>

      <div className="space-y-1">
        {recent.map((transaction) => {
          const isIncome = transaction.type === 'Income';
          const category = categories.find(c => c.id === transaction.categoryId);
          
          return (
            <div 
              key={transaction.id}
              className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 ${
                  isIncome ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  {isIncome ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div className="min-w-0">
                  <p className="text-body-sm font-bold text-[#F9FAFB] truncate max-w-[120px] md:max-w-full">
                    {transaction.merchant || category?.name || 'External Party'}
                  </p>
                  <p className="text-[11px] text-on-surface-variant opacity-70 font-medium">
                    {category?.name || 'General'} • {shortDate(transaction.occurredOn)}
                  </p>
                </div>
              </div>

              <p className={`font-label-mono text-sm font-bold shrink-0 ${isIncome ? 'text-secondary' : 'text-[#F9FAFB]'}`}>
                {isIncome ? '+' : '-'}{money(transaction.amount)}
              </p>
            </div>
          );
        })}

        {recent.length === 0 && (
          <div className="py-6 text-center text-on-surface-variant opacity-50 text-xs font-medium font-label-mono">
            NO RECENT LOGS
          </div>
        )}
      </div>
    </section>
  );
}

