'use client';

import { Check, Sparkles, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PLANS = [
  { name: 'Starter', price: 49, staff: 5, branches: 1, feat: ['Expense Tracking', 'Basic Reports'] },
  { name: 'Professional', price: 149, staff: 25, branches: 5, feat: ['AI Insights', 'Export Engine'], popular: true },
  { name: 'Business', price: 399, staff: 100, branches: 20, feat: ['Audit Logs', 'Workflow Approvals'] },
];

export function UpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [annual, setAnnual] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/70 backdrop-blur-lg overflow-y-auto p-4 py-10">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-5xl relative bg-transparent"
      >
        <button onClick={onClose} className="absolute -top-12 right-0 p-2 text-[#9CA3AF] hover:text-white bg-white/[0.05] rounded-full"><X size={24}/></button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#4F8CFF]/10 border border-[#4F8CFF]/20 px-4 py-1.5 rounded-full text-[#4F8CFF] text-sm font-bold mb-4 shadow-sm shadow-[#4F8CFF]/10">
            <Sparkles size={16} /> Scalable Premium Growth
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F9FAFB] tracking-tight mb-3">Ascend your architecture.</h1>
          <p className="text-[#9CA3AF] text-base font-medium max-w-xl mx-auto leading-relaxed">Provision greater organizational node headroom and unlock deep algorithmic intelligence.</p>
          
          {/* Cycle Toggle */}
          <div className="mt-8 inline-flex items-center p-1 bg-[#111827] border border-white/[0.05] rounded-2xl relative">
             <button onClick={() => setAnnual(false)} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all relative z-10 ${!annual ? 'text-[#F9FAFB]' : 'text-[#9CA3AF]'}`}>Monthly</button>
             <button onClick={() => setAnnual(true)} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all relative z-10 ${annual ? 'text-[#F9FAFB]' : 'text-[#9CA3AF]'}`}>Yearly <span className="text-[#22C55E] text-[10px] ml-1 font-extrabold">SAVE 20%</span></button>
             
             <motion.div
               className="absolute inset-y-1 bg-[#4F8CFF] rounded-xl shadow-md shadow-[#4F8CFF]/20"
               initial={false}
               animate={{
                 left: annual ? '50%' : '4px',
                 right: annual ? '4px' : '50%'
               }}
               transition={{ type: 'spring', stiffness: 500, damping: 35 }}
             />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
           {PLANS.map((plan, i) => (
             <motion.div 
               key={plan.name} 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: i * 0.1 }}
               className={`relative bg-[#111827] border rounded-[32px] p-8 flex flex-col ${
                 plan.popular ? 'border-[#4F8CFF] shadow-[0_24px_64px_-12px_rgba(79,140,255,0.25)]' : 'border-white/[0.06]'
               }`}
             >
               {plan.popular && (
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#4F8CFF] text-[#F9FAFB] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-[#4F8CFF]/30 flex items-center gap-1">
                   <Zap size={10} fill="currentColor"/> Recommended
                 </div>
               )}

               <h3 className="text-lg font-bold text-[#F9FAFB] tracking-tight mb-1">{plan.name}</h3>
               <div className="flex items-baseline gap-1 mt-4 mb-6">
                 <span className="text-4xl font-extrabold text-[#F9FAFB] tracking-tighter">${annual ? Math.floor(plan.price * 0.8) : plan.price}</span>
                 <span className="text-[#9CA3AF] text-sm font-medium">/mo</span>
               </div>

               <div className="space-y-3 py-6 border-y border-white/[0.04] mb-6">
                 <div className="flex items-center justify-between"><span className="text-xs font-bold text-[#9CA3AF]">Staff Vector</span><span className="text-sm font-bold text-[#F9FAFB]">{plan.staff} Limit</span></div>
                 <div className="flex items-center justify-between"><span className="text-xs font-bold text-[#9CA3AF]">Branch Span</span><span className="text-sm font-bold text-[#F9FAFB]">{plan.branches} Nodes</span></div>
               </div>

               <ul className="space-y-4 mb-8 flex-1">
                 {plan.feat.map(f => (
                   <li key={f} className="flex items-center gap-3 text-xs font-bold text-[#F9FAFB]">
                      <div className="w-5 h-5 rounded-full bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E] shrink-0"><Check size={12} strokeWidth={3}/></div>
                      {f}
                   </li>
                 ))}
               </ul>

               <button className={`w-full h-12 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
                 plan.popular ? 'bg-[#4F8CFF] text-white shadow-md' : 'bg-white/[0.04] border border-white/[0.05] text-[#F9FAFB] hover:bg-white/[0.08]'
               }`}>
                 Select {plan.name}
               </button>

             </motion.div>
           ))}
        </div>

      </motion.div>
    </div>
  );
}
