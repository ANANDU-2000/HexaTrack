'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Zap, Shield, BarChart3, Users, GitBranch, Wallet } from 'lucide-react';

export function HeroSection({ onGetStarted, onLogin }: { onGetStarted: () => void; onLogin: () => void }) {
  return (
    <section className="relative pt-32 pb-24 lg:pt-44 lg:pb-36 px-5 md:px-8 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.12)_0%,transparent_70%)]" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(59,130,246,0.08)_0%,transparent_70%)]" />
        <div className="absolute top-20 left-0 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(34,197,94,0.06)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/8 border border-[#10B981]/15 mb-7">
              <Zap size={13} className="text-[#10B981]" />
              <span className="text-[11px] font-semibold text-[#10B981] tracking-wide">Finance Operations Platform</span>
            </div>

            <h1 className="text-[40px] sm:text-[52px] lg:text-[62px] font-bold leading-[1.05] tracking-[-0.03em] text-[#E1E2EC] mb-6">
              Finance Built for{' '}
              <span className="bg-gradient-to-r from-[#10B981] via-[#3B82F6] to-[#22C55E] bg-clip-text text-transparent">
                Everyone
              </span>
            </h1>

            <p className="text-[17px] leading-[1.7] text-[#C2C6D6] max-w-[520px] mb-10">
              Track expenses, manage branches, control teams, monitor reports, and operate your entire financial stack from one unified workspace.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <button onClick={onGetStarted}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#10B981] text-white text-[15px] font-semibold transition-all hover:brightness-105 active:scale-[0.98] shadow-[0_8px_30px_-4px_rgba(16,185,129,0.4)]">
                Start Free
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button onClick={onLogin}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl border border-white/10 text-[#E1E2EC] text-[15px] font-semibold transition-all hover:bg-white/[0.04] active:scale-[0.98]">
                <Play size={14} className="text-[#10B981]" />
                Book Demo
              </button>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {[
                { v: '10K+', l: 'Transactions' },
                { v: '500+', l: 'Workspaces' },
                { v: '99.9%', l: 'Uptime' },
              ].map(s => (
                <div key={s.l} className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-[#E1E2EC]">{s.v}</span>
                  <span className="text-[12px] text-[#C2C6D6]">{s.l}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Dashboard mockup */}
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
            <div className="rounded-2xl border border-white/[0.08] bg-[#0B1023]/80 backdrop-blur-sm p-5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]">
              {/* Dots */}
              <div className="flex gap-1.5 mb-5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/50" /><div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/50" /><div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/50" />
              </div>
              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Revenue', value: '₹12.4L', color: '#22C55E', icon: BarChart3 },
                  { label: 'Expenses', value: '₹8.2L', color: '#EF4444', icon: Wallet },
                  { label: 'Net Flow', value: '₹4.2L', color: '#10B981', icon: Zap },
                ].map(m => (
                  <div key={m.label} className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-3.5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <m.icon size={12} style={{ color: m.color }} />
                      <span className="text-[10px] text-[#C2C6D6]">{m.label}</span>
                    </div>
                    <p className="text-lg font-bold text-[#E1E2EC]">{m.value}</p>
                  </div>
                ))}
              </div>
              {/* Chart */}
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-[#C2C6D6]">Cash Flow</span>
                  <span className="text-[10px] text-[#22C55E] font-semibold">+18.3%</span>
                </div>
                <svg viewBox="0 0 200 60" className="w-full h-12">
                  <defs>
                    <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polygon points="0,60 10,48 30,42 50,35 70,38 90,28 110,32 130,20 150,15 170,22 190,10 200,12 200,60" fill="url(#hg)" />
                  <polyline points="10,48 30,42 50,35 70,38 90,28 110,32 130,20 150,15 170,22 190,10" fill="none" stroke="#10B981" strokeWidth="2" />
                </svg>
              </div>
              {/* Transactions */}
              <div className="space-y-2">
                {[
                  { n: 'Office Supplies', a: '-₹4,200', c: '#EF4444' },
                  { n: 'Client Payment', a: '+₹85,000', c: '#22C55E' },
                  { n: 'Team Lunch', a: '-₹2,800', c: '#EF4444' },
                ].map(t => (
                  <div key={t.n} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/[0.02]">
                    <span className="text-[12px] text-[#C2C6D6]">{t.n}</span>
                    <span className="text-[13px] font-semibold" style={{ color: t.c }}>{t.a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating cards */}
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1, duration: 0.5 }}
              className="absolute -top-6 -right-6 hidden md:flex items-center gap-2 px-4 py-3 rounded-xl border border-white/[0.08] bg-[#0B1023]/90 backdrop-blur-md shadow-xl">
              <GitBranch size={14} className="text-[#F59E0B]" />
              <div>
                <p className="text-[10px] text-[#C2C6D6]">Branches</p>
                <p className="text-sm font-bold text-[#E1E2EC]">12 Active</p>
              </div>
            </motion.div>

            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -bottom-5 -left-6 hidden md:flex items-center gap-2 px-4 py-3 rounded-xl border border-white/[0.08] bg-[#0B1023]/90 backdrop-blur-md shadow-xl">
              <Users size={14} className="text-[#3B82F6]" />
              <div>
                <p className="text-[10px] text-[#C2C6D6]">Team</p>
                <p className="text-sm font-bold text-[#E1E2EC]">48 Members</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
