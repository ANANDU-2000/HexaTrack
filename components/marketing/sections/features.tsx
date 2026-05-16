'use client';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Users, GitBranch, BarChart3, ShieldCheck, Layers, ClipboardCheck, FileText, Camera, RefreshCw, Smartphone } from 'lucide-react';

const FEATURES = [
  { icon: Wallet, title: 'Expense Tracking', desc: 'Categorize and track every transaction with smart tagging and merchant detection.', color: '#EF4444' },
  { icon: TrendingUp, title: 'Income Management', desc: 'Monitor revenue streams across accounts, branches, and team members.', color: '#22C55E' },
  { icon: Users, title: 'Team Collaboration', desc: 'Invite staff, assign roles, and collaborate on financial operations.', color: '#3B82F6' },
  { icon: GitBranch, title: 'Branch Management', desc: 'Track finances per branch with independent dashboards and reports.', color: '#F59E0B' },
  { icon: BarChart3, title: 'Analytics', desc: 'Real-time insights with trend analysis, spending breakdowns and forecasts.', color: '#10B981' },
  { icon: ShieldCheck, title: 'Role Permissions', desc: 'Granular access control for owners, staff, and viewers across workspaces.', color: '#EC4899' },
  { icon: Layers, title: 'Multi Workspace', desc: 'Manage personal, business and family finances in isolated workspaces.', color: '#10B981' },
  { icon: ClipboardCheck, title: 'Approval Workflow', desc: 'Staff submit expenses for owner approval before finalizing.', color: '#8B5CF6' },
  { icon: FileText, title: 'Reports', desc: 'Generate P&L, cashflow, and category reports for any date range.', color: '#10B981' },
  { icon: Camera, title: 'Receipt Uploads', desc: 'Capture and attach receipts to transactions for audit trails.', color: '#F97316' },
  { icon: RefreshCw, title: 'Recurring Entries', desc: 'Automate monthly rent, salaries, subscriptions and repeating costs.', color: '#A855F7' },
  { icon: Smartphone, title: 'Mobile App', desc: 'Native mobile experience that works offline with instant sync.', color: '#10B981' },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32 px-5 md:px-8 bg-[#050816]">
      <div className="max-w-[1200px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-[11px] font-bold text-[#10B981] uppercase tracking-[0.2em] mb-3">Capabilities</p>
          <h2 className="text-[32px] sm:text-[42px] font-bold text-[#E1E2EC] tracking-[-0.02em] mb-4">Everything You Need</h2>
          <p className="text-[17px] text-[#C2C6D6] max-w-xl mx-auto">A complete financial operating system built for how modern teams and individuals actually work.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              className="group rounded-2xl border border-white/[0.06] bg-[#0B1023] p-6 hover:border-white/[0.12] hover:bg-[#0E152B] transition-all duration-300">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: `${f.color}12` }}>
                <f.icon size={18} style={{ color: f.color }} />
              </div>
              <h3 className="text-[15px] font-semibold text-[#E1E2EC] mb-2">{f.title}</h3>
              <p className="text-[13px] text-[#C2C6D6] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
