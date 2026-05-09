import { Split, UsersRound } from 'lucide-react';
import { money, shortDate } from '@/lib/format';
import { useFinanceStore } from '@/store/finance-store';

export function GroupExpensesScreen() {
  const groupExpenses = useFinanceStore((state) => state.groupExpenses);
  const owed = groupExpenses.reduce((sum, expense) => sum + expense.amount / Math.max(expense.people.length, 1), 0);

  return (
    <div className="space-y-5">
      <div>
        <p className="eyebrow">Shared money</p>
        <h1 className="text-2xl font-bold text-[#111827]">Group expenses</h1>
      </div>
      <section className="overflow-hidden rounded-2xl border border-[#10B981]/20 bg-gradient-to-br from-[#10B981] via-[#059669] to-[#064E3B] p-5 text-white shadow-xl shadow-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 text-white">
            <UsersRound size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-emerald-50/85">Net balance</p>
            <p className="break-words text-3xl font-bold">You are owed {money(owed)}</p>
          </div>
        </div>
        <button className="mt-5 h-12 w-full rounded-2xl bg-white text-sm font-bold text-[#059669] shadow-lg shadow-black/15 transition active:scale-[0.98]" type="button">
          Settle Up
        </button>
      </section>
      <div className="grid gap-3 md:grid-cols-2">
        {groupExpenses.map((expense) => (
          <article key={expense.id} className="card p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#ECFDF5] text-[#059669]">
                <Split size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#111827]">{expense.description}</p>
                <p className="truncate text-xs text-[#6B7280]">
                  {expense.splitMethod} split {' · '} {expense.people.join(', ')}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-[#111827]">{money(expense.amount)}</p>
                <p className="text-xs text-[#6B7280]">{shortDate(expense.expenseOn)}</p>
              </div>
            </div>
            <div className="mt-4 flex -space-x-2">
              {expense.people.slice(0, 4).map((person) => (
                <div key={person} className="grid h-8 w-8 place-items-center rounded-full border border-white bg-[#10B981] text-xs font-bold text-white">
                  {person.slice(0, 1)}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
