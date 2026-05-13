'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useWorkspaceStore } from '@/store/workspace-store';
import { useFinanceStore } from '@/store/finance-store';
import { BrandMark } from '@/components/ui/brand';
import { 
  LayoutDashboard, Users, Settings, LogOut, Bell, Search, 
  Building2, Network, Briefcase, TrendingUp, CreditCard, History, 
  PieChart, RefreshCcw, DollarSign, Wallet, Plus, ShieldAlert, ArrowUpRight, Tag
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

/* Custom Owner Pages */
import { OrganizationOverview } from '@/components/branches/organization-overview';
import { StaffManagementTable } from '@/components/branches/staff-management-table';
import { AssetManagement } from '@/components/branches/asset-management';
import { ConsolidatedLedger } from '@/components/branches/consolidated-ledger';
import { IntegrationsHub } from '@/components/branches/integrations-hub';
import { BranchSwitcher } from '@/components/branches/branch-switcher';

/* Shared Workspace Screens (Direct Re-use of Prebuilt Enterprise Tools) */
const DashboardScreen = dynamic(() => import('@/components/screens/dashboard-screen').then(m => m.DashboardScreen), { loading: () => <LoaderSkeleton /> });
const HistoryScreen = dynamic(() => import('@/components/screens/history-screen').then(m => m.HistoryScreen), { loading: () => <LoaderSkeleton /> });
const ReportsScreen = dynamic(() => import('@/components/screens/reports-screen').then(m => m.ReportsScreen), { loading: () => <LoaderSkeleton />, ssr: false });
const RecurringScreen = dynamic(() => import('@/components/screens/recurring-screen').then(m => m.RecurringScreen), { loading: () => <LoaderSkeleton /> });
const SettingsScreen = dynamic(() => import('@/components/screens/settings-screen').then(m => m.SettingsScreen), { loading: () => <LoaderSkeleton /> });

/* Modals / UI Utils */
import { AddTransactionSheet } from '@/components/transactions/add-transaction-sheet';
import { StatusBanner } from '@/components/ui/status-banner';

type OwnerView = 
  | 'overview' | 'staff' | 'assets' | 'ledger' | 'integrations' 
  | 'finance-dashboard' | 'transactions' | 'reports' | 'recurring' | 'settings';

export default function OwnerDashboard() {
  const router = useRouter();
  const { user, logout, hydrated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<OwnerView>('overview');
  const [isAddingTx, setIsAddingTx] = useState(false);

  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const loadFinanceWorkspace = useFinanceStore((s) => s.loadWorkspace);
  const { loading, error, clearError } = useFinanceStore();

  useEffect(() => {
    if (hydrated && !user) {
      router.replace('/');
    }
    if (hydrated && user && user.organizationRole?.toLowerCase() !== 'owner') {
       router.replace('/');
    }
  }, [hydrated, user, router]);

  // Re-sync finance store anytime global workspaceId changes (e.g. via BranchSwitcher)
  useEffect(() => {
     if (activeWorkspaceId) {
        void loadFinanceWorkspace();
     }
  }, [activeWorkspaceId, loadFinanceWorkspace]);

  if (!hydrated || !user) {
    return (
      <div className="min-h-screen bg-[#0B1015] flex items-center justify-center text-[#8B9BB4]">
        <div className="animate-pulse font-black tracking-widest text-xs uppercase">Synchronizing Global Access Keys...</div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const renderContent = () => {
     switch (activeTab) {
        case 'overview': return <OrganizationOverview />;
        case 'staff': return <StaffManagementTable />;
        case 'assets': return <AssetManagement />;
        case 'ledger': return <ConsolidatedLedger />;
        case 'integrations': return <IntegrationsHub />;
        
        /* Shared Branch Contextual Finance Screens */
        case 'finance-dashboard': return <DashboardScreen onAddTransaction={() => setIsAddingTx(true)} />;
        case 'transactions': return <HistoryScreen />;
        case 'reports': return <ReportsScreen />;
        case 'recurring': return <RecurringScreen />;
        case 'settings': return <SettingsScreen />;
        
        default: return <OrganizationOverview />;
     }
  };

  return (
    <div className="min-h-screen bg-[#0B1015] text-white flex font-sans selection:bg-[#4F8CFF]/30">
      
      {/* Dynamic Shared Components */}
      <AddTransactionSheet open={isAddingTx} onOpenChange={setIsAddingTx} />
      
      {/* Expanded Sidebar */}
      <aside className="w-[280px] border-r border-white/[0.05] bg-[#0B1015] hidden xl:flex flex-col sticky top-0 h-screen">
        <div className="h-20 flex items-center px-7 border-b border-white/[0.04]">
          <BrandMark tone="dark" />
          <div className="ml-3 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black tracking-widest uppercase">Owner</div>
        </div>

        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar pb-20">
            
            <SidebarLabel>Command</SidebarLabel>
            <NavItem active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={LayoutDashboard} label="Master Control" />
            <NavItem active={activeTab === 'staff'} onClick={() => setActiveTab('staff')} icon={Users} label="Workforce Registry" />
            <NavItem active={activeTab === 'ledger'} icon={History} label="Global Ledger" onClick={() => setActiveTab('ledger')} />

            <div className="h-4" />
            <SidebarLabel>Branch Finance</SidebarLabel>
            <NavItem active={activeTab === 'finance-dashboard'} onClick={() => setActiveTab('finance-dashboard')} icon={TrendingUp} label="Branch Monitor" />
            <NavItem active={false} onClick={() => router.push('/owner/income')} icon={DollarSign} label="Income" />
            <NavItem active={false} onClick={() => router.push('/owner/expenses')} icon={ArrowUpRight} label="Expenses" />
            <NavItem active={false} onClick={() => router.push('/owner/accounts')} icon={Wallet} label="Accounts" />
            <NavItem active={false} onClick={() => router.push('/owner/categories')} icon={Tag} label="Categories" />
            <NavItem active={activeTab === 'transactions'} onClick={() => router.push('/owner/transactions')} icon={CreditCard} label="Transactions" />
            <NavItem active={activeTab === 'reports'} onClick={() => router.push('/owner/analytics')} icon={PieChart} label="Financial Analytics" />
            <NavItem active={activeTab === 'recurring'} onClick={() => setActiveTab('recurring')} icon={RefreshCcw} label="Recurring Ledger" />

            <div className="h-4" />
            <SidebarLabel>Infrastructure</SidebarLabel>
            <NavItem active={activeTab === 'assets'} onClick={() => setActiveTab('assets')} icon={Briefcase} label="Asset Registry" />
            <NavItem active={activeTab === 'integrations'} icon={Network} label="Integrations" onClick={() => setActiveTab('integrations')} />

            <div className="h-4" />
            <SidebarLabel>System</SidebarLabel>
            <NavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings} label="Local Controls" />
        </div>

        <div className="p-4 border-t border-white/[0.05]">
           <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/[0.04] mb-3">
              <div className="flex items-center gap-3">
                 <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#4F8CFF] to-[#2563EB] flex items-center justify-center font-black text-white shadow-lg border border-white/10 text-xs">
                   {user.displayName?.charAt(0).toUpperCase()}
                 </div>
                 <div className="min-w-0">
                    <p className="text-xs font-black text-[#F9FAFB] truncate">{user.displayName}</p>
                    <p className="text-[10px] font-bold text-[#9CA3AF] truncate opacity-60 uppercase tracking-wider">Executive ID</p>
                 </div>
              </div>
           </div>
           <button onClick={handleLogout} className="w-full h-10 rounded-xl border border-white/[0.06] hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-[#9CA3AF] transition-all duration-200">
             <LogOut size={14} /> Finalize Session
           </button>
        </div>
      </aside>

      {/* Main Frame */}
      <main className="flex-1 flex flex-col min-h-screen relative">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4F8CFF]/5 blur-[100px] pointer-events-none rounded-full z-0" />
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] pointer-events-none rounded-full z-0" />

         {/* Global Banner State */}
         {error && <div className="sticky top-0 z-[99]"><StatusBanner error={error} loading={false} onDismiss={clearError} /></div>}

         {/* Executive Header */}
         <header className="h-20 flex items-center justify-between px-4 sm:px-8 border-b border-white/[0.04] bg-[#0B1015]/80 backdrop-blur-xl sticky top-0 z-40">
            <div className="flex items-center gap-4 flex-1">
               {/* The magic unified branch contextualizer */}
               <BranchSwitcher />
               
               <div className="hidden md:flex items-center bg-[#111827] border border-white/[0.05] rounded-xl px-3.5 py-2 w-full max-w-xs transition-all focus-within:border-white/20">
                  <Search size={14} className="text-[#9CA3AF]/40 mr-2" />
                  <input type="text" placeholder="Global Audit Query..." className="bg-transparent border-none outline-none text-xs text-white placeholder:text-[#9CA3AF]/30 w-full font-medium" />
               </div>
            </div>

            <div className="flex items-center gap-2.5">
               <button 
                 onClick={() => setIsAddingTx(true)}
                 disabled={!activeWorkspaceId}
                 className="h-10 px-4 bg-[#4F8CFF] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#4F8CFF]/20 hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
               >
                  <Plus size={16} /> Record Feed
               </button>
               <button className="h-10 w-10 rounded-xl border border-white/[0.06] bg-[#111827] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:border-white/20 transition-colors relative">
                  <Bell size={16} />
                  <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               </button>
            </div>
         </header>

         {/* Operational Substrate */}
         <div className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto relative z-10">
            {!activeWorkspaceId && ['finance-dashboard', 'transactions', 'reports', 'recurring', 'settings'].includes(activeTab) ? (
               <div className="min-h-[400px] flex flex-col items-center justify-center text-center border border-dashed border-white/[0.08] rounded-[32px] bg-white/[0.01]">
                  <ShieldAlert size={40} className="text-yellow-500 opacity-40 mb-4" />
                  <h3 className="text-lg font-black text-white tracking-tight">Branch Node Required</h3>
                  <p className="text-xs text-[#9CA3AF] mt-1 max-w-xs font-bold leading-relaxed uppercase tracking-wide">Please initialize or select an active node using the switch vector located in the command header.</p>
               </div>
            ) : (
               <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeTab} 
                    initial={{ opacity: 0, y: 12 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -12 }} 
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                     {renderContent()}
                  </motion.div>
               </AnimatePresence>
            )}
         </div>

      </main>
    </div>
  );
}

function SidebarLabel({ children }: { children: React.ReactNode }) {
   return (
      <div className="px-4 py-2 mt-2">
         <p className="text-[10px] font-black text-[#9CA3AF]/50 uppercase tracking-[0.25em] antialiased select-none">{children}</p>
      </div>
   );
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
       onClick={onClick}
       className={`w-full h-11 rounded-xl flex items-center px-4 gap-3 transition-all duration-200 group relative ${
         active 
           ? 'bg-gradient-to-r from-[#4F8CFF]/10 to-[#4F8CFF]/5 text-[#4F8CFF] shadow-[inset_0_0_0_1px_rgba(79,140,255,0.25)] shadow-lg shadow-blue-500/5' 
           : 'text-[#9CA3AF] hover:bg-white/[0.03] hover:text-[#F9FAFB]'
       }`}
    >
       {active && <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-[#4F8CFF] rounded-r shadow-[0_0_12px_#4F8CFF]" />}
       <Icon size={16} className={`${active ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'} transition-opacity duration-200`} />
       <span className={`text-sm font-bold tracking-tight ${active ? 'font-black' : ''}`}>{label}</span>
    </button>
  );
}

function LoaderSkeleton() {
   return (
      <div className="space-y-5 w-full">
         <div className="h-8 bg-white/[0.03] w-1/4 rounded-xl animate-pulse" />
         <div className="grid grid-cols-3 gap-5">
            <div className="h-32 bg-white/[0.03] rounded-3xl animate-pulse" />
            <div className="h-32 bg-white/[0.03] rounded-3xl animate-pulse" />
            <div className="h-32 bg-white/[0.03] rounded-3xl animate-pulse" />
         </div>
         <div className="h-64 bg-white/[0.03] rounded-[32px] animate-pulse" />
      </div>
   );
}
