'use client';

import { 
  TrendingUp, 
  Building2, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';

const MINI_DATA = [
  { v: 400 }, { v: 300 }, { v: 500 }, { v: 450 }, { v: 700 }, { v: 600 }, { v: 900 }
];

export function OrganizationOverview() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      <div>
        <p className="text-[11px] font-bold tracking-[0.2em] text-[#4F8CFF] uppercase mb-1">Enterprise Core</p>
        <h1 className="text-3xl font-bold text-[#F9FAFB] tracking-tight">Sunil Holdings, Ltd.</h1>
      </div>

      {/* Aggregated Org KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
         <StatCard 
           label="Consolidated Flow"
           value="$1.24M"
           pct="+14.2%"
           up={true}
         />
         <StatCard 
           label="Active Nodes / Branches"
           value="8"
           pct="Optimal"
           up={true}
           icon={Building2}
         />
         <StatCard 
           label="Workforce Size"
           value="142"
           pct="+4 new"
           up={true}
           icon={Users}
         />
      </div>

      {/* Cross-Branch Comparison Map */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-[32px] p-6 md:p-8">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#F9FAFB]">Active Segment Velocity</h3>
          <p className="text-sm text-[#9CA3AF] mt-1">Inter-branch throughput benchmarking.</p>
        </div>

        <div className="space-y-4">
          <BranchVelocityRow name="Dubai Main" value="$540.2k" weight={85} color="#4F8CFF" />
          <BranchVelocityRow name="Kochi Labs" value="$210.5k" weight={40} color="#22C55E" />
          <BranchVelocityRow name="Abu Dhabi" value="$188.0k" weight={35} color="#F59E0B" />
          <BranchVelocityRow name="Bangalore IT" value="$122.1k" weight={22} color="#8B5CF6" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, pct, up, icon: Icon = TrendingUp }: { label: string, value: string, pct: string, up: boolean, icon?: any }) {
  return (
    <div className="bg-[#111827] border border-white/[0.05] rounded-[28px] p-6 relative overflow-hidden group hover:border-[#4F8CFF]/30 transition-all">
       <div className="flex items-start justify-between relative z-10">
         <div>
           <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1 flex items-center gap-2">
             <Icon size={12} /> {label}
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

       <div className="h-16 w-full absolute bottom-0 left-0 right-0 pointer-events-none">
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
         <span className="text-[#F9FAFB]">{name}</span>
         <span className="text-[#9CA3AF] tracking-tight group-hover:text-[#F9FAFB] transition-colors">{value}</span>
      </div>
      <div className="h-2.5 w-full bg-[#0B1015] rounded-full overflow-hidden border border-white/[0.04]">
         <div 
           className="h-full rounded-full transition-all duration-1000 ease-out opacity-80 hover:opacity-100" 
           style={{ width: `${weight}%`, backgroundColor: color, boxShadow: `0 0 15px -3px ${color}` }}
         />
      </div>
    </div>
  );
}
