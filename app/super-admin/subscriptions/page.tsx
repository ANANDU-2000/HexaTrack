'use client';

import React, { useEffect, useState } from 'react';
import { hexaTrackApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import type { AdminAnalyticsDashboard } from '@/lib/types';
import { CreditCard, Users, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubscriptionsPage() {
  const { accessToken } = useAuthStore();
  const [data, setData] = useState<AdminAnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    hexaTrackApi.admin.analyticsDashboard(90).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [accessToken]);

  if (loading) return <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  const d = data ?? {} as AdminAnalyticsDashboard;
  const plans = d.activeSubscriptionsByPlan ?? [];
  const total = plans.reduce((s, p) => s + p.count, 0);
  const colors: Record<string, string> = { Free: '#6B7280', Basic: '#3B82F6', Pro: '#10B981', ProMax: '#8B5CF6', Growth: '#F59E0B', Enterprise: '#EC4899' };

  return (
    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      <div>
        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Revenue</p>
        <h1 className="text-2xl font-bold text-white tracking-tight">Subscriptions</h1>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/[0.06] bg-[#0E1425] p-5">
          <CreditCard size={16} className="text-emerald-400 mb-2" />
          <p className="text-2xl font-bold text-white">{d.payingSubscriptionCount ?? 0}</p>
          <p className="text-[11px] text-gray-500">Paying Users</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl border border-white/[0.06] bg-[#0E1425] p-5">
          <DollarSign size={16} className="text-amber-400 mb-2" />
          <p className="text-2xl font-bold text-white">₹{(d.estimatedMrrInr ?? 0).toLocaleString()}</p>
          <p className="text-[11px] text-gray-500">Est. MRR</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-white/[0.06] bg-[#0E1425] p-5">
          <TrendingUp size={16} className="text-primary mb-2" />
          <p className="text-2xl font-bold text-white">₹{(d.averageRevenuePerPayingUserInr ?? 0).toLocaleString()}</p>
          <p className="text-[11px] text-gray-500">ARPU</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border border-white/[0.06] bg-[#0E1425] p-5">
          <Users size={16} className="text-pink-400 mb-2" />
          <p className="text-2xl font-bold text-white">{total}</p>
          <p className="text-[11px] text-gray-500">Total Subscriptions</p>
        </motion.div>
      </div>

      {/* Plan breakdown */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-white/[0.06] bg-[#0E1425] p-6">
        <p className="text-xs font-semibold text-gray-400 mb-6">Distribution by Plan</p>
        <div className="space-y-4">
          {plans.map((plan, i) => {
            const pct = total > 0 ? (plan.count / total) * 100 : 0;
            const color = colors[plan.plan] ?? '#6B7280';
            return (
              <div key={plan.plan}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: color }} />
                    <span className="text-sm font-semibold text-white">{plan.plan}</span>
                  </div>
                  <span className="text-sm text-gray-400">{plan.count} ({pct.toFixed(1)}%)</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }} className="h-full rounded-full" style={{ background: color }} />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* New paying subscribers chart */}
      {(d.newPayingSubscriptionsByDay ?? []).length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-white/[0.06] bg-[#0E1425] p-5">
          <p className="text-xs font-semibold text-gray-400 mb-4">New Paying Subscribers (90d)</p>
          <div className="flex items-end gap-[2px] h-24">
            {d.newPayingSubscriptionsByDay!.map((day, i) => {
              const max = Math.max(...d.newPayingSubscriptionsByDay!.map(d => d.value), 1);
              const h = (day.value / max) * 100;
              return (
                <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${Math.max(h, 2)}%` }} transition={{ delay: 0.3 + i * 0.005 }}
                  className="flex-1 rounded-t bg-gradient-to-t from-emerald-500/30 to-emerald-500/80 min-w-[2px]" title={`${day.date}: ${day.value}`} />
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
