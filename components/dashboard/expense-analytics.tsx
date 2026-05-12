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
    name: new Date(cf.period).toLocaleString('default', { month: 'short' }),
    amount: cf.net,
    expense: cf.expense,
    income: cf.income,
  })).slice(-5); // Get 5 relevant period buckets

  return (
    <section className="glass-card rounded-3xl p-6 md:p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-headline-md text-headline-md text-[#F5F7FA]">Capital Analytics</h3>
        
        {/* Stitch UI Toggle Style */}
        <div className="flex gap-2 p-1 bg-black/20 rounded-full border border-white/[0.03]">
          {(['1M', '3M', '1Y'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold font-label-mono tracking-wide transition-all ${
                range === r 
                  ? 'bg-secondary-container text-on-secondary-container shadow-sm' 
                  : 'text-on-surface-variant opacity-60 hover:opacity-100'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* SVG / Recharts Area Simulation */}
      <div className="flex-1 w-full min-h-[220px] relative group mt-4">
         <ResponsiveContainer width="100%" height="100%">
           <AreaChart data={chartData.length > 0 ? chartData : fallbackData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
             <defs>
               <linearGradient id="stitchChartGrad" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="5%" stopColor="#4b8eff" stopOpacity={0.3}/>
                 <stop offset="100%" stopColor="#4b8eff" stopOpacity={0}/>
               </linearGradient>
             </defs>
             <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#8B9BB4', fontWeight: 500, letterSpacing: '0.05em' }} 
                dy={10}
             />
             <YAxis hide domain={['dataMin - 500', 'dataMax + 500']} />
             <Tooltip
               contentStyle={{ backgroundColor: '#131316', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff' }}
               itemStyle={{ color: '#adc6ff' }}
               formatter={(value: number) => money(value)}
               labelStyle={{ color: '#8B9BB4', fontSize: '10px', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}
             />
             <Area 
               type="monotone" 
               dataKey="amount" 
               stroke="#4b8eff" 
               strokeWidth={3} 
               fillOpacity={1} 
               fill="url(#stitchChartGrad)"
               animationDuration={1200}
               className="chart-glow" // Leveraging predefined glow utility in globals
             />
           </AreaChart>
         </ResponsiveContainer>
      </div>
    </section>
  );
}

const fallbackData = [
  { name: 'Jan', amount: 4200 },
  { name: 'Feb', amount: 3800 },
  { name: 'Mar', amount: 5100 },
  { name: 'Apr', amount: 4600 },
  { name: 'May', amount: 6200 },
];

