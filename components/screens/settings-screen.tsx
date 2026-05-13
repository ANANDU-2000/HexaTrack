'use client';

import {
  Bell,
  ChevronRight,
  Layers,
  LogOut,
  Moon,
  Palette,
  Sun,
  Users,
  Building,
  Scan,
  User,
  Plus,
  Globe,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { CategoriesSettingsPanel } from '@/components/settings/categories-settings-panel';
import { useAuthStore } from '@/store/auth-store';

type SettingsSection =
  | 'profile'
  | 'organization'
  | 'staff'
  | 'branches'
  | 'scanner'
  | 'categories'
  | 'appearance'
  | 'notifications';

export function SettingsScreen() {
  const [expandedId, setExpandedId] = useState<SettingsSection | null>(null);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const toggleSection = (id: SettingsSection) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-5 pb-28 pt-4 select-none font-sans">
      
      {/* Clean Page Head */}
      <div className="px-1">
         <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-black text-emerald tracking-[0.2em] uppercase font-label-caps block leading-none">Registry Engine</span>
            <span className="w-1 h-1 bg-emerald rounded-full shadow-[0_0_4px_#10B981]" />
         </div>
         <h2 className="text-xl font-extrabold text-on-surface tracking-tight">Settings & Management</h2>
      </div>

      {/* Active Profile Summary */}
      <div className="bg-[#11131A] border border-outline-variant/20 rounded-xl p-4 flex items-center gap-4 shadow-sm">
         <div className="w-11 h-11 rounded-xl bg-[#1D1F27] border border-outline-variant/20 flex items-center justify-center text-emerald shrink-0 overflow-hidden">
            <User size={20} />
         </div>
         <div className="flex-grow min-w-0">
            <h3 className="text-sm font-extrabold text-on-surface truncate leading-tight">{user?.displayName || 'Manager Account'}</h3>
            <span className="text-[9px] font-bold font-label-caps text-on-surface-variant/60 tracking-wider uppercase mt-0.5">{user?.email || 'admin@workspace.net'}</span>
         </div>
         <span className="bg-emerald/10 text-emerald border border-emerald/20 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">
            Super User
         </span>
      </div>

      {/* Main Operations Group */}
      <div className="flex flex-col gap-2.5">
         <span className="px-1 text-[9px] font-black uppercase font-label-caps tracking-wider text-on-surface-variant/60">Corporate Actions</span>
         
         <div className="bg-[#11131A] border border-outline-variant/20 rounded-xl overflow-hidden divide-y divide-outline-variant/10 shadow-sm">
            
            {/* 1. Staff Management Accordion */}
            <AccordionItem 
              id="staff"
              title="Staff Management"
              icon={Users}
              isExpanded={expandedId === 'staff'}
              onToggle={() => toggleSection('staff')}
            >
               <div className="space-y-3 pt-1">
                  <p className="text-[11px] text-on-surface-variant/80 font-medium">Control workspace access permissions and manage operative staff members.</p>
                  <div className="flex flex-col gap-2 bg-[#1D1F27]/50 border border-outline-variant/10 rounded-lg p-3">
                     <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-on-surface">Surag Anandu</span>
                        <span className="text-[9px] font-black font-label-caps text-emerald uppercase">Owner</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-on-surface">Accounting AI</span>
                        <span className="text-[9px] font-bold font-label-caps text-on-surface-variant/60 uppercase">Agent</span>
                     </div>
                  </div>
                  <button className="w-full h-9 rounded-lg bg-[#1D1F27] border border-outline-variant/20 text-[10px] font-bold font-label-caps uppercase tracking-wider hover:text-emerald transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                     <Plus size={12} /> Invite Member
                  </button>
               </div>
            </AccordionItem>

            {/* 2. Branch Management */}
            <AccordionItem 
              id="branches"
              title="Branch Locations"
              icon={Building}
              isExpanded={expandedId === 'branches'}
              onToggle={() => toggleSection('branches')}
            >
               <div className="space-y-3 pt-1">
                  <p className="text-[11px] text-on-surface-variant/80 font-medium">Configure geographical reporting branches and physical office channels.</p>
                  <div className="flex items-center justify-between bg-[#1D1F27]/50 border border-outline-variant/10 p-3 rounded-lg">
                     <div className="flex flex-col">
                        <span className="text-xs font-bold text-on-surface">HQ - San Francisco</span>
                        <span className="text-[9px] font-bold font-label-caps text-on-surface-variant/50 mt-0.5">Primary Routing Node</span>
                     </div>
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald shadow-[0_0_3px_#10B981]" />
                  </div>
               </div>
            </AccordionItem>

            {/* 3. Receipt Scanner */}
            <AccordionItem 
              id="scanner"
              title="Receipt Scanner Integration"
              icon={Scan}
              isExpanded={expandedId === 'scanner'}
              onToggle={() => toggleSection('scanner')}
            >
               <div className="space-y-3 pt-1">
                  <p className="text-[11px] text-on-surface-variant/80 font-medium">Upload digital invoice captures to synthetically map to ledger flows.</p>
                  <div className="w-full py-8 border border-dashed border-outline-variant/30 rounded-lg flex flex-col items-center justify-center bg-[#1D1F27]/30 gap-2">
                     <div className="w-8 h-8 rounded-full bg-[#1D1F27] flex items-center justify-center text-on-surface-variant">
                        <Scan size={16} />
                     </div>
                     <span className="text-[9px] font-black uppercase tracking-wider font-label-caps text-on-surface-variant/70">Drag photo or Click to Upload</span>
                  </div>
               </div>
            </AccordionItem>

            {/* 4. Organization Settings */}
            <AccordionItem 
              id="organization"
              title="Organization Settings"
              icon={Briefcase}
              isExpanded={expandedId === 'organization'}
              onToggle={() => toggleSection('organization')}
            >
               <div className="space-y-3 pt-1">
                  <div className="flex justify-between items-center py-1 border-b border-outline-variant/10">
                     <span className="text-xs font-bold text-on-surface-variant">Company Name</span>
                     <span className="text-xs font-bold text-on-surface">HexaTrack Inc.</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-outline-variant/10">
                     <span className="text-xs font-bold text-on-surface-variant">Base Currency</span>
                     <span className="text-xs font-bold font-mono text-on-surface">USD</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                     <span className="text-xs font-bold text-on-surface-variant">Fiscal Interval</span>
                     <span className="text-xs font-bold text-on-surface">Jan - Dec</span>
                  </div>
               </div>
            </AccordionItem>

         </div>
      </div>

      {/* Interface Configuration Group */}
      <div className="flex flex-col gap-2.5">
         <span className="px-1 text-[9px] font-black uppercase font-label-caps tracking-wider text-on-surface-variant/60">Interface Configuration</span>
         
         <div className="bg-[#11131A] border border-outline-variant/20 rounded-xl overflow-hidden divide-y divide-outline-variant/10 shadow-sm">
            <AccordionItem 
              id="categories"
              title="Taxonomy Categories"
              icon={Layers}
              isExpanded={expandedId === 'categories'}
              onToggle={() => toggleSection('categories')}
            >
               <div className="pt-1">
                  <CategoriesSettingsPanel />
               </div>
            </AccordionItem>

            <AccordionItem 
              id="appearance"
              title="Theme Preferences"
              icon={Palette}
              isExpanded={expandedId === 'appearance'}
              onToggle={() => toggleSection('appearance')}
            >
               <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button className="flex items-center justify-center gap-1.5 h-9 rounded-lg bg-[#1D1F27]/50 border border-outline-variant/10 text-[9px] font-bold font-label-caps text-on-surface-variant/70 uppercase hover:text-on-surface"><Sun size={11} /> Light</button>
                  <button className="flex items-center justify-center gap-1.5 h-9 rounded-lg bg-[#1D1F27] border border-emerald/20 text-[9px] font-black font-label-caps text-emerald uppercase shadow-sm"><Moon size={11} /> Dark</button>
                  <button className="flex items-center justify-center gap-1.5 h-9 rounded-lg bg-[#1D1F27]/50 border border-outline-variant/10 text-[9px] font-bold font-label-caps text-on-surface-variant/70 uppercase hover:text-on-surface"><Globe size={11} /> System</button>
               </div>
            </AccordionItem>

            <AccordionItem 
              id="notifications"
              title="Alert Relays"
              icon={Bell}
              isExpanded={expandedId === 'notifications'}
              onToggle={() => toggleSection('notifications')}
            >
               <div className="flex flex-col gap-3 pt-1">
                  <ToggleRow label="Push Signal Notifications" enabled={true} onToggle={() => {}} />
                  <ToggleRow label="Weekly Expense Summary" enabled={false} onToggle={() => {}} />
               </div>
            </AccordionItem>
         </div>
      </div>

      {/* Terminate Authority */}
      <div className="bg-[#11131A] border border-outline-variant/20 rounded-xl overflow-hidden shadow-sm mt-2 cursor-pointer group active:scale-[0.98] transition-transform" onClick={logout}>
         <div className="flex items-center justify-between p-4 bg-danger/5 hover:bg-danger/10 transition-all">
            <div className="flex items-center gap-3.5">
               <div className="w-8.5 h-8.5 rounded-lg bg-danger/10 border border-danger/20 flex items-center justify-center text-danger group-hover:scale-105 transition-transform shadow-sm">
                  <LogOut size={15} />
               </div>
               <span className="text-[11px] font-extrabold uppercase font-label-caps tracking-wider text-danger">Sign Out Workspace</span>
            </div>
            <ChevronRight size={14} className="text-danger/70 group-hover:translate-x-0.5 transition-transform" />
         </div>
      </div>

    </div>
  );
}

function AccordionItem({ id, title, icon: Icon, isExpanded, onToggle, children }: { id?: string; title: string; icon: React.ElementType; isExpanded: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="w-full">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-4 hover:bg-[#1D1F27]/20 transition-colors outline-none"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
            isExpanded 
              ? 'bg-emerald/10 text-emerald border-emerald/20' 
              : 'bg-[#1D1F27] text-on-surface-variant/70 border-outline-variant/10 shadow-sm'
          }`}>
            <Icon size={15} />
          </div>
          <span className="text-[13px] font-bold text-on-surface tracking-wide">
            {title}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.15 }}
          className="text-on-surface-variant/50 shrink-0 ml-2"
        >
          <ChevronRight size={14} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-[#1D1F27]/10"
          >
            <div className="px-4 pb-4 pt-1 border-t border-outline-variant/5">
               {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ToggleRow({ label, enabled, onToggle }: { label: string; enabled: boolean; onToggle: () => void }) {
  return (
    <button 
      onClick={onToggle}
      className="flex items-center justify-between w-full py-0.5 select-none outline-none"
    >
      <span className="text-xs font-bold text-on-surface-variant font-sans">{label}</span>
      <div className={`w-9 h-5 rounded-full transition-all relative flex items-center px-0.5 shadow-inner border ${enabled ? 'bg-emerald border-emerald/30' : 'bg-[#1D1F27] border-outline-variant/10'}`}>
        <motion.div 
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          animate={{ x: enabled ? 16 : 0 }}
          className="h-3.5 w-3.5 rounded-full bg-white shadow-sm" 
        />
      </div>
    </button>
  );
}
