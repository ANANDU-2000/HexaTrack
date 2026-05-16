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
      <div className="min-h-[400px] flex items-center justify-center text-on-surface-variant font-sans">
         <Loader2 className="animate-spin h-5 w-5 mr-3 text-cyan" />
         <span className="text-[11px] font-black tracking-widest uppercase font-label-caps">Loading organizational node aggregates...</span>
      </div>
    );
  }

  if (!data) {
     return (
       <div className="p-6.5 bg-danger/10 rounded-[28px] border border-danger/20 text-danger font-sans text-sm font-bold tracking-wide animate-pulse">
          Context signal interrupted. No dynamic organization maps linked to current signature.
       </div>
     );
  }

  return (
    <div className="space-y-10 font-sans animate-in fade-in duration-700">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <Shield size={13} className="text-cyan" />
             <p className="font-label-caps text-[11px] tracking-widest text-cyan uppercase font-black">Autonomous Core Management</p>
          </div>
          <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">{data.name}</h1>
        </div>
        <div className="text-[9px] text-on-surface-variant font-black uppercase font-label-caps tracking-widest bg-[#0E152B] border border-white/[0.04] px-4 py-2 rounded-full shadow-inner select-none">
           Synchronized {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Main System Metaplots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatCard 
           label="Consolidated Velocity"
           value={formatCurrency(data.totalFlow)}
           pct="+ LIVE"
           up={true}
           icon={TrendingUp}
           activeColor="rgba(6, 182, 212, 0.35)"
         />
         <StatCard 
           label="Provisioned Interfaces"
           value={data.branchCount.toString()}
           pct="STABLE"
           up={true}
           icon={Building2}
           activeColor="rgba(99, 102, 241, 0.35)"
         />
         <StatCard 
           label="Authorized Workforce"
           value={data.staffCount.toString()}
           pct="SECURED"
           up={true}
           icon={Users}
           activeColor="rgba(16, 185, 129, 0.35)"
         />
      </div>

      {/* Flow Classification Visual Vector */}
      <div className="bg-[#0E152B]/40 backdrop-blur-md border border-white/[0.04] rounded-[28px] p-6 md:p-8 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan/5 blur-3xl rounded-full pointer-events-none" />
        
        <div className="mb-8 relative z-10">
          <h3 className="text-lg font-extrabold text-on-surface tracking-wide">Synchronous Flux Indices</h3>
          <p className="text-[11px] text-on-surface-variant font-medium tracking-wide mt-1">Dynamic metrics cross-referencing direct db segment telemetry.</p>
        </div>

        {data.branchVelocity.length === 0 ? (
           <div className="py-14 text-center text-on-surface-variant font-sans tracking-wide text-xs border border-dashed border-white/[0.08] rounded-[24px] bg-[#0E152B]/20 select-none">
              System idle. No flow detected across assigned sub-nodes.
           </div>
        ) : (
          <div className="space-y-6 relative z-10">
            {data.branchVelocity.map((b, idx) => {
               const colors = ["#10B981", "#10B981", "#0D9488", "#0D9488", "#fca5a5"];
               return (
                 <BranchVelocityRow 
                    key={b.name} 
                    name={b.name} 
                    value={formatCurrency(b.volume)} 
                    weight={b.percentage > 0 ? Math.max(5, b.percentage) : 1} 
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

function StatCard({ label, value, pct, up, icon: Icon, activeColor }: { label: string, value: string, pct: string, up: boolean, icon: any, activeColor: string }) {
  return (
    <div className="bg-[#0E152B]/40 border border-white/[0.05] rounded-[28px] p-6 md:p-7 relative overflow-hidden group transition-all hover:border-cyan/20 shadow-md">
       <div className="flex items-start justify-between relative z-10">
         <div>
           <p className="text-[10px] font-black font-label-caps text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-2 opacity-70">
             <Icon size={13} className="text-cyan" /> {label}
           </p>
           <p className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight leading-none">{value}</p>
         </div>
         <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black tracking-wider uppercase font-label-caps flex items-center gap-1 border border-white/[0.05] bg-[#0E152B] text-cyan shadow-[0_0_8px_rgba(16,185,129,0.15)]`}>
           <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse shadow-[0_0_6px_#10B981] mr-0.5" />
           {pct}
         </div>
       </div>

       <div className="h-16 w-full absolute bottom-0 left-0 right-0 pointer-events-none opacity-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MINI_DATA}>
               <defs>
                 <linearGradient id={`grad-${label.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#10B981" stopOpacity={0.2}/>
                   <stop offset="100%" stopColor="#10B981" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <Area type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2} fill={`url(#grad-${label.replace(/\s/g, '')})`} />
            </AreaChart>
          </ResponsiveContainer>
       </div>
    </div>
  );
}

function BranchVelocityRow({ name, value, weight, color }: { name: string, value: string, weight: number, color: string }) {
  return (
    <div className="space-y-2.5 group">
      <div className="flex items-center justify-between text-xs">
         <span className="text-on-surface font-bold tracking-wide">{name}</span>
         <span className="font-mono-data font-extrabold text-on-surface-variant tracking-tight group-hover:text-cyan transition-colors">
           {value} <span className="opacity-40 text-[10px] font-label-caps font-black">({weight.toFixed(1)}%)</span>
         </span>
      </div>
      <div className="h-2.5 w-full bg-[#0E152B] rounded-full overflow-hidden border border-white/[0.04] shadow-inner">
         <div 
           className="h-full rounded-full transition-all duration-1000 ease-out opacity-90 group-hover:brightness-105" 
           style={{ width: `${Math.max(1, weight)}%`, backgroundColor: color, boxShadow: `0 0 15px -3px ${color}` }}
         />
      </div>
    </div>
  );
}

