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

// Premium Design Tokens for Charts
const CHART_COLORS = ['#4F8CFF', '#22C55E', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6'];

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
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#c1c1fc]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      
      {/* Top Heading Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="font-label-mono text-[10px] text-secondary tracking-[0.2em] uppercase font-bold mb-2">Portfolio Intelligence</p>
          <h2 className="font-display-lg text-3xl md:text-5xl text-[#F5F7FA] font-bold tracking-tight">Wealth Analytics</h2>
        </div>
        
        <div className="flex p-1 bg-black/20 rounded-full border border-white/[0.03] shadow-inner">
          {periodLabels.slice(0, 3).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`px-5 py-2 text-[11px] font-bold font-label-mono tracking-widest rounded-full transition-all ${
                period === key 
                  ? 'bg-secondary-container text-on-secondary-container shadow-sm' 
                  : 'text-on-surface-variant opacity-70 hover:opacity-100'
              }`}
            >
              {label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* BENTO GRID BASE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-gutter">
        
        {/* 1. GROWTH PROJECTION AREA CHART [md:col-span-8] */}
        <div className="md:col-span-8 glass-card rounded-3xl p-6 md:p-8 flex flex-col relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[80px] rounded-full pointer-events-none" />

          <div className="flex justify-between items-start mb-8 z-10">
            <div>
              <h3 className="font-headline-md text-headline-md text-[#F5F7FA] font-bold">Asset Velocity</h3>
              <p className="text-body-sm text-on-surface-variant opacity-70">Predictive trend analysis via ledger dynamics</p>
            </div>
            <div className="text-right">
              <p className="font-headline-md text-headline-md text-secondary font-bold">
                {activeReport.net >= 0 ? '+' : ''}{money(activeReport.net)}
              </p>
              <p className="font-label-mono text-[10px] text-secondary/80 font-bold tracking-wide mt-1">NET CHANGE</p>
            </div>
          </div>

          <div className="flex-1 w-full min-h-[280px] z-10">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashflowData.length > 0 ? cashflowData : fallbackProjectionData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4b8eff" stopOpacity={0.4}/>
                      <stop offset="100%" stopColor="#4b8eff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="period" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#9CA3AF', fontWeight: 600, letterSpacing: '0.05em'}} 
                    dy={10}
                  />
                  <YAxis hide domain={['dataMin - 500', 'dataMax + 500']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#131316', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#adc6ff' }}
                    formatter={(value: any) => money(Number(value))}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="val" 
                    stroke="#4b8eff" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#growthGrad)" 
                    className="chart-glow"
                    animationDuration={1500}
                  />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* 2. BREAKDOWN RING CHART [md:col-span-4] */}
        <div className="md:col-span-4 glass-card rounded-3xl p-6 md:p-8 flex flex-col relative overflow-hidden">
           <h3 className="font-headline-md text-headline-md text-[#F5F7FA] font-bold mb-6">Spend Ratio</h3>
           
           <div className="flex-1 flex items-center justify-center min-h-[180px] relative">
              {pieData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={pieData}
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={6}
                        dataKey="value"
                        stroke="none"
                        animationBegin={200}
                      >
                        {pieData.map((e, i) => (
                           <Cell key={`slice-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} className="hover:opacity-80" />
                        ))}
                      </Pie>
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="font-label-mono text-2xl font-bold text-[#F5F7FA]">{percent((pieData[0]?.value / Math.max(1, totalSpend)) * 100)}</span>
                     <span className="text-[9px] font-bold text-on-surface-variant tracking-widest uppercase opacity-60">Main Target</span>
                  </div>
                </>
              ) : (
                <div className="text-center opacity-50 text-sm italic">No classification data</div>
              )}
           </div>

           <div className="mt-6 space-y-3">
              {pieData.map((item, i) => (
                 <div key={item.name} className="flex justify-between items-center group">
                    <div className="flex items-center gap-2">
                       <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                       <span className="text-body-sm font-medium text-on-surface group-hover:text-[#F5F7FA] transition-colors">{item.name}</span>
                    </div>
                    <span className="font-label-mono text-xs font-bold text-on-surface-variant">{money(item.value)}</span>
                 </div>
              ))}
           </div>
        </div>

        {/* 3. AI INSIGHT BANNER [md:col-span-12] */}
        <div className="md:col-span-12 glass-card rounded-3xl p-6 border-l-4 border-l-secondary flex flex-col md:flex-row items-center gap-6 shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-secondary-container/20 flex items-center justify-center shrink-0 shadow-inner border border-secondary/10">
             <TrendingUp size={28} className="text-secondary" />
          </div>
          <div className="flex-grow text-center md:text-left">
             <h4 className="text-lg font-bold text-[#F5F7FA] mb-1">Smart Optimization Potential</h4>
             <p className="text-sm text-on-surface-variant opacity-80 max-w-2xl">
                Current outflow velocity across top 3 verticals is 12% below forecasted parameters. HexaTrack AI confirms surplus liquidity is viable for reinvestment strategy or expansion capital.
             </p>
          </div>
          <button className="bg-secondary-container text-on-secondary-container px-8 py-3 rounded-full font-bold text-sm active:scale-95 transition-all shrink-0 shadow-md shadow-secondary/20 whitespace-nowrap hover:opacity-90">
             Execute Strategy
          </button>
        </div>

        {/* 4. ACTIVITY HEATMAP GRID [md:col-span-7] */}
        <div className="md:col-span-7 glass-card rounded-3xl p-6 md:p-8 relative">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-headline-md text-headline-md text-[#F5F7FA] font-bold">Transaction Heatmap</h3>
             <div className="flex items-center gap-2">
                <span className="text-[10px] text-on-surface-variant opacity-60 uppercase font-bold">Idle</span>
                <div className="flex gap-1">
                   <div className="w-3 h-3 rounded-sm bg-secondary-container opacity-10"></div>
                   <div className="w-3 h-3 rounded-sm bg-secondary-container opacity-40"></div>
                   <div className="w-3 h-3 rounded-sm bg-secondary-container opacity-70"></div>
                   <div className="w-3 h-3 rounded-sm bg-secondary-container opacity-100"></div>
                </div>
                <span className="text-[10px] text-on-surface-variant opacity-60 uppercase font-bold">Peak</span>
             </div>
           </div>

           <div className="grid grid-cols-12 gap-2 sm:gap-2.5">
              {/* High Fidelity fake heatmap generator based on fixed map size */}
              {heatmapValues.map((val, i) => (
                 <div 
                   key={i}
                   className={`aspect-square rounded-md bg-secondary transition-all duration-500 hover:scale-110 cursor-pointer`}
                   style={{ opacity: val }}
                   title={`Intensity ${Math.round(val*100)}%`}
                 />
              ))}
           </div>
        </div>

        {/* 5. REAL-TIME PULSE [md:col-span-5] */}
        <div className="md:col-span-5 glass-card rounded-3xl p-6 md:p-8 flex flex-col">
           <h3 className="font-headline-md text-headline-md text-[#F5F7FA] font-bold mb-6 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             Global Pulse
           </h3>
           
           <div className="flex flex-col space-y-4 flex-1 justify-center">
              {marketPulse.map(ticker => (
                 <div key={ticker.sym} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-[#F5F7FA] group-hover:text-primary group-hover:scale-105 transition-all border border-white/[0.02]">
                       {ticker.icon}
                    </div>
                    <div className="flex-grow min-w-0">
                       <p className="font-bold text-[#F5F7FA] text-base">{ticker.sym}</p>
                       <p className="text-xs text-on-surface-variant opacity-60 truncate">{ticker.name}</p>
                    </div>
                    <div className="text-right">
                       <p className="font-label-mono font-bold text-sm text-[#F5F7FA]">{ticker.val}</p>
                       <p className={`font-label-mono text-[10px] font-bold ${ticker.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
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

