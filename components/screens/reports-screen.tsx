'use client';

import { 
  Loader2, 
  TrendingUp,
  Bitcoin,
  Coins,
  BarChart2
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { 
  Area, 
  AreaChart, 
  Cell, 
  Pie, 
  PieChart as RePieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis
} from 'recharts';
import { ApiError, hexaTrackApi } from '@/lib/api';
import type { ReportSummary } from '@/lib/types';
import { money, percent } from '@/lib/format';

type Period = 'week' | 'month' | 'year' | 'all';

function periodRange(period: Period): { from: string; to: string } {
  const to = new Date();
  const toStr = to.toISOString().slice(0, 10);
  if (period === 'all') {
    return { from: '2000-01-01', to: toStr };
  }
  const from = new Date(to);
  if (period === 'week') {
    from.setDate(from.getDate() - 6);
  } else if (period === 'month') {
    from.setDate(1);
  } else {
    from.setMonth(0, 1);
  }
  return { from: from.toISOString().slice(0, 10), to: toStr };
}

const emptyReport: ReportSummary = {
  income: 0,
  expense: 0,
  net: 0,
  cashflow: [],
  spendingByCategory: [],
};

// Ultra-Modern Design Tokens for Charts
const CHART_COLORS = ['#06B6D4', '#6366F1', '#10B981', '#cfbcff', '#ffb4ab', '#4f8cff', '#8b5cf6'];

export function ReportsScreen() {
  const [period, setPeriod] = useState<Period>('month');
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { from, to } = useMemo(() => periodRange(period), [period]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await hexaTrackApi.reportSummary(from, to);
        if (!cancelled) setReport(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Unable to load analytics.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [from, to]);

  const activeReport = report ?? emptyReport;

  const cashflowData = useMemo(() => {
    return activeReport.cashflow.map(item => ({
      period: new Date(item.period).toLocaleDateString('en-US', { month: 'short' }),
      val: item.income - item.expense
    }));
  }, [activeReport.cashflow]);

  const pieData = useMemo(() => {
    return activeReport.spendingByCategory.slice(0, 3).map(item => ({
      name: item.categoryName,
      value: item.amount
    }));
  }, [activeReport.spendingByCategory]);

  const totalSpend = useMemo(() => 
    activeReport.spendingByCategory.reduce((acc, curr) => acc + curr.amount, 0), 
  [activeReport.spendingByCategory]);

  if (loading && !report) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-sans">
        <Loader2 className="animate-spin text-cyan" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-28 lg:pb-10 px-4 sm:px-6 lg:px-gutter pt-5 font-sans select-none">
      
      {/* Animated Modern Layout Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
        <div>
           <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black text-cyan tracking-[0.2em] uppercase font-label-caps block leading-none">Portfolio Pulse</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_6px_#06B6D4] animate-pulse" />
           </div>
           <h2 className="font-headline text-2xl md:text-3xl text-on-surface font-black tracking-tight">Analysis Engine</h2>
        </div>
        
        <div className="flex p-1 bg-[#111827] border border-white/[0.04] rounded-2xl overflow-x-auto hide-scrollbar shrink-0 shadow-md w-fit select-none">
          {periodLabels.slice(0, 3).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`px-4 py-2 rounded-xl font-black text-[9px] font-label-caps tracking-widest uppercase whitespace-nowrap active:scale-[0.96] transition-all ${
                period === key 
                  ? 'bg-white/5 text-cyan shadow-inner border border-white/[0.03]' 
                  : 'text-on-surface-variant opacity-60 hover:opacity-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN METRICS BENTO */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-stack-lg mt-2">
        
        {/* 1. ASSET VELOCITY AREA CHART */}
        <div className="md:col-span-8 glass-card rounded-[28px] p-6 md:p-8 flex flex-col relative overflow-hidden border border-white/[0.05]">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan/5 blur-[80px] rounded-full pointer-events-none" />

          <div className="flex justify-between items-start mb-10 z-10">
            <div>
              <p className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant font-black mb-1">Vector Path</p>
              <h3 className="font-extrabold text-on-surface text-lg tracking-tight">Asset Momentum</h3>
            </div>
            <div className="text-right">
              <p className="font-mono-data font-extrabold text-cyan text-xl tracking-tight">
                {activeReport.net >= 0 ? '+' : ''}{money(activeReport.net)}
              </p>
              <p className="font-label-caps text-[9px] text-on-surface-variant font-black tracking-widest uppercase mt-1">Aggregate Net</p>
            </div>
          </div>

          <div className="flex-1 w-full min-h-[280px] z-10">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashflowData.length > 0 ? cashflowData : fallbackProjectionData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cyanGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.4}/>
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="period" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 9, fill: '#9CA3AF', fontWeight: 800, letterSpacing: '0.1em', fontFamily: 'var(--font-label-caps)'}} 
                    dy={12}
                  />
                  <YAxis hide domain={['dataMin - 500', 'dataMax + 500']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.06)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                    labelStyle={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'var(--font-label-caps)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}
                    itemStyle={{ color: '#06B6D4', fontFamily: 'var(--font-mono-data)', fontWeight: 700 }}
                    formatter={(value: any) => money(Number(value))}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="val" 
                    stroke="#06B6D4" 
                    strokeWidth={3.5} 
                    fillOpacity={1} 
                    fill="url(#cyanGrowthGrad)" 
                    className="chart-glow"
                    animationDuration={1200}
                  />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* 2. BREAKDOWN DONUT */}
        <div className="md:col-span-4 glass-card rounded-[28px] p-6 md:p-8 flex flex-col relative overflow-hidden border border-white/[0.05]">
           <p className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant font-black mb-1">Outflow Matrix</p>
           <h3 className="font-extrabold text-on-surface text-lg tracking-tight mb-6">Expense Ratio</h3>
           
           <div className="flex-1 flex items-center justify-center min-h-[180px] relative">
              {pieData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={pieData}
                        innerRadius={62}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        animationBegin={200}
                      >
                        {pieData.map((e, i) => (
                           <Cell key={`slice-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} className="hover:opacity-90 transition-opacity cursor-pointer" />
                        ))}
                      </Pie>
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                     <span className="font-mono-data text-2xl font-extrabold text-on-surface tracking-tight">{percent((pieData[0]?.value / Math.max(1, totalSpend)) * 100)}</span>
                     <span className="text-[9px] font-black text-cyan tracking-widest uppercase mt-0.5 font-label-caps">Dominant</span>
                  </div>
                </>
              ) : (
                <div className="text-center opacity-50 text-xs italic font-medium font-sans">No structural data</div>
              )}
           </div>

           <div className="mt-6 space-y-3.5">
              {pieData.map((item, i) => (
                 <div key={item.name} className="flex justify-between items-center group">
                    <div className="flex items-center gap-2.5">
                       <div className="w-2.5 h-2.5 rounded-full shadow-inner" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                       <span className="text-sm font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors font-sans">{item.name}</span>
                    </div>
                    <span className="font-mono-data text-[13px] font-bold text-on-surface tracking-tight">{money(item.value)}</span>
                 </div>
              ))}
           </div>
        </div>

        {/* 3. AI STRATEGIC HIGHLIGHT */}
        <div className="md:col-span-12 glass-card rounded-[28px] p-6.5 border-l-4 border-l-cyan border-y border-r border-white/[0.05] flex flex-col md:flex-row items-center gap-6 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(rgba(6,182,212,0.4)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="w-14 h-14 rounded-2xl bg-cyan/10 flex items-center justify-center shrink-0 shadow-inner border border-cyan/20">
             <TrendingUp size={24} className="text-cyan drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
          </div>
          <div className="flex-grow text-center md:text-left relative z-10">
             <h4 className="text-lg font-extrabold text-on-surface tracking-tight mb-1.5">Algorithmic Reinvestment Signal</h4>
             <p className="text-sm text-on-surface-variant opacity-90 max-w-3xl leading-relaxed">
                Current velocity metrics across primary pools reside 12% below forecast benchmarks. HexaTrack Core Compiler validates surplus liquidity parameters are viable for high-yield expansion routers.
             </p>
          </div>
          <button className="bg-indigo text-white hover:brightness-110 active:scale-95 px-6 py-3.5 rounded-full text-xs font-black tracking-widest uppercase shadow-lg shadow-indigo/20 whitespace-nowrap shrink-0 border border-white/[0.1] font-label-caps relative z-10">
             Route Liquidity
          </button>
        </div>

        {/* 4. GRID HEATMAP ACTIVITY */}
        <div className="md:col-span-7 glass-card rounded-[28px] p-6 md:p-8 relative border border-white/[0.05] overflow-hidden">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
             <div>
                <p className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant font-black mb-1">Cadence Frequency</p>
                <h3 className="font-extrabold text-on-surface text-lg tracking-tight">Ledger Flux Map</h3>
             </div>
             <div className="flex items-center gap-2.5 bg-[#111827] border border-white/[0.04] px-3 py-2 rounded-xl">
                <span className="text-[9px] text-on-surface-variant font-bold uppercase font-label-caps tracking-widest">Zero</span>
                <div className="flex gap-1">
                   <div className="w-3.5 h-3.5 rounded bg-cyan opacity-10 shadow-inner"></div>
                   <div className="w-3.5 h-3.5 rounded bg-cyan opacity-40 shadow-inner"></div>
                   <div className="w-3.5 h-3.5 rounded bg-cyan opacity-70 shadow-inner"></div>
                   <div className="w-3.5 h-3.5 rounded bg-cyan opacity-100 shadow-md"></div>
                </div>
                <span className="text-[9px] text-on-surface-variant font-bold uppercase font-label-caps tracking-widest">Max</span>
             </div>
           </div>

           <div className="grid grid-cols-12 gap-2 sm:gap-2.5 relative z-10 select-none">
              {heatmapValues.map((val, i) => (
                 <div 
                   key={i}
                   className={`aspect-square rounded-md bg-cyan transition-all duration-500 hover:scale-110 hover:shadow-[0_0_8px_#06B6D4] cursor-pointer shadow-inner`}
                   style={{ opacity: Math.max(0.08, val) }}
                   title={`Intensity ${Math.round(val*100)}%`}
                 />
              ))}
           </div>
        </div>

        {/* 5. LIVE COMPILER PULSE */}
        <div className="md:col-span-5 glass-card rounded-[28px] p-6 md:p-8 flex flex-col border border-white/[0.05] overflow-hidden">
           <div className="flex justify-between items-center mb-8">
              <div>
                 <p className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant font-black mb-1">External Feeds</p>
                 <h3 className="font-extrabold text-on-surface text-lg tracking-tight mb-1 flex items-center gap-2">
                   Market Integration
                 </h3>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald shadow-[0_0_8px_#10B981] animate-pulse" />
           </div>
           
           <div className="flex flex-col space-y-4 flex-1 justify-center">
              {marketPulse.map(ticker => (
                 <div key={ticker.sym} className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#111827]/40 border border-white/[0.02] hover:border-white/[0.05] hover:bg-[#111827]/60 transition-all group cursor-pointer shadow-sm">
                    <div className="flex items-center gap-4 min-w-0">
                       <div className="w-11 h-11 rounded-xl bg-[#111827] flex items-center justify-center text-on-surface group-hover:text-cyan group-hover:scale-105 transition-all border border-white/[0.04] shadow-inner">
                          {ticker.icon}
                       </div>
                       <div className="min-w-0">
                          <p className="font-extrabold text-on-surface text-sm font-sans tracking-wide">{ticker.sym}</p>
                          <p className="text-[11px] text-on-surface-variant font-medium truncate font-sans mt-0.5">{ticker.name}</p>
                       </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                       <p className="font-mono-data font-bold text-sm text-on-surface tracking-tight">{ticker.val}</p>
                       <p className={`font-mono-data text-[11px] font-extrabold tracking-wide mt-0.5 ${ticker.positive ? 'text-emerald' : 'text-danger'}`}>
                         {ticker.positive ? '+' : ''}{ticker.change}%
                       </p>
                    </div>
                 </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}

const periodLabels: { key: Period; label: string }[] = [
  { key: 'week', label: 'Weekly' },
  { key: 'month', label: 'Monthly' },
  { key: 'year', label: 'Yearly' },
  { key: 'all', label: 'Global' },
];

const fallbackProjectionData = [
  { period: 'Jan', val: 4500 },
  { period: 'Feb', val: 4800 },
  { period: 'Mar', val: 5200 },
  { period: 'Apr', val: 5100 },
  { period: 'May', val: 5900 },
  { period: 'Jun', val: 6800 },
];

const heatmapValues = [
  0.1, 0.3, 0.1, 0.6, 0.2, 0.8, 0.4, 0.1, 0.5, 0.2, 0.1, 0.3,
  0.2, 0.4, 0.8, 0.1, 0.9, 0.3, 0.1, 0.6, 0.2, 0.5, 0.3, 0.1,
  0.1, 0.2, 0.3, 0.5, 0.1, 0.2, 0.7, 0.4, 0.1, 0.8, 0.2, 0.4,
  0.3, 0.1, 0.6, 0.2, 0.4, 0.9, 0.1, 0.3, 0.5, 0.1, 0.2, 0.1,
];

const marketPulse = [
  { sym: 'NVDA', name: 'Nvidia Corp', val: '$1,148.25', change: 3.4, positive: true, icon: <BarChart2 size={20} /> },
  { sym: 'BTC', name: 'Bitcoin Index', val: '$68,240', change: -1.2, positive: false, icon: <Bitcoin size={20} /> },
  { sym: 'XAU', name: 'Gold Spot', val: '$2,342.15', change: 0.8, positive: true, icon: <Coins size={20} /> },
];

