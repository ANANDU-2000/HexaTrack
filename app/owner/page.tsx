'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { BrandMark } from '@/components/ui/brand';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  Building2,
  Network
} from 'lucide-react';
import { OrganizationOverview } from '@/components/branches/organization-overview';
import { StaffManagementTable } from '@/components/branches/staff-management-table';
import { AnimatePresence, motion } from 'framer-motion';

type OwnerView = 'overview' | 'staff' | 'settings';

export default function OwnerDashboard() {
  const router = useRouter();
  const { user, logout, hydrated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<OwnerView>('overview');

  useEffect(() => {
    if (hydrated && !user) {
      router.replace('/');
    }
    if (hydrated && user && user.organizationRole?.toLowerCase() !== 'owner') {
       // Double safety check - bounce if not real owner
       router.replace('/');
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return (
      <div className="min-h-screen bg-[#0B1015] flex items-center justify-center text-[#8B9BB4]">
        <div className="animate-pulse font-bold tracking-wider text-xs">AUTHENTICATING NODE...</div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <div className="min-h-screen bg-[#0B1015] text-white flex font-sans selection:bg-[#4F8CFF]/30">
      
      {/* Premium Left Nav Sidebar */}
      <aside className="w-72 border-r border-white/[0.05] bg-[#0B1015] hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="h-20 flex items-center px-8 border-b border-white/[0.04]">
          <BrandMark tone="dark" />
          <div className="ml-3 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold tracking-wider uppercase">Owner</div>
        </div>

        <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
           <NavItem active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={LayoutDashboard} label="Command Center" />
           <NavItem active={activeTab === 'staff'} onClick={() => setActiveTab('staff')} icon={Users} label="Workforce Registry" />
           <div className="pt-6 pb-2 px-4">
              <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em]">Assets</p>
           </div>
           <NavItem icon={Building2} label="Branch Ledger" onClick={() => {}} />
           <NavItem icon={Network} label="Integrations" onClick={() => {}} />
        </div>

        <div className="p-4 border-t border-white/[0.05]">
           <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/[0.04] mb-4">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-xl bg-[#4F8CFF] flex items-center justify-center font-bold text-white">
                   {user.displayName?.charAt(0)}
                 </div>
                 <div className="min-w-0">
                    <p className="text-sm font-bold text-[#F9FAFB] truncate">{user.displayName}</p>
                    <p className="text-[11px] text-[#9CA3AF] truncate">{user.email}</p>
                 </div>
              </div>
           </div>
           <button 
             onClick={handleLogout} 
             className="w-full h-11 rounded-xl border border-white/[0.06] hover:bg-[#EF4444]/10 hover:border-[#EF4444]/20 hover:text-[#EF4444] flex items-center justify-center gap-2 text-sm font-bold text-[#9CA3AF] transition-all"
           >
             <LogOut size={16} /> Finalize Session
           </button>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col min-h-screen relative">
         
         {/* Universal Ambient Radial Light */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4F8CFF]/5 blur-[120px] pointer-events-none rounded-full" />

         {/* Header */}
         <header className="h-20 flex items-center justify-between px-6 lg:px-10 border-b border-white/[0.04] bg-[#0B1015]/80 backdrop-blur-xl sticky top-0 z-40">
            <div className="flex items-center bg-[#111827] border border-white/[0.05] rounded-full px-4 py-2 w-full max-w-md">
               <Search size={16} className="text-[#9CA3AF]/50 mr-2" />
               <input type="text" placeholder="Search operations, branches, transactions..." className="bg-transparent border-none outline-none text-sm text-[#F9FAFB] placeholder:text-[#9CA3AF]/40 w-full" />
            </div>

            <div className="flex items-center gap-3">
               <button className="h-10 w-10 rounded-xl border border-white/[0.06] flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors relative">
                  <Bell size={18} />
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               </button>
               <button className="h-10 w-10 rounded-xl border border-white/[0.06] flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors">
                  <Settings size={18} />
               </button>
            </div>
         </header>

         {/* Dynamic Content Render Area */}
         <div className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto">
            <AnimatePresence mode="wait">
               {activeTab === 'overview' && (
                  <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                     <OrganizationOverview />
                  </motion.div>
               )}
               {activeTab === 'staff' && (
                  <motion.div key="staff" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                     <StaffManagementTable />
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

      </main>

    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
       onClick={onClick}
       className={`w-full h-12 rounded-2xl flex items-center px-4 gap-3 transition-all duration-300 group ${
         active ? 'bg-[#4F8CFF]/10 text-[#4F8CFF] shadow-[inset_0_0_0_1px_rgba(79,140,255,0.2)]' : 'text-[#9CA3AF] hover:bg-white/[0.03] hover:text-[#F9FAFB]'
       }`}
    >
       <Icon size={20} className={`${active ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'} transition-opacity`} />
       <span className={`text-sm font-bold ${active ? '' : 'opacity-90'}`}>{label}</span>
    </button>
  );
}
