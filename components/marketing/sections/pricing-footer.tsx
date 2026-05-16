'use client';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Star, MessageSquare, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

const PLANS = [
  { name: 'Free', price: '₹0', period: 'forever', color: '#C2C6D6', features: ['1 User', '1 Workspace', 'Basic Dashboard', '50 Transactions/mo'], limits: '0 branches' },
  { name: 'Starter', price: '₹299', period: '/mo', color: '#3B82F6', features: ['3 Users', '2 Workspaces', 'Reports', 'Categories', 'Recurring', 'CSV Export'], limits: '0 branches' },
  { name: 'Business', price: '₹999', period: '/mo', color: '#10B981', popular: true, features: ['25 Users', '5 Workspaces', 'Branch Management', 'Approval Workflows', 'Advanced Reports', 'Multi Currency', 'API Access'], limits: '5 branches' },
  { name: 'Enterprise', price: '₹2,999', period: '/mo', color: '#8B5CF6', features: ['Unlimited Users', 'Unlimited Workspaces', 'Unlimited Branches', 'SSO', 'Audit Log', 'Custom Integrations', 'Dedicated Support'], limits: 'Unlimited' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'CFO, TechNova', quote: 'HexaTrack replaced three separate tools for us. Branch management alone saved us 15 hours per week.', avatar: 'P' },
  { name: 'Rahul Mehta', role: 'Founder, QuickBite', quote: 'Managing 8 restaurant branches from one dashboard is a game-changer. The staff permissions are perfect.', avatar: 'R' },
  { name: 'Ananya Iyer', role: 'Freelancer', quote: 'I use the individual mode for personal finances. Clean, simple, and the reports are beautiful.', avatar: 'A' },
  { name: 'Vikram Patel', role: 'Ops Manager, GreenLeaf', quote: 'The approval workflow means no expense goes unnoticed. Our team of 30 adopted it in days.', avatar: 'V' },
];

const FAQS = [
  { q: 'Can individuals use HexaTrack?', a: 'Absolutely. Individual mode gives you a clean personal finance dashboard with expense tracking, income management, savings goals, and beautiful reports.' },
  { q: 'Does HexaTrack support branches?', a: 'Yes. Enable Branch Mode and you get independent dashboards, staff assignments, analytics, and financial tracking per branch.' },
  { q: 'Can I manage staff?', a: 'Owners can invite staff, assign them to branches, set permissions, and create approval workflows for expenses.' },
  { q: 'Is there mobile support?', a: 'HexaTrack is mobile-first with a native PWA experience, bottom navigation, touch-optimized screens, and offline capabilities.' },
  { q: 'Does it support teams?', a: 'Yes. Organization and Enterprise modes support team workspaces with collaboration, shared categories, and role-based access.' },
  { q: 'Can I switch workspace types later?', a: 'Yes. You can upgrade from Individual to Organization or Branch mode anytime from your settings without losing data.' },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 lg:py-32 px-5 md:px-8 bg-[#050816]">
      <div className="max-w-[1200px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-[11px] font-bold text-[#10B981] uppercase tracking-[0.2em] mb-3">Pricing</p>
          <h2 className="text-[32px] sm:text-[42px] font-bold text-[#E1E2EC] tracking-[-0.02em] mb-4">Simple, Transparent Pricing</h2>
          <p className="text-[17px] text-[#C2C6D6] max-w-xl mx-auto">Start free. Scale as you grow.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className={`relative rounded-2xl border p-6 flex flex-col ${p.popular ? 'border-[#10B981]/30 bg-[#10B981]/[0.04]' : 'border-white/[0.06] bg-[#0B1023]'}`}>
              {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#10B981] text-[10px] font-bold text-white uppercase tracking-wider">Popular</div>}
              <h3 className="text-[17px] font-bold text-[#E1E2EC] mb-1">{p.name}</h3>
              <div className="mb-5"><span className="text-3xl font-bold text-[#E1E2EC]">{p.price}</span><span className="text-sm text-[#C2C6D6]">{p.period}</span></div>
              <p className="text-[11px] text-[#C2C6D6] mb-5 pb-5 border-b border-white/[0.06]">{p.limits} • {p.features[0]}</p>
              <div className="flex-1 space-y-2.5 mb-6">
                {p.features.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <Check size={13} style={{ color: p.color }} />
                    <span className="text-[12px] text-[#C2C6D6]">{f}</span>
                  </div>
                ))}
              </div>
              <button className={`w-full py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${p.popular ? 'bg-[#10B981] text-white shadow-[0_6px_20px_-4px_rgba(16,185,129,0.4)]' : 'border border-white/[0.1] text-[#E1E2EC] hover:bg-white/[0.04]'}`}>
                {p.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-24 lg:py-32 px-5 md:px-8 bg-[#050816]">
      <div className="max-w-[1200px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-[11px] font-bold text-[#22C55E] uppercase tracking-[0.2em] mb-3">Testimonials</p>
          <h2 className="text-[32px] sm:text-[42px] font-bold text-[#E1E2EC] tracking-[-0.02em]">Loved by Teams</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-white/[0.06] bg-[#0B1023] p-6">
              <div className="flex gap-1 mb-4">{Array.from({length:5}).map((_,j)=><Star key={j} size={13} className="text-[#F59E0B] fill-[#F59E0B]" />)}</div>
              <p className="text-[14px] text-[#C2C6D6] leading-relaxed mb-5 italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#10B981] to-[#3B82F6] flex items-center justify-center text-white text-xs font-bold">{t.avatar}</div>
                <div><p className="text-[13px] font-semibold text-[#E1E2EC]">{t.name}</p><p className="text-[11px] text-[#C2C6D6]">{t.role}</p></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-24 lg:py-32 px-5 md:px-8 bg-[#050816]">
      <div className="max-w-[720px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-[11px] font-bold text-[#3B82F6] uppercase tracking-[0.2em] mb-3">FAQ</p>
          <h2 className="text-[32px] sm:text-[42px] font-bold text-[#E1E2EC] tracking-[-0.02em]">Common Questions</h2>
        </motion.div>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              className="rounded-xl border border-white/[0.06] bg-[#0B1023] overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                <span className="text-[14px] font-semibold text-[#E1E2EC]">{faq.q}</span>
                <ChevronDown size={16} className={`text-[#C2C6D6] transition-transform shrink-0 ml-3 ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && <div className="px-5 pb-4"><p className="text-[13px] text-[#C2C6D6] leading-relaxed">{faq.a}</p></div>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="py-24 lg:py-32 px-5 md:px-8 bg-[#050816]">
      <div className="max-w-[800px] mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }}
          className="relative rounded-3xl border border-[#10B981]/20 bg-gradient-to-b from-[#10B981]/[0.06] to-transparent p-12 lg:p-16 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[radial-gradient(ellipse,rgba(16,185,129,0.15),transparent_70%)] pointer-events-none" />
          <h2 className="text-[32px] sm:text-[42px] font-bold text-[#E1E2EC] tracking-[-0.02em] mb-4 relative z-10">Start Managing Finances Smarter</h2>
          <p className="text-[17px] text-[#C2C6D6] mb-10 max-w-md mx-auto relative z-10">Join thousands of individuals and businesses using HexaTrack to streamline their financial operations.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
            <button onClick={onGetStarted} className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#10B981] text-white font-semibold transition-all hover:brightness-105 active:scale-[0.98] shadow-[0_8px_30px_-4px_rgba(16,185,129,0.4)]">
              Start Free <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/[0.1] text-[#E1E2EC] font-semibold transition-all hover:bg-white/[0.04] active:scale-[0.98]">
              <MessageSquare size={15} className="text-[#10B981]" /> Contact Sales
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function FooterSection() {
  const cols = [
    { title: 'Product', links: ['Features', 'Pricing', 'Mobile App', 'Integrations', 'Security'] },
    { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press', 'Contact'] },
    { title: 'Resources', links: ['Documentation', 'API Reference', 'Guides', 'Community', 'Status'] },
    { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies', 'Licenses'] },
  ];
  return (
    <footer className="py-16 px-5 md:px-8 border-t border-white/[0.06] bg-[#050816]">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 sm:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-[#0E152B] border border-white/[0.08] shadow-[0_0_12px_-4px_rgba(16,185,129,0.25)]">
                <Image src="/icons/icon-192x192.png" alt="HexaTrack" width={32} height={32} className="w-full h-full object-cover" />
              </div>
              <span className="text-[15px] font-bold text-[#E1E2EC]">HexaTrack</span>
            </div>
            <p className="text-[12px] text-[#C2C6D6] max-w-[240px] leading-relaxed">The modern finance workspace for individuals, businesses, and enterprise organizations.</p>
          </div>
          {cols.map(c => (
            <div key={c.title}>
              <p className="text-[11px] font-bold text-[#E1E2EC] uppercase tracking-wider mb-4">{c.title}</p>
              <ul className="space-y-2.5">
                {c.links.map(l => <li key={l}><a href="#" className="text-[12px] text-[#C2C6D6] hover:text-[#E1E2EC] transition-colors">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-[#C2C6D6]/60">© 2026 HexaTrack. All rights reserved.</p>
          <div className="flex gap-4">
            {['Twitter', 'LinkedIn', 'GitHub'].map(s => <a key={s} href="#" className="text-[11px] text-[#C2C6D6]/60 hover:text-[#C2C6D6] transition-colors">{s}</a>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
