'use client';

import { BellRing, CalendarClock, ChevronRight } from 'lucide-react';
import { money, shortDate } from '@/lib/format';
import { useFinanceStore } from '@/store/finance-store';

export function RecurringAlerts() {
  const recurring = useFinanceStore((state) => state.recurring);
  const categories = useFinanceStore((state) => state.categories);

  const upcoming = recurring
    .filter(r => r.isActive)
    .sort((a, b) => a.nextRunOn.localeCompare(b.nextRunOn))
    .slice(0, 2); // Minimal size for widget nesting

  return (
    <section className="glass-card rounded-3xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <BellRing size={16} className="text-[#c1c1fc]" />
        <h3 className="font-headline-md text-headline-md text-[#F5F7FA]">Subscriptions</h3>
      </div>

      <div className="space-y-2">
        {upcoming.map((item) => {
          const cat = categories.find(c => c.id === item.categoryId);
          return (
            <div 
              key={item.id}
              className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 shrink-0 bg-surface-container-high rounded-xl flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                  <CalendarClock size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-body-sm font-bold text-[#F9FAFB] truncate">
                    {cat?.name || 'Subscription'}
                  </p>
                  <p className="text-[11px] text-on-surface-variant opacity-70 font-medium">
                    Next: {shortDate(item.nextRunOn)}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <p className="font-label-mono text-sm font-bold text-[#F9FAFB]">{money(item.amount)}</p>
              </div>
            </div>
          );
        })}

        {upcoming.length === 0 && (
          <div className="py-4 text-center text-xs text-on-surface-variant opacity-50 font-label-mono uppercase">
            No active billing cycles
          </div>
        )}
      </div>
    </section>
  );
}

