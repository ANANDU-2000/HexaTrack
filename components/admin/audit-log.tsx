'use client';

import { motion } from 'framer-motion';
import { Activity, ShieldAlert, User, UserCheck, KeyRound } from 'lucide-react';

interface AuditItem {
  id: string;
  title: string;
  timestamp: string;
  userInitials: string;
  role: 'Admin' | 'User';
  status: 'Success' | 'Denied' | 'Warning';
}

export function AuditLogPanel({ events }: { events?: AuditItem[] }) {
  
  const data = events || [
     { id: '1', title: 'Workspace Lockdown Triggered', timestamp: '2 mins ago', userInitials: 'AD', role: 'Admin', status: 'Warning' },
     { id: '2', title: 'API Token Rotation Completed', timestamp: '15 mins ago', userInitials: 'SYS', role: 'Admin', status: 'Success' },
     { id: '3', title: 'Unauthorized Access Blocked', timestamp: '1 hour ago', userInitials: 'IP88', role: 'User', status: 'Denied' },
     { id: '4', title: 'New Staff Node Attached', timestamp: '4 hours ago', userInitials: 'JD', role: 'User', status: 'Success' }
  ];

  const getStatusIcon = (status: string) => {
     switch(status) {
        case 'Denied': return <ShieldAlert size={14} className="text-rose-400" />;
        case 'Warning': return <KeyRound size={14} className="text-amber-400" />;
        default: return <UserCheck size={14} className="text-emerald-400" />;
     }
  };

  const getStatusBorder = (status: string) => {
     switch(status) {
        case 'Denied': return 'border-rose-500/30 bg-rose-500/5 text-rose-400';
        case 'Warning': return 'border-amber-500/30 bg-amber-500/5 text-amber-400';
        default: return 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400';
     }
  };

  return (
    <div className="bg-[#111827]/40 backdrop-blur-md border border-white/[0.04] rounded-[32px] overflow-hidden flex flex-col h-full relative">
       
       <div className="px-8 py-6 border-b border-white/[0.04] flex items-center justify-between bg-[#111827]/20">
          <h3 className="font-bold text-[#F5F7FA] text-lg tracking-tight flex items-center gap-2">
             <Activity size={18} className="text-emerald-400" /> Neural Activity Log
          </h3>
          <div className="flex items-center gap-1.5 text-[9px] font-black font-label-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/10">
             <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> LIVE_FEED
          </div>
       </div>

       <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
          {data.map((event, i) => (
             <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-4 p-3.5 rounded-2xl hover:bg-white/[0.02] transition-all border border-transparent hover:border-white/[0.02] relative group"
             >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs border ${
                   event.role === 'Admin' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-white/5 border-white/10 text-[#F5F7FA]'
                }`}>
                   {event.userInitials}
                </div>
                
                <div className="flex-1 min-w-0 pt-0.5">
                   <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-bold text-[#F5F7FA] leading-tight group-hover:text-white transition-colors">{event.title}</h4>
                      <span className="shrink-0 font-label-mono text-[8px] font-bold text-on-surface-variant opacity-50 tracking-wider mt-0.5 uppercase">
                         {event.timestamp}
                      </span>
                   </div>
                   
                   <div className="flex items-center gap-2 mt-2">
                      <span className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border leading-none ${getStatusBorder(event.status)}`}>
                         {getStatusIcon(event.status)}
                         {event.status}
                      </span>
                      <span className={`text-[9px] font-black uppercase tracking-widest opacity-50 ${event.role === 'Admin' ? 'text-blue-400' : 'text-on-surface-variant'}`}>
                         {event.role} ACCESS
                      </span>
                   </div>
                </div>
             </motion.div>
          ))}
       </div>
    </div>
  );
}
