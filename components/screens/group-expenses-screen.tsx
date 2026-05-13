import { Split, UsersRound } from 'lucide-react';
import { money, shortDate } from '@/lib/format';
import { useFinanceStore } from '@/store/finance-store';

export function GroupExpensesScreen() {
  const groupExpenses = useFinanceStore((state) => state.groupExpenses);
  const owed = groupExpenses.reduce((sum, expense) => sum + expense.amount / Math.max(expense.people.length, 1), 0);

  return (
    <div className="space-y-10 pb-28 lg:pb-10 px-container-margin lg:px-gutter pt-6 font-sans animate-in fade-in duration-500">
      <div>
        <div className="flex items-center gap-2 mb-2">
           <p className="font-label-caps text-[11px] text-cyan tracking-widest uppercase font-black">Shared Pool</p>
           <div className="w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_8px_#06B6D4]" />
        </div>
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">Multiplayer Ledger</h1>
      </div>

      <section className="glass-card rounded-[28px] border border-white/[0.05] bg-[#111827]/40 p-6 md:p-7 relative overflow-hidden shadow-lg">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#cfbcff]/5 blur-2xl rounded-full pointer-events-none" />
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#111827] border border-white/[0.04] flex items-center justify-center text-cyan shrink-0 shadow-inner">
            <UsersRound size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest font-label-caps mb-1">Aggregate Receivable</p>
            <p className="font-mono-data font-extrabold text-cyan text-2xl sm:text-3xl tracking-tight">
              Owed {money(owed)}
            </p>
          </div>
        </div>
        <button
          className="w-full h-[56px] bg-indigo hover:brightness-110 active:scale-[0.99] border border-white/[0.1] shadow-lg shadow-indigo/20 font-black font-label-caps uppercase text-xs tracking-widest text-white rounded-full mt-6 transition-all"
          type="button"
        >
          Synchronize Ledger
        </button>
      </section>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        {groupExpenses.map((expense) => (
          <article key={expense.id} className="glass-card rounded-[24px] border border-white/[0.03] p-5 hover:border-cyan/20 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-[#111827] border border-white/[0.04] flex items-center justify-center text-cyan shadow-inner group-hover:scale-105 transition-transform">
                <Split size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-on-surface text-[15px] font-sans tracking-wide">{expense.description}</p>
                <p className="truncate text-[11px] text-on-surface-variant font-medium font-sans mt-0.5">
                  {expense.splitMethod} split {' · '} {expense.people.join(', ')}
                </p>
              </div>
              <div className="shrink-0 text-right ml-2">
                <p className="font-mono-data font-extrabold text-on-surface text-sm tracking-tight">{money(expense.amount)}</p>
                <p className="text-[10px] text-on-surface-variant font-bold font-label-caps mt-0.5 tracking-wide">{shortDate(expense.expenseOn)}</p>
              </div>
            </div>
            <div className="mt-4.5 flex -space-x-2 ml-1">
              {expense.people.slice(0, 4).map((person) => (
                <div
                  key={person}
                  className="w-8 h-8 rounded-full border-2 border-[#0B1020] bg-indigo flex items-center justify-center text-[10px] font-black text-white font-label-caps shadow-sm select-none"
                  title={person}
                >
                  {person.slice(0, 1).toUpperCase()}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

