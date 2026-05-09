import { Calendar, Check, Tag, Wallet, X } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { useFinanceStore } from '@/store/finance-store';
import type { TransactionType } from '@/lib/types';
import { BottomSheet } from '@/components/ui/mobile-layout';

const transactionSchema = z.object({
  type: z.enum(['Income', 'Expense']),
  amount: z.coerce.number().positive('Enter an amount greater than zero'),
  accountId: z.string().min(1, 'Choose an account'),
  occurredOn: z.string().min(1, 'Choose a date'),
  merchant: z.string().max(120).optional(),
  note: z.string().max(240).optional(),
  tags: z.string().optional(),
});

type Errors = Partial<Record<keyof z.infer<typeof transactionSchema> | 'category' | 'subcategory', string>>;

export function AddTransactionSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const accounts = useFinanceStore((state) => state.accounts);
  const categories = useFinanceStore((state) => state.categories);
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const [type, setType] = useState<TransactionType>('Expense');
  const [parentCategoryId, setParentCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const filteredByType = useMemo(() => categories.filter((category) => category.type === type), [categories, type]);

  const rootCategories = useMemo(
    () => filteredByType.filter((category) => !category.parentCategoryId),
    [filteredByType],
  );

  const subcategories = useMemo(
    () => filteredByType.filter((category) => category.parentCategoryId === parentCategoryId),
    [filteredByType, parentCategoryId],
  );

  useEffect(() => {
    if (!open) return;
    setParentCategoryId((previous) => {
      const valid = rootCategories.some((c) => c.id === previous);
      if (valid && previous) return previous;
      return rootCategories[0]?.id ?? '';
    });
  }, [open, rootCategories]);

  useEffect(() => {
    if (!open || !parentCategoryId) return;
    setSubcategoryId((previous) => {
      if (subcategories.length === 0) return '';
      const valid = subcategories.some((c) => c.id === previous);
      if (valid && previous) return previous;
      return subcategories[0]?.id ?? '';
    });
  }, [open, parentCategoryId, subcategories]);

  if (!open) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = transactionSchema.safeParse({
      type,
      amount: formData.get('amount'),
      accountId: formData.get('accountId'),
      occurredOn: formData.get('occurredOn'),
      merchant: formData.get('merchant')?.toString(),
      note: formData.get('note')?.toString(),
      tags: formData.get('tags')?.toString(),
    });

    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message])) as Errors);
      return;
    }

    const resolvedCategoryId =
      subcategories.length > 0 ? subcategoryId : parentCategoryId;

    if (!resolvedCategoryId) {
      setErrors({ category: 'Choose a category' });
      return;
    }

    if (subcategories.length > 0 && !subcategoryId) {
      setErrors({ subcategory: 'Choose a subcategory' });
      return;
    }

    void addTransaction({
      accountId: result.data.accountId,
      categoryId: resolvedCategoryId,
      type: result.data.type,
      amount: result.data.amount,
      currency: 'USD',
      merchant: result.data.merchant,
      note: result.data.note,
      occurredOn: result.data.occurredOn,
      tagNames: result.data.tags?.split(',').map((tagName) => tagName.trim()).filter(Boolean),
    });
    setErrors({});
    onOpenChange(false);
  }

  return (
    <BottomSheet labelledBy="add-transaction-title">
      <div className="flex shrink-0 items-center justify-between gap-3 px-4 pb-4 pt-3">
        <div>
          <p className="eyebrow">HexaTrack entry</p>
          <h2 id="add-transaction-title" className="text-xl font-bold text-[#111827]">
            Add transaction
          </h2>
        </div>
        <button aria-label="Close" className="icon-button" onClick={() => onOpenChange(false)} type="button">
          <X size={20} />
        </button>
      </div>

      {accounts.length === 0 || categories.length === 0 ? (
        <div className="mx-4 mb-4 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-4 text-sm text-[#6B7280]">
          Load your workspace first. If the API is offline, saved transactions will stay local.
        </div>
      ) : (
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4">
            <section className="py-2 text-center">
              <label className="text-sm text-[#6B7280]" htmlFor="amount">
                Amount
              </label>
              <div className="mt-2 flex items-center justify-center">
                <span className="mr-1 text-3xl font-semibold text-[#6B7280]">$</span>
                <input
                  autoFocus
                  className="w-full max-w-[280px] bg-transparent text-center text-5xl font-bold text-[#111827] outline-none placeholder:text-[#D1D5DB] sm:text-6xl"
                  id="amount"
                  inputMode="decimal"
                  name="amount"
                  placeholder="0"
                />
              </div>
              {errors.amount && <span className="mt-2 block text-xs text-red-600">{errors.amount}</span>}
            </section>

            <div className="grid grid-cols-2 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-1">
              {(['Expense', 'Income'] as const).map((item) => (
                <button
                  key={item}
                  className={`rounded-xl px-3 py-3 text-sm font-semibold transition active:scale-[0.98] ${type === item ? (item === 'Income' ? 'bg-[#10B981] text-white shadow-lg shadow-emerald-500/20' : 'bg-red-500 text-white shadow-lg shadow-red-500/20') : 'text-[#6B7280]'}`}
                  onClick={() => setType(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 flex items-center gap-2 text-xs font-medium text-[#6B7280]">
                  <Wallet size={14} /> Account
                </span>
                <select className="field" defaultValue={accounts[0]?.id} name="accountId">
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
                {errors.accountId && <span className="mt-1 block text-xs text-red-600">{errors.accountId}</span>}
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#6B7280]">Category</span>
                <select
                  className="field"
                  name="parentCategoryId"
                  onChange={(event) => setParentCategoryId(event.target.value)}
                  value={parentCategoryId}
                >
                  {rootCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="mt-1 block text-xs text-red-600">{errors.category}</span>}
              </label>
            </div>

            {subcategories.length > 0 ? (
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#6B7280]">Subcategory</span>
                <select
                  className="field"
                  name="subcategoryId"
                  onChange={(event) => setSubcategoryId(event.target.value)}
                  value={subcategoryId}
                >
                  {subcategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.subcategory && <span className="mt-1 block text-xs text-red-600">{errors.subcategory}</span>}
              </label>
            ) : null}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 flex items-center gap-2 text-xs font-medium text-[#6B7280]">
                  <Calendar size={14} /> Date
                </span>
                <input className="field" defaultValue={new Date().toISOString().slice(0, 10)} name="occurredOn" type="date" />
                {errors.occurredOn && <span className="mt-1 block text-xs text-red-600">{errors.occurredOn}</span>}
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#6B7280]">Merchant</span>
                <input className="field" name="merchant" placeholder="Coffee, rent, payroll" />
              </label>
            </div>

            <label className="block">
              <span className="mb-1 flex items-center gap-2 text-xs font-medium text-[#6B7280]">
                <Tag size={14} /> Tags
              </span>
              <input className="field" name="tags" placeholder="work, reimbursable" />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#6B7280]">Notes</span>
              <textarea className="field min-h-20 resize-none" name="note" placeholder="Optional note" />
            </label>
          </div>

          <div className="keyboard-safe-padding shrink-0 border-t border-[#E5E7EB] bg-white px-4 pt-3">
            <button className="primary-button min-h-14 w-full" type="submit">
              <Check size={19} />
              Save transaction
            </button>
          </div>
        </form>
      )}
    </BottomSheet>
  );
}
