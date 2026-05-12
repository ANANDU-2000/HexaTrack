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

import { AdminKpiCards } from '@/components/admin/admin-kpi-cards';
import { OrganizationList } from '@/components/admin/organization-list';
import { AuditLogPanel } from '@/components/admin/audit-log';

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

function formatRefreshedAt(d: Date): string {
  try {
    return d.toLocaleTimeString(undefined, { timeStyle: 'short' });
  } catch {
    return '';
  }
}

function formatAuditTime(iso: string): string {
  try {
     const date = new Date(iso);
     const now = new Date();
     const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
     if (diff < 1) return 'just now';
     if (diff < 60) return `${diff} mins ago`;
     if (diff < 1440) return `${Math.floor(diff/60)} hrs ago`;
     return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
     return 'recently';
  }
}

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

  // Adapt props mapping for the generalized visual components
  const mappedKpiStats = overview ? {
     orgs: dashboard?.totalActiveOrganizations || overview.totalWorkspaces,
     tokens: overview.aiPromptTokensLast30Days + overview.aiCompletionTokensLast30Days,
     revenue: dashboard?.totalSystemIncome30d || 0
  } : undefined;

  const mappedAudit = auditItems.slice(0, 6).map(a => ({
     id: a.id,
     title: a.action.replace(/\./g, ' ').toUpperCase(),
     timestamp: formatAuditTime(a.createdAt),
     userInitials: 'SYS',
     role: 'Admin' as const,
     status: a.action.includes('.denied') ? 'Denied' as const : 'Success' as const
  }));

  return (
    <div className="relative mx-auto max-w-7xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Dynamic Header Substrate */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
            <p className="font-label-mono text-[10px] font-black tracking-[0.25em] text-primary uppercase opacity-80 mb-1.5">Command Substrate</p>
            <h2 className="text-3xl font-display-lg font-black text-[#F5F7FA] tracking-tighter leading-none">Neural Control Center</h2>
            <p className="text-xs text-on-surface-variant opacity-70 font-medium mt-2 flex items-center gap-2">
               <span>Aggregated Telemetry Stream</span>
               {lastRefreshedAt && (
                  <>
                     <span className="w-1 h-1 rounded-full bg-white/20" />
                     <span className="text-emerald-400 font-label-mono font-bold text-[10px]">SYNCHRONIZED {formatRefreshedAt(lastRefreshedAt)}</span>
                  </>
               )}
            </p>
         </div>

         <div className="flex items-center gap-3">
            <div className="bg-[#111827]/60 backdrop-blur-xl border border-white/[0.05] p-1 rounded-xl flex gap-1">
               {RANGE_OPTIONS.map(opt => (
                  <button
                    key={opt.days}
                    onClick={() => onChartDaysChange(opt.days)}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                       chartDays === opt.days ? 'bg-white/10 text-[#F5F7FA] shadow-sm' : 'text-on-surface-variant hover:text-white'
                    }`}
                  >
                     {opt.label}
                  </button>
               ))}
            </div>
            <button 
              onClick={onRefresh}
              disabled={overviewLoading}
              className="w-9 h-9 rounded-xl bg-[#111827]/60 border border-white/[0.05] flex items-center justify-center text-on-surface-variant hover:text-white hover:border-white/20 transition-all disabled:opacity-50 shadow-sm"
            >
               <RefreshCw size={14} className={overviewLoading ? 'animate-spin' : ''} />
            </button>
         </div>
      </div>

      {/* Error Catchment */}
      {err && (
         <div className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-5 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
               <AlertCircle size={20} className="text-rose-400" />
               <p className="text-sm font-bold text-rose-400">Subsystem Disconnected: {err}</p>
            </div>
            <button onClick={onRetry} className="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110">Reboot link</button>
         </div>
      )}

      {/* 1. KPI Metrics Grid */}
      <AdminKpiCards stats={mappedKpiStats} loading={showSkeleton} />

      {/* 2. Main Operation Substrate Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
         {/* Left: Registry streaming (replacing standard analytics grid placeholders) */}
         <div className="xl:col-span-7 min-h-[400px]">
            <OrganizationList loading={showSkeleton} />
         </div>
         
         {/* Right: Live Activity feeds */}
         <div className="xl:col-span-5 min-h-[400px]">
            <AuditLogPanel events={mappedAudit.length > 0 ? mappedAudit : undefined} />
         </div>
      </div>

      {/* 3. Contextual Detailed Plot Flow */}
      {!err && dashboard && (
        <motion.div
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="glass-card rounded-[32px] p-1 border border-white/[0.03] overflow-hidden"
        >
           <EnterpriseAnalyticsPanel dashboard={dashboard} chartDays={chartDays} />
        </motion.div>
      )}
    </div>
  );
}
