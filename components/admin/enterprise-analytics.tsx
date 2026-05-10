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

const PIE_COLORS = ['#4F8CFF', '#1FD18B', '#FF5C75', '#8B9BB4'];
const CHART_AXIS = { stroke: '#8B9BB4', fontSize: 11 };
const tooltipProps = {
  contentStyle: {
    background: '#121A22',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: '10px 12px',
  },
  labelStyle: { color: '#F5F7FA' },
  itemStyle: { color: '#8B9BB4' },
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
    return new Date(`${iso}T00:00:00Z`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
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
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-wrap items-center gap-2 text-xs text-[#8B9BB4]"
      >
        <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[#0B1015]/60 px-3 py-1 font-medium text-[#8B9BB4]">
          Range: last {chartDays} days (UTC)
        </span>
        <span>Expense categories aggregate platform-wide expense transactions.</span>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <motion.div variants={sectionMotion} initial="hidden" animate="show" className="min-w-0 xl:col-span-2">
          <GlassCard
            bodyClassName="p-0"
            title="User registrations"
            subtitle="New accounts created per day."
            actions={<UserPlus className="h-4 w-4 text-[#8B9BB4]" aria-hidden />}
          >
            <div className="h-[260px] w-full min-w-0 max-w-full px-2 pb-4 pt-2 sm:px-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboard.newUsersByDay} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={CHART_AXIS}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={24}
                    tickFormatter={formatAxisDate}
                  />
                  <YAxis tick={CHART_AXIS} tickLine={false} axisLine={false} width={36} />
                  <Tooltip
                    {...tooltipProps}
                    labelFormatter={(l) => formatAxisDate(String(l))}
                    formatter={(v: number) => [formatTokenCount(v), 'Registrations']}
                  />
                  <Bar dataKey="value" fill="#1FD18B" name="Registrations" radius={[6, 6, 0, 0]} opacity={0.92} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={sectionMotion} initial="hidden" animate="show" className="min-w-0">
          <GlassCard
            title="Revenue metrics"
            subtitle="Illustrative MRR from list prices. Not payment-provider actuals."
            actions={<CreditCard className="h-4 w-4 text-[#8B9BB4]" aria-hidden />}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#0B1015]/50 p-4">
                  <p className="text-xs text-[#8B9BB4]">Est. MRR</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-[#F5F7FA]">
                    {formatInr(dashboard.estimatedMrrInr)}
                  </p>
                </div>
                <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#0B1015]/50 p-4">
                  <p className="text-xs text-[#8B9BB4]">Paying seats</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-[#F5F7FA]">
                    {formatTokenCount(dashboard.payingSubscriptionCount)}
                  </p>
                </div>
                <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#0B1015]/50 p-4">
                  <p className="text-xs text-[#8B9BB4]">ARPU (est.)</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-[#4F8CFF]">
                    {formatInr(dashboard.averageRevenuePerPayingUserInr)}
                  </p>
                </div>
              </div>
              <div className="h-[200px] w-full min-w-0 max-w-full">
                {dashboard.activeSubscriptionsByPlan.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-[#8B9BB4]">
                    No active subscriptions
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
                        innerRadius={48}
                        outerRadius={72}
                        paddingAngle={2}
                      >
                        {dashboard.activeSubscriptionsByPlan.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip {...tooltipProps} />
                      <Legend
                        wrapperStyle={{ fontSize: 11, color: '#8B9BB4' }}
                        formatter={(value) => <span className="text-[#8B9BB4]">{value}</span>}
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
            subtitle="Registrations vs new paid subscription rows (paid plan at creation). Conversion % = paid ÷ registrations."
            actions={<TrendingUp className="h-4 w-4 text-[#8B9BB4]" aria-hidden />}
          >
            <div className="h-[280px] w-full min-w-0 max-w-full px-2 pb-4 pt-2 sm:px-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={conversionSeries} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={CHART_AXIS}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={28}
                    tickFormatter={formatAxisDate}
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
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar yAxisId="left" dataKey="signups" fill="#1FD18B" name="Registrations" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="left" dataKey="paidAdds" fill="#4F8CFF" name="Paid rows" radius={[4, 4, 0, 0]} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="conversionPct"
                    stroke="#8B9BB4"
                    strokeWidth={2}
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
            subtitle="Distinct users with at least one transaction per day."
            actions={<Users className="h-4 w-4 text-[#8B9BB4]" aria-hidden />}
          >
            <div className="h-[280px] w-full min-w-0 max-w-full px-2 pb-4 pt-2 sm:px-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboard.activeUsersByDay} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={CHART_AXIS}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={24}
                    tickFormatter={formatAxisDate}
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
                    stroke="#4F8CFF"
                    strokeWidth={2}
                    dot={false}
                    name="DAU"
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
            subtitle="All transaction types by occurred date."
            actions={<ArrowRightLeft className="h-4 w-4 text-[#8B9BB4]" aria-hidden />}
          >
            <div className="h-[260px] w-full min-w-0 max-w-full px-2 pb-4 pt-2 sm:px-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboard.transactionsByDay} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={CHART_AXIS}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={20}
                    tickFormatter={formatAxisDate}
                  />
                  <YAxis tick={CHART_AXIS} tickLine={false} axisLine={false} width={40} />
                  <Tooltip
                    {...tooltipProps}
                    labelFormatter={(l) => formatAxisDate(String(l))}
                    formatter={(v: number) => [formatTokenCount(v), 'Transactions']}
                  />
                  <Bar dataKey="value" fill="#8B9BB4" radius={[6, 6, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={sectionMotion} initial="hidden" animate="show" className="min-w-0 xl:col-span-2">
          <GlassCard
            bodyClassName="p-0"
            title="Workspace growth"
            subtitle="Cumulative workspaces and new workspaces per day."
            actions={<Wallet className="h-4 w-4 text-[#8B9BB4]" aria-hidden />}
          >
            <div className="h-[280px] w-full min-w-0 max-w-full px-2 pb-4 pt-2 sm:px-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={dashboard.cumulativeWorkspacesByDay.map((c, i) => ({
                    date: c.date,
                    cumulative: c.value,
                    newWorkspaces: dashboard.newWorkspacesByDay[i]?.value ?? 0,
                  }))}
                  margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={CHART_AXIS}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={24}
                    tickFormatter={formatAxisDate}
                  />
                  <YAxis yAxisId="left" tick={CHART_AXIS} tickLine={false} axisLine={false} width={40} />
                  <YAxis yAxisId="right" orientation="right" tick={CHART_AXIS} tickLine={false} axisLine={false} width={32} />
                  <Tooltip
                    {...tooltipProps}
                    labelFormatter={(l) => formatAxisDate(String(l))}
                    formatter={(v: number, n: string) => [formatTokenCount(v), n]}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="cumulative"
                    stroke="#4F8CFF"
                    fill="#4F8CFF"
                    fillOpacity={0.15}
                    name="Cumulative"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="newWorkspaces"
                    fill="#1FD18B"
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
            subtitle="Prompt vs completion volume (UTC)."
            actions={<Sparkles className="h-4 w-4 text-[#8B9BB4]" aria-hidden />}
          >
            <div className="h-[280px] w-full min-w-0 max-w-full px-1 pb-3 sm:px-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboard.tokenUsageByDay} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={CHART_AXIS}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={20}
                    tickFormatter={formatAxisDate}
                  />
                  <YAxis tick={CHART_AXIS} tickLine={false} axisLine={false} width={44} />
                  <Tooltip
                    {...tooltipProps}
                    formatter={(v: number, name: string) => [formatTokenCount(v), name]}
                    labelFormatter={(l) => formatAxisDate(String(l))}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area
                    type="monotone"
                    dataKey="promptTokens"
                    name="Prompt"
                    stackId="1"
                    stroke="#4F8CFF"
                    fill="#4F8CFF"
                    fillOpacity={0.25}
                  />
                  <Area
                    type="monotone"
                    dataKey="completionTokens"
                    name="Completion"
                    stackId="1"
                    stroke="#1FD18B"
                    fill="#1FD18B"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={sectionMotion} initial="hidden" animate="show" className="min-w-0">
          <GlassCard
            bodyClassName="p-0"
            title="AI est. cost (USD)"
            subtitle="Illustrative rates: $3 / 1M prompt · $15 / 1M completion."
            actions={<Activity className="h-4 w-4 text-[#8B9BB4]" aria-hidden />}
          >
            <div className="h-[280px] w-full min-w-0 max-w-full px-2 pb-4 pt-2 sm:px-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboard.tokenEstimatedCostByDay} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="costFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF5C75" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#FF5C75" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={CHART_AXIS}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={20}
                    tickFormatter={formatAxisDate}
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
                    stroke="#FF5C75"
                    strokeWidth={2}
                    fill="url(#costFill)"
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
            title="Expense categories"
            subtitle="Top expense totals by category name and currency for the selected range."
            actions={<Tags className="h-4 w-4 text-[#8B9BB4]" aria-hidden />}
          >
            <div className="h-[min(420px,60vh)] w-full min-w-0 max-w-full px-2 pb-4 pt-2 sm:px-4">
              {expenseBars.length === 0 ? (
                <div className="flex h-[280px] items-center justify-center text-sm text-[#8B9BB4]">
                  No expense transactions in this range.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={expenseBars}
                    margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
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
                    <Bar dataKey="total" radius={[0, 6, 6, 0]}>
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
