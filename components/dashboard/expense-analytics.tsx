'use client';

import { useState } from 'react';
import { money } from '@/lib/format';
import { useFinanceStore } from '@/store/finance-store';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function ExpenseAnalytics() {
  const report = useFinanceStore((state) => state.report);
  const [range, setRange] = useState<'1M' | '3M' | '1Y'>('3M');

  // Real data from cashflow engine
  const chartData = report.cashflow.map(cf => ({
    name: new Date(cf.period).toLocaleString('default', { month: 'short' }).toUpperCase(),
    amount: cf.net,
    expense: cf.expense,
    income: cf.income,
  })).slice(-5); // Get 5 relevant period buckets

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
           <p className="font-label-caps text-[10px] uppercase tracking-widest text-cyan font-black mb-1">Analytics</p>
           <h3 className="font-headline text-lg font-extrabold text-on-surface tracking-tight">Capital Forecast</h3>
        </div>
        
        <div className="flex gap-1 p-1 bg-[#111827]/80 rounded-xl border border-white/[0.04]">
          {(['1M', '3M', '1Y'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-lg text-[10px] font-black font-label-caps tracking-widest uppercase transition-all active:scale-95 ${
                range === r 
                  ? 'bg-white/5 text-cyan shadow-[0_0_10px_rgba(6,182,212,0.2)] border border-white/[0.03]' 
                  : 'text-on-surface-variant opacity-60 hover:opacity-100'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart Section */}
      <div className="flex-1 w-full min-h-[230px] relative group mt-2 select-none">
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData.length > 0 ? chartData : fallbackData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="premiumChartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.25}/>
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                 dataKey="name" 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fontSize: 9, fill: '#cbc4d2', fontWeight: 600, letterSpacing: '0.1em', fontFamily: 'Geist' }} 
                 dy={12}
              />
              <YAxis hide domain={['dataMin - 500', 'dataMax + 500']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.06)', borderRadius: '16px', color: '#e6e0e9', boxShadow: '0 12px 32px rgba(11,16,32,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}
                itemStyle={{ color: '#06B6D4', fontFamily: 'Geist', fontWeight: 600 }}
                formatter={(value: number) => money(value)}
                labelStyle={{ color: '#cbc4d2', fontSize: '9px', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Geist' }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#06B6D4" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#premiumChartGrad)"
                animationDuration={1200}
                className="chart-glow" 
              />
            </AreaChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
}

const fallbackData = [
  { name: 'JAN', amount: 4200 },
  { name: 'FEB', amount: 3800 },
  { name: 'MAR', amount: 5100 },
  { name: 'APR', amount: 4600 },
  { name: 'MAY', amount: 6200 },
];


