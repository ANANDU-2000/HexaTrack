'use client';

import { Plus, TrendingUp, Wallet, CreditCard, Activity, Building2, CircleDollarSign, ChevronRight, Send, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { money } from '@/lib/format';
import { useFinanceStore } from '@/store/finance-store';

export function WalletsScreen() {
  const accounts = useFinanceStore((state) => state.accounts);
  const transactions = useFinanceStore((state) => state.transactions).slice(0, 3);
  
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="space-y-8 pb-28 lg:pb-10 px-4 sm:px-6 lg:px-gutter pt-5 font-sans select-none">
      
      {/* High Fidelity Animated Page Head */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
        <div>
           <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black text-cyan tracking-[0.2em] uppercase font-label-caps block leading-none">Matrix Registry</span>
              <span className="w-1 h-1 bg-cyan rounded-full shadow-[0_0_6px_#06B6D4] animate-pulse" />
           </div>
           <h2 className="font-headline text-2xl md:text-3xl text-on-surface font-black tracking-tight">Asset Shells</h2>
        </div>
        <button className="bg-indigo text-white hover:brightness-105 active:scale-95 px-5 py-2.5 rounded-[20px] text-[10px] font-black tracking-[0.12em] uppercase shadow-lg shadow-indigo/20 flex items-center justify-center gap-2 transition-all w-fit font-label-caps border border-white/[0.08]">
          <Plus size={15} strokeWidth={2.8} /> Sync Node
        </button>
      </div>

      {/* LUXURIOUS Apple-Wallet Stack Container */}
      <section className="relative w-full flex flex-col gap-5 mt-1 select-none">
         {accounts.length === 0 ? (
            <div className="w-full h-48 rounded-[28px] border border-dashed border-white/[0.1] flex items-center justify-center text-on-surface-variant font-bold text-xs tracking-wider uppercase">Empty Node Stack</div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
               {accounts.map((acc, idx) => {
                  // Sophisticated high-premium metallic gradients
                  const cardStyles = [
                     {
                        grad: 'from-[#111827] via-[#0B1020] to-[#030712]',
                        glow: 'bg-cyan/10',
                        chip: 'bg-cyan/15 text-cyan border-cyan/20',
                        glowDots: 'bg-[#06B6D4]/30'
                     },
                     {
                        grad: 'from-[#0F172A] via-[#1E1B4B] to-[#0A0A0F]',
                        glow: 'bg-indigo/10',
                        chip: 'bg-indigo/15 text-[#A5B4FC] border-indigo/20',
                        glowDots: 'bg-[#818CF8]/30'
                     },
                     {
                        grad: 'from-[#064E3B] via-[#022C22] to-[#020617]',
                        glow: 'bg-emerald/10',
                        chip: 'bg-emerald/15 text-emerald border-emerald/20',
                        glowDots: 'bg-[#10B981]/30'
                     }
                  ];
                  const style = cardStyles[idx % cardStyles.length];

                  return (
                     <motion.div
                        key={acc.id}
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className={`relative w-full aspect-[1.68/1] rounded-[28px] bg-gradient-to-br ${style.grad} border border-white/[0.08] p-6 overflow-hidden flex flex-col justify-between shadow-2xl shadow-black/80`}
                     >
                        {/* Visual depth overlay shaders */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.035),transparent_50%)] pointer-events-none" />
                        <div className={`absolute top-0 right-0 w-52 h-52 blur-3xl rounded-full -mr-20 -mt-20 ${style.glow} pointer-events-none`} />
                        
                        {/* Core Card Grid Mesh Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

                        <div className="flex justify-between items-start relative z-10">
                           <div>
                              <span className={`inline-block px-2.5 py-0.75 rounded-lg text-[9px] font-black uppercase tracking-[0.18em] font-label-caps border shadow-inner mb-2 ${style.chip}`}>
                                 {acc.type} NODE
                              </span>
                              <h3 className="text-base font-extrabold text-on-surface tracking-wide drop-shadow">{acc.name}</h3>
                           </div>
                           <div className="p-2.5 rounded-xl bg-[#111827]/80 border border-white/[0.04] flex items-center justify-center text-white/80 backdrop-blur shadow-inner shrink-0">
                              <CreditCard size={18} />
                           </div>
                        </div>

                        <div className="relative z-10">
                           {/* Premium Dot Sequence */}
                           <div className="flex items-center gap-4 opacity-40 mb-4.5 font-mono-data text-xs font-bold select-none">
                              <span>••••</span>
                              <span>••••</span>
                              <span>••••</span>
                              <span className="font-black tracking-widest text-on-surface text-sm font-mono">992{idx}</span>
                           </div>
                           
                           <div className="flex justify-between items-end">
                              <div>
                                 <p className="text-[9px] font-black font-label-caps text-on-surface-variant/60 uppercase tracking-[0.15em] mb-0.5">Liquid Allocation</p>
                                 <div className="flex items-baseline gap-1.5">
                                    <span className="font-headline text-2xl font-black text-on-surface tracking-tight">{money(acc.balance)}</span>
                                    <span className="text-[9px] font-bold text-cyan font-mono">{acc.currency}</span>
                                 </div>
                              </div>
                              {/* Intersecting glass circles branding mockup */}
                              <div className="flex shrink-0 items-center relative pr-1 select-none pointer-events-none">
                                 <div className={`w-6.5 h-6.5 rounded-full border border-white/[0.1] backdrop-blur-sm ${style.glowDots}`} />
                                 <div className={`w-6.5 h-6.5 rounded-full border border-white/[0.1] backdrop-blur-sm bg-white/5 -ml-3.5`} />
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  );
               })}

               {/* Interactive Empty Placeholder Wrapper */}
               <motion.button 
                  whileTap={{ scale: 0.97 }}
                  className="w-full aspect-[1.68/1] rounded-[28px] border-2 border-dashed border-white/[0.05] hover:border-cyan/20 hover:bg-cyan/[0.02] transition-all flex flex-col items-center justify-center gap-3 select-none group outline-none"
               >
                  <div className="w-11 h-11 rounded-full bg-[#111827] border border-white/[0.04] flex items-center justify-center text-on-surface-variant group-hover:text-cyan group-hover:border-cyan/20 transition-all shadow-md">
                     <Plus size={18} />
                  </div>
                  <p className="text-[10px] font-black text-on-surface-variant group-hover:text-on-surface uppercase tracking-[0.2em] font-label-caps transition-colors">Provision Shell</p>
               </motion.button>
            </div>
         )}
      </section>

      {/* Global Metrics Matrix Bento Assembly */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-3">
         
         {/* Consolidated Capital Analytics Display */}
         <div className="lg:col-span-8 bg-[#111827]/35 border border-white/[0.04] rounded-[28px] p-6 sm:p-7 relative overflow-hidden shadow-inner select-none min-h-[320px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan/5 blur-3xl rounded-full pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 select-none">
               <div>
                  <span className="text-[9px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] font-label-caps leading-none block mb-2">Ecosystem Index</span>
                  <h4 className="text-base font-extrabold text-on-surface tracking-wide">Global Aggregate Supply</h4>
                  <div className="flex items-baseline gap-2.5 mt-2 select-none">
                     <span className="font-headline text-3xl font-black text-on-surface tracking-tight">{money(totalBalance)}</span>
                     <span className="px-2 py-0.5 rounded-full bg-emerald/10 text-emerald border border-emerald/20 flex items-center gap-1 font-mono-data text-[10px] font-black shadow-inner">
                        <TrendingUp size={11} strokeWidth={2.8} /> +4.12%
                     </span>
                  </div>
               </div>
               <span className="bg-[#111827]/60 px-3 py-1.5 border border-white/[0.04] text-[9px] font-black font-label-caps text-cyan uppercase tracking-wider rounded-lg shadow-sm w-fit">
                  Active Sweep
               </span>
            </div>

            {/* Futuristic custom bar graph preview */}
            <div className="flex-grow flex items-end justify-between gap-2.5 h-28 mt-8 px-1 relative z-10 select-none">
               {[35, 50, 40, 65, 55, 80, 70, 95, 85, 100, 90, 110].map((val, i) => (
                  <motion.div
                     key={i}
                     initial={{ scaleY: 0 }}
                     animate={{ scaleY: val / 110 }}
                     transition={{ delay: i * 0.03, duration: 0.6, ease: 'easeOut' }}
                     style={{ transformOrigin: 'bottom center' }}
                     className="flex-1 h-full bg-gradient-to-t from-cyan/5 via-cyan/10 to-cyan/30 border-t border-cyan/40 rounded-t-lg hover:bg-cyan/50 hover:shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all cursor-crosshair relative group"
                  >
                     <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#111827] border border-white/[0.05] text-[8px] font-black text-cyan opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap uppercase font-label-caps pointer-events-none">
                        {i + 1} CYC
                     </div>
                  </motion.div>
               ))}
            </div>

            {/* Visual grid support ticks */}
            <div className="absolute bottom-8 left-6 right-6 flex flex-col justify-between h-28 opacity-[0.03] pointer-events-none select-none">
               <div className="border-b border-white w-full" />
               <div className="border-b border-white w-full" />
               <div className="border-b border-white w-full" />
            </div>
         </div>

         {/* Nodes Details Control Sheet */}
         <div className="lg:col-span-4 flex flex-col gap-3.5 select-none">
            <div className="flex justify-between items-center px-1 select-none">
               <span className="text-[9px] font-black uppercase font-label-caps tracking-[0.2em] text-on-surface-variant">Allocation Vectors</span>
               <span className="text-[9px] font-bold font-mono-data text-cyan uppercase px-2 py-0.5 rounded bg-cyan/5 border border-cyan/10">{accounts.length} Shells</span>
            </div>

            <div className="flex flex-col gap-2.5 max-h-[280px] overflow-y-auto custom-scrollbar pr-0.5 select-none">
               {accounts.map((acc, i) => (
                  <div key={acc.id} className="w-full bg-[#111827]/30 border border-white/[0.03] hover:bg-[#111827]/50 hover:border-white/[0.06] rounded-[20px] p-4 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer shadow-inner select-none">
                     <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 border shadow-inner ${
                           i % 3 === 0 
                             ? 'bg-cyan/10 text-cyan border-cyan/20' 
                             : i % 3 === 1 
                               ? 'bg-indigo/10 text-[#A5B4FC] border-indigo/20' 
                               : 'bg-emerald/10 text-emerald border-emerald/20'
                        }`}>
                           {i % 3 === 0 ? <Building2 size={16} /> : i % 3 === 1 ? <CircleDollarSign size={16} /> : <Wallet size={16} />}
                        </div>
                        <div className="min-w-0 select-none">
                           <h4 className="text-[13px] font-bold text-on-surface truncate tracking-wide">{acc.name}</h4>
                           <p className="text-[9px] font-black font-label-caps tracking-wider uppercase text-on-surface-variant/50 mt-0.5 leading-none">{acc.currency} Index</p>
                        </div>
                     </div>
                     <div className="text-right flex flex-col items-end justify-center shrink-0 ml-3 select-none">
                        <span className="font-mono-data font-bold text-xs text-on-surface tracking-tight">{money(acc.balance)}</span>
                        <ChevronRight size={11} className="text-cyan opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all mt-0.5" />
                     </div>
                  </div>
               ))}
            </div>
         </div>

      </section>

      {/* Ledger Feed Stream Node */}
      <section className="pt-3 select-none">
         <div className="flex items-center gap-2 mb-4.5 px-1">
            <div className="w-7 h-7 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan shadow-inner">
               <Activity size={14} />
            </div>
            <h3 className="text-sm font-extrabold text-on-surface tracking-wide uppercase font-label-caps select-none">
               Stream Flow Telemetry
            </h3>
         </div>

         <div className="flex flex-col gap-2.5">
            {transactions.map(tx => (
               <div key={tx.id} className="bg-[#111827]/25 border border-white/[0.03] hover:bg-[#111827]/35 transition-colors rounded-[20px] p-4 flex items-center justify-between select-none group shadow-inner">
                  <div className="flex items-center gap-3.5 min-w-0 select-none">
                     <div className="w-9 h-9 rounded-xl bg-[#111827] border border-white/[0.04] flex items-center justify-center shadow-inner">
                        <div className="w-2 h-2 rounded-full bg-cyan group-hover:scale-110 transition-transform shadow-[0_0_6px_rgba(6,182,212,0.7)]" />
                     </div>
                     <div className="min-w-0">
                        <p className="text-[13px] font-bold text-on-surface truncate tracking-wide select-none">{tx.merchant || 'Aggregate Flow'}</p>
                        <p className="text-[9px] font-black uppercase tracking-[0.12em] text-on-surface-variant/50 font-label-caps leading-none mt-1 select-none">Direct Route</p>
                     </div>
                  </div>
                  <div className="shrink-0 text-right ml-3 select-none">
                     <span className={`font-mono-data font-bold tracking-tight text-xs select-none ${tx.type === 'Income' ? 'text-emerald' : 'text-on-surface'}`}>
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


