'use client';

import {
  Bell,
  ChevronRight,
  Globe2,
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
import { useAuthStore } from '@/store/auth-store';

type SettingsSection =
  | 'intelligence'
  | 'security'
  | 'notifications'
  | 'appearance'
  | 'categories';

export function SettingsScreen() {
  const [expandedId, setExpandedId] = useState<SettingsSection | null>(null);
  const logout = useAuthStore((state) => state.logout);

  const toggleSection = (id: SettingsSection) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-10 pb-28 lg:pb-10 px-container-margin lg:px-gutter pt-6 font-sans animate-in fade-in duration-500">
      
      {/* Configuration Header */}
      <header>
         <div className="flex items-center gap-2 mb-2">
            <p className="font-label-caps text-[11px] text-cyan tracking-widest uppercase font-black">Global Schema</p>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_8px_#06B6D4]" />
         </div>
         <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">Registry Settings</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-stack-lg mt-2">
        
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Identity Module */}
          <div className="glass-card rounded-[28px] p-6 flex items-center gap-5 border border-white/[0.05] relative overflow-hidden bg-[#111827]/40 shadow-lg">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#cfbcff]/5 blur-2xl rounded-full pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-[#111827] border border-white/[0.04] flex items-center justify-center text-cyan shadow-inner relative z-10">
               <BrandMark compact tone="dark" />
            </div>
            <div className="flex-grow min-w-0 z-10">
               <h2 className="text-[15px] font-extrabold text-on-surface tracking-wide font-sans">Core Administrative Vault</h2>
               <p className="text-[10px] text-on-surface-variant font-black tracking-wider uppercase font-label-caps mt-1 opacity-80">Node Auth Protocol: Valid</p>
            </div>
          </div>

          {/* Preferences Section Accordion */}
          <div className="glass-card rounded-[28px] overflow-hidden divide-y divide-white/[0.03] border border-white/[0.05] shadow-lg">
            <AccordionItem 
              id="intelligence"
              title="Quantum Insights"
              icon={Sparkles}
              isExpanded={expandedId === 'intelligence'}
              onToggle={() => toggleSection('intelligence')}
            >
              <div className="space-y-4 pb-2 pt-1">
                <p className="text-xs text-on-surface-variant leading-relaxed font-medium font-sans opacity-90">Inject AI recommendation loops to automatically synthesize ledger flows.</p>
                <ToggleRow label="Insight Forecast Nodes" enabled={true} onToggle={() => {}} />
                <ToggleRow label="Adaptive Classification" enabled={true} onToggle={() => {}} />
              </div>
            </AccordionItem>

            <AccordionItem 
              id="security"
              title="Key Registry"
              icon={ShieldCheck}
              isExpanded={expandedId === 'security'}
              onToggle={() => toggleSection('security')}
            >
               <div className="space-y-2.5 pb-2 pt-1">
                  <div className="flex justify-between items-center bg-[#111827] px-4 py-3.5 rounded-2xl border border-white/[0.03] text-xs">
                     <span className="text-on-surface-variant font-semibold font-sans">Node Signature</span>
                     <span className="text-cyan font-mono-data font-bold tracking-wide uppercase">AES-256 GCM</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#111827] px-4 py-3.5 rounded-2xl border border-white/[0.03] text-xs">
                     <span className="text-on-surface-variant font-semibold font-sans">Auto-Lock Window</span>
                     <span className="text-on-surface font-mono-data font-extrabold tracking-tight text-sm">15m</span>
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
               <div className="pb-2 pt-1">
                  <CategoriesSettingsPanel />
               </div>
            </AccordionItem>
          </div>

        </div>

        <div className="lg:col-span-4 space-y-6">
          
          {/* Global System Rules Accordion */}
          <div className="glass-card rounded-[28px] overflow-hidden divide-y divide-white/[0.03] border border-white/[0.05] shadow-lg">
             <AccordionItem 
              id="appearance"
              title="Dynamic Theme"
              icon={Palette}
              isExpanded={expandedId === 'appearance'}
              onToggle={() => toggleSection('appearance')}
            >
               <div className="pb-2 pt-1">
                 <div className="grid grid-cols-3 gap-1.5 bg-[#111827] p-1.5 rounded-2xl border border-white/[0.03]">
                   <button className="flex flex-col items-center gap-1 py-3 rounded-xl text-[9px] font-black font-label-caps tracking-widest text-on-surface-variant hover:bg-white/[0.02] transition-all uppercase"><Sun size={13}/> LIGHT</button>
                   <button className="flex flex-col items-center gap-1 py-3 rounded-xl text-[9px] font-black font-label-caps tracking-widest bg-white/5 border border-white/[0.04] text-cyan shadow-sm transition-all uppercase"><Moon size={13}/> DARK</button>
                   <button className="flex flex-col items-center gap-1 py-3 rounded-xl text-[9px] font-black font-label-caps tracking-widest text-on-surface-variant hover:bg-white/[0.02] transition-all uppercase"><Globe2 size={13}/> AUTO</button>
                 </div>
               </div>
            </AccordionItem>

            <AccordionItem 
              id="notifications"
              title="Interface Relays"
              icon={Bell}
              isExpanded={expandedId === 'notifications'}
              onToggle={() => toggleSection('notifications')}
            >
              <div className="space-y-4 pb-2 pt-1">
                <ToggleRow label="Webhook Signals" enabled={true} onToggle={() => {}} />
                <ToggleRow label="Consolidated Digests" enabled={false} onToggle={() => {}} />
              </div>
            </AccordionItem>
          </div>

          {/* Terminate Node */}
          <div className="glass-card rounded-[28px] overflow-hidden relative border border-white/[0.05] shadow-lg">
             <button 
              onClick={logout}
              className="w-full flex items-center justify-between px-6 py-5.5 bg-danger/5 hover:bg-danger/10 active:scale-[0.99] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center text-danger group-hover:scale-105 transition-all border border-danger/20 shadow-inner shadow-danger/5">
                  <LogOut size={18} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-danger font-label-caps">Revoke Authority</span>
              </div>
              <ChevronRight size={14} className="text-danger group-hover:translate-x-1 transition-transform opacity-80" />
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
        className={`w-full flex items-center justify-between px-5 py-5 transition-colors ${isExpanded ? 'bg-white/[0.01]' : 'hover:bg-white/[0.01]'}`}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all shrink-0 border ${
            isExpanded 
              ? 'bg-cyan/10 text-cyan border-cyan/20 shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
              : 'bg-[#111827] text-on-surface-variant border-white/[0.04] shadow-inner'
          }`}>
            <Icon size={18} />
          </div>
          <span className={`text-[15px] font-bold truncate transition-colors font-sans tracking-wide ${isExpanded ? 'text-on-surface' : 'text-on-surface-variant opacity-90'}`}>
            {title}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="text-on-surface-variant opacity-60 shrink-0 ml-2"
        >
          <ChevronRight size={16} />
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
            <div className="px-5 pb-5 pt-2.5 border-t border-white/[0.02]">
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
      className="flex items-center justify-between w-full py-1 select-none"
    >
      <span className="text-[13px] font-semibold text-on-surface font-sans tracking-wide">{label}</span>
      <div className={`w-10 h-6 rounded-full transition-all relative flex items-center px-0.5 shadow-inner border ${enabled ? 'bg-cyan border-cyan/30' : 'bg-[#111827] border-white/[0.04]'}`}>
        <motion.div 
          layout
          transition={{ type: 'spring', stiffness: 600, damping: 35 }}
          animate={{ x: enabled ? 16 : 0 }}
          className="h-5 w-5 rounded-full bg-white shadow-md" 
        />
      </div>
    </button>
  );
}

