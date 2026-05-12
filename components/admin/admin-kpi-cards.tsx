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
      label: 'Live Nodes',
      key: 'Organisations',
      value: stats?.orgs?.toLocaleString() || '0',
      suffix: 'INSTANCES',
      icon: Building2,
      color: 'text-blue-400',
      glow: 'shadow-[0_0_30px_rgba(96,165,250,0.15)]',
      growth: '+12.5%'
    },
    {
      label: 'Synapse Load',
      key: 'AI Tokens Consumed',
      value: stats?.tokens ? `${(stats.tokens / 1000000).toFixed(2)}M` : '0.00M',
      suffix: 'UNIT VOLUME',
      icon: Zap,
      color: 'text-purple-400',
      glow: 'shadow-[0_0_30px_rgba(192,132,252,0.15)]',
      growth: '+24.8%'
    },
    {
      label: 'Fiscal Throughput',
      key: 'Platform Revenue',
      value: stats?.revenue ? `$${(stats.revenue / 1000).toFixed(1)}k` : '$0.0k',
      suffix: 'GROSS YIELD',
      icon: DollarSign,
      color: 'text-emerald-400',
      glow: 'shadow-[0_0_30px_rgba(52,211,153,0.15)]',
      growth: '+8.2%'
    }
  ];

  if (loading) {
     return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[1, 2, 3].map(i => (
              <div key={i} className="h-36 animate-pulse rounded-3xl bg-white/[0.02] border border-white/[0.05]" />
           ))}
        </div>
     );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.key}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className={`relative bg-[#111827]/60 backdrop-blur-xl border border-white/[0.05] rounded-[32px] p-6 md:p-8 overflow-hidden group hover:border-white/10 transition-all cursor-default ${metric.glow}`}
        >
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] rounded-full blur-2xl pointer-events-none group-hover:bg-white/[0.03] transition-all" />
           
           <div className="flex justify-between items-start relative z-10 mb-6">
              <div>
                 <p className="font-label-mono text-[9px] font-black tracking-[0.2em] text-on-surface-variant/50 uppercase">{metric.label}</p>
                 <h3 className="font-bold text-[#F5F7FA] text-sm mt-0.5">{metric.key}</h3>
              </div>
              <div className={`w-10 h-10 rounded-2xl bg-[#0B1015] border border-white/[0.06] flex items-center justify-center ${metric.color} shadow-inner group-hover:scale-105 transition-transform`}>
                 <metric.icon size={18} />
              </div>
           </div>

           <div className="relative z-10 flex items-end justify-between">
              <div>
                 <p className="font-display-lg text-3xl md:text-4xl font-black text-[#F5F7FA] tracking-tighter leading-none">{metric.value}</p>
                 <p className="font-label-mono text-[8px] font-bold tracking-widest text-on-surface-variant/40 uppercase mt-2">{metric.suffix}</p>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/10 rounded-lg text-emerald-400 text-[10px] font-black font-label-mono">
                 <ArrowUpRight size={10} />
                 {metric.growth}
              </div>
           </div>
        </motion.div>
      ))}
    </div>
  );
}
