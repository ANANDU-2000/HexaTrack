import { CalendarClock, Pause, Play, Plus, Sparkles, AlarmClockCheck, CreditCard } from 'lucide-react';
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
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      
      {/* Title & Quick Add Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <p className="font-label-mono text-[10px] text-secondary tracking-[0.2em] uppercase font-bold mb-2">Automated Cycles</p>
           <h2 className="font-display-lg text-3xl md:text-5xl text-[#F5F7FA] font-bold tracking-tight">Recurring Stack</h2>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary text-on-primary px-6 py-3 rounded-full text-sm font-bold shadow-md shadow-primary/20 flex items-center gap-2 active:scale-95 hover:opacity-90 transition-all whitespace-nowrap w-fit"
        >
          <Plus size={16} /> NEW SUBSCRIPTION
        </button>
      </div>

      {/* 1. AI OPTIMIZATION BANNER */}
      <section className="glass-card rounded-3xl p-6 border-l-4 border-l-secondary relative overflow-hidden shadow-lg">
         <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/10 blur-[50px] rounded-full pointer-events-none" />
         
         <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-secondary-container/20 flex items-center justify-center shrink-0 border border-secondary/10">
               <Sparkles size={24} className="text-secondary" />
            </div>
            <div>
               <h3 className="font-headline-md text-headline-md text-[#F5F7FA] font-bold mb-1">Cost Leak Detected</h3>
               <p className="text-body-sm text-on-surface-variant opacity-80 max-w-2xl leading-relaxed">
                  HexaTrack AI identified redundancy across cloud services. Consolidating tiered subscriptions could liberate <span className="font-label-mono text-secondary font-bold">${(upcomingTotal * 0.12).toFixed(2)}/cycle</span> without service degradation.
               </p>
               <button className="mt-4 text-[11px] font-bold font-label-mono uppercase tracking-widest text-secondary hover:underline">Execute Analysis</button>
            </div>
         </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. VERTICAL TIMELINE SEQUENCE [Span 7] */}
        <div className="lg:col-span-7 flex flex-col">
           <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline-md text-xl text-[#F5F7FA] font-bold">Imminent Withdrawals</h3>
              <div className="bg-surface-container px-4 py-1.5 rounded-full border border-white/[0.03] font-label-mono text-[10px] font-bold text-on-surface-variant opacity-80 tracking-wider">
                 CURRENT BILLING WINDOW
              </div>
           </div>

           {recurring.length > 0 ? (
             <div className="relative pl-6 sm:pl-8 ml-2 sm:ml-4 border-l-2 border-dashed border-white/10 py-2 space-y-10">
               {recurring.map((item, idx) => {
                  const cat = categories.find(c => c.id === item.categoryId);
                  return (
                    <div key={item.id} className="relative animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                       
                       {/* Timeline Node Indicator */}
                       <div className="absolute -left-[33px] top-3 w-6 h-6 rounded-full bg-background flex items-center justify-center z-20">
                          <div className={`w-3 h-3 rounded-full shadow-glow ${item.isActive ? 'bg-secondary' : 'bg-on-surface-variant/30'}`} />
                       </div>

                       <div className="flex flex-col">
                          <span className="font-label-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3 block opacity-60">
                             Triggers {shortDate(item.nextRunOn)}
                          </span>

                          <div className={`glass-card p-4 rounded-2xl flex items-center gap-4 transition-all hover:border-primary/20 ${!item.isActive ? 'opacity-60 grayscale' : ''}`}>
                             <div className="w-12 h-12 rounded-xl bg-surface-container-high border border-white/[0.02] flex items-center justify-center text-secondary shrink-0 shadow-inner">
                                <CalendarClock size={22} />
                             </div>

                             <div className="flex-grow min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                   <h4 className="font-bold text-[#F5F7FA] text-sm sm:text-base truncate">{cat?.name || 'Unlabeled Sequence'}</h4>
                                   <p className="font-label-mono font-bold text-[#F5F7FA] shrink-0 ml-4">{money(item.amount)}</p>
                                </div>
                                
                                <div className="flex items-center gap-4 mt-1.5 text-[11px] text-on-surface-variant font-medium opacity-80">
                                   <span className="flex items-center gap-1">
                                      <AlarmClockCheck size={12} className="text-secondary" /> 
                                      {item.frequency.toUpperCase()}
                                   </span>
                                   <span className="flex items-center gap-1">
                                      <CreditCard size={12} /> 
                                      {item.isActive ? 'ACTIVE SYNC' : 'SUSPENDED'}
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
             <div className="glass-card rounded-3xl p-12 text-center border border-dashed border-white/10">
               <p className="font-bold text-[#F5F7FA]">No configured sequences.</p>
               <p className="text-sm text-on-surface-variant mt-2">Initialize your first subscription loop now.</p>
             </div>
           )}
        </div>

        {/* 3. ANALYTICS SIDEBAR [Span 5] */}
        <div className="lg:col-span-5 flex flex-col gap-6">
           
           {/* Monthly Total Widget */}
           <div className="glass-card p-6 rounded-3xl bg-gradient-to-br from-primary-container/30 to-transparent relative border border-primary/10 overflow-hidden">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
              <p className="font-label-mono text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Aggregated Committed Burn</p>
              <h3 className="text-3xl font-bold text-[#F5F7FA] font-display-lg tracking-tight">{money(upcomingTotal)}<span className="text-sm opacity-60 font-normal"> / cycle</span></h3>
              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                 <span className="text-body-sm text-on-surface-variant">Managed instances</span>
                 <span className="font-label-mono font-bold text-[#F5F7FA]">{recurring.length} Units</span>
              </div>
           </div>

           {/* Abstract Projections Chart Placeholder */}
           <div className="glass-card p-6 rounded-3xl flex flex-col relative">
              <div className="flex justify-between items-center mb-8">
                 <div>
                   <h4 className="font-bold text-[#F5F7FA] text-sm">Yearly Horizon</h4>
                   <p className="text-[11px] text-on-surface-variant opacity-60 mt-0.5">Committed liability path</p>
                 </div>
                 <div className="text-right">
                    <p className="font-label-mono font-bold text-secondary text-lg">{money(upcomingTotal * 12)}</p>
                 </div>
              </div>

              {/* Dynamic CSS Grid Abstract Graph */}
              <div className="h-24 flex items-end gap-2">
                 {[0.4, 0.5, 0.3, 0.8, 0.6, 0.9, 0.5, 0.4, 0.7, 0.5, 0.6, 0.8].map((val, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-secondary/20 hover:bg-secondary/50 transition-all rounded-t-md group relative"
                      style={{ height: `${val * 100}%` }}
                    >
                       <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-on-secondary opacity-0 group-hover:opacity-100 bg-secondary px-1 rounded transition-opacity pointer-events-none">
                          P{i+1}
                       </div>
                    </div>
                 ))}
              </div>
              <div className="flex justify-between text-[9px] font-bold text-on-surface-variant/50 font-label-mono mt-3 uppercase tracking-widest px-1">
                 <span>Jan</span><span>Dec</span>
              </div>
           </div>

        </div>
      </div>

      <AddRecurringSheet open={isAdding} onOpenChange={setIsAdding} />
    </div>
  );
}

