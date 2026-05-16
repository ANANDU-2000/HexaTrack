'use client';
import { motion } from 'framer-motion';
import { User, Building2, GitBranch, Crown, Check } from 'lucide-react';

const MODES = [
  { icon: User, title: 'Individual', audience: 'Personal finance users', color: '#22C55E',
    features: ['Personal dashboard', 'Expense & income tracking', 'Savings goals', 'Budget reports', 'Receipt capture'] },
  { icon: Building2, title: 'Organization', audience: 'Companies without branches', color: '#3B82F6',
    features: ['Owner dashboard', 'Staff management', 'Approval workflows', 'Team analytics', 'Role permissions'] },
  { icon: GitBranch, title: 'Branch Mode', audience: 'Multi-location businesses', color: '#F59E0B',
    features: ['Branch selector', 'Branch-level reports', 'Staff per branch', 'Branch analytics', 'Cross-branch overview'] },
  { icon: Crown, title: 'Enterprise', audience: 'Large organizations', color: '#8B5CF6',
    features: ['Department hierarchy', 'Advanced permissions', 'Audit logging', 'API access', 'Custom integrations'] },
];

const ROLES = [
  { role: 'Super Admin', desc: 'Platform-level control over all organizations, users, billing and system configuration.', color: '#EF4444' },
  { role: 'Owner', desc: 'Organization owner with full access to staff, branches, finance, and settings.', color: '#F59E0B' },
  { role: 'Staff', desc: 'Team member with scoped access to assigned branches, categories, and transactions.', color: '#3B82F6' },
  { role: 'Individual', desc: 'Personal user managing their own finance workspace independently.', color: '#22C55E' },
];

export function WorkspaceModesSection() {
  return (
    <section className="py-24 lg:py-32 px-5 md:px-8 bg-[#050816]">
      <div className="max-w-[1200px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-[11px] font-bold text-[#F59E0B] uppercase tracking-[0.2em] mb-3">Workspace Types</p>
          <h2 className="text-[32px] sm:text-[42px] font-bold text-[#E1E2EC] tracking-[-0.02em] mb-4">One Platform, Every Mode</h2>
          <p className="text-[17px] text-[#C2C6D6] max-w-xl mx-auto">HexaTrack dynamically adapts based on your workspace type. No separate apps needed.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-24">
          {MODES.map((m, i) => (
            <motion.div key={m.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-white/[0.06] bg-[#0B1023] p-6 hover:border-white/[0.12] transition-all">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${m.color}12` }}>
                <m.icon size={20} style={{ color: m.color }} />
              </div>
              <h3 className="text-[17px] font-bold text-[#E1E2EC] mb-1">{m.title}</h3>
              <p className="text-[12px] text-[#C2C6D6] mb-5">{m.audience}</p>
              <div className="space-y-2.5">
                {m.features.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <Check size={13} style={{ color: m.color }} />
                    <span className="text-[12px] text-[#C2C6D6]">{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Role-based section */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-[11px] font-bold text-[#EC4899] uppercase tracking-[0.2em] mb-3">Role Architecture</p>
          <h2 className="text-[32px] sm:text-[42px] font-bold text-[#E1E2EC] tracking-[-0.02em] mb-4">Built for Every Role</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROLES.map((r, i) => (
            <motion.div key={r.role} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-white/[0.06] bg-[#0B1023] p-6 text-center">
              <div className="w-3 h-3 rounded-full mx-auto mb-4" style={{ background: r.color }} />
              <h3 className="text-[15px] font-bold text-[#E1E2EC] mb-2">{r.role}</h3>
              <p className="text-[12px] text-[#C2C6D6] leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
