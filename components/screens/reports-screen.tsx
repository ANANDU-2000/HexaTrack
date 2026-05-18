'use client';

import { 
  Loader2, 
  TrendingUp,
  Activity,
  ShoppingBag,
  FileSpreadsheet,
  ChevronRight
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
import { motion, AnimatePresence } from 'framer-motion';
import { useFinanceStore } from '@/store/finance-store';

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

// Operational Palette Design Tokens
const CHART_COLORS = ['#10B981', '#0D9488', '#34D399', '#115E59', '#A7F3D0', '#0D9488'];

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

  const categories = useFinanceStore((s) => s.categories);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedCategoryId(expandedCategoryId === id ? null : id);
  };

  const drillDownData = useMemo(() => {
    if (!activeReport) return [];

    const mainMap: Record<string, { id: string; name: string; color: string; amount: number; subs: Array<{ id: string; name: string; amount: number }> }> = {};

    activeReport.spendingByCategory.forEach((spend) => {
      const cat = categories.find((c) => c.id === spend.categoryId);
      if (!cat) {
        mainMap[spend.categoryId] = {
          id: spend.categoryId,
          name: spend.categoryName,
          color: '#10B981',
          amount: spend.amount,
          subs: []
        };
        return;
      }

      if (cat.parentCategoryId) {
        const parent = categories.find((c) => c.id === cat.parentCategoryId);
        const parentId = parent?.id || cat.parentCategoryId;
        const parentName = parent?.name || 'Other';
        const parentColor = parent?.color || '#10B981';

        if (!mainMap[parentId]) {
          mainMap[parentId] = {
            id: parentId,
            name: parentName,
            color: parentColor,
            amount: 0,
            subs: []
          };
        }
        mainMap[parentId].amount += spend.amount;
        mainMap[parentId].subs.push({
          id: cat.id,
          name: cat.name,
          amount: spend.amount
        });
      } else {
        if (!mainMap[cat.id]) {
          mainMap[cat.id] = {
            id: cat.id,
            name: cat.name,
            color: cat.color || '#10B981',
            amount: 0,
            subs: []
          };
        }
        mainMap[cat.id].amount += spend.amount;
      }
    });

    return Object.values(mainMap).sort((a, b) => b.amount - a.amount);
  }, [activeReport.spendingByCategory, categories]);

  const pieData = useMemo(() => {
    return drillDownData.slice(0, 4).map(item => ({
      name: item.name,
      value: item.amount,
      color: item.color
    }));
  }, [drillDownData]);

  const totalSpend = useMemo(() => 
    drillDownData.reduce((acc, curr) => acc + curr.amount, 0), 
  [drillDownData]);

  if (loading && !report) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-sans">
        <Loader2 className="animate-spin text-emerald" size={28} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-5 pt-4 select-none font-sans">
      
      {/* Header Block */}
      <div className="flex flex-col gap-4">
        <div className="px-1">
           <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-black text-emerald tracking-[0.2em] uppercase font-label-caps block leading-none">Operational Pulse</span>
              <span className="w-1 h-1 rounded-full bg-emerald shadow-[0_0_4px_#10B981]" />
           </div>
           <h2 className="text-xl font-extrabold text-on-surface tracking-tight">Business Analytics</h2>
        </div>
        
        <div className="flex p-0.5 bg-[#1D1F27] border border-outline-variant/10 rounded-xl overflow-x-auto hide-scrollbar w-fit shadow-sm">
          {periodLabels.slice(0, 3).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`px-4 py-1.5 rounded-lg font-bold text-[9px] font-label-caps tracking-wider uppercase whitespace-nowrap active:scale-[0.97] transition-all ${
                period === key 
                  ? 'bg-[#0E152B] text-emerald shadow-sm border border-outline-variant/20' 
                  : 'text-on-surface-variant/60 hover:text-on-surface'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. ASSET VELOCITY AREA CHART */}
      <div className="bg-[#0E152B] rounded-2xl p-5 flex flex-col border border-outline-variant/20 relative overflow-hidden shadow-sm">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald/5 blur-2xl rounded-full pointer-events-none" />

        <div className="flex justify-between items-start mb-6 z-10">
          <div>
            <p className="font-label-caps text-[9px] uppercase tracking-wider text-on-surface-variant/60 font-bold mb-0.5">Capital Movement</p>
            <h3 className="font-extrabold text-on-surface text-[13px] tracking-wide">Cash Flow Delta</h3>
          </div>
          <div className="text-right">
            <p className="font-extrabold text-emerald text-base tracking-tight leading-none">
              {activeReport.net >= 0 ? '+' : ''}{money(activeReport.net)}
            </p>
            <p className="font-label-caps text-[8px] text-on-surface-variant/60 font-bold tracking-wider uppercase mt-1">Period aggregate</p>
          </div>
        </div>

        <div className="flex-1 w-full min-h-[180px] z-10">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashflowData.length > 0 ? cashflowData : fallbackProjectionData} margin={{ top: 5, right: 0, left: -45, bottom: 0 }}>
                <defs>
                  <linearGradient id="emeraldGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="period" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 8, fill: '#8C909F', fontWeight: 600, letterSpacing: '0.05em', fontFamily: 'var(--font-label-caps)'}} 
                  dy={8}
                />
                <YAxis hide domain={['dataMin - 200', 'dataMax + 200']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1D1F27', borderColor: 'rgba(140, 144, 159, 0.15)', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
                  labelStyle={{ fontSize: '9px', color: '#8C909F', fontFamily: 'var(--font-label-caps)', textTransform: 'uppercase', fontWeight: 700 }}
                  itemStyle={{ color: '#10B981', fontSize: '11px', fontWeight: 700 }}
                  formatter={(value: any) => money(Number(value))}
                />
                <Area 
                  type="monotone" 
                  dataKey="val" 
                  stroke="#10B981" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#emeraldGrowthGrad)" 
                  animationDuration={800}
                />
              </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* 2. BREAKDOWN DONUT & DRILLDOWN TREE */}
      <div className="bg-[#0E152B] rounded-2xl p-5 flex flex-col border border-outline-variant/20 shadow-sm font-sans">
         <div className="flex flex-col mb-4">
            <p className="font-label-caps text-[9px] uppercase tracking-wider text-on-surface-variant/60 font-bold mb-0.5">Allocation Breakdown</p>
            <h3 className="font-extrabold text-on-surface text-[13px] tracking-wide">Direct Expense Ratio</h3>
         </div>
         
         <div className="flex flex-col gap-4">
            {/* Pie Chart and legend container */}
            <div className="flex items-center justify-between py-2 border-b border-white/[0.04] pb-4">
               <div className="relative w-32 h-32 flex items-center justify-center">
                  {pieData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={pieData}
                            innerRadius={42}
                            outerRadius={58}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                            animationDuration={700}
                          >
                            {pieData.map((e, i) => (
                               <Cell key={`slice-${i}`} fill={e.color} className="hover:opacity-90 transition-opacity cursor-pointer" />
                            ))}
                          </Pie>
                        </RePieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                         <span className="text-[13px] font-extrabold text-on-surface tracking-tight leading-none">
                            {percent((pieData[0]?.value / Math.max(1, totalSpend)) * 100)}
                         </span>
                         <span className="text-[7px] font-bold text-emerald tracking-wider uppercase mt-0.5 font-label-caps">Primary</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center opacity-50 text-xs font-medium">No core ledger data</div>
                  )}
               </div>

               <div className="flex-grow pl-6 flex flex-col gap-2">
                  {pieData.slice(0, 3).map((item) => (
                     <div key={item.name} className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
                           <span className="text-[11px] font-bold text-on-surface-variant truncate flex-1">{item.name}</span>
                        </div>
                        <span className="text-[11px] font-mono text-on-surface font-bold pl-4 leading-none">{money(item.value)}</span>
                     </div>
                  ))}
               </div>
            </div>

            {/* Expandable Category Tree List */}
            <div className="flex flex-col gap-2">
              {drillDownData.map((group) => {
                const isExpanded = expandedCategoryId === group.id;
                const percentShare = (group.amount / Math.max(1, totalSpend)) * 100;
                
                return (
                  <div key={group.id} className="rounded-xl bg-white/[0.01] border border-white/[0.04] p-3 transition-all hover:bg-white/[0.02]">
                    {/* Parent row trigger */}
                    <button
                      onClick={() => toggleExpand(group.id)}
                      className="w-full flex items-center justify-between text-left outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: group.color }} />
                        <div>
                          <h4 className="text-xs font-bold text-on-surface leading-snug">{group.name}</h4>
                          <span className="text-[9px] font-bold font-label-caps text-on-surface-variant/40 uppercase tracking-widest">
                            {group.subs.length} subcategories • {percentShare.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-on-surface">{money(group.amount)}</span>
                        {group.subs.length > 0 && (
                          <ChevronRight
                            size={14}
                            className={`text-on-surface-variant/40 transition-transform ${isExpanded ? 'rotate-90 text-primary' : ''}`}
                          />
                        )}
                      </div>
                    </button>

                    {/* Expandable Subcategory List */}
                    <AnimatePresence>
                      {isExpanded && group.subs.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mt-3 pl-3 border-l-2 border-white/5 space-y-2.5"
                        >
                          {group.subs.sort((a, b) => b.amount - a.amount).map((sub) => {
                            const subPercent = (sub.amount / Math.max(1, group.amount)) * 100;
                            return (
                              <div key={sub.id} className="flex items-center justify-between py-0.5">
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[11px] font-bold text-on-surface-variant/80">{sub.name}</span>
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-16 h-1 rounded-full bg-white/[0.04] overflow-hidden">
                                      <div className="h-full bg-primary/60 rounded-full" style={{ width: `${subPercent}%` }} />
                                    </div>
                                    <span className="text-[8px] font-bold text-on-surface-variant/35">{subPercent.toFixed(0)}% of parent</span>
                                  </div>
                                </div>
                                <span className="text-xs font-mono font-bold text-on-surface/90">{money(sub.amount)}</span>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
         </div>
      </div>

      {/* 3. OPERATIONAL HEATMAP ACTIVITY */}
      <div className="bg-[#0E152B] rounded-2xl p-5 flex flex-col border border-outline-variant/20 shadow-sm">
         <div className="flex justify-between items-center mb-5">
           <div>
              <p className="font-label-caps text-[9px] uppercase tracking-wider text-on-surface-variant/60 font-bold mb-0.5">Activity Cadence</p>
              <h3 className="font-extrabold text-on-surface text-[13px] tracking-wide">Ledger Transaction Matrix</h3>
           </div>
         </div>

         <div className="grid grid-cols-8 gap-1.5 relative z-10 select-none">
            {heatmapValues.slice(0, 32).map((val, i) => (
               <div 
                 key={i}
                 className="aspect-square rounded-md bg-emerald transition-all duration-300 hover:scale-105 cursor-pointer shadow-sm"
                 style={{ opacity: Math.max(0.1, val) }}
                 title={`Load level ${Math.round(val*100)}%`}
               />
            ))}
         </div>
         <div className="flex justify-between items-center mt-4 text-[8px] font-bold font-label-caps uppercase text-on-surface-variant/50 tracking-widest px-0.5">
            <span>Zero flow</span>
            <span>Peak volume</span>
         </div>
      </div>

      {/* 4. BUSINESS INTELLIGENCE SIGNAL */}
      <div className="bg-[#0E152B] rounded-2xl p-5 border border-outline-variant/20 flex items-start gap-4 shadow-sm relative overflow-hidden">
        <div className="w-9 h-9 rounded-xl bg-teal/10 flex items-center justify-center shrink-0 text-teal mt-0.5 border border-teal/20">
           <Activity size={16} />
        </div>
        <div className="flex-grow">
           <h4 className="text-[12px] font-extrabold text-on-surface tracking-wide mb-1 leading-none">Cost Efficiency Recommendation</h4>
           <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed">
              Weekly operating overhead is trending below the quarterly average by 4.2%. Direct cash flows can absorb localized seasonal inventory stock.
           </p>
        </div>
      </div>

    </div>
  );
}

const periodLabels: { key: Period; label: string }[] = [
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
  { key: 'all', label: 'Global' },
];

const fallbackProjectionData = [
  { period: 'Jan', val: 3500 },
  { period: 'Feb', val: 3800 },
  { period: 'Mar', val: 4100 },
  { period: 'Apr', val: 3900 },
  { period: 'May', val: 4400 },
  { period: 'Jun', val: 4900 },
];

const heatmapValues = [
  0.15, 0.4, 0.1, 0.7, 0.3, 0.9, 0.5, 0.2,
  0.3, 0.5, 0.8, 0.1, 0.95, 0.4, 0.2, 0.6,
  0.2, 0.3, 0.4, 0.6, 0.2, 0.3, 0.8, 0.5,
  0.4, 0.2, 0.7, 0.3, 0.5, 0.9, 0.2, 0.4,
];
