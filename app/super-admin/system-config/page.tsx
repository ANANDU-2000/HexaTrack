'use client';

import React, { useEffect, useState } from 'react';
import { hexaTrackApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import type { FeatureFlagDto } from '@/lib/types';
import { ToggleLeft, ToggleRight, Cpu, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURE_KEYS = [
  { key: 'branch_management', label: 'Branch Management', description: 'Enable multi-branch organization support' },
  { key: 'advanced_reports', label: 'Advanced Reports', description: 'Detailed financial analytics and reports' },
  { key: 'payroll', label: 'Payroll', description: 'Staff payroll management module' },
  { key: 'multi_currency', label: 'Multi Currency', description: 'Support for multiple currencies' },
  { key: 'inventory', label: 'Inventory', description: 'Inventory tracking and management' },
  { key: 'ai_insights', label: 'AI Insights', description: 'AI-powered financial insights' },
  { key: 'approval_workflows', label: 'Approval Workflows', description: 'Transaction approval pipelines' },
  { key: 'recurring_transactions', label: 'Recurring Transactions', description: 'Automated recurring entries' },
  { key: 'tax_management', label: 'Tax Management', description: 'Tax calculation and reporting' },
  { key: 'receipt_ocr', label: 'Receipt OCR', description: 'Automatic receipt scanning' },
];

export default function SystemConfigPage() {
  const { accessToken } = useAuthStore();
  const [flags, setFlags] = useState<FeatureFlagDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    hexaTrackApi.admin.featureFlags().then(f => { setFlags(f); setLoading(false); }).catch(() => setLoading(false));
  }, [accessToken]);

  const handleToggle = async (key: string, currentValue: string) => {
    setToggling(key);
    const newValue = currentValue === 'true' ? 'false' : 'true';
    try {
      await hexaTrackApi.admin.setFeatureFlag(key, newValue);
      setFlags(f => f.map(fl => fl.key === key ? { ...fl, value: newValue } : fl));
    } catch {}
    setToggling(null);
  };

  const getFlagValue = (key: string) => flags.find(f => f.key === key)?.value ?? 'false';

  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto space-y-6">
      <div>
        <p className="text-[10px] font-bold text-violet-400 uppercase tracking-[0.2em] mb-1">Platform</p>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Configuration</h1>
        <p className="text-sm text-gray-500 mt-1">Manage global feature flags and platform capabilities</p>
      </div>

      {loading ? (
        <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURE_KEYS.map((feat, i) => {
            const enabled = getFlagValue(feat.key) === 'true';
            return (
              <motion.div key={feat.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className={`rounded-2xl border p-5 transition-all cursor-pointer ${enabled ? 'border-emerald-500/20 bg-emerald-500/[0.03]' : 'border-white/[0.06] bg-[#0E1425]'}`}
                onClick={() => handleToggle(feat.key, getFlagValue(feat.key))}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white mb-1">{feat.label}</p>
                    <p className="text-[11px] text-gray-500">{feat.description}</p>
                  </div>
                  <div className="ml-3 shrink-0">
                    {toggling === feat.key ? (
                      <RefreshCw size={20} className="text-gray-400 animate-spin" />
                    ) : enabled ? (
                      <ToggleRight size={28} className="text-emerald-400" />
                    ) : (
                      <ToggleLeft size={28} className="text-gray-600" />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
