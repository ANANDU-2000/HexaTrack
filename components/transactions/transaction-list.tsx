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
  
  // Highly-performant dynamic grouping algorithm for smooth lists
  const groups = useMemo(() => {
    const result: GroupedTransactions[] = [];
    const map: Record<string, Transaction[]> = {};

    transactions.forEach((tx) => {
      const key = tx.occurredOn.split('T')[0]; // standard YYYY-MM-DD key
      if (!map[key]) map[key] = [];
      map[key].push(tx);
    });

    // Sort descending keys and produce finalized groups
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
      <div className="border border-white/[0.05] bg-[#111827] rounded-3xl p-8 text-center flex flex-col items-center animate-in fade-in">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-[#9CA3AF] mb-4">
          <Receipt size={20} />
        </div>
        <p className="text-sm font-bold text-[#F9FAFB]">No Ledger Records Found</p>
        <p className="text-xs text-[#9CA3AF] mt-1">Your transaction history will manifest here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {groups.map((group) => (
        <div key={group.dateKey} className="relative">
          {/* Sticky Date Header (Google Pay Style) */}
          <div className="sticky top-0 z-10 py-3 bg-[#0B1015]/80 backdrop-blur-md mb-3 flex items-center">
            <span className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.15em] pr-4 relative bg-[#0B1015] z-20">
              {group.dateLabel}
            </span>
            <div className="absolute left-0 right-0 top-1/2 h-px bg-white/[0.04] z-10" />
          </div>

          {/* Notion-style minimalist list stack */}
          <div className="space-y-0.5 border border-white/[0.05] bg-[#111827] rounded-[24px] overflow-hidden shadow-sm">
            {group.items.map((transaction, index) => {
              const category = categories.find((item) => item.id === transaction.categoryId);
              const income = transaction.type === 'Income';
              const isLast = index === group.items.length - 1;
              
              return (
                <button
                  key={transaction.id}
                  type="button"
                  className={`w-full group text-left flex items-center gap-4 px-4 py-4 transition-all hover:bg-white/[0.02] active:bg-white/[0.04] relative ${
                    !isLast ? 'border-b border-white/[0.03]' : ''
                  }`}
                >
                  {/* Premium minimalist icon container */}
                  <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-105 ${
                    income ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#EF4444]/10 text-[#EF4444]'
                  }`}>
                    {income ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>

                  <div className="min-w-0 flex-1 py-0.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-semibold text-[#F9FAFB] tracking-tight group-hover:text-[#4F8CFF] transition-colors">
                          {transaction.merchant || category?.name || 'Transaction'}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {category && (
                            <span className="inline-flex items-center text-[11px] font-medium px-1.5 py-0.5 bg-white/[0.04] text-[#9CA3AF] rounded-md">
                              {category.name}
                            </span>
                          )}
                          {transaction.note && (
                            <span className="truncate text-[11px] text-[#9CA3AF]/70 italic">
                              “{transaction.note}”
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end shrink-0 gap-0.5">
                        <p className={`text-[15px] font-bold tabular-nums tracking-tight ${income ? 'text-[#22C55E]' : 'text-[#F9FAFB]'}`}>
                          {income ? '+' : ''}
                          {money(transaction.amount, transaction.currency)}
                        </p>
                        <span className="text-[10px] font-medium text-[#9CA3AF]/60 uppercase tracking-wider">
                           {new Date(transaction.occurredOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Subtle hover chevron */}
                  <div className="text-[#9CA3AF]/30 opacity-0 group-hover:opacity-100 transition-all -mr-1">
                     <ChevronRight size={16} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
