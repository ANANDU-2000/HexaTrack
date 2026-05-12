'use client';

import {
  Bell,
  ChevronRight,
  CircleDollarSign,
  Fingerprint,
  Globe2,
  HelpCircle,
  Info,
  KeyRound,
  Layers,
  LogOut,
  Moon,
  Palette,
  ShieldCheck,
  Sparkles,
  Sun,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { CategoriesSettingsPanel } from '@/components/settings/categories-settings-panel';
import { BrandMark } from '@/components/ui/brand';
import { AppScreen } from '@/components/ui/mobile-layout';
import { useAuthStore } from '@/store/auth-store';

type SettingsSection =
  | 'intelligence'
  | 'security'
  | 'biometric'
  | 'notifications'
  | 'appearance'
  | 'currency'
  | 'language'
  | 'categories'
  | 'privacy'
  | 'help'
  | 'about'
  | 'logout';

export function SettingsScreen() {
  const [expandedId, setExpandedId] = useState<SettingsSection | null>(null);
  const logout = useAuthStore((state) => state.logout);

  const toggleSection = (id: SettingsSection) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="pb-24 space-y-8 animate-in fade-in duration-500">
      <header>
        <p className="font-label-mono text-[10px] text-secondary tracking-[0.2em] uppercase font-bold mb-2">Preferences</p>
        <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-[#F5F7FA] tracking-tight">System Configuration</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-8 space-y-6">
          
          {/* Profile Quick Banner */}
          <div className="glass-card rounded-3xl p-6 flex items-center gap-5 border border-primary/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-2xl rounded-full" />
            <div className="w-16 h-16 rounded-2xl bg-surface-container-high border border-white/5 flex items-center justify-center text-primary shadow-sm relative z-10">
               <BrandMark compact tone="dark" />
            </div>
            <div className="flex-grow min-w-0 z-10">
               <h2 className="text-lg font-bold text-[#F5F7FA] tracking-tight">Enterprise Node</h2>
               <p className="text-sm text-on-surface-variant font-medium opacity-70 mt-0.5">Authentication Status: Confirmed</p>
            </div>
          </div>

          {/* Core Settings Container */}
          <div className="glass-card rounded-3xl overflow-hidden divide-y divide-white/[0.03] shadow-md">
            <AccordionItem 
              id="intelligence"
              title="Intelligence Matrix"
              icon={Sparkles}
              isExpanded={expandedId === 'intelligence'}
              onToggle={() => toggleSection('intelligence')}
            >
              <div className="space-y-3 pb-2">
                <p className="text-xs text-on-surface-variant leading-relaxed opacity-80 font-medium">Enforce model-driven dynamic analysis across audit trail vectors.</p>
                <ToggleRow label="AI Prediction Nodes" enabled={true} onToggle={() => {}} />
                <ToggleRow label="Adaptive Auto-Categorization" enabled={true} onToggle={() => {}} />
              </div>
            </AccordionItem>

            <AccordionItem 
              id="security"
              title="Vault Custody"
              icon={ShieldCheck}
              isExpanded={expandedId === 'security'}
              onToggle={() => toggleSection('security')}
            >
               <div className="space-y-2 pb-2">
                  <div className="flex justify-between bg-surface-container-lowest p-3.5 rounded-2xl border border-white/5 text-xs font-medium">
                     <span className="text-on-surface-variant">Node Token</span>
                     <span className="text-[#F5F7FA] font-label-mono font-bold tracking-wider uppercase text-[10px]">Active SSL</span>
                  </div>
                  <div className="flex justify-between bg-surface-container-lowest p-3.5 rounded-2xl border border-white/5 text-xs font-medium">
                     <span className="text-on-surface-variant">Auto-Lock Interval</span>
                     <span className="text-secondary font-bold">15 MINS</span>
                  </div>
               </div>
            </AccordionItem>

            <AccordionItem 
              id="categories"
              title="Ledger Taxonomy"
              icon={Layers}
              isExpanded={expandedId === 'categories'}
              onToggle={() => toggleSection('categories')}
            >
               <div className="pb-2">
                  <CategoriesSettingsPanel />
               </div>
            </AccordionItem>
          </div>

        </div>

        <div className="lg:col-span-4 space-y-6">
          
          {/* Sidebar Preferences */}
          <div className="glass-card rounded-3xl overflow-hidden divide-y divide-white/[0.03]">
             <AccordionItem 
              id="appearance"
              title="Visual Canvas"
              icon={Palette}
              isExpanded={expandedId === 'appearance'}
              onToggle={() => toggleSection('appearance')}
            >
               <div className="pb-2">
                 <div className="grid grid-cols-3 gap-2 bg-surface-container-lowest p-1 rounded-2xl border border-white/5">
                   <button className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-[10px] font-bold font-label-mono tracking-widest text-on-surface-variant hover:bg-white/5 transition-colors"><Sun size={14}/> LIGHT</button>
                   <button className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-[10px] font-bold font-label-mono tracking-widest bg-secondary-container text-on-secondary-container shadow-sm"><Moon size={14}/> DARK</button>
                   <button className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-[10px] font-bold font-label-mono tracking-widest text-on-surface-variant hover:bg-white/5 transition-colors"><Globe2 size={14}/> AUTO</button>
                 </div>
               </div>
            </AccordionItem>

            <AccordionItem 
              id="notifications"
              title="Event Relays"
              icon={Bell}
              isExpanded={expandedId === 'notifications'}
              onToggle={() => toggleSection('notifications')}
            >
              <div className="space-y-3 pb-2">
                <ToggleRow label="Push Confirmations" enabled={true} onToggle={() => {}} />
                <ToggleRow label="E-mail Invoices" enabled={false} onToggle={() => {}} />
              </div>
            </AccordionItem>
          </div>

          <div className="glass-card rounded-3xl overflow-hidden relative">
             <button 
              onClick={logout}
              className="w-full flex items-center justify-between px-6 py-6 bg-rose-500/5 hover:bg-rose-500/10 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform border border-rose-500/10">
                  <LogOut size={18} />
                </div>
                <span className="text-sm font-bold text-rose-400">Terminate Session</span>
              </div>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}


type AccordionItemProps = {
  id: string;
  title: string;
  icon: any;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

function AccordionItem({ title, icon: Icon, isExpanded, onToggle, children }: AccordionItemProps) {
  return (
    <div className="w-full">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-5 py-5 transition-colors ${isExpanded ? 'bg-white/[0.02]' : 'hover:bg-white/[0.01]'}`}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
            isExpanded ? 'bg-[#4F8CFF] text-white shadow-md shadow-[#4F8CFF]/20' : 'bg-white/[0.05] text-[#9CA3AF]'
          }`}>
            <Icon size={18} />
          </div>
          <span className={`text-[15px] font-bold truncate transition-colors ${isExpanded ? 'text-[#F9FAFB]' : 'text-[#9CA3AF]'}`}>
            {title}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="text-[#9CA3AF]/50 shrink-0 ml-2"
        >
          <ChevronRight size={18} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-white/[0.02]">
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
      className="flex items-center justify-between w-full py-2"
    >
      <span className="text-sm font-medium text-[#F9FAFB]">{label}</span>
      <div className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${enabled ? 'bg-[#22C55E]' : 'bg-white/[0.1]'}`}>
        <motion.div 
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          animate={{ x: enabled ? 20 : 0 }}
          className="h-5 w-5 rounded-full bg-[#F9FAFB] shadow-sm" 
        />
      </div>
    </button>
  );
}
