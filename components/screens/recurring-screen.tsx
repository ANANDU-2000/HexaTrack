import { CalendarClock, Plus, Sparkles, AlarmClockCheck, CreditCard } from 'lucide-react';
import { useState, useMemo } from 'react';
import { money, shortDate } from '@/lib/format';
import { useFinanceStore } from '@/store/finance-store';
import { AddRecurringSheet } from '@/components/recurring/add-recurring-sheet';

export function RecurringScreen() {
  const recurring = useFinanceStore((state) => state.recurring);
  const categories = useFinanceStore((state) => state.categories);
  const [isAdding, setIsAdding] = useState(false);
  
  const upcomingTotal = useMemo(() => 
    recurring.reduce((sum, item) => sum + item.amount, 0), 
  [recurring]);

  return (
    <div className="space-y-10 px-container-margin lg:px-gutter pt-6 font-sans animate-in fade-in duration-500">
      
      {/* Header Configuration */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <p className="font-label-caps text-[11px] text-cyan tracking-widest uppercase font-black">Automation Loop</p>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_8px_#10B981]" />
           </div>
           <h2 className="font-headline text-3xl md:text-4xl text-on-surface font-extrabold tracking-tight">Recurring Protocol</h2>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary text-white hover:brightness-105 active:scale-95 px-6 py-3.5 rounded-full text-xs font-black tracking-widest uppercase shadow-lg shadow-primary/20 flex items-center gap-2 transition-all w-fit font-label-caps border border-white/[0.1]"
        >
          <Plus size={16} strokeWidth={3} /> New Recurring Loop
        </button>
      </div>

      {/* 1. ADVANCED AI BANNER */}
      <section className="glass-card rounded-[28px] p-6.5 relative overflow-hidden border-l-4 border-l-cyan border-y border-r border-white/[0.05] shadow-lg">
         <div className="absolute -top-10 -right-10 w-52 h-52 bg-cyan/10 blur-[60px] rounded-full pointer-events-none" />
         <div className="absolute inset-0 opacity-5 bg-[radial-gradient(rgba(16,185,129,0.4)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
         
         <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-cyan/10 flex items-center justify-center shrink-0 border border-cyan/20 shadow-inner shadow-cyan/5">
               <Sparkles size={24} className="text-cyan drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            </div>
            <div>
               <h3 className="font-headline text-lg text-on-surface font-extrabold mb-1 tracking-tight">Algorithmic Yield Leak</h3>
               <p className="text-sm text-on-surface-variant leading-relaxed max-w-3xl opacity-90">
                  Quantum Analysis identified sequential overlap across node pools. Restructuring ledger workflows can optimize <span className="font-mono-data text-cyan font-bold text-base tracking-tight">${(upcomingTotal * 0.12).toFixed(2)}</span> per cadence cycle with absolute integrity.
               </p>
               <button className="mt-4 text-[10px] font-black font-label-caps uppercase tracking-widest text-cyan hover:text-white active:scale-95 transition-all">Initialize Compiler Analysis</button>
            </div>
         </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-stack-lg mt-2">
        
        {/* 2. TIMELINE PROTOCOL */}
        <div className="lg:col-span-7 flex flex-col">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h3 className="font-headline text-lg text-on-surface font-bold tracking-tight">Imminent Deployments</h3>
              <div className="bg-[#0E152B] px-4 py-2 rounded-xl border border-white/[0.04] font-label-caps text-[9px] font-black text-on-surface-variant opacity-80 tracking-widest uppercase w-fit shadow-sm">
                 Current Scan Interval
              </div>
           </div>

           {recurring.length > 0 ? (
             <div className="relative pl-6 sm:pl-8 ml-2 border-l border-dashed border-white/[0.1] py-2 space-y-10">
               {recurring.map((item, idx) => {
                  const cat = categories.find(c => c.id === item.categoryId);
                  return (
                    <div key={item.id} className="relative animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 80}ms` }}>
                       
                       {/* Timeline Tracker Bubble */}
                       <div className="absolute -left-[31px] top-3 w-5 h-5 rounded-full bg-[#0B1020] border-2 border-[#0b1020] flex items-center justify-center z-20">
                          <div className={`w-2 h-2 rounded-full shadow-sm transition-all ${item.isActive ? 'bg-cyan shadow-[0_0_8px_#10B981]' : 'bg-on-surface-variant/30'}`} />
                       </div>

                       <div className="flex flex-col">
                          <span className="font-mono-data text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3 block opacity-60">
                             Triggers {shortDate(item.nextRunOn)}
                          </span>

                          <div className={`glass-card p-4.5 rounded-[24px] flex items-center gap-4 border border-white/[0.03] transition-all hover:bg-white/[0.01] hover:border-cyan/20 group ${!item.isActive ? 'opacity-60 grayscale' : ''}`}>
                             <div className="w-12 h-12 rounded-xl bg-[#0E152B] border border-white/[0.04] flex items-center justify-center text-cyan shrink-0 shadow-inner">
                                <CalendarClock size={22} className="group-hover:scale-105 transition-transform" />
                             </div>

                             <div className="flex-grow min-w-0">
                                <div className="flex justify-between items-start gap-4 mb-1.5">
                                   <h4 className="font-bold text-on-surface text-[15px] truncate font-sans tracking-wide">{cat?.name || 'Generic Loop'}</h4>
                                   <p className="font-mono-data font-extrabold text-on-surface shrink-0 text-sm tracking-tight">{money(item.amount)}</p>
                                </div>
                                
                                <div className="flex items-center gap-4 text-[10px] text-on-surface-variant font-bold font-label-caps tracking-wider mt-0.5 opacity-90">
                                   <span className="flex items-center gap-1.5 uppercase">
                                      <AlarmClockCheck size={13} className="text-cyan" /> 
                                      {item.frequency}
                                   </span>
                                   <span className="w-[1px] h-3 bg-white/10" />
                                   <span className="flex items-center gap-1.5 uppercase">
                                      <CreditCard size={13} /> 
                                      {item.isActive ? 'Live Stack' : 'Offline'}
                                   </span>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  )
               })}
             </div>
           ) : (
             <div className="glass-card rounded-[28px] p-12 text-center border border-dashed border-white/[0.08]">
                <p className="font-bold text-on-surface font-sans">Zero active sub-routines.</p>
                <p className="text-[11px] font-label-caps text-on-surface-variant uppercase tracking-wider mt-2">Configure a node pipeline to initiate</p>
             </div>
           )}
        </div>

        {/* 3. AGGREGATION METRICS */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-stack-lg">
           
           {/* Consolidated Burn Widget */}
           <div className="glass-card p-6 md:p-7 rounded-[28px] bg-gradient-to-br from-[#0E152B] to-[#0b1020] relative border border-white/[0.06] overflow-hidden">
              <div className="absolute bottom-0 right-0 w-36 h-36 bg-[#0D9488]/5 blur-3xl rounded-full pointer-events-none" />
              <p className="font-label-caps text-[10px] font-black uppercase tracking-widest text-cyan mb-2">Aggregated Runrate Value</p>
              <h3 className="text-display-balance text-3xl font-extrabold text-on-surface tracking-tight font-headline">{money(upcomingTotal)}<span className="text-sm text-on-surface-variant font-semibold font-sans lowercase"> / cycle</span></h3>
              <div className="mt-6 flex items-center justify-between border-t border-white/[0.05] pt-4.5">
                 <span className="text-[11px] text-on-surface-variant uppercase font-label-caps font-bold tracking-wider">Active Subscriptions</span>
                 <span className="font-mono-data font-bold text-cyan text-sm">{recurring.length} Nodes</span>
              </div>
           </div>

           {/* Horizon Chart Widget */}
           <div className="glass-card p-6 md:p-7 rounded-[28px] flex flex-col border border-white/[0.05] relative overflow-hidden">
              <div className="flex justify-between items-start gap-4 mb-8 z-10">
                 <div>
                   <h4 className="font-bold text-on-surface text-[15px] font-sans tracking-wide">Annual Projections</h4>
                   <p className="text-[10px] font-semibold uppercase tracking-wider font-label-caps text-on-surface-variant mt-0.5">Horizon forecast path</p>
                 </div>
                 <div className="text-right">
                    <p className="font-mono-data font-extrabold text-cyan text-lg tracking-tight">{money(upcomingTotal * 12)}</p>
                 </div>
              </div>

              {/* Abstract projection scale bars */}
              <div className="h-28 flex items-end gap-2 relative z-10 mt-2 px-1 select-none">
                 {[0.4, 0.5, 0.3, 0.8, 0.6, 0.9, 0.5, 0.4, 0.7, 0.5, 0.6, 0.8].map((val, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-cyan/15 hover:bg-cyan/60 hover:shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all border-t border-cyan/20 rounded-t-md group relative cursor-crosshair"
                      style={{ height: `${val * 100}%` }}
                    >
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] font-black text-on-surface bg-[#0E152B] px-2 py-0.5 border border-white/[0.05] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-label-caps pointer-events-none tracking-widest">
                          T-{i+1}
                       </div>
                    </div>
                 ))}
              </div>
              <div className="flex justify-between text-[9px] font-black text-on-surface-variant opacity-50 font-label-caps mt-4 uppercase tracking-widest px-1.5">
                 <span>JAN</span><span>DEC</span>
              </div>
           </div>

        </div>
      </div>

      <AddRecurringSheet open={isAdding} onOpenChange={setIsAdding} />
    </div>
  );
}


