'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  LayoutDashboard, BarChart3, History, CreditCard, 
  Users, Wallet, Tag, RefreshCcw, Settings, LogOut, Plus, Menu, X 
} from 'lucide-react';

import { BrandMark } from '@/components/ui/brand';
import { useAuthStore } from '@/store/auth-store';
import { useFinanceStore } from '@/store/finance-store';
import { useWorkspaceStore } from '@/store/workspace-store';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { KpiCards } from '@/components/dashboard/kpi-cards';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { AddTransactionSheet } from '@/components/transactions/add-transaction-sheet';

import { ExpenseCategoryWidget } from '@/components/dashboard/expense-category-widget';

type NavSection = 'Workspace' | 'Manage' | 'System';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, hydrated } = useAuthStore();
  const loadWorkspace = useFinanceStore((s) => s.loadWorkspace);
  const financeError = useFinanceStore((s) => s.error);
  const hydrateWorkspace = useWorkspaceStore((s) => s.hydrate);
  const wsHydrated = useWorkspaceStore((s) => s.hydrated);
  const [activeTxSheet, setActiveTxSheet] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Step 1: Hydrate workspace store from localStorage (synchronous)
  useEffect(() => {
    if (hydrated && user && !wsHydrated) {
      hydrateWorkspace();
    }
  }, [hydrated, user, wsHydrated, hydrateWorkspace]);

  useEffect(() => {
    if (hydrated && !user) {
      router.replace('/');
    }
  }, [hydrated, user, router]);

  // Step 2: Load finance workspace (which now ensures workspace is ready internally)
  useEffect(() => {
    if (hydrated && user) {
       void loadWorkspace();
    }
  }, [hydrated, user, loadWorkspace]);

  if (!hydrated || !user) return null;

  const navGroups = [
    {
      title: 'Workspace',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, active: true, path: '/dashboard' },
        { label: 'Analytics', icon: BarChart3, active: false, path: '/dashboard/analytics' },
        { label: 'Transactions', icon: CreditCard, active: false, path: '/dashboard/transactions' },
        { label: 'Ledger', icon: History, active: false, path: '/dashboard/ledger' },
      ]
    },
    {
      title: 'Manage',
      items: [
        { label: 'Staff', icon: Users, active: false, path: '/dashboard/staff' },
        { label: 'Accounts', icon: Wallet, active: false, path: '/dashboard/accounts' },
        { label: 'Categories', icon: Tag, active: false, path: '/dashboard/categories' },
        { label: 'Recurring', icon: RefreshCcw, active: false, path: '/dashboard/recurring' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B1015] text-white flex overflow-hidden selection:bg-primary/30 font-sans relative">
      {/* Ambient background glow for premium fintech depth */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Transaction Overlay */}
      <AddTransactionSheet open={activeTxSheet} onOpenChange={setActiveTxSheet} />

      {/* Mobile Sidebar Toggle Overlay */}
      <AnimatePresence>
         {isMobileNavOpen && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileNavOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
            />
         )}
      </AnimatePresence>

      {/* Sidebar (Fixed, Deep Navy Gradient) */}
      <aside className={`fixed inset-y-0 left-0 w-[260px] bg-gradient-to-b from-[#0F172A] to-[#0B1015] border-r border-white/[0.03] flex flex-col z-50 transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:h-screen shrink-0 ${
         isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-20 flex items-center px-6 border-b border-white/[0.03] relative shrink-0">
           <BrandMark tone="dark" className="h-7 w-auto" />
           <span className="ml-3 text-lg font-black tracking-tighter text-[#F5F7FA]">HexaTrack</span>
           
           <button onClick={() => setIsMobileNavOpen(false)} className="lg:hidden absolute right-4 text-on-surface-variant">
              <X size={20} />
           </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-7 custom-scrollbar">
           {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-1.5">
                 <p className="px-4 font-label-mono text-[9px] font-black tracking-[0.2em] text-on-surface-variant/50 uppercase mb-3">{group.title}</p>
                 {group.items.map((item) => (
                    <button
                      key={item.label}
                      className={`w-full h-10 rounded-xl flex items-center px-4 gap-3.5 transition-all duration-200 group relative font-medium text-sm ${
                         item.active 
                           ? 'bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(79,140,255,0.15)]' 
                           : 'text-on-surface-variant hover:bg-white/[0.03] hover:text-[#F5F7FA]'
                      }`}
                    >
                       {item.active && <motion.div layoutId="sidebar-active-glow" className="absolute inset-0 rounded-xl shadow-[0_4px_20px_rgba(79,140,255,0.12)] pointer-events-none" />}
                       <item.icon size={16} className={`shrink-0 ${item.active ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'} transition-opacity`} />
                       <span>{item.label}</span>
                    </button>
                 ))}
              </div>
           ))}
        </nav>

        <div className="p-4 border-t border-white/[0.03] space-y-3 shrink-0">
           <button className="w-full h-10 rounded-xl flex items-center px-4 gap-3.5 transition-all text-on-surface-variant hover:bg-white/[0.03] hover:text-[#F5F7FA] text-sm font-medium">
              <Settings size={16} className="opacity-50" />
              <span>Settings</span>
           </button>
           
           <div className="h-px bg-white/[0.03] mx-2" />

           <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/5 flex items-center justify-center font-bold text-xs text-[#F5F7FA]">
                 {user.displayName?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="min-w-0 flex-1">
                 <p className="text-xs font-bold text-[#F5F7FA] truncate">{user.displayName || 'User Agent'}</p>
                 <p className="text-[10px] text-on-surface-variant opacity-60 truncate font-medium">Enterprise Console</p>
              </div>
              <button onClick={() => logout()} className="p-2 text-on-surface-variant hover:text-rose-400 transition-colors rounded-lg">
                 <LogOut size={14} />
              </button>
           </div>
        </div>
      </aside>

      {/* Main Workspace Substrate */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar relative z-10 w-full">
         
         {/* Top Nav Bar for Mobile view only */}
         <div className="lg:hidden h-16 border-b border-white/[0.03] bg-[#0B1015]/90 backdrop-blur-md flex items-center px-4 shrink-0 sticky top-0 z-30">
            <button onClick={() => setIsMobileNavOpen(true)} className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-[#F5F7FA]">
               <Menu size={20} />
            </button>
            <div className="ml-auto w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
               <BrandMark tone="dark" className="h-4 w-auto" />
            </div>
         </div>

         <div className="w-full max-w-7xl mx-auto px-6 md:px-10 py-6 md:py-8 flex flex-col gap-8 pb-20">
            
            {/* 1. HEADER */}
            <DashboardHeader onAddTransaction={() => setActiveTxSheet(true)} />

            {/* 2. KPI ROW */}
            <KpiCards />

            {/* 3. CORE BENTO CONTENT */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
               
               {/* Analytics Preview (Re-using established Area Projected Flow visual) */}
               <div className="xl:col-span-8 space-y-6 md:space-y-8">
                  <div className="glass-card rounded-[32px] p-6 md:p-8 border border-white/[0.03] min-h-[400px] flex flex-col justify-between group hover:border-white/[0.08] transition-all relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
                     
                     <div className="flex items-center justify-between z-10">
                        <div>
                           <h3 className="font-bold text-[#F5F7FA] text-lg tracking-tight">Asset Projections</h3>
                           <p className="text-xs text-on-surface-variant opacity-60 font-medium mt-0.5">Quarterly trajectory analysis</p>
                        </div>
                        <div className="flex gap-1 bg-surface-container-lowest/50 p-1 rounded-xl border border-white/[0.03]">
                           {['1W', '1M', '3M'].map((v) => (
                              <button key={v} className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${v === '1M' ? 'bg-white/5 text-[#F5F7FA]' : 'text-on-surface-variant hover:text-[#F5F7FA]'}`}>
                                 {v}
                              </button>
                           ))}
                        </div>
                     </div>

                     {/* Static Placeholder for visual balance graph as detailed in the reference */}
                     <div className="h-64 w-full flex items-end gap-2 md:gap-3 mt-8 relative z-10">
                        {[30, 45, 40, 65, 55, 80, 70, 95, 85, 100, 90, 85].map((val, i) => (
                           <motion.div 
                             key={i}
                             initial={{ height: 0 }}
                             animate={{ height: `${val}%` }}
                             transition={{ delay: i * 0.03, duration: 0.8, ease: "circOut" }}
                             className={`flex-1 rounded-t-lg transition-all cursor-pointer relative group ${
                                i === 9 ? 'bg-primary shadow-[0_0_20px_rgba(79,140,255,0.3)]' : 'bg-primary/15 hover:bg-primary/30'
                             }`}
                           >
                              <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-[#F5F7FA] text-[#0B1015] font-black text-[8px] tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                 VAL {val}%
                              </div>
                           </motion.div>
                        ))}
                     </div>
                  </div>

                  {/* Distribution Analytics integration */}
                  <ExpenseCategoryWidget />
               </div>

               {/* 4. RIGHT SIDE PANEL (Recent Transactions) */}
               <div className="xl:col-span-4">
                  <RecentTransactions />
               </div>

            </div>

         </div>
      </main>

    </div>
  );
}
