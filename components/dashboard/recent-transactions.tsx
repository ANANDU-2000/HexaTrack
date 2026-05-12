'use client';

import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, CalendarDays, ReceiptText, ChevronRight } from 'lucide-react';
import { money, shortDate } from '@/lib/format';
import { useFinanceStore } from '@/store/finance-store';

export function RecentTransactions() {
  const transactions = useFinanceStore((state) => state.transactions).slice(0, 5);
  const categories = useFinanceStore((state) => state.categories);

  return (
    <div className="glass-card rounded-[32px] p-6 md:p-8 border border-white/[0.03] flex flex-col w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
           <ReceiptText size={18} className="text-secondary opacity-80" />
           <h3 className="font-bold text-[#F5F7FA] text-lg tracking-tight">Ledger Stream</h3>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest border border-white/[0.05] rounded-full">
           <CalendarDays size={12} className="text-on-surface-variant opacity-60" />
           <span className="font-label-mono text-[9px] font-bold text-on-surface-variant tracking-widest uppercase">RECENT</span>
        </div>
      </div>

      {transactions.length === 0 ? (
         <div className="flex-grow flex flex-col items-center justify-center py-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <ReceiptText size={32} className="text-on-surface-variant opacity-20 mb-3" />
            <p className="text-sm font-bold text-[#F5F7FA]">No flow records found</p>
            <p className="text-xs text-on-surface-variant opacity-60 mt-1">Initialize transactional telemetry.</p>
         </div>
      ) : (
         <div className="space-y-3.5">
            {transactions.map((tx, i) => {
               const isIncome = tx.type === 'Income';
               const category = categories.find(c => c.id === tx.categoryId);
               
               return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="group flex items-center justify-between p-4 bg-surface-container-lowest/40 border border-white/[0.01] rounded-2xl hover:bg-white/[0.03] hover:border-white/[0.04] transition-all cursor-pointer relative overflow-hidden"
                  >
                     <div className="flex items-center gap-4 min-w-0 z-10 relative">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 shadow-sm transition-all group-hover:scale-105 ${
                           isIncome 
                             ? 'bg-emerald-500/10 border-emerald-500/10 text-emerald-400' 
                             : 'bg-surface-container border-white/5 text-[#F5F7FA]'
                        }`}>
                           {isIncome ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                        </div>
                        <div className="min-w-0">
                           <h4 className="text-sm font-bold text-[#F5F7FA] truncate group-hover:text-primary transition-colors">{tx.merchant || 'Unlabeled Record'}</h4>
                           <p className="text-[11px] text-on-surface-variant font-medium opacity-70 flex items-center gap-1.5 mt-0.5">
                              <span className="uppercase tracking-wider font-label-mono text-[9px] opacity-60">{category?.name || 'SYSTEM'}</span>
                              <span className="w-1 h-1 rounded-full bg-white/20" />
                              <span>{shortDate(tx.occurredOn)}</span>
                           </p>
                        </div>
                     </div>

                     <div className="text-right flex flex-col items-end gap-1 z-10 relative ml-4 shrink-0">
                        <span className={`font-label-mono font-bold text-sm ${isIncome ? 'text-emerald-400' : 'text-[#F5F7FA]'}`}>
                           {isIncome ? '+' : '-'}{money(tx.amount)}
                        </span>
                        <ChevronRight size={12} className="text-on-surface-variant opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                     </div>
                  </motion.div>
               );
            })}
         </div>
      )}

      {transactions.length > 0 && (
         <button className="w-full mt-6 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-xs font-bold text-on-surface-variant uppercase tracking-widest hover:bg-white/5 hover:text-[#F5F7FA] transition-all active:scale-[0.99]">
            Examine Full Ledger
         </button>
      )}
    </div>
  );
}
