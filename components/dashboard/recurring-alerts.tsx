'use client';

import { BellRing, CalendarClock } from 'lucide-react';
import { money, shortDate } from '@/lib/format';
import { useFinanceStore } from '@/store/finance-store';

export function RecurringAlerts() {
  const recurring = useFinanceStore((state) => state.recurring);
  const categories = useFinanceStore((state) => state.categories);

  const upcoming = recurring
    .filter(r => r.isActive)
    .sort((a, b) => a.nextRunOn.localeCompare(b.nextRunOn))
    .slice(0, 2);

  return (
    <section className="glass-card rounded-[28px] p-6 md:p-7">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/10">
           <BellRing size={16} className="text-primary shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
        </div>
        <h3 className="font-headline text-lg font-bold text-on-surface tracking-tight">Recurrent Bills</h3>
      </div>

      <div className="divide-y divide-white/[0.05]">
        {upcoming.map((item) => {
          const cat = categories.find(c => c.id === item.categoryId);
          return (
            <div 
              key={item.id}
              className="flex items-center justify-between py-3 hover:bg-white/[0.02] px-1 rounded-xl transition-colors cursor-pointer group first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 shrink-0 bg-[#0E152B] border border-white/[0.03] rounded-xl flex items-center justify-center text-on-surface-variant group-hover:text-primary group-hover:border-primary/20 transition-colors">
                  <CalendarClock size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-on-surface truncate font-sans tracking-wide">
                    {cat?.name || 'Service Billing'}
                  </p>
                  <p className="text-[10px] tracking-widest uppercase font-label-caps text-on-surface-variant opacity-70 font-medium mt-0.5">
                    Due • {shortDate(item.nextRunOn)}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <p className="font-mono-data text-sm font-bold text-on-surface tracking-tight">{money(item.amount)}</p>
              </div>
            </div>
          );
        })}

        {upcoming.length === 0 && (
          <div className="py-6 text-center text-[10px] font-black font-label-caps text-on-surface-variant opacity-50 tracking-[0.2em] uppercase">
            NO PENDING CYCLES
          </div>
        )}
      </div>
    </section>
  );
}


