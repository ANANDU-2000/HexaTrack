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
    <AppScreen className="pb-20">
      <header className="mb-6">
        <p className="text-[11px] font-bold tracking-[0.2em] text-[#4F8CFF] uppercase">Preferences</p>
        <h1 className="text-3xl font-bold text-[#F9FAFB] tracking-tight">Settings</h1>
      </header>

      <div className="space-y-5">
        {/* Profile Summary (Sticky Top Concept) */}
        <div className="bg-[#111827] border border-white/[0.06] rounded-[28px] p-5 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-[#4F8CFF]/10 flex items-center justify-center text-[#4F8CFF]">
             <BrandMark compact tone="dark" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-[#F9FAFB] tracking-tight text-lg">HexaTrack User</h2>
            <p className="text-xs text-[#9CA3AF] font-medium">Enterprise Tier Active</p>
          </div>
        </div>

        {/* Core Engine Settings */}
        <div className="bg-[#111827] border border-white/[0.06] rounded-[28px] overflow-hidden shadow-sm divide-y divide-white/[0.03]">
          
          <AccordionItem 
            id="intelligence"
            title="Intelligence Engine"
            icon={Sparkles}
            isExpanded={expandedId === 'intelligence'}
            onToggle={() => toggleSection('intelligence')}
          >
            <div className="space-y-3 pb-2">
              <p className="text-xs text-[#9CA3AF] leading-relaxed">AI-driven spending analysis, categorization vectors, and pattern recognition.</p>
              <ToggleRow label="Enable Prediction" enabled={true} onToggle={() => {}} />
              <ToggleRow label="Auto-categorize" enabled={true} onToggle={() => {}} />
            </div>
          </AccordionItem>

          <AccordionItem 
            id="security"
            title="Vault Security"
            icon={ShieldCheck}
            isExpanded={expandedId === 'security'}
            onToggle={() => toggleSection('security')}
          >
             <div className="space-y-3 pb-2">
                <div className="text-xs text-[#9CA3AF] space-y-1.5">
                  <div className="flex justify-between bg-[#0B1015] p-3 rounded-xl"><span>Trusted Token</span><span className="text-[#F9FAFB] font-mono">Active</span></div>
                  <div className="flex justify-between bg-[#0B1015] p-3 rounded-xl"><span>Session Exp</span><span className="text-[#F9FAFB]">60m</span></div>
                </div>
             </div>
          </AccordionItem>

          <AccordionItem 
            id="biometric"
            title="Biometric Access"
            icon={Fingerprint}
            isExpanded={expandedId === 'biometric'}
            onToggle={() => toggleSection('biometric')}
          >
             <div className="pb-2">
               <ToggleRow label="Face ID Unlock" enabled={true} onToggle={() => {}} />
             </div>
          </AccordionItem>
        </div>

        {/* Interface & Notifications */}
        <div className="bg-[#111827] border border-white/[0.06] rounded-[28px] overflow-hidden shadow-sm divide-y divide-white/[0.03]">
           <AccordionItem 
            id="notifications"
            title="Alert Pipelines"
            icon={Bell}
            isExpanded={expandedId === 'notifications'}
            onToggle={() => toggleSection('notifications')}
          >
            <div className="space-y-3 pb-2">
              <ToggleRow label="Recurring Invoices" enabled={true} onToggle={() => {}} />
              <ToggleRow label="Budget Caps" enabled={true} onToggle={() => {}} />
            </div>
          </AccordionItem>

          <AccordionItem 
            id="appearance"
            title="Appearance Theme"
            icon={Palette}
            isExpanded={expandedId === 'appearance'}
            onToggle={() => toggleSection('appearance')}
          >
             <div className="pb-2 pt-1">
               <div className="grid grid-cols-3 gap-2 bg-[#0B1015] p-1.5 rounded-2xl border border-white/[0.05]">
                 <button className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-bold text-[#9CA3AF]"><Sun size={16}/> Light</button>
                 <button className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-bold bg-[#111827] text-[#4F8CFF] shadow-sm"><Moon size={16}/> Dark</button>
                 <button className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-bold text-[#9CA3AF]"><Globe2 size={16}/> Auto</button>
               </div>
             </div>
          </AccordionItem>
        </div>

        {/* Localization & Control */}
        <div className="bg-[#111827] border border-white/[0.06] rounded-[28px] overflow-hidden shadow-sm divide-y divide-white/[0.03]">
           <AccordionItem 
            id="currency"
            title="Monetary Unit"
            icon={CircleDollarSign}
            isExpanded={expandedId === 'currency'}
            onToggle={() => toggleSection('currency')}
          >
             <div className="bg-[#0B1015] p-3 rounded-xl flex items-center justify-between text-sm text-[#F9FAFB] font-semibold mb-2">
               <span>Base Display</span>
               <span className="text-[#4F8CFF]">USD ($)</span>
             </div>
          </AccordionItem>

          <AccordionItem 
            id="categories"
            title="Category Taxonomy"
            icon={Layers}
            isExpanded={expandedId === 'categories'}
            onToggle={() => toggleSection('categories')}
          >
             <div className="pb-2">
                <CategoriesSettingsPanel />
             </div>
          </AccordionItem>
        </div>

        {/* Session Controls */}
        <div className="bg-[#111827] border border-white/[0.06] rounded-[28px] overflow-hidden shadow-sm divide-y divide-white/[0.03]">
           <AccordionItem 
            id="about"
            title="About Ecosystem"
            icon={Info}
            isExpanded={expandedId === 'about'}
            onToggle={() => toggleSection('about')}
          >
             <div className="text-xs text-[#9CA3AF] pb-2 pt-1 space-y-2">
               <p>HexaTrack Core Version 1.2.0</p>
               <p>Build Hash: STABLE_PREMIUM_PROD</p>
             </div>
          </AccordionItem>

          <button 
            onClick={logout}
            className="w-full flex items-center justify-between px-5 py-5 hover:bg-[#FF5C75]/5 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-[#FF5C75]/10 flex items-center justify-center text-[#FF5C75]">
                <LogOut size={18} />
              </div>
              <span className="text-[15px] font-bold text-[#FF5C75]">Initialize Logout</span>
            </div>
          </button>
        </div>

      </div>
    </AppScreen>
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
