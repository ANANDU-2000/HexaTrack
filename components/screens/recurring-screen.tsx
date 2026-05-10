import { CalendarClock, Pause, Play, Plus } from 'lucide-react';
import { useState } from 'react';
import { money, shortDate } from '@/lib/format';
import { useFinanceStore } from '@/store/finance-store';
import { AddRecurringSheet } from '@/components/recurring/add-recurring-sheet';
import { AppScreen } from '@/components/ui/mobile-layout';

export function RecurringScreen() {
  const recurring = useFinanceStore((state) => state.recurring);
  const categories = useFinanceStore((state) => state.categories);
  const [isAdding, setIsAdding] = useState(false);
  const upcomingTotal = recurring.reduce((sum, item) => sum + item.amount, 0);

  return (
    <AppScreen>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Automation</p>
          <h1 className="truncate text-2xl font-bold text-[#F5F7FA]">Recurring</h1>
        </div>
        <button className="primary-button min-h-11 shrink-0 px-3 py-2" onClick={() => setIsAdding(true)} type="button">
          <Plus size={18} />
          Add
        </button>
      </div>

      <section className="overflow-hidden rounded-3xl border border-white/[0.06] bg-[#121A22] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:p-5">
        <p className="text-sm text-[#8B9BB4]">Upcoming this month</p>
        <h2 className="mt-2 break-words text-3xl font-bold text-[#F5F7FA]">{money(upcomingTotal)}</h2>
        <p className="mt-2 text-sm font-medium text-[#8B9BB4]">Across {recurring.length} recurring payments</p>
      </section>

      <div className="grid gap-3 md:grid-cols-2">
        {recurring.map((item) => {
          const category = categories.find((categoryItem) => categoryItem.id === item.categoryId);
          return (
            <article key={item.id} className="card p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#4F8CFF]/15 text-[#4F8CFF]">
                  <CalendarClock size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#F5F7FA]">{category?.name ?? 'Recurring item'}</p>
                  <p className="truncate text-xs text-[#8B9BB4]">
                    {item.frequency} {' · '} next {shortDate(item.nextRunOn)}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-bold text-[#F5F7FA]">{money(item.amount)}</p>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/[0.06] bg-[#0B1015] px-3 py-2">
                <span className="text-xs font-medium text-[#8B9BB4]">{item.isActive ? 'Active schedule' : 'Paused'}</span>
                <button
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.06] bg-[#121A22] text-[#4F8CFF] transition active:scale-95"
                  type="button"
                >
                  {item.isActive ? <Pause size={16} /> : <Play size={16} />}
                </button>
              </div>
            </article>
          );
        })}
        {recurring.length === 0 && <p className="card p-4 text-sm text-[#8B9BB4]">No recurring payments configured.</p>}
      </div>
      <AddRecurringSheet open={isAdding} onOpenChange={setIsAdding} />
    </AppScreen>
  );
}
