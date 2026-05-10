'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  ArrowRightLeft,
  Building2,
  CreditCard,
  Loader2,
  RefreshCw,
  ScrollText,
  Sparkles,
  Users,
} from 'lucide-react';
import type { AdminAnalyticsDashboard, AdminAnalyticsOverview, AdminAuditLogDto } from '@/lib/types';
import { EnterpriseAnalyticsSkeleton } from '@/components/admin/enterprise-analytics-skeleton';
import { GlassCard } from '@/components/admin/glass-card';

const EnterpriseAnalyticsPanel = dynamic(
  () =>
    import('@/components/admin/enterprise-analytics').then((mod) => ({
      default: mod.EnterpriseAnalytics,
    })),
  {
    ssr: false,
    loading: () => <EnterpriseAnalyticsSkeleton />,
  },
);

function formatTokenCount(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

function formatAuditWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

function formatRefreshedAt(d: Date): string {
  try {
    return d.toLocaleTimeString(undefined, { timeStyle: 'short' });
  } catch {
    return '';
  }
}

function auditBadgeClass(action: string): string {
  if (action.endsWith('.denied')) {
    return 'border-[rgba(255,92,117,0.35)] bg-[rgba(255,92,117,0.12)] text-[#FF5C75]';
  }
  if (action === 'admin.login' || action.startsWith('superadmin.')) {
    return 'border-[rgba(79,140,255,0.35)] bg-[rgba(79,140,255,0.12)] text-[#4F8CFF]';
  }
  if (
    action.startsWith('featureflag.') ||
    action.startsWith('global_setting') ||
    action.startsWith('subscription.')
  ) {
    return 'border-[rgba(31,209,139,0.35)] bg-[rgba(31,209,139,0.12)] text-[#1FD18B]';
  }
  if (action.startsWith('user.')) {
    return 'border-[rgba(79,140,255,0.35)] bg-[rgba(79,140,255,0.12)] text-[#4F8CFF]';
  }
  return 'border-[rgba(255,255,255,0.1)] bg-white/[0.06] text-[#8B9BB4]';
}

const listMotion = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.06 },
  },
};

const cardMotion = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 420, damping: 28 },
  },
};

const RANGE_OPTIONS = [
  { days: 7, label: '7d' },
  { days: 30, label: '30d' },
  { days: 90, label: '90d' },
  { days: 365, label: '1y' },
] as const;

export type ControlCenterOverviewProps = {
  overview: AdminAnalyticsOverview | null;
  dashboard: AdminAnalyticsDashboard | null;
  overviewLoading: boolean;
  dashboardLoading: boolean;
  overviewError: string | null;
  dashboardError: string | null;
  auditItems: AdminAuditLogDto[];
  auditLoading: boolean;
  chartDays: number;
  onChartDaysChange: (days: number) => void;
  onRetry: () => void;
  onOpenAudit: () => void;
  lastRefreshedAt: Date | null;
  onRefresh: () => void;
};

export function ControlCenterOverview({
  overview,
  dashboard,
  overviewLoading,
  dashboardLoading,
  overviewError,
  dashboardError,
  auditItems,
  auditLoading,
  chartDays,
  onChartDaysChange,
  onRetry,
  onOpenAudit,
  lastRefreshedAt,
  onRefresh,
}: ControlCenterOverviewProps) {
  const showSkeleton = (overviewLoading && !overview) || (dashboardLoading && !dashboard);
  const err = overviewError ?? dashboardError;

  const peakDau =
    dashboard && dashboard.activeUsersByDay.length > 0
      ? Math.max(...dashboard.activeUsersByDay.map((x) => x.value))
      : 0;
  const totalTx = dashboard
    ? dashboard.transactionsByDay.reduce((s, d) => s + d.value, 0)
    : 0;

  return (
    <div className="relative mx-auto max-w-7xl min-w-0 space-y-6 overflow-x-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8B9BB4]">Control center</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#F5F7FA] md:text-2xl">
            Enterprise analytics
          </h2>
          <p className="mt-1 max-w-xl text-sm text-[#8B9BB4]">
            Live platform metrics — refreshed automatically while you stay on this tab.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Analytics range">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.days}
                type="button"
                onClick={() => onChartDaysChange(opt.days)}
                className={`min-h-[44px] rounded-[18px] px-4 text-sm font-semibold transition-all sm:px-5 ${
                  chartDays === opt.days
                    ? 'bg-[#4F8CFF] text-white shadow-[0_8px_24px_rgba(79,140,255,0.25)]'
                    : 'border border-[rgba(255,255,255,0.08)] bg-[#121A22]/80 text-[#8B9BB4] backdrop-blur-xl hover:text-[#F5F7FA]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onRefresh()}
              disabled={overviewLoading || dashboardLoading}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[#121A22]/80 px-4 text-sm font-semibold text-[#8B9BB4] backdrop-blur-xl transition-colors hover:border-[#4F8CFF]/35 hover:text-[#F5F7FA] disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${overviewLoading || dashboardLoading ? 'animate-spin' : ''}`}
                aria-hidden
              />
              Refresh
            </button>
            {lastRefreshedAt ? (
              <span className="text-xs text-[#8B9BB4]">Updated {formatRefreshedAt(lastRefreshedAt)}</span>
            ) : null}
          </div>
        </div>
      </div>

      {err ? (
        <motion.div
          role="alert"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 rounded-3xl border border-[rgba(255,92,117,0.25)] bg-[rgba(255,92,117,0.06)] p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#FF5C75]" aria-hidden />
            <p className="text-sm text-[#FF5C75]">{err}</p>
          </div>
          <button
            type="button"
            onClick={() => onRetry()}
            className="min-h-[44px] shrink-0 rounded-[18px] bg-[#4F8CFF] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Retry
          </button>
        </motion.div>
      ) : null}

      {showSkeleton ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-3xl border border-[rgba(255,255,255,0.06)] bg-[#121A22]/50"
            />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={listMotion}
          initial="hidden"
          animate="show"
        >
          {overview
            ? [
                {
                  label: 'Total users',
                  value: formatTokenCount(overview.totalUsers),
                  icon: Users,
                  accent: 'text-[#4F8CFF]',
                },
                {
                  label: 'Workspaces',
                  value: formatTokenCount(overview.totalWorkspaces),
                  icon: Building2,
                  accent: 'text-[#1FD18B]',
                },
                {
                  label: 'Active subscriptions',
                  value: formatTokenCount(overview.activeSubscriptions),
                  icon: CreditCard,
                  accent: 'text-[#4F8CFF]',
                },
                {
                  label: 'AI tokens (30d)',
                  value: formatTokenCount(
                    overview.aiPromptTokensLast30Days + overview.aiCompletionTokensLast30Days,
                  ),
                  icon: Sparkles,
                  accent: 'text-[#1FD18B]',
                },
                {
                  label: `Peak daily active (${chartDays}d)`,
                  value: formatTokenCount(peakDau),
                  icon: Activity,
                  accent: 'text-[#4F8CFF]',
                },
                {
                  label: `Transactions (${chartDays}d)`,
                  value: formatTokenCount(totalTx),
                  icon: ArrowRightLeft,
                  accent: 'text-[#8B9BB4]',
                },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <motion.div key={c.label} variants={cardMotion}>
                    <GlassCard bodyClassName="p-5">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0B1015]/80 ${c.accent}`}
                        >
                          <Icon className="h-5 w-5" aria-hidden />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-[#8B9BB4]">{c.label}</p>
                          <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-[#F5F7FA]">
                            {c.value}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })
            : null}
        </motion.div>
      )}

      {!err && dashboardLoading && !dashboard ? <EnterpriseAnalyticsSkeleton /> : null}
      {!err && dashboard ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <EnterpriseAnalyticsPanel dashboard={dashboard} chartDays={chartDays} />
        </motion.div>
      ) : null}

      <GlassCard
        bodyClassName="px-0 pb-0 pt-0"
        title="Audit activity"
        subtitle="Latest platform events across security and configuration."
        actions={
          <button
            type="button"
            onClick={onOpenAudit}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[#0B1015]/60 px-4 text-xs font-semibold text-[#8B9BB4] backdrop-blur-sm transition-colors hover:border-[#4F8CFF]/35 hover:text-[#F5F7FA]"
          >
            <ScrollText className="h-4 w-4" aria-hidden />
            Full log
          </button>
        }
      >
        <div className="max-h-[420px] overflow-y-auto overscroll-contain px-2 pb-3">
          {auditLoading && auditItems.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-[#8B9BB4]">
              <Loader2 className="h-5 w-5 animate-spin text-[#4F8CFF]" aria-hidden />
              Loading activity…
            </div>
          ) : auditItems.length === 0 ? (
            <p className="py-12 text-center text-sm text-[#8B9BB4]">No audit entries yet.</p>
          ) : (
            <ul className="divide-y divide-[rgba(255,255,255,0.06)]">
              {auditItems.map((a, idx) => (
                <motion.li
                  key={a.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex max-w-full rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${auditBadgeClass(a.action)}`}
                      >
                        <span className="truncate">{a.action}</span>
                      </span>
                      <span className="text-xs text-[#8B9BB4]">{formatAuditWhen(a.createdAt)}</span>
                    </div>
                    <p className="mt-2 break-all font-mono text-[11px] text-[#8B9BB4]">
                      Actor {a.actorUserId}
                      {a.targetType ? ` · ${a.targetType}` : ''}
                    </p>
                  </div>
                  {a.ipAddress ? (
                    <p className="shrink-0 text-[11px] text-[#8B9BB4]">{a.ipAddress}</p>
                  ) : null}
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </GlassCard>

      {overviewLoading && overview ? (
        <p className="flex items-center justify-center gap-2 text-xs text-[#8B9BB4]">
          <Loader2 className="h-4 w-4 animate-spin text-[#4F8CFF]" aria-hidden />
          Refreshing metrics…
        </p>
      ) : null}
    </div>
  );
}
