'use client';

import { Plus, TrendingUp, Wallet, CreditCard, Activity, Building2, CircleDollarSign, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { money } from '@/lib/format';
import { useFinanceStore } from '@/store/finance-store';

export function WalletsScreen() {
  const accounts = useFinanceStore((state) => state.accounts);
  const transactions = useFinanceStore((state) => state.transactions).slice(0, 3);
  
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <p className="font-label-mono text-[10px] text-secondary tracking-[0.2em] uppercase font-bold mb-2">Global Custody</p>
           <h2 className="font-display-lg text-3xl md:text-5xl text-[#F5F7FA] font-bold tracking-tight">Wallets & Accounts</h2>
        </div>
        <button className="bg-primary text-on-primary px-6 py-3 rounded-full text-sm font-bold shadow-md shadow-primary/20 flex items-center gap-2 active:scale-95 hover:opacity-90 transition-all whitespace-nowrap w-fit">
          <Plus size={16} /> ADD ASSET
        </button>
      </div>

      {/* 1. HORIZONTAL CARD CAROUSEL (High Fidelity Snap Scroll) */}
      <section className="-mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex overflow-x-auto gap-6 pb-6 hide-scrollbar snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
          
          {/* Render main system accounts as high-fi visual cards, limit to top 2 to simulate premium feel, remainder as grid below */}
          {accounts.slice(0, 2).map((acc, i) => (
             <div 
               key={acc.id} 
               className={`snap-center shrink-0 w-[280px] md:w-[360px] aspect-[1.6/1] relative rounded-3xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl ${
                 i === 0 
                   ? 'bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10' 
                   : 'bg-secondary-container/10 border border-secondary/20 backdrop-blur-md'
               }`}
             >
               {/* Dynamic Gradient Overlay */}
               <div className={`absolute top-0 right-0 w-40 h-40 blur-3xl rounded-full opacity-20 ${i === 0 ? 'bg-primary' : 'bg-secondary'}`} />

               <div className="flex justify-between items-start relative z-10">
                  <div>
                     <p className={`font-label-mono text-[9px] uppercase tracking-widest mb-1 font-bold opacity-70 ${i === 0 ? 'text-primary' : 'text-secondary'}`}>
                       {acc.type.toUpperCase()}
                     </p>
                     <h3 className="font-bold text-[#F5F7FA] tracking-wide">{acc.name}</h3>
                  </div>
                  {i === 0 ? <Wallet size={24} className="text-primary opacity-70" /> : <CreditCard size={24} className="text-secondary opacity-70" />}
               </div>

               <div className="relative z-10">
                  <div className="flex gap-4 mb-4 opacity-60">
                     <span className="font-label-mono text-base tracking-[0.2em]">••••</span>
                     <span className="font-label-mono text-base tracking-[0.2em]">••••</span>
                     <span className="font-label-mono text-base tracking-[0.2em]">••••</span>
                     <span className="font-label-mono text-base tracking-widest font-bold">240{i}</span>
                  </div>
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[9px] font-label-mono text-on-surface-variant opacity-60 font-bold uppercase tracking-widest">Available</p>
                        <p className="text-xl md:text-2xl font-bold text-[#F5F7FA] tracking-tight">{money(acc.balance)}</p>
                     </div>
                     <div className="flex gap-1 h-6 items-center">
                        <div className={`w-6 h-6 rounded-full opacity-70 ${i === 0 ? 'bg-rose-500' : 'bg-orange-500'}`} />
                        <div className={`w-6 h-6 rounded-full -ml-3 opacity-70 ${i === 0 ? 'bg-yellow-500' : 'bg-yellow-400'}`} />
                     </div>
                  </div>
               </div>
             </div>
          ))}

          {/* Placeholder for creation */}
          <div className="snap-center shrink-0 w-[200px] md:w-[280px] aspect-[1.6/1] rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-colors cursor-pointer group opacity-70">
             <div className="w-10 h-10 rounded-full bg-surface-container-high border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={18} className="text-on-surface-variant" />
             </div>
             <span className="text-xs font-bold text-on-surface-variant tracking-widest font-label-mono">CONNECT NODE</span>
          </div>
        </div>
      </section>

      {/* 2. BENTO GRID: Total Liquidity & Detail Inventory */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Balance Tracker Chart Card */}
        <div className="lg:col-span-8 glass-card rounded-[32px] p-6 md:p-8 border border-white/5 flex flex-col relative overflow-hidden min-h-[320px]">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
           
           <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-8 z-10">
              <div>
                 <h3 className="font-bold text-[#F5F7FA] text-lg">Total Aggregated Liquidity</h3>
                 <div className="flex items-baseline gap-3 mt-1">
                    <span className="font-display-lg text-3xl md:text-5xl font-bold text-[#F5F7FA] tracking-tighter">{money(totalBalance)}</span>
                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md font-label-mono text-[10px] font-bold flex items-center gap-1 border border-emerald-500/10">
                       <TrendingUp size={10} /> +2.4%
                    </span>
                 </div>
              </div>
              <div className="flex gap-2">
                 <div className="bg-surface-container-lowest border border-white/5 px-3 py-1.5 rounded-full font-label-mono text-[9px] font-bold text-on-surface-variant">
                    AUTO-SYNC ENABLED
                 </div>
              </div>
           </div>

           {/* Abstract Grid Graph (Mimicking design specification) */}
           <div className="flex-grow flex items-end justify-between gap-2 md:gap-4 relative mt-4 h-32 z-10 px-2">
              {[30, 45, 35, 55, 48, 70, 60, 85, 75, 100].map((val, i) => (
                 <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ delay: i * 0.05, duration: 0.8, ease: "easeOut" }}
                    className="flex-1 bg-primary/20 rounded-t-lg hover:bg-primary/50 transition-all group relative cursor-crosshair"
                 >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#F5F7FA] text-surface-container text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                       PERIOD {i+1}
                    </div>
                 </motion.div>
              ))}
           </div>
           
           {/* Backdrop graph lines */}
           <div className="absolute bottom-8 left-6 right-6 flex flex-col justify-between h-32 opacity-10 pointer-events-none">
              <div className="border-t border-white w-full" />
              <div className="border-t border-white w-full" />
              <div className="border-t border-white w-full" />
           </div>
        </div>

        {/* Side Sub-Account Inventory */}
        <div className="lg:col-span-4 flex flex-col gap-4">
           <div className="px-1 flex justify-between items-center">
              <span className="font-label-mono text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Asset Nodes</span>
              <span className="font-label-mono text-[10px] font-bold text-[#F5F7FA]">{accounts.length}</span>
           </div>

           <div className="flex flex-col gap-3">
              {accounts.map((acc, i) => (
                 <div key={acc.id} className="glass-card rounded-2xl p-4 flex items-center justify-between group hover:bg-white/[0.03] transition-all cursor-pointer border border-white/[0.02]">
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          i % 3 === 0 ? 'bg-primary/10 text-primary' : i % 3 === 1 ? 'bg-secondary/10 text-secondary' : 'bg-white/5 text-[#F5F7FA]'
                       }`}>
                          {i % 3 === 0 ? <Building2 size={18} /> : i % 3 === 1 ? <CircleDollarSign size={18} /> : <Wallet size={18} />}
                       </div>
                       <div className="min-w-0">
                          <p className="text-sm font-bold text-[#F5F7FA] truncate">{acc.name}</p>
                          <p className="text-[10px] text-on-surface-variant font-medium opacity-60 uppercase">{acc.currency}</p>
                       </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-0.5">
                       <span className="font-label-mono font-bold text-sm text-[#F5F7FA]">{money(acc.balance)}</span>
                       <ChevronRight size={12} className="text-on-surface-variant opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 3. RECENT HIGHLIGHTS (Contextual Transaction Peek) */}
      <section className="pt-6">
         <h3 className="font-bold text-[#F5F7FA] text-lg mb-5 flex items-center gap-2">
            <Activity size={18} className="text-secondary" /> Ledger Stream
         </h3>
         <div className="space-y-3">
            {transactions.map(tx => (
               <div key={tx.id} className="glass-card rounded-xl p-4 flex items-center justify-between border border-white/[0.02] hover:border-primary/10 transition-all">
                  <div className="flex items-center gap-4 min-w-0">
                     <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-glow shadow-primary/40" />
                     </div>
                     <div className="min-w-0">
                        <p className="text-sm font-bold text-[#F5F7FA] truncate">{tx.merchant || 'Unidentified Entity'}</p>
                        <p className="text-[11px] text-on-surface-variant opacity-70 mt-0.5">Direct Debit Node • Finalized</p>
                     </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                     <span className={`font-label-mono font-bold ${tx.type === 'Income' ? 'text-emerald-400' : 'text-[#F5F7FA]'}`}>
                        {tx.type === 'Income' ? '+' : '-'}{money(tx.amount)}
                     </span>
                  </div>
               </div>
            ))}
         </div>
      </section>

    </div>
  );
}
