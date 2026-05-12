'use client';

import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { money } from '@/lib/format';
import { useFinanceStore } from '@/store/finance-store';

type TimeRange = 'week' | 'month' | 'year';

export function DashboardHero() {
  const dashboard = useFinanceStore((state) => state.dashboard);
  const accounts = useFinanceStore((state) => state.accounts);
  const report = useFinanceStore((state) => state.report);

  const totalBalance = dashboard?.totalBalance ?? accounts.reduce((sum, a) => sum + a.balance, 0);
  const netChange = report.cashflow.length > 1 
    ? ((report.cashflow[report.cashflow.length-1].net / totalBalance) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between h-full min-h-[240px] shadow-2xl shadow-black/30">
       {/* Top-left subtle ambient radial glow consistent with Stitch architecture */}
       <div className="absolute top-0 left-0 w-40 h-40 bg-secondary/20 blur-[60px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
       
       <div>
          <span className="font-label-mono text-label-mono uppercase tracking-[0.15em] text-on-surface-variant text-[10px]">Global Net Assets</span>
          <motion.h2 
            key={totalBalance}
            initial={{ opacity: 0.7, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display-lg text-3xl md:text-5xl mt-2 font-bold text-[#F5F7FA]"
          >
            {money(totalBalance)}
          </motion.h2>
       </div>

       <div className="flex justify-between items-end mt-8 pt-6 border-t border-white/5">
          <div className="flex gap-6">
             <div>
                <p className={`text-label-mono font-bold font-label-mono flex items-center gap-1 ${Number(netChange) >= 0 ? 'text-secondary' : 'text-error'}`}>
                   {Number(netChange) >= 0 ? '+' : ''}{netChange}%
                </p>
                <p className="text-body-sm text-on-surface-variant text-xs mt-0.5 font-medium opacity-70">Last 30 Days</p>
             </div>
             <div className="w-[1px] h-8 bg-white/10 self-center" />
             <div>
                <p className="text-label-mono text-on-surface font-label-mono font-bold">
                   {accounts.length} Assets
                </p>
                <p className="text-body-sm text-on-surface-variant text-xs mt-0.5 font-medium opacity-70">Tracked Accounts</p>
             </div>
          </div>
          
          <div className="text-[#c1c1fc]/20 transition-transform group-hover:scale-110">
             <TrendingUp size={48} strokeWidth={1.5} />
          </div>
       </div>
    </div>
  );
}

