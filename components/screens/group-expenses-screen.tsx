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
        <h1 className="text-2xl font-bold text-[#F5F7FA]">Group expenses</h1>
      </div>
      <section className="overflow-hidden rounded-3xl border border-white/[0.06] bg-[#121A22] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#4F8CFF]/15 text-[#4F8CFF]">
            <UsersRound size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-[#8B9BB4]">Net balance</p>
            <p className="break-words text-3xl font-bold text-[#F5F7FA]">You are owed {money(owed)}</p>
          </div>
        </div>
        <button
          className="primary-button mt-5 h-12 w-full text-sm font-bold shadow-[0_12px_28px_rgba(79,140,255,0.28)]"
          type="button"
        >
          Settle Up
        </button>
      </section>
      <div className="grid gap-3 md:grid-cols-2">
        {groupExpenses.map((expense) => (
          <article key={expense.id} className="card p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#1FD18B]/15 text-[#1FD18B]">
                <Split size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#F5F7FA]">{expense.description}</p>
                <p className="truncate text-xs text-[#8B9BB4]">
                  {expense.splitMethod} split {' · '} {expense.people.join(', ')}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-[#F5F7FA]">{money(expense.amount)}</p>
                <p className="text-xs text-[#8B9BB4]">{shortDate(expense.expenseOn)}</p>
              </div>
            </div>
            <div className="mt-4 flex -space-x-2">
              {expense.people.slice(0, 4).map((person) => (
                <div
                  key={person}
                  className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#121A22] bg-[#4F8CFF] text-xs font-bold text-white"
                >
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
