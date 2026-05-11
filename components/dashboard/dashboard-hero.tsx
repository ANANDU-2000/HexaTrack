'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, PiggyBank, TrendingUp } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';
import { money } from '@/lib/format';
import { useFinanceStore } from '@/store/finance-store';

type TimeRange = 'week' | 'month' | 'year';

export function DashboardHero() {
  const [range, setRange] = useState<TimeRange>('month');
  const dashboard = useFinanceStore((state) => state.dashboard);
  const report = useFinanceStore((state) => state.report);
  const accounts = useFinanceStore((state) => state.accounts);

  const totalBalance = dashboard?.totalBalance ?? accounts.reduce((sum, a) => sum + a.balance, 0);
  
  // Fake but smooth mini trend visual
  const data = report.cashflow.slice(-7).map((cf, index) => ({
    name: `P${index}`,
    val: cf.net + 1000 // ensure above zero for display usually
  }));

  const income = report.income;
  const expense = report.expense;
  const net = report.net;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0B1015] via-[#111827] to-[#1A2333] p-6 border border-white/[0.08] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)]"
    >
      {/* Inner ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#4F8CFF]/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-widest flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-[#4F8CFF]" />
          Current Wealth
        </p>
        <div className="flex p-0.5 bg-black/40 backdrop-blur-sm rounded-full border border-white/[0.05]">
          {(['week', 'month', 'year'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                range === r ? 'bg-[#4F8CFF] text-white shadow-sm' : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <motion.h1 
          key={totalBalance}
          initial={{ opacity: 0.5, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl md:text-5xl font-bold tracking-tight text-[#F9FAFB]"
        >
          {money(totalBalance)}
        </motion.h1>
      </div>

      <div className="mt-6 flex flex-wrap gap-2.5 relative z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111827] border border-white/[0.05] rounded-full shadow-sm hover:border-[#22C55E]/30 transition-colors">
          <div className="p-1 rounded-full bg-[#22C55E]/10 text-[#22C55E]">
            <ArrowDownLeft size={14} />
          </div>
          <div>
            <span className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-medium">Income</span>
            <p className="text-sm font-semibold text-[#F9FAFB]">{money(income)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111827] border border-white/[0.05] rounded-full shadow-sm hover:border-[#EF4444]/30 transition-colors">
          <div className="p-1 rounded-full bg-[#EF4444]/10 text-[#EF4444]">
            <ArrowUpRight size={14} />
          </div>
          <div>
            <span className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-medium">Expense</span>
            <p className="text-sm font-semibold text-[#F9FAFB]">{money(expense)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111827] border border-white/[0.05] rounded-full shadow-sm hover:border-[#4F8CFF]/30 transition-colors">
          <div className="p-1 rounded-full bg-[#4F8CFF]/10 text-[#4F8CFF]">
            <PiggyBank size={14} />
          </div>
          <div>
            <span className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-medium">Savings</span>
            <p className="text-sm font-semibold text-[#F9FAFB]">{money(Math.max(0, net))}</p>
          </div>
        </div>
      </div>

      {/* Balance Trend Visual */}
      <div className="h-[90px] w-full mt-4 -mb-2 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.length > 0 ? data : [{val: 10}, {val: 25}, {val: 15}, {val: 35}, {val: 28}, {val: 45}, {val: 50}]}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F8CFF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4F8CFF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
            <Area 
              type="monotone" 
              dataKey="val" 
              stroke="#4F8CFF" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorBalance)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}
