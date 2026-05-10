import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { money, shortDate } from '@/lib/format';
import type { Category, Transaction } from '@/lib/types';

export function TransactionList({ categories, transactions }: { categories: Category[]; transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return <div className="card p-4 text-sm font-medium text-[#8B9BB4]">No HexaTrack entries yet.</div>;
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => {
        const category = categories.find((item) => item.id === transaction.categoryId);
        const income = transaction.type === 'Income';
        return (
          <article
            key={transaction.id}
            className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#121A22] p-3 shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition hover:border-[#4F8CFF]/25 hover:bg-[#121A22]/90 active:scale-[0.99]"
          >
            <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${income ? 'bg-[#1FD18B]/15 text-[#1FD18B]' : 'bg-[#FF5C75]/15 text-[#FF5C75]'}`}>
              {income ? <ArrowDownLeft size={19} /> : <ArrowUpRight size={19} />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#F5F7FA]">{transaction.merchant ?? category?.name ?? 'Transaction'}</p>
                  <p className="truncate text-xs text-[#8B9BB4]">
                    {category?.name ?? 'Uncategorized'} {' · '} {shortDate(transaction.occurredOn)}
                  </p>
                </div>
                <p className={`shrink-0 text-sm font-bold ${income ? 'text-[#1FD18B]' : 'text-[#FF5C75]'}`}>
                  {income ? '+' : '-'}
                  {money(transaction.amount, transaction.currency)}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
