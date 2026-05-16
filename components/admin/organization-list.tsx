'use client';

import { motion } from 'framer-motion';
import { Building2, Users, ChevronRight, ExternalLink } from 'lucide-react';

interface OrgItem {
  id: string;
  name: string;
  ownerEmail: string;
  staffCount: number;
  plan: 'Free' | 'Pro' | 'Enterprise';
}

interface OrganizationListProps {
  orgs?: OrgItem[];
  loading?: boolean;
  onViewDetail?: (id: string) => void;
}

export function OrganizationList({ orgs, loading, onViewDetail }: OrganizationListProps) {
  
  // Synthetic data for perfect design representation if none present
  const data = orgs || [
     { id: '1', name: 'Stark Industries', ownerEmail: 'tony@stark.com', staffCount: 245, plan: 'Enterprise' },
     { id: '2', name: 'Wayne Enterprises', ownerEmail: 'bruce@wayne.co', staffCount: 120, plan: 'Pro' },
     { id: '3', name: 'Acme Corp', ownerEmail: 'roadrunner@acme.org', staffCount: 12, plan: 'Free' }
  ];

  const getPlanStyles = (plan: string) => {
     switch(plan) {
        case 'Enterprise': return 'bg-primary/10 border-primary/20 text-primary shadow-[0_0_15px_rgba(16,185,129,0.15)]';
        case 'Pro': return 'bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]';
        default: return 'bg-white/5 border-white/10 text-on-surface-variant';
     }
  };

  return (
    <div className="bg-[#0E152B]/40 backdrop-blur-md border border-white/[0.04] rounded-[32px] overflow-hidden flex flex-col h-full">
       <div className="px-8 py-6 border-b border-white/[0.04] flex items-center justify-between bg-[#0E152B]/20">
          <h3 className="font-bold text-[#F5F7FA] text-lg tracking-tight flex items-center gap-2">
             <Building2 size={18} className="text-on-surface-variant opacity-60" /> Global Entities
          </h3>
          <span className="font-label-mono text-[9px] font-bold px-2 py-1 rounded-full border border-white/10 text-on-surface-variant uppercase tracking-widest">SYSTEM_REGISTRY</span>
       </div>

       <div className="flex-1 overflow-y-auto custom-scrollbar p-2 divide-y divide-white/[0.02]">
          {data.map((org, i) => (
             <motion.div
               key={org.id}
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.05 }}
               onClick={() => onViewDetail?.(org.id)}
               className="group flex items-center justify-between px-6 py-5 hover:bg-white/[0.02] transition-all cursor-pointer rounded-2xl relative"
             >
                <div className="flex items-center gap-5 min-w-0 z-10">
                   <div className="w-11 h-11 rounded-xl bg-[#0B1015] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:border-primary/20 transition-colors">
                      <Building2 size={18} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                   </div>
                   <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#F5F7FA] truncate flex items-center gap-2">
                         {org.name}
                         <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border leading-none ${getPlanStyles(org.plan)}`}>
                            {org.plan}
                         </span>
                      </h4>
                      <p className="text-[11px] text-on-surface-variant opacity-60 mt-0.5 flex items-center gap-2">
                         <span className="truncate font-medium">{org.ownerEmail}</span>
                         <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                         <span className="flex items-center gap-1 shrink-0 font-label-mono text-[9px]">
                            <Users size={10} /> {org.staffCount}
                         </span>
                      </p>
                   </div>
                </div>

                <div className="flex items-center gap-2 z-10 relative shrink-0 ml-4">
                   <div className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-on-surface-variant group-hover:text-[#F5F7FA] group-hover:border-white/20 opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
                      <ExternalLink size={14} />
                   </div>
                </div>
             </motion.div>
          ))}
       </div>
    </div>
  );
}
