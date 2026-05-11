'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { BrandMark } from '@/components/ui/brand';
import { 
  LayoutDashboard, 
  Briefcase, 
  LogOut, 
  Search,
  CheckCircle,
  Clock,
  Inbox
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function StaffDashboard() {
  const router = useRouter();
  const { user, logout, hydrated } = useAuthStore();

  useEffect(() => {
    if (hydrated && !user) {
      router.replace('/');
    }
    if (hydrated && user && user.organizationRole?.toLowerCase() !== 'staff') {
       router.replace('/');
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return <div className="min-h-screen bg-[#0B1015] flex items-center justify-center text-[#8B9BB4] font-bold text-xs tracking-widest">AUTHORIZING NODE...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0B1015] text-white flex flex-col selection:bg-[#4F8CFF]/30">
      
      {/* Header Nav for Staff */}
      <header className="h-16 border-b border-white/[0.05] flex items-center justify-between px-6 bg-[#0B1015] sticky top-0 z-50">
         <div className="flex items-center gap-3">
            <BrandMark tone="dark" />
            <div className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase">Staff</div>
         </div>
         <button onClick={() => { logout(); router.replace('/'); }} className="flex items-center gap-2 text-[#9CA3AF] hover:text-white text-xs font-bold transition-colors">
            <LogOut size={14} /> Sign Out
         </button>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-8">
         
         {/* Welcome Hero */}
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm text-[#4F8CFF] font-bold uppercase tracking-wider mb-1">Assigned Node Operations</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Greetings, {user.displayName}</h1>
            <p className="text-[#9CA3AF] text-sm mt-2">Your clearance parameters allow standard transaction propagation across mapped branches.</p>
         </motion.div>

         {/* Tasks Bar */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <QuickCard icon={CheckCircle} title="Tasks Finished" val="12" c="text-[#22C55E]"/>
            <QuickCard icon={Clock} title="Pending Transmissions" val="3" c="text-[#F59E0B]"/>
            <QuickCard icon={Inbox} title="Awaiting Verification" val="0" c="text-[#8B9BB4]"/>
         </div>

         {/* Main Activity Feed Center */}
         <div className="bg-[#111827] border border-white/[0.06] rounded-3xl p-6 md:p-10 flex flex-col items-center justify-center min-h-[300px] text-center">
            <div className="w-16 h-16 bg-white/[0.02] rounded-2xl border border-white/[0.05] flex items-center justify-center text-[#8B9BB4] mb-4">
               <LayoutDashboard size={28} className="opacity-40" />
            </div>
            <h3 className="text-lg font-bold text-white">Operational Grid Active</h3>
            <p className="text-sm text-[#9CA3AF] max-w-sm mt-2">Request vectors cleared. Submit entries directly via primary financial console once assigned to a live workspace ledger.</p>
         </div>

      </main>
    </div>
  );
}

function QuickCard({ icon: Icon, title, val, c }: any) {
  return (
    <div className="bg-[#111827] border border-white/[0.05] rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-white/10 transition-all">
       <div>
          <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-0.5">{title}</p>
          <p className={`text-2xl font-bold ${c}`}>{val}</p>
       </div>
       <Icon size={24} className={`${c} opacity-30`} />
    </div>
  );
}
