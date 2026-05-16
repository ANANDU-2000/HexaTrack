'use client';

import { motion } from 'framer-motion';
import { Building2, Zap, DollarSign, ArrowUpRight } from 'lucide-react';

interface AdminKpiCardsProps {
  stats?: {
    orgs?: number;
    tokens?: number;
    revenue?: number;
  };
  loading?: boolean;
}

export function AdminKpiCards({ stats, loading }: AdminKpiCardsProps) {
  const metrics = [
    {
      label: 'Active Nodes',
      key: 'Registry Nodes',
      value: stats?.orgs?.toLocaleString() || '0',
      suffix: 'INSTANCE TOTAL',
      icon: Building2,
      color: 'text-cyan',
      bg: 'bg-[#0E152B]/40',
      glow: 'shadow-md hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] border-white/[0.05]',
      growth: '+12.5%'
    },
    {
      label: 'Synapse Load',
      key: 'Quantum Vol',
      value: stats?.tokens ? `${(stats.tokens / 1000000).toFixed(2)}M` : '0.00M',
      suffix: 'TOKEN CADENCE',
      icon: Zap,
      color: 'text-primary',
      bg: 'bg-[#0E152B]/40',
      glow: 'shadow-md hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] border-white/[0.05]',
      growth: '+24.8%'
    },
    {
      label: 'Yield Velocity',
      key: 'System Revenue',
      value: stats?.revenue ? `$${(stats.revenue / 1000).toFixed(1)}k` : '$0.0k',
      suffix: 'MRR ESTIMATE',
      icon: DollarSign,
      color: 'text-emerald',
      bg: 'bg-[#0E152B]/40',
      glow: 'shadow-md hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] border-white/[0.05]',
      growth: '+8.2%'
    }
  ];

  if (loading) {
     return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[1, 2, 3].map(i => (
              <div key={i} className="h-40 animate-pulse rounded-[28px] bg-[#0E152B]/40 border border-white/[0.04]" />
           ))}
        </div>
     );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full font-sans">
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.key}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className={`relative backdrop-blur-md border rounded-[28px] p-6 md:p-7 overflow-hidden group hover:border-cyan/20 transition-all cursor-default ${metric.bg} ${metric.glow}`}
        >
           <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/[0.01] rounded-full blur-2xl pointer-events-none transition-all" />
           
           <div className="flex justify-between items-start relative z-10 mb-6">
              <div>
                 <p className="font-label-caps text-[10px] font-black tracking-widest text-on-surface-variant/60 uppercase">{metric.label}</p>
                 <h3 className="font-bold text-on-surface text-[15px] tracking-wide mt-0.5">{metric.key}</h3>
              </div>
              <div className={`w-11 h-11 rounded-2xl bg-[#0E152B] border border-white/[0.04] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform ${metric.color}`}>
                 <metric.icon size={18} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.05)]" />
              </div>
           </div>

           <div className="relative z-10 flex items-end justify-between">
              <div>
                 <p className="font-mono-data text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight leading-none select-all">{metric.value}</p>
                 <p className="font-label-caps text-[8px] font-bold tracking-widest text-on-surface-variant opacity-50 uppercase mt-2.5">{metric.suffix}</p>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-emerald/10 border border-emerald/10 rounded-lg text-emerald text-[10px] font-black font-label-caps tracking-wide">
                 <ArrowUpRight size={10} strokeWidth={3} />
                 {metric.growth}
              </div>
           </div>
        </motion.div>
      ))}
    </div>
  );
}

