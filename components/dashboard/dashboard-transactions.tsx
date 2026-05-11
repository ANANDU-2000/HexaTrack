'use client';

import { ArrowDownLeft, ArrowUpRight, ChevronRight } from 'lucide-react';
import { money, shortDate } from '@/lib/format';
import { useFinanceStore } from '@/store/finance-store';

export function DashboardTransactions() {
  const transactions = useFinanceStore((state) => state.transactions);
  const categories = useFinanceStore((state) => state.categories);
  const accounts = useFinanceStore((state) => state.accounts);

  const recent = transactions.slice(0, 5);

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-base font-bold text-[#F9FAFB]">Recent Transactions</h3>
        <button className="text-xs font-semibold text-[#4F8CFF] hover:underline flex items-center gap-0.5">
          View All <ChevronRight size={14} />
        </button>
      </div>

      <div className="space-y-2">
        {recent.map((transaction) => {
          const isIncome = transaction.type === 'Income';
          const category = categories.find(c => c.id === transaction.categoryId);
          const account = accounts.find(a => a.id === transaction.accountId);
          
          return (
            <div 
              key={transaction.id}
              className="group bg-[#111827] border border-white/[0.03] hover:border-white/[0.08] rounded-2xl p-3.5 flex items-center gap-3.5 transition-all cursor-pointer hover:bg-[#1A2333] active:scale-[0.99]"
            >
              {/* Minimal Circular Icon */}
              <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${
                isIncome ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#EF4444]/10 text-[#EF4444]'
              }`}>
                {isIncome ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#F9FAFB] truncate mb-0.5">
                  {transaction.merchant || category?.name || 'Unknown Party'}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF] font-medium truncate">
                  <span className="bg-white/5 px-1.5 py-0.5 rounded capitalize">{account?.name || 'Wallet'}</span>
                  <span>•</span>
                  <span>{shortDate(transaction.occurredOn)}</span>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right shrink-0">
                <p className={`text-sm font-bold ${isIncome ? 'text-[#22C55E]' : 'text-[#F9FAFB]'}`}>
                  {isIncome ? '+' : '-'} {money(transaction.amount)}
                </p>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5 truncate font-medium">
                  {category?.name || 'General'}
                </p>
              </div>
            </div>
          );
        })}

        {recent.length === 0 && (
          <div className="py-8 text-center bg-[#111827] border border-dashed border-white/[0.06] rounded-2xl text-[#9CA3AF] text-sm font-medium">
            No transactions recorded yet
          </div>
        )}
      </div>
    </section>
  );
}
