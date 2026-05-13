'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRightLeft,
  CreditCard,
  Sparkles,
  Tags,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react';
import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AdminAnalyticsDashboard } from '@/lib/types';
import { GlassCard } from '@/components/admin/glass-card';

const PIE_COLORS = ['#06B6D4', '#6366F1', '#10B981', '#cfbcff'];
const CHART_AXIS = { stroke: '#9CA3AF', fontSize: 9, fontWeight: 800, fontFamily: 'var(--font-label-caps)', letterSpacing: '0.05em' };
const tooltipProps = {
  contentStyle: {
    background: '#111827',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: 16,
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    padding: '10px 14px',
  },
  labelStyle: { color: '#9CA3AF', fontSize: '10px', fontWeight: 800, fontFamily: 'var(--font-label-caps)', textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
  itemStyle: { color: '#06B6D4', fontWeight: 700, fontSize: '12px', fontFamily: 'var(--font-mono-data)' },
};

const sectionMotion = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 380, damping: 32 },
  },
};

function formatInr(n: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
}

function formatUsd(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function formatTokenCount(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

function formatAxisDate(iso: string): string {
  try {
    return new Date(`${iso}T00:00:00Z`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).toUpperCase();
  } catch {
    return iso;
  }
}

export type EnterpriseAnalyticsProps = {
  dashboard: AdminAnalyticsDashboard;
  chartDays: number;
};

export function EnterpriseAnalytics({ dashboard, chartDays }: EnterpriseAnalyticsProps) {
  const conversionSeries = useMemo(() => {
    return dashboard.newUsersByDay.map((row, i) => {
      const paid = dashboard.newPayingSubscriptionsByDay[i]?.value ?? 0;
      const signups = row.value;
      const conversionPct = signups > 0 ? Math.round((paid / signups) * 1000) / 10 : 0;
      return {
        date: row.date,
        signups,
        paidAdds: paid,
        conversionPct,
      };
    });
  }, [dashboard.newPayingSubscriptionsByDay, dashboard.newUsersByDay]);

  const expenseBars = useMemo(
    () =>
      dashboard.expenseCategoryTotals.map((e) => ({
        label: `${e.categoryName} · ${e.currency}`,
        shortLabel: e.categoryName.length > 14 ? `${e.categoryName.slice(0, 12)}…` : e.categoryName,
        total: Number(e.totalAmount),
        count: e.transactionCount,
        currency: e.currency,
      })),
    [dashboard.expenseCategoryTotals],
  );

  return (
    <div className="space-y-6 font-sans">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-wrap items-center gap-2 text-[11px] text-on-surface-variant font-semibold"
      >
        <span className="rounded-xl border border-white/[0.04] bg-[#111827] px-3.5 py-1.5 font-black text-cyan tracking-widest uppercase font-label-caps shadow-sm">
          Range: last {chartDays} days (UTC)
        </span>
        <span className="opacity-85 ml-2">Aggregated analytical stream synthesizing core usage indexes.</span>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3 mt-2">
        <motion.div variants={sectionMotion} initial="hidden" animate="show" className="min-w-0 xl:col-span-2">
          <GlassCard
            bodyClassName="p-0"
            title="User registrations"
            subtitle="New accounts created per day."
            actions={<UserPlus className="h-4 w-4 text-cyan" aria-hidden />}
          >
            <div className="h-[280px] w-full min-w-0 max-w-full px-2 pb-4 pt-3 sm:px-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboard.newUsersByDay} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={CHART_AXIS}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={24}
                    tickFormatter={formatAxisDate}
                    dy={10}
                  />
                  <YAxis tick={CHART_AXIS} tickLine={false} axisLine={false} width={36} />
                  <Tooltip
                    {...tooltipProps}
                    labelFormatter={(l) => formatAxisDate(String(l))}
                    formatter={(v: number) => [formatTokenCount(v), 'Registrations']}
                  />
                  <Bar dataKey="value" fill="#10B981" name="Registrations" radius={[6, 6, 0, 0]} opacity={0.92} className="drop-shadow-[0_0_8px_rgba(16,185,129,0.15)]" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={sectionMotion} initial="hidden" animate="show" className="min-w-0">
          <GlassCard
            title="Revenue metrics"
            subtitle="Illustrative MRR from current indexes."
            actions={<CreditCard className="h-4 w-4 text-cyan" aria-hidden />}
          >
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-[20px] border border-white/[0.03] bg-[#111827]/60 p-4 shadow-sm">
                  <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant font-label-caps">Est. MRR</p>
                  <p className="mt-1.5 text-[15px] font-bold tracking-tight font-mono-data text-on-surface leading-none">
                    {formatInr(dashboard.estimatedMrrInr)}
                  </p>
                </div>
                <div className="rounded-[20px] border border-white/[0.03] bg-[#111827]/60 p-4 shadow-sm">
                  <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant font-label-caps">Active Seats</p>
                  <p className="mt-1.5 text-[15px] font-bold tracking-tight font-mono-data text-on-surface leading-none">
                    {formatTokenCount(dashboard.payingSubscriptionCount)}
                  </p>
                </div>
                <div className="rounded-[20px] border border-white/[0.03] bg-[#111827]/60 p-4 shadow-sm">
                  <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant font-label-caps">ARPU</p>
                  <p className="mt-1.5 text-[15px] font-bold tracking-tight font-mono-data text-cyan leading-none">
                    {formatInr(dashboard.averageRevenuePerPayingUserInr)}
                  </p>
                </div>
              </div>
              <div className="h-[210px] w-full min-w-0 max-w-full mt-1 relative z-10">
                {dashboard.activeSubscriptionsByPlan.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-xs italic font-medium text-on-surface-variant">
                    Zero synchronous deployments
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboard.activeSubscriptionsByPlan.map((x) => ({
                          name: x.plan,
                          value: x.count,
                        }))}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={72}
                        paddingAngle={5}
                        stroke="none"
                      >
                        {dashboard.activeSubscriptionsByPlan.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} className="hover:opacity-90 transition-opacity cursor-pointer" />
                        ))}
                      </Pie>
                      <Tooltip {...tooltipProps} />
                      <Legend
                        wrapperStyle={{ fontSize: 10, fontFamily: 'var(--font-label-caps)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        formatter={(value) => <span className="text-on-surface-variant ml-1">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={sectionMotion} initial="hidden" animate="show" className="min-w-0 xl:col-span-2">
          <GlassCard
            bodyClassName="p-0"
            title="Subscription conversion"
            subtitle="Registrations correlated to synchronous ledger allocations."
            actions={<TrendingUp className="h-4 w-4 text-cyan" aria-hidden />}
          >
            <div className="h-[290px] w-full min-w-0 max-w-full px-2 pb-4 pt-3 sm:px-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={conversionSeries} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={CHART_AXIS}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={28}
                    tickFormatter={formatAxisDate}
                    dy={10}
                  />
                  <YAxis yAxisId="left" tick={CHART_AXIS} tickLine={false} axisLine={false} width={32} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={CHART_AXIS}
                    tickLine={false}
                    axisLine={false}
                    width={36}
                    unit="%"
                  />
                  <Tooltip
                    {...tooltipProps}
                    labelFormatter={(l) => formatAxisDate(String(l))}
                    formatter={(value: number, name: string) => {
                      if (name === 'Conversion') return [`${value}%`, name];
                      return [formatTokenCount(value), name];
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'var(--font-label-caps)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                  <Bar yAxisId="left" dataKey="signups" fill="#10B981" name="Registrations" radius={[4, 4, 0, 0]} opacity={0.8} />
                  <Bar yAxisId="left" dataKey="paidAdds" fill="#6366F1" name="Committed" radius={[4, 4, 0, 0]} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="conversionPct"
                    stroke="#06B6D4"
                    strokeWidth={2.5}
                    dot={false}
                    name="Conversion"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={sectionMotion} initial="hidden" animate="show" className="min-w-0">
          <GlassCard
            bodyClassName="p-0"
            title="Active users"
            subtitle="Unique users interacting with active loops."
            actions={<Users className="h-4 w-4 text-cyan" aria-hidden />}
          >
            <div className="h-[290px] w-full min-w-0 max-w-full px-2 pb-4 pt-3 sm:px-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboard.activeUsersByDay} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={CHART_AXIS}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={24}
                    tickFormatter={formatAxisDate}
                    dy={10}
                  />
                  <YAxis tick={CHART_AXIS} tickLine={false} axisLine={false} width={36} />
                  <Tooltip
                    {...tooltipProps}
                    labelFormatter={(l) => formatAxisDate(String(l))}
                    formatter={(v: number) => [formatTokenCount(v), 'Active users']}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#6366F1"
                    strokeWidth={3}
                    dot={false}
                    name="DAU"
                    className="chart-glow"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={sectionMotion} initial="hidden" animate="show" className="min-w-0">
          <GlassCard
            bodyClassName="p-0"
            title="Daily transactions"
            subtitle="Aggregated state-mutation occurrences."
            actions={<ArrowRightLeft className="h-4 w-4 text-cyan" aria-hidden />}
          >
            <div className="h-[270px] w-full min-w-0 max-w-full px-2 pb-4 pt-3 sm:px-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboard.transactionsByDay} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={CHART_AXIS}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={20}
                    tickFormatter={formatAxisDate}
                    dy={10}
                  />
                  <YAxis tick={CHART_AXIS} tickLine={false} axisLine={false} width={40} />
                  <Tooltip
                    {...tooltipProps}
                    labelFormatter={(l) => formatAxisDate(String(l))}
                    formatter={(v: number) => [formatTokenCount(v), 'Transactions']}
                  />
                  <Bar dataKey="value" fill="#06B6D4" radius={[6, 6, 0, 0]} opacity={0.85} className="drop-shadow-[0_0_8px_rgba(6,182,212,0.15)]" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={sectionMotion} initial="hidden" animate="show" className="min-w-0 xl:col-span-2">
          <GlassCard
            bodyClassName="p-0"
            title="Workspace growth"
            subtitle="Cumulative environments mapped against incoming flows."
            actions={<Wallet className="h-4 w-4 text-cyan" aria-hidden />}
          >
            <div className="h-[290px] w-full min-w-0 max-w-full px-2 pb-4 pt-3 sm:px-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={dashboard.cumulativeWorkspacesByDay.map((c, i) => ({
                    date: c.date,
                    cumulative: c.value,
                    newWorkspaces: dashboard.newWorkspacesByDay[i]?.value ?? 0,
                  }))}
                  margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={CHART_AXIS}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={24}
                    tickFormatter={formatAxisDate}
                    dy={10}
                  />
                  <YAxis yAxisId="left" tick={CHART_AXIS} tickLine={false} axisLine={false} width={40} />
                  <YAxis yAxisId="right" orientation="right" tick={CHART_AXIS} tickLine={false} axisLine={false} width={32} />
                  <Tooltip
                    {...tooltipProps}
                    labelFormatter={(l) => formatAxisDate(String(l))}
                    formatter={(v: number, n: string) => [formatTokenCount(v), n]}
                  />
                  <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'var(--font-label-caps)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="cumulative"
                    stroke="#6366F1"
                    fill="#6366F1"
                    fillOpacity={0.15}
                    strokeWidth={2.5}
                    name="Cumulative"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="newWorkspaces"
                    fill="#10B981"
                    name="New / day"
                    radius={[4, 4, 0, 0]}
                    opacity={0.85}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={sectionMotion} initial="hidden" animate="show" className="min-w-0">
          <GlassCard
            bodyClassName="p-0"
            title="AI token usage"
            subtitle="Analytical inference vs generation volume."
            actions={<Sparkles className="h-4 w-4 text-cyan" aria-hidden />}
          >
            <div className="h-[290px] w-full min-w-0 max-w-full px-1 pb-3 pt-3 sm:px-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboard.tokenUsageByDay} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={CHART_AXIS}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={20}
                    tickFormatter={formatAxisDate}
                    dy={10}
                  />
                  <YAxis tick={CHART_AXIS} tickLine={false} axisLine={false} width={44} />
                  <Tooltip
                    {...tooltipProps}
                    formatter={(v: number, name: string) => [formatTokenCount(v), name]}
                    labelFormatter={(l) => formatAxisDate(String(l))}
                  />
                  <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'var(--font-label-caps)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                  <Area
                    type="monotone"
                    dataKey="promptTokens"
                    name="Prompt"
                    stackId="1"
                    stroke="#6366F1"
                    fill="#6366F1"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="completionTokens"
                    name="Completion"
                    stackId="1"
                    stroke="#06B6D4"
                    fill="#06B6D4"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={sectionMotion} initial="hidden" animate="show" className="min-w-0">
          <GlassCard
            bodyClassName="p-0"
            title="AI estimated cost"
            subtitle="Index calculations on prompt/completion loads."
            actions={<Activity className="h-4 w-4 text-cyan" aria-hidden />}
          >
            <div className="h-[290px] w-full min-w-0 max-w-full px-2 pb-4 pt-3 sm:px-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboard.tokenEstimatedCostByDay} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="saasCostFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={CHART_AXIS}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={20}
                    tickFormatter={formatAxisDate}
                    dy={10}
                  />
                  <YAxis tick={CHART_AXIS} tickLine={false} axisLine={false} width={44} />
                  <Tooltip
                    {...tooltipProps}
                    labelFormatter={(l) => formatAxisDate(String(l))}
                    formatter={(v: number) => [formatUsd(v), 'Est. cost']}
                  />
                  <Area
                    type="monotone"
                    dataKey="estimatedCostUsd"
                    stroke="#06B6D4"
                    strokeWidth={2.5}
                    fill="url(#saasCostFill)"
                    name="USD"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={sectionMotion} initial="hidden" animate="show" className="min-w-0 xl:col-span-3">
          <GlassCard
            bodyClassName="p-0"
            title="Expense classification"
            subtitle="High-volume outflow vectors across registered nodes."
            actions={<Tags className="h-4 w-4 text-cyan" aria-hidden />}
          >
            <div className="h-[min(420px,60vh)] w-full min-w-0 max-w-full px-2 pb-4 pt-3 sm:px-4 mt-1">
              {expenseBars.length === 0 ? (
                <div className="flex h-[280px] items-center justify-center text-xs font-medium italic text-on-surface-variant">
                  No classification data present
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={expenseBars}
                    margin={{ top: 12, right: 24, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid stroke="rgba(255,255,255,0.03)" horizontal={false} />
                    <XAxis type="number" tick={CHART_AXIS} tickLine={false} axisLine={false} />
                    <YAxis
                      type="category"
                      dataKey="shortLabel"
                      width={100}
                      tick={CHART_AXIS}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      {...tooltipProps}
                      formatter={(value: number, _n, item) => {
                        const payload = item.payload as { count?: number; currency?: string; label?: string };
                        return [
                          `${formatTokenCount(value)} ${payload.currency ?? ''} · ${payload.count ?? 0} tx`,
                          payload.label ?? 'Total',
                        ];
                      }}
                    />
                    <Bar dataKey="total" radius={[0, 6, 6, 0]} className="drop-shadow-[0_0_8px_rgba(99,102,241,0.15)]">
                      {expenseBars.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}

