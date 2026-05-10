import { Calendar, Check, Tag, Wallet, X } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useFinanceStore } from '@/store/finance-store';
import { z } from 'zod';
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
  const clearFinanceError = useFinanceStore((state) => state.clearError);
  const [type, setType] = useState<TransactionType>('Expense');
  const [parentCategoryId, setParentCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

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
    if (!open) {
      setSubmitting(false);
      return;
    }
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

    setSubmitting(true);
    clearFinanceError();
    try {
      await addTransaction({
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
      const stillError = useFinanceStore.getState().error;
      if (stillError) return;
      setErrors({});
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <BottomSheet labelledBy="add-transaction-title">
      <div className="flex shrink-0 items-center justify-between gap-3 px-4 pb-4 pt-3">
        <div>
          <p className="eyebrow">HexaTrack entry</p>
          <h2 id="add-transaction-title" className="text-xl font-bold text-[#F5F7FA]">
            Add transaction
          </h2>
        </div>
        <button aria-label="Close" className="icon-button" onClick={() => onOpenChange(false)} type="button">
          <X size={20} />
        </button>
      </div>

      {accounts.length === 0 || categories.length === 0 ? (
        <div className="mx-4 mb-4 rounded-2xl border border-white/[0.06] bg-[#0B1015] px-4 py-4 text-sm text-[#8B9BB4]">
          Load your workspace first. If the API is offline, saved transactions will stay local.
        </div>
      ) : (
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={(e) => void handleSubmit(e)}>
          <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4">
            <section className="py-2 text-center">
              <label className="text-sm text-[#8B9BB4]" htmlFor="amount">
                Amount
              </label>
              <div className="mt-2 flex items-center justify-center">
                <span className="mr-1 text-3xl font-semibold text-[#8B9BB4]">$</span>
                <input
                  autoFocus
                  className="w-full max-w-[280px] bg-transparent text-center text-5xl font-bold text-[#F5F7FA] outline-none placeholder:text-[#8B9BB4]/50 sm:text-6xl"
                  id="amount"
                  inputMode="decimal"
                  name="amount"
                  placeholder="0"
                />
              </div>
              {errors.amount && <span className="mt-2 block text-xs text-[#FF5C75]">{errors.amount}</span>}
            </section>

            <div className="grid grid-cols-2 rounded-2xl border border-white/[0.06] bg-[#0B1015] p-1">
              {(['Expense', 'Income'] as const).map((item) => (
                <button
                  key={item}
                  className={`rounded-xl px-3 py-3 text-sm font-semibold transition active:scale-[0.98] ${
                    type === item
                      ? item === 'Income'
                        ? 'bg-[#1FD18B] text-[#0B1015] shadow-lg shadow-[#1FD18B]/20'
                        : 'bg-[#FF5C75] text-white shadow-lg shadow-[#FF5C75]/25'
                      : 'text-[#8B9BB4]'
                  }`}
                  onClick={() => setType(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 flex items-center gap-2 text-xs font-medium text-[#8B9BB4]">
                  <Wallet size={14} /> Account
                </span>
                <select className="field" defaultValue={accounts[0]?.id} name="accountId">
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
                {errors.accountId && <span className="mt-1 block text-xs text-[#FF5C75]">{errors.accountId}</span>}
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#8B9BB4]">Category</span>
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
                {errors.category && <span className="mt-1 block text-xs text-[#FF5C75]">{errors.category}</span>}
              </label>
            </div>

            {subcategories.length > 0 ? (
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#8B9BB4]">Subcategory</span>
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
                {errors.subcategory && <span className="mt-1 block text-xs text-[#FF5C75]">{errors.subcategory}</span>}
              </label>
            ) : null}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 flex items-center gap-2 text-xs font-medium text-[#8B9BB4]">
                  <Calendar size={14} /> Date
                </span>
                <input className="field" defaultValue={new Date().toISOString().slice(0, 10)} name="occurredOn" type="date" />
                {errors.occurredOn && <span className="mt-1 block text-xs text-[#FF5C75]">{errors.occurredOn}</span>}
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#8B9BB4]">Merchant</span>
                <input className="field" name="merchant" placeholder="Coffee, rent, payroll" />
              </label>
            </div>

            <label className="block">
              <span className="mb-1 flex items-center gap-2 text-xs font-medium text-[#8B9BB4]">
                <Tag size={14} /> Tags
              </span>
              <input className="field" name="tags" placeholder="work, reimbursable" />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#8B9BB4]">Notes</span>
              <textarea className="field min-h-20 resize-none" name="note" placeholder="Optional note" />
            </label>
          </div>

          <div className="keyboard-safe-padding shrink-0 border-t border-white/[0.06] bg-[#0B1015] px-4 pt-3">
            <button className="primary-button min-h-14 w-full" disabled={submitting} type="submit">
              <Check size={19} />
              {submitting ? 'Saving…' : 'Save transaction'}
            </button>
          </div>
        </form>
      )}
    </BottomSheet>
  );
}
