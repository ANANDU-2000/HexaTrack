'use client';

import React from 'react';
import { CreditCard, Check, Zap, Building2, Crown, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const PLANS = [
  {
    name: 'Free', price: '₹0', period: 'forever', color: '#6B7280', icon: Star,
    features: ['1 User', '1 Workspace', 'Basic Dashboard', 'Expense Tracking', 'Income Tracking', '50 Transactions/mo'],
    limits: { users: 1, branches: 0, staff: 0, workspaces: 1 },
  },
  {
    name: 'Starter', price: '₹299', period: '/month', color: '#3B82F6', icon: Zap, popular: false,
    features: ['3 Users', '2 Workspaces', 'Reports & Analytics', 'Categories', 'Recurring Transactions', 'Unlimited Transactions', 'CSV Export'],
    limits: { users: 3, branches: 0, staff: 2, workspaces: 2 },
  },
  {
    name: 'Business', price: '₹999', period: '/month', color: '#10B981', icon: Building2, popular: true,
    features: ['25 Users', '5 Workspaces', 'Branch Management', 'Staff Management', 'Approval Workflows', 'Advanced Reports', 'Multi Currency', 'API Access'],
    limits: { users: 25, branches: 5, staff: 20, workspaces: 5 },
  },
  {
    name: 'Enterprise', price: '₹2,999', period: '/month', color: '#8B5CF6', icon: Crown,
    features: ['Unlimited Users', 'Unlimited Workspaces', 'Unlimited Branches', 'Advanced Permissions', 'AI Insights', 'Custom Integrations', 'Dedicated Support', 'SLA Guarantee', 'Audit Log', 'SSO'],
    limits: { users: -1, branches: -1, staff: -1, workspaces: -1 },
  },
];

export default function PlansPage() {
  return (
    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="text-center mb-8">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-2">Pricing</p>
        <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Subscription Plans</h1>
        <p className="text-sm text-gray-500 mt-2">Configure features available at each tier</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-2xl border p-6 flex flex-col ${plan.popular ? 'border-emerald-500/30 bg-emerald-500/[0.03]' : 'border-white/[0.06] bg-[#0E1425]'}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-[10px] font-bold text-white uppercase tracking-wider">
                Most Popular
              </div>
            )}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${plan.color}15` }}>
                <plan.icon size={18} style={{ color: plan.color }} />
              </div>
              <h3 className="text-lg font-bold text-white">{plan.name}</h3>
            </div>
            <div className="mb-5">
              <span className="text-3xl font-bold text-white">{plan.price}</span>
              <span className="text-sm text-gray-500">{plan.period}</span>
            </div>
            <div className="flex-1 space-y-2.5 mb-6">
              {plan.features.map(f => (
                <div key={f} className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span className="text-xs text-gray-400">{f}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-white/[0.06]">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded-lg bg-white/[0.02] py-2">
                  <p className="text-lg font-bold text-white">{plan.limits.users === -1 ? '∞' : plan.limits.users}</p>
                  <p className="text-[9px] text-gray-600 uppercase">Users</p>
                </div>
                <div className="rounded-lg bg-white/[0.02] py-2">
                  <p className="text-lg font-bold text-white">{plan.limits.branches === -1 ? '∞' : plan.limits.branches}</p>
                  <p className="text-[9px] text-gray-600 uppercase">Branches</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
