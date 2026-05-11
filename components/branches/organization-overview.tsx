'use client';

import { 
  TrendingUp, 
  Building2, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Loader2,
  Shield
} from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { hexaTrackApi } from '@/lib/api';
import type { OrganizationOverviewDto } from '@/lib/types';

const MINI_DATA = [
  { v: 400 }, { v: 300 }, { v: 500 }, { v: 450 }, { v: 700 }, { v: 600 }, { v: 900 }
];

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);
}

export function OrganizationOverview() {
  const [data, setData] = useState<OrganizationOverviewDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await hexaTrackApi.owner.overview();
        setData(res);
      } catch (e) {
        console.error("Failed load org overview", e);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-[#8B9BB4]">
         <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading real-time velocity metrics...
      </div>
    );
  }

  if (!data) {
     return (
       <div className="p-8 bg-red-500/10 rounded-3xl border border-red-500/20 text-red-400">
          Identity context error. No operational organization linked to this profile.
       </div>
     );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Shield size={14} className="text-[#4F8CFF]" />
             <p className="text-[11px] font-bold tracking-[0.2em] text-[#4F8CFF] uppercase">Enterprise Core Control</p>
          </div>
          <h1 className="text-3xl font-bold text-[#F9FAFB] tracking-tight">{data.name}</h1>
        </div>
        <div className="text-xs text-[#9CA3AF] font-medium bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/[0.04]">
           Data accurate as of {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Aggregated Org KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
         <StatCard 
           label="Consolidated Volume"
           value={formatCurrency(data.totalFlow)}
           pct="+ Live"
           up={true}
         />
         <StatCard 
           label="Provisioned Nodes"
           value={data.branchCount.toString()}
           pct="Stable"
           up={true}
           icon={Building2}
         />
         <StatCard 
           label="Operational Workforce"
           value={data.staffCount.toString()}
           pct="Managed"
           up={true}
           icon={Users}
         />
      </div>

      {/* Cross-Branch Comparison Map */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-[32px] p-6 md:p-8">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#F9FAFB]">Segment Velocity Map</h3>
          <p className="text-sm text-[#9CA3AF] mt-1">Inter-branch capital volume benchmarking driven directly by DB aggregates.</p>
        </div>

        {data.branchVelocity.length === 0 ? (
           <div className="py-12 text-center text-[#8B9BB4] text-sm border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
              No active transaction flows detected across existing nodes yet.
           </div>
        ) : (
          <div className="space-y-4">
            {data.branchVelocity.map((b, idx) => {
               const colors = ["#4F8CFF", "#22C55E", "#F59E0B", "#8B5CF6", "#EC4899"];
               return (
                 <BranchVelocityRow 
                    key={b.name} 
                    name={b.name} 
                    value={formatCurrency(b.volume)} 
                    weight={b.percentage > 0 ? Math.max(5, b.percentage) : 1} // ensure slight visual width 
                    color={colors[idx % colors.length]} 
                 />
               );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, pct, up, icon: Icon = TrendingUp }: { label: string, value: string, pct: string, up: boolean, icon?: any }) {
  return (
    <div className="bg-[#111827] border border-white/[0.05] rounded-[28px] p-6 relative overflow-hidden group hover:border-[#4F8CFF]/30 transition-all shadow-[0_8px_32px_-4px_rgba(0,0,0,0.2)]">
       <div className="flex items-start justify-between relative z-10">
         <div>
           <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1 flex items-center gap-2">
             <Icon size={12} className="opacity-60" /> {label}
           </p>
           <p className="text-3xl font-bold text-[#F9FAFB] tracking-tight">{value}</p>
         </div>
         <div className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border ${
           up ? 'bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E]' : 'bg-[#EF4444]/10 border-[#EF4444]/20 text-[#EF4444]'
         }`}>
           {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
           {pct}
         </div>
       </div>

       <div className="h-16 w-full absolute bottom-0 left-0 right-0 pointer-events-none opacity-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MINI_DATA}>
               <defs>
                 <linearGradient id="statGrad" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor={up ? "#22C55E" : "#EF4444"} stopOpacity={0.15}/>
                   <stop offset="100%" stopColor={up ? "#22C55E" : "#EF4444"} stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <Area type="monotone" dataKey="v" stroke={up ? "#22C55E" : "#EF4444"} strokeWidth={1.5} fill="url(#statGrad)" />
            </AreaChart>
          </ResponsiveContainer>
       </div>
    </div>
  );
}

function BranchVelocityRow({ name, value, weight, color }: { name: string, value: string, weight: number, color: string }) {
  return (
    <div className="space-y-2 group">
      <div className="flex items-center justify-between text-sm font-bold">
         <span className="text-[#F9FAFB] tracking-tight">{name}</span>
         <span className="text-[#9CA3AF] tracking-tight group-hover:text-[#F9FAFB] transition-colors">{value} <span className="opacity-40 font-medium text-xs">({weight.toFixed(1)}%)</span></span>
      </div>
      <div className="h-2.5 w-full bg-[#0B1015] rounded-full overflow-hidden border border-white/[0.04] shadow-inner">
         <div 
           className="h-full rounded-full transition-all duration-1000 ease-out opacity-90 hover:opacity-100" 
           style={{ width: `${Math.max(1, weight)}%`, backgroundColor: color, boxShadow: `0 0 15px -3px ${color}` }}
         />
      </div>
    </div>
  );
}
