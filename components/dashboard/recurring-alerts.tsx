'use client';

import { BellRing, CalendarClock, ChevronRight } from 'lucide-react';
import { money, shortDate } from '@/lib/format';
import { useFinanceStore } from '@/store/finance-store';

export function RecurringAlerts() {
  const recurring = useFinanceStore((state) => state.recurring);
  const categories = useFinanceStore((state) => state.categories);

  // Fetch upcoming active items
  const upcoming = recurring
    .filter(r => r.isActive)
    .sort((a, b) => a.nextRunOn.localeCompare(b.nextRunOn))
    .slice(0, 3);

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <BellRing size={16} className="text-[#F59E0B]" />
          <h3 className="text-base font-bold text-[#F9FAFB]">Recurring & Alerts</h3>
        </div>
      </div>

      <div className="bg-[#111827] border border-white/[0.04] rounded-[32px] overflow-hidden">
        {upcoming.map((item, i) => {
          const cat = categories.find(c => c.id === item.categoryId);
          return (
            <div 
              key={item.id}
              className={`flex items-center justify-between p-4 hover:bg-[#1A2333] transition-colors cursor-pointer ${
                i !== upcoming.length - 1 ? 'border-b border-white/[0.03]' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 shrink-0 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center text-[#F59E0B]">
                  <CalendarClock size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#F9FAFB] truncate">
                    {cat?.name || 'Subscription Renewal'}
                  </p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5 truncate font-medium">
                    Renews {shortDate(item.nextRunOn)}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <p className="text-sm font-bold text-[#F9FAFB]">{money(item.amount)}</p>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5 font-semibold uppercase tracking-wider bg-white/5 px-1.5 py-0.5 rounded">
                  {item.frequency}
                </p>
              </div>
            </div>
          );
        })}

        {upcoming.length === 0 && (
          <div className="py-6 text-center text-sm font-medium text-[#9CA3AF]">
            No upcoming recurring payments
          </div>
        )}
      </div>
    </section>
  );
}
