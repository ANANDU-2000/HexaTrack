'use client';

import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { money } from '@/lib/format';
import { useFinanceStore } from '@/store/finance-store';

export function KpiCards() {
  const report = useFinanceStore((state) => state.report);
  const accounts = useFinanceStore((state) => state.accounts);
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const stats = [
    {
      title: 'Total Liquidity',
      value: totalBalance,
      trend: 4.2,
      icon: Wallet,
      color: 'text-primary',
      glowColor: 'from-primary/10 to-transparent',
    },
    {
      title: 'Aggregate Income',
      value: report.income,
      trend: 12.5,
      icon: TrendingUp,
      color: 'text-emerald-400',
      glowColor: 'from-emerald-500/10 to-transparent',
    },
    {
      title: 'Gross Outflow',
      value: report.expense,
      trend: -2.4,
      icon: TrendingDown,
      color: 'text-rose-400',
      glowColor: 'from-rose-500/10 to-transparent',
    },
    {
      title: 'Net Preservation',
      value: report.net,
      trend: 8.1,
      icon: PiggyBank,
      color: 'text-secondary',
      glowColor: 'from-secondary/10 to-transparent',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        const isPositive = stat.trend > 0;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass-card rounded-[28px] p-6 border border-white/[0.03] relative overflow-hidden group hover:border-white/10 transition-all"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
            
            <div className="flex justify-between items-start mb-4 z-10 relative">
              <span className="font-label-mono text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-70">
                {stat.title}
              </span>
              <div className={`w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center ${stat.color} border border-white/[0.05] shadow-sm`}>
                <Icon size={18} />
              </div>
            </div>

            <div className="z-10 relative">
              <h4 className="text-2xl md:text-3xl font-bold text-[#F5F7FA] tracking-tight truncate font-display-lg">
                {money(stat.value).split('.')[0]}
                <span className="text-sm opacity-40">.{money(stat.value).split('.')[1] || '00'}</span>
              </h4>
              
              <div className="flex items-center gap-2 mt-2.5">
                <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold font-label-mono border ${
                  isPositive ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/10' : 'text-rose-400 bg-rose-500/10 border-rose-500/10'
                }`}>
                  {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {Math.abs(stat.trend)}%
                </div>
                <span className="text-[10px] font-medium text-on-surface-variant opacity-50 tracking-wide">
                  VS PREVIOUS
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
