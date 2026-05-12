import { ArrowDownLeft, ArrowUpRight, ChevronRight, MoreVertical, Receipt } from 'lucide-react';
import { money, shortDate } from '@/lib/format';
import type { Category, Transaction } from '@/lib/types';
import { useMemo } from 'react';

type GroupedTransactions = {
  dateLabel: string;
  dateKey: string;
  items: Transaction[];
};

function formatDateKey(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  
  return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function TransactionList({ categories, transactions }: { categories: Category[]; transactions: Transaction[] }) {
  
  const groups = useMemo(() => {
    const result: GroupedTransactions[] = [];
    const map: Record<string, Transaction[]> = {};

    transactions.forEach((tx) => {
      const key = tx.occurredOn.split('T')[0];
      if (!map[key]) map[key] = [];
      map[key].push(tx);
    });

    Object.keys(map)
      .sort((a, b) => b.localeCompare(a))
      .forEach((key) => {
        result.push({
          dateKey: key,
          dateLabel: formatDateKey(key),
          items: map[key]
        });
      });

    return result;
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center flex flex-col items-center animate-in fade-in">
        <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant mb-4 opacity-50">
          <Receipt size={24} />
        </div>
        <p className="font-headline-md text-[#F5F7FA] font-bold">Zero activity traces</p>
        <p className="text-body-sm text-on-surface-variant mt-1 max-w-xs mx-auto">Log your financial engagements to build the timeline.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {groups.map((group) => (
        <div key={group.dateKey} className="space-y-4">
          {/* Premium Sticky Line Header */}
          <div className="flex items-center justify-between gap-4">
             <span className="text-label-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest shrink-0 opacity-80">
                {group.dateLabel}
             </span>
             <div className="h-px w-full bg-white/[0.05]" />
          </div>

          {/* Glass Ledger Grouping */}
          <div className="space-y-3">
            {group.items.map((transaction) => {
              const category = categories.find((item) => item.id === transaction.categoryId);
              const income = transaction.type === 'Income';
              
              return (
                <div
                  key={transaction.id}
                  className="group relative glass-card p-4 rounded-2xl flex items-center justify-between hover:border-primary/30 transition-all cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/[0.02] shadow-sm transition-transform group-hover:scale-105 ${
                      income 
                        ? 'bg-secondary/10 text-secondary' 
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      {income ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>

                    <div className="min-w-0">
                       <h4 className="font-bold text-body-sm text-[#F5F7FA] truncate">
                          {transaction.merchant || category?.name || 'General Transaction'}
                       </h4>
                       <p className="text-[11px] text-on-surface-variant opacity-70 mt-0.5 flex items-center gap-1.5 font-medium">
                          {category?.name || 'Uncategorized'} 
                          <span className="w-1 h-1 rounded-full bg-white/20" />
                          {new Date(transaction.occurredOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                       </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                     <p className={`font-label-mono font-bold text-base ${income ? 'text-secondary' : 'text-[#F5F7FA]'}`}>
                        {income ? '+' : '-'}{money(transaction.amount, transaction.currency)}
                     </p>
                     <div className="flex justify-end items-center gap-1 mt-1 opacity-80">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/40" />
                        <span className="text-[9px] font-bold text-on-surface-variant tracking-widest uppercase">Settled</span>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

