'use client';
import { motion } from 'framer-motion';
import { GitBranch, Users, BarChart3, MapPin, TrendingUp, Wallet, Smartphone, Home, PieChart, Bell, ArrowUpDown } from 'lucide-react';

export function TrustedSection() {
  const stats = ['STRIPE', 'RAZORPAY', 'ZOHO', 'FRESHWORKS', 'TALLY'];
  return (
    <section className="py-10 border-y border-white/[0.04] bg-[#050816]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
        {stats.map(s => (
          <span key={s} className="text-[14px] font-bold tracking-[0.1em] text-[#C2C6D6]/25 hover:text-[#C2C6D6]/50 transition-colors cursor-default">{s}</span>
        ))}
      </div>
    </section>
  );
}

export function BranchSection() {
  const branches = [
    { name: 'Mumbai HQ', staff: 12, revenue: '₹4.2L', status: 'active' },
    { name: 'Delhi Branch', staff: 8, revenue: '₹2.8L', status: 'active' },
    { name: 'Bangalore', staff: 15, revenue: '₹5.1L', status: 'active' },
    { name: 'Chennai', staff: 6, revenue: '₹1.9L', status: 'pending' },
  ];
  return (
    <section className="py-24 lg:py-32 px-5 md:px-8 bg-[#050816]">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[11px] font-bold text-[#F59E0B] uppercase tracking-[0.2em] mb-3">Branch Management</p>
            <h2 className="text-[32px] sm:text-[42px] font-bold text-[#E1E2EC] tracking-[-0.02em] mb-4">Multi-Branch Operations</h2>
            <p className="text-[17px] text-[#C2C6D6] mb-8 max-w-md">Track revenue, expenses, and staff across every branch. Get consolidated views or drill into individual locations.</p>
            <div className="space-y-3">
              {['Independent branch dashboards', 'Staff assignment per branch', 'Cross-branch analytics', 'Branch-level P&L reports'].map(f => (
                <div key={f} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-[#F59E0B]/10 flex items-center justify-center"><GitBranch size={11} className="text-[#F59E0B]" /></div>
                  <span className="text-[14px] text-[#C2C6D6]">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/[0.08] bg-[#0B1023] p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] font-semibold text-[#C2C6D6]">Branch Overview</span>
              <span className="text-[10px] px-2 py-1 rounded-full bg-[#22C55E]/10 text-[#22C55E] font-semibold">4 Branches</span>
            </div>
            <div className="space-y-2">
              {branches.map(b => (
                <div key={b.name} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center gap-3">
                    <MapPin size={14} className="text-[#F59E0B]" />
                    <div>
                      <p className="text-[13px] font-semibold text-[#E1E2EC]">{b.name}</p>
                      <p className="text-[10px] text-[#C2C6D6]">{b.staff} staff</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-semibold text-[#22C55E]">{b.revenue}</p>
                    <p className="text-[10px] text-[#C2C6D6]">this month</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function MobileShowcaseSection() {
  return (
    <section className="py-24 lg:py-32 px-5 md:px-8 bg-[#050816]">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Phone mockup */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex justify-center order-2 lg:order-1">
            <div className="w-[280px] rounded-[36px] border-[3px] border-white/[0.1] bg-[#0B1023] p-2 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]">
              <div className="rounded-[30px] overflow-hidden bg-[#050816]">
                {/* Status bar */}
                <div className="flex items-center justify-between px-5 pt-3 pb-2">
                  <span className="text-[10px] text-[#C2C6D6]">9:41</span>
                  <div className="flex gap-1"><div className="w-3 h-2 rounded-sm bg-[#C2C6D6]/40" /><div className="w-3 h-2 rounded-sm bg-[#C2C6D6]/40" /></div>
                </div>
                {/* Header */}
                <div className="px-5 pt-2 pb-4">
                  <p className="text-[11px] text-[#C2C6D6]">Good morning</p>
                  <p className="text-[18px] font-bold text-[#E1E2EC]">₹2,45,800</p>
                  <p className="text-[10px] text-[#22C55E] mt-1">+₹12,400 today</p>
                </div>
                {/* Quick actions */}
                <div className="flex justify-around px-5 pb-4">
                  {[{ icon: TrendingUp, label: 'Income', c: '#22C55E' }, { icon: Wallet, label: 'Expense', c: '#EF4444' }, { icon: ArrowUpDown, label: 'Transfer', c: '#3B82F6' }].map(a => (
                    <div key={a.label} className="flex flex-col items-center gap-1.5">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${a.c}12` }}>
                        <a.icon size={16} style={{ color: a.c }} />
                      </div>
                      <span className="text-[9px] text-[#C2C6D6]">{a.label}</span>
                    </div>
                  ))}
                </div>
                {/* Transactions */}
                <div className="px-4 pb-3">
                  <p className="text-[10px] font-semibold text-[#C2C6D6] mb-2 px-1">Recent</p>
                  {[
                    { n: 'Salary', a: '+₹85,000', c: '#22C55E' },
                    { n: 'Rent', a: '-₹25,000', c: '#EF4444' },
                    { n: 'Groceries', a: '-₹3,200', c: '#EF4444' },
                    { n: 'Freelance', a: '+₹15,000', c: '#22C55E' },
                  ].map(t => (
                    <div key={t.n} className="flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 bg-white/[0.02]">
                      <span className="text-[11px] text-[#C2C6D6]">{t.n}</span>
                      <span className="text-[12px] font-semibold" style={{ color: t.c }}>{t.a}</span>
                    </div>
                  ))}
                </div>
                {/* Bottom nav */}
                <div className="flex justify-around py-3 border-t border-white/[0.06]">
                  {[{ icon: Home, l: 'Home', active: true }, { icon: BarChart3, l: 'Reports' }, { icon: PieChart, l: 'Analytics' }, { icon: Bell, l: 'Alerts' }].map(n => (
                    <div key={n.l} className="flex flex-col items-center gap-0.5">
                      <n.icon size={16} className={n.active ? 'text-[#10B981]' : 'text-[#C2C6D6]/40'} />
                      <span className={`text-[8px] ${n.active ? 'text-[#10B981]' : 'text-[#C2C6D6]/40'}`}>{n.l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          {/* Text */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
            <p className="text-[11px] font-bold text-[#EC4899] uppercase tracking-[0.2em] mb-3">Mobile First</p>
            <h2 className="text-[32px] sm:text-[42px] font-bold text-[#E1E2EC] tracking-[-0.02em] mb-4">Your Finances, Everywhere</h2>
            <p className="text-[17px] text-[#C2C6D6] mb-8 max-w-md">A native mobile experience with bottom navigation, instant actions, and offline-first architecture. Feels like Apple Wallet meets Revolut.</p>
            <div className="space-y-3">
              {['Offline-first with instant sync', 'Bottom navigation with quick actions', 'Touch-optimized transaction entry', 'Role-aware mobile dashboards'].map(f => (
                <div key={f} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-[#EC4899]/10 flex items-center justify-center"><Smartphone size={11} className="text-[#EC4899]" /></div>
                  <span className="text-[14px] text-[#C2C6D6]">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function AnalyticsShowcaseSection() {
  return (
    <section className="py-24 lg:py-32 px-5 md:px-8 bg-[#050816]">
      <div className="max-w-[1200px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-[11px] font-bold text-[#10B981] uppercase tracking-[0.2em] mb-3">Analytics</p>
          <h2 className="text-[32px] sm:text-[42px] font-bold text-[#E1E2EC] tracking-[-0.02em] mb-4">Insights That Drive Decisions</h2>
          <p className="text-[17px] text-[#C2C6D6] max-w-xl mx-auto">Real-time spending analytics, growth trends, and branch performance reports.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Donut chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-white/[0.06] bg-[#0B1023] p-6">
            <p className="text-[12px] font-semibold text-[#C2C6D6] mb-4">Spending by Category</p>
            <div className="flex justify-center mb-4">
              <svg viewBox="0 0 120 120" className="w-28 h-28">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#10B981" strokeWidth="12" strokeDasharray="120 207" strokeLinecap="round" transform="rotate(-90 60 60)" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="#3B82F6" strokeWidth="12" strokeDasharray="80 247" strokeDashoffset="-120" strokeLinecap="round" transform="rotate(-90 60 60)" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="#22C55E" strokeWidth="12" strokeDasharray="50 277" strokeDashoffset="-200" strokeLinecap="round" transform="rotate(-90 60 60)" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="#F59E0B" strokeWidth="12" strokeDasharray="35 292" strokeDashoffset="-250" strokeLinecap="round" transform="rotate(-90 60 60)" />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[{ l: 'Operations', c: '#10B981', p: '37%' }, { l: 'Staff', c: '#3B82F6', p: '24%' }, { l: 'Growth', c: '#22C55E', p: '22%' }, { l: 'Other', c: '#F59E0B', p: '17%' }].map(i => (
                <div key={i.l} className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: i.c }} /><span className="text-[11px] text-[#C2C6D6]">{i.l} {i.p}</span></div>
              ))}
            </div>
          </motion.div>
          {/* Growth chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.06 }} className="rounded-2xl border border-white/[0.06] bg-[#0B1023] p-6">
            <p className="text-[12px] font-semibold text-[#C2C6D6] mb-2">Monthly Growth</p>
            <p className="text-2xl font-bold text-[#E1E2EC] mb-4">+23.5%</p>
            <svg viewBox="0 0 200 80" className="w-full h-20">
              <defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22C55E" stopOpacity="0.2" /><stop offset="100%" stopColor="#22C55E" stopOpacity="0" /></linearGradient></defs>
              <polygon points="0,80 20,65 40,60 60,55 80,50 100,45 120,38 140,30 160,25 180,18 200,12 200,80" fill="url(#gg)" />
              <polyline points="20,65 40,60 60,55 80,50 100,45 120,38 140,30 160,25 180,18 200,12" fill="none" stroke="#22C55E" strokeWidth="2" />
            </svg>
          </motion.div>
          {/* Branch performance */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 }} className="rounded-2xl border border-white/[0.06] bg-[#0B1023] p-6">
            <p className="text-[12px] font-semibold text-[#C2C6D6] mb-4">Branch Performance</p>
            {[{ n: 'Mumbai', w: '80%', c: '#10B981' }, { n: 'Delhi', w: '65%', c: '#3B82F6' }, { n: 'Bangalore', w: '90%', c: '#22C55E' }, { n: 'Chennai', w: '45%', c: '#F59E0B' }].map(b => (
              <div key={b.n} className="mb-3">
                <div className="flex justify-between mb-1"><span className="text-[11px] text-[#C2C6D6]">{b.n}</span><span className="text-[11px] text-[#E1E2EC] font-semibold">{b.w}</span></div>
                <div className="h-1.5 rounded-full bg-white/[0.04]"><div className="h-full rounded-full" style={{ width: b.w, background: b.c }} /></div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
