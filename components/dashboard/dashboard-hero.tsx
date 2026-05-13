'use client';

import { motion } from 'framer-motion';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { money } from '@/lib/format';
import { useFinanceStore } from '@/store/finance-store';

export function DashboardHero() {
  const dashboard = useFinanceStore((state) => state.dashboard);
  const accounts = useFinanceStore((state) => state.accounts);
  const report = useFinanceStore((state) => state.report);

  const totalBalance = dashboard?.totalBalance ?? accounts.reduce((sum, a) => sum + a.balance, 0);
  const netChange = report.cashflow.length > 1 
    ? ((report.cashflow[report.cashflow.length-1].net / totalBalance) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="glass-card rounded-[28px] p-6 md:p-8 relative overflow-hidden flex flex-col justify-between h-full min-h-[240px]">
        {/* Dynamic Gradient Mesh Background */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary-container/15 blur-3xl rounded-full pointer-events-none" />
        
        <div>
           <div className="flex items-center gap-2 mb-2">
              <span className="font-label-caps text-label-caps uppercase tracking-[0.12em] text-on-surface-variant text-[11px]">Global Net Liquidity</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse shadow-[0_0_8px_#10B981]" />
           </div>
           <motion.h2 
             key={totalBalance}
             initial={{ opacity: 0.7, y: 5 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ type: 'spring', stiffness: 300, damping: 30 }}
             className="font-headline text-display-balance text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight"
           >
             {money(totalBalance)}
           </motion.h2>
        </div>

        <div className="flex justify-between items-end mt-10 pt-6 border-t border-white/[0.05]">
           <div className="flex gap-6">
              <div>
                 <div className={`font-mono-data text-sm font-semibold flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/[0.03] ${Number(netChange) >= 0 ? 'text-emerald' : 'text-danger'}`}>
                    {Number(netChange) >= 0 ? '+' : ''}{netChange}%
                 </div>
                 <p className="text-[11px] font-label-caps text-on-surface-variant font-medium tracking-wider uppercase mt-2">Period Delta</p>
              </div>
              <div className="w-[1px] h-8 bg-white/10 self-center opacity-60" />
              <div>
                 <p className="font-mono-data text-sm font-bold text-on-surface">
                    {accounts.length} Positions
                 </p>
                 <p className="text-[11px] font-label-caps text-on-surface-variant font-medium tracking-wider uppercase mt-2">Connected</p>
              </div>
           </div>
           
           <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/[0.05] hover:bg-white/10 transition-all text-on-surface-variant active:scale-95">
              <ChevronRight size={16} className="text-on-surface" />
           </button>
        </div>
    </div>
  );
}


