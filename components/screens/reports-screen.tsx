'use client';

import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Loader2, 
  PieChart, 
  RefreshCw, 
  TrendingUp 
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  Cell, 
  Pie, 
  PieChart as RePieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid
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
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

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
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Unable to load reports.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [from, to]);

  const activeReport = report ?? emptyReport;

  // Prepare Data for Rich Charts
  const cashflowData = useMemo(() => {
    return activeReport.cashflow.map(item => ({
      period: new Date(item.period).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      income: item.income,
      expense: item.expense,
      net: item.income - item.expense
    }));
  }, [activeReport.cashflow]);

  const pieData = useMemo(() => {
    return activeReport.spendingByCategory.slice(0, 6).map(item => ({
      name: item.categoryName,
      value: item.amount
    }));
  }, [activeReport.spendingByCategory]);

  const totalSpend = useMemo(() => 
    activeReport.spendingByCategory.reduce((acc, curr) => acc + curr.amount, 0), 
  [activeReport.spendingByCategory]);

  const handleRetry = () => {
    setError(null);
    setReport(null);
    setLoading(true);
    hexaTrackApi.reportSummary(from, to).then(setReport).catch(e => setError(e instanceof ApiError ? e.message : 'Failed')).finally(() => setLoading(false));
  };

  const periodLabels: { key: Period; label: string }[] = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
    { key: 'all', label: 'All Data' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#4F8CFF] uppercase">Intelligence Center</p>
          <h1 className="text-3xl font-bold text-[#F9FAFB] tracking-tight">Reports</h1>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setExportMenuOpen(!exportMenuOpen)}
            className="h-11 px-5 inline-flex items-center gap-2.5 bg-[#111827] border border-white/[0.05] hover:bg-white/[0.04] text-[#F9FAFB] text-sm font-semibold rounded-2xl shadow-sm transition-all"
          >
            <Download size={16} />
            Export Insights
          </button>

          {exportMenuOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setExportMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#111827] border border-white/[0.08] rounded-2xl shadow-xl p-2 z-30 animate-in slide-in-from-top-2 duration-150">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#F9FAFB] hover:bg-white/[0.05] rounded-xl transition-colors text-left">
                  <FileText size={16} className="text-[#4F8CFF]" /> PDF Document
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#F9FAFB] hover:bg-white/[0.05] rounded-xl transition-colors text-left">
                  <FileSpreadsheet size={16} className="text-[#22C55E]" /> Excel Sheet
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#F9FAFB] hover:bg-white/[0.05] rounded-xl transition-colors text-left">
                  <BarChart3 size={16} className="text-[#F59E0B]" /> CSV Matrix
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Range Selector */}
      <div className="flex p-1 gap-1 bg-[#111827] rounded-2xl border border-white/[0.05] shadow-sm max-w-md">
        {periodLabels.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setPeriod(key)}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              period === key ? 'bg-[#4F8CFF] text-white shadow-md shadow-[#4F8CFF]/20' : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-2xl border border-[#EF4444]/20 bg-[#EF4444]/5 p-4 flex items-center justify-between">
          <p className="text-sm font-medium text-[#EF4444]">{error}</p>
          <button onClick={handleRetry} className="text-xs font-bold text-[#F9FAFB] underline">Try Again</button>
        </div>
      )}

      {loading && !report ? (
        <div className="space-y-6">
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             {[1,2,3].map(i => <div key={i} className="h-32 rounded-3xl bg-[#111827] animate-pulse" />)}
           </div>
           <div className="h-80 rounded-3xl bg-[#111827] animate-pulse" />
        </div>
      ) : null}

      {report && (
        <div className="space-y-6 animate-in fade-in duration-700">
          
          {/* High Level Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard 
              icon={<TrendingUp size={20} />}
              label="Net Position"
              value={money(activeReport.net)}
              subtext="Real-time equity flow"
              color="#4F8CFF"
            />
            <MetricCard 
              icon={<ArrowDownLeft size={20} />}
              label="Liquidity Inflow"
              value={money(activeReport.income)}
              subtext="Total gross income"
              color="#22C55E"
            />
            <MetricCard 
              icon={<ArrowUpRight size={20} />}
              label="Total Debits"
              value={money(activeReport.expense)}
              subtext="All combined overhead"
              color="#EF4444"
            />
          </div>

          {/* Core Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Cash Flow Visualized (Span 2) */}
            <div className="lg:col-span-2 bg-[#111827] border border-white/[0.05] rounded-[32px] p-6 md:p-8">
              <div className="mb-8">
                <h3 className="text-lg font-bold text-[#F9FAFB]">Capital Flow Dynamics</h3>
                <p className="text-sm text-[#9CA3AF] mt-1">Performance assessment by operational cycle</p>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashflowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.03} vertical={false} />
                    <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11, fontWeight: 500}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0B1015', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}
                      itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                      labelStyle={{ color: '#9CA3AF', marginBottom: '4px', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="income" stroke="#22C55E" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncome)" name="Inflow" />
                    <Area type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpense)" name="Outflow" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Composition */}
            <div className="bg-[#111827] border border-white/[0.05] rounded-[32px] p-6 md:p-8 flex flex-col">
              <div>
                <h3 className="text-lg font-bold text-[#F9FAFB]">Category Distribution</h3>
                <p className="text-sm text-[#9CA3AF] mt-1">Weighted allocation profile</p>
              </div>

              <div className="flex-1 relative min-h-[220px] flex items-center justify-center">
                {pieData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={pieData}
                          innerRadius={70}
                          outerRadius={90}
                          paddingAngle={4}
                          dataKey="value"
                          stroke="none"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                           contentStyle={{ backgroundColor: '#0B1015', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff' }}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                    <div className="absolute flex flex-col items-center">
                       <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Total</span>
                       <span className="text-xl font-bold text-[#F9FAFB] mt-0.5">{money(totalSpend)}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-[#9CA3AF] text-center">No expenditure logged.</p>
                )}
              </div>

              <div className="mt-4 space-y-3">
                {pieData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                      <span className="text-xs font-medium text-[#F9FAFB]">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-[#9CA3AF]">{percent((item.value / Math.max(totalSpend, 1)) * 100)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comprehensive Spend Bars */}
          <div className="bg-[#111827] border border-white/[0.05] rounded-[32px] p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#F9FAFB]">Comparative Overhead</h3>
                <p className="text-sm text-[#9CA3AF] mt-1">Analysis of dominant categorical volumes</p>
              </div>
            </div>

            {activeReport.spendingByCategory.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activeReport.spendingByCategory.slice(0, 10)} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.02} horizontal={true} vertical={false} />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} />
                    <YAxis type="category" dataKey="categoryName" axisLine={false} tickLine={false} tick={{fill: '#F9FAFB', fontSize: 12, fontWeight: 600}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0B1015', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                      cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    />
                    <Bar dataKey="amount" name="Spend" radius={[0, 8, 8, 0]} barSize={24}>
                       {activeReport.spendingByCategory.slice(0, 10).map((e, i) => (
                          <Cell key={`bar-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                       ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[150px] flex items-center justify-center text-sm text-[#9CA3AF]">
                Awaiting fiscal activity inputs.
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

function MetricCard({ icon, label, value, subtext, color }: { icon: React.ReactNode, label: string, value: string, subtext: string, color: string }) {
  return (
    <div className="bg-[#111827] border border-white/[0.05] rounded-[32px] p-6 flex flex-col relative overflow-hidden group">
      <div 
        className="absolute top-0 right-0 w-24 h-24 opacity-5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110 duration-500"
        style={{ backgroundColor: color }}
      />
      <div 
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
        style={{ backgroundColor: `${color}15`, color: color }}
      >
        {icon}
      </div>
      <span className="text-xs font-bold tracking-wide text-[#9CA3AF] uppercase">{label}</span>
      <span className="text-2xl font-bold text-[#F9FAFB] mt-1 tracking-tight">{value}</span>
      <span className="text-[11px] font-medium text-[#9CA3AF]/60 mt-2 uppercase tracking-wider">{subtext}</span>
    </div>
  );
}
