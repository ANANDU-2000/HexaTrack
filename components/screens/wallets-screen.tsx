'use client';

import { Plus, TrendingUp, Wallet, CreditCard, Activity, Building, DollarSign, ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { money } from '@/lib/format';
import { useFinanceStore } from '@/store/finance-store';

export function WalletsScreen() {
  const accounts = useFinanceStore((state) => state.accounts);
  const transactions = useFinanceStore((state) => state.transactions).slice(0, 3);
  
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-5 pb-28 pt-4 select-none font-sans">
      
      {/* Clean Page Head */}
      <div className="flex items-center justify-between px-1">
         <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="text-[9px] font-black text-emerald tracking-[0.2em] uppercase font-label-caps block leading-none">Capital Engine</span>
               <span className="w-1 h-1 bg-emerald rounded-full shadow-[0_0_4px_#10B981]" />
            </div>
            <h2 className="text-xl font-extrabold text-on-surface tracking-tight">Accounts & Wallets</h2>
         </div>
         <button className="h-9 px-3 rounded-xl bg-[#11131A] border border-outline-variant/20 text-on-surface hover:text-emerald hover:border-emerald/30 active:scale-95 text-[10px] font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all shadow-sm">
           <Plus size={14} /> Add Account
         </button>
      </div>

      {/* 1. CONSOLIDATED CAPITAL BLOCK */}
      <div className="bg-[#11131A] border border-outline-variant/20 rounded-xl p-5 relative overflow-hidden shadow-sm">
         <div className="absolute top-0 right-0 w-36 h-36 bg-emerald/5 blur-2xl rounded-full pointer-events-none" />
         
         <div className="flex flex-col gap-1 relative z-10">
            <span className="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-wider font-label-caps leading-none">Total Asset Value</span>
            <div className="flex items-baseline gap-2 select-none">
               <span className="text-2xl font-black text-on-surface tracking-tight">{money(totalBalance)}</span>
               <span className="px-1.5 py-0.5 rounded-md bg-emerald/10 text-emerald border border-emerald/20 flex items-center gap-0.5 text-[9px] font-bold">
                  <TrendingUp size={10} /> +4.1%
               </span>
            </div>
         </div>

         {/* Minimal Bar graph visualization */}
         <div className="flex items-end justify-between gap-1.5 h-14 mt-5 relative z-10 opacity-80">
            {[25, 40, 32, 55, 42, 70, 62, 80, 72, 85, 78, 92].map((val, i) => (
               <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: val / 92 }}
                  transition={{ delay: i * 0.02, duration: 0.5 }}
                  style={{ transformOrigin: 'bottom center' }}
                  className="flex-1 h-full bg-emerald/20 border-t border-emerald/30 rounded-t-sm hover:bg-emerald/40 transition-colors relative"
               />
            ))}
         </div>
      </div>

      {/* 2. ACCOUNT CARDS SLIDER / GRID */}
      <div className="flex flex-col gap-3">
         <span className="px-1 text-[9px] font-black uppercase font-label-caps tracking-wider text-on-surface-variant/60">Registered Wallets</span>
         
         <div className="flex flex-col gap-3">
            {accounts.length === 0 ? (
               <div className="w-full py-12 rounded-xl border border-dashed border-outline-variant/30 flex items-center justify-center text-on-surface-variant/60 font-bold text-xs uppercase">No wallets mapped</div>
            ) : (
               accounts.map((acc, idx) => (
                  <motion.div
                     key={acc.id}
                     className="relative w-full bg-[#11131A] border border-outline-variant/20 rounded-xl p-5 overflow-hidden flex items-center justify-between shadow-sm group cursor-pointer hover:border-emerald/20 transition-colors"
                  >
                     <div className="flex items-center gap-4 relative z-10">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                           idx % 3 === 0 
                             ? 'bg-emerald/10 text-emerald border-emerald/20' 
                             : idx % 3 === 1 
                               ? 'bg-teal/10 text-teal border-teal/20' 
                               : 'bg-[#1D1F27] text-on-surface-variant border-outline-variant/20'
                        }`}>
                           {idx % 3 === 0 ? <Building size={16} /> : idx % 3 === 1 ? <CreditCard size={16} /> : <Wallet size={16} />}
                        </div>
                        <div className="flex flex-col min-w-0">
                           <h3 className="text-sm font-extrabold text-on-surface truncate tracking-wide leading-tight">{acc.name}</h3>
                           <span className="text-[9px] font-bold font-label-caps text-on-surface-variant/60 tracking-wider uppercase mt-0.5">{acc.type} ACCOUNT</span>
                        </div>
                     </div>
                     
                     <div className="text-right flex flex-col items-end select-none shrink-0 ml-3 relative z-10">
                        <span className="text-sm font-mono text-on-surface font-bold leading-none">{money(acc.balance)}</span>
                        <ChevronRight size={12} className="text-on-surface-variant/30 group-hover:text-emerald group-hover:translate-x-0.5 transition-all mt-1" />
                     </div>
                  </motion.div>
               ))
            )}
         </div>
      </div>

      {/* 3. RECENT TRANSACTIONS PREVIEW */}
      <div className="flex flex-col gap-3 mt-1">
         <div className="flex items-center gap-2 px-1">
            <div className="w-6 h-6 rounded-lg bg-teal/10 border border-teal/20 flex items-center justify-center text-teal shadow-sm">
               <Activity size={12} />
            </div>
            <h3 className="text-[11px] font-extrabold text-on-surface tracking-wide uppercase font-label-caps leading-none">
               Activity Log
            </h3>
         </div>

         <div className="flex flex-col border border-outline-variant/20 rounded-xl overflow-hidden bg-[#11131A] shadow-sm">
            {transactions.map((tx, idx) => (
               <div key={tx.id} className={`flex justify-between items-center p-4 ${idx !== transactions.length - 1 ? 'border-b border-outline-variant/10' : ''} group`}>
                  <div className="flex items-center gap-3 min-w-0 select-none">
                     <div className="w-8 h-8 rounded-lg bg-[#1D1F27] border border-outline-variant/10 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald opacity-70 shadow-[0_0_3px_#10B981]" />
                     </div>
                     <div className="min-w-0">
                        <p className="text-xs font-bold text-on-surface truncate leading-tight">{tx.merchant || 'Direct Ledger Flow'}</p>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant/50 font-label-caps mt-0.5">Posted Entry</p>
                     </div>
                  </div>
                  <span className={`text-xs font-extrabold tracking-tight select-none ${tx.type === 'Income' ? 'text-emerald' : 'text-on-surface'}`}>
                     {tx.type === 'Income' ? '+' : '-'}{money(tx.amount)}
                  </span>
               </div>
            ))}
         </div>
      </div>

    </div>
  );
}
