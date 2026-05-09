'use client';

import { Layers, Plus, Trash2 } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { ApiError, hexaTrackApi } from '@/lib/api';
import { useFinanceStore } from '@/store/finance-store';
import type { Category, TransactionType } from '@/lib/types';

export function CategoriesSettingsPanel() {
  const categories = useFinanceStore((state) => state.categories);
  const loadWorkspace = useFinanceStore((state) => state.loadWorkspace);
  const loading = useFinanceStore((state) => state.loading);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roots = useMemo(() => {
    const top = categories.filter((c) => !c.parentCategoryId);
    return [...top].sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name));
  }, [categories]);

  const subsByParent = useMemo(() => {
    const map = new Map<string, Category[]>();
    for (const c of categories) {
      if (!c.parentCategoryId) continue;
      const list = map.get(c.parentCategoryId) ?? [];
      list.push(c);
      map.set(c.parentCategoryId, list);
    }
    for (const list of Array.from(map.values())) {
      list.sort((a: Category, b: Category) => a.name.localeCompare(b.name));
    }
    return map;
  }, [categories]);

  async function handleAddRoot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('rootName')?.toString().trim();
    const type = formData.get('rootType')?.toString() as TransactionType;
    if (!name) {
      setError('Enter a category name.');
      return;
    }
    if (type !== 'Income' && type !== 'Expense') {
      setError('Choose Income or Expense.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await hexaTrackApi.categories.create({ name, type, parentCategoryId: null });
      event.currentTarget.reset();
      await loadWorkspace();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create category.');
    } finally {
      setBusy(false);
    }
  }

  async function handleAddSub(parentId: string, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('subName')?.toString().trim();
    if (!name) {
      setError('Enter a subcategory name.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await hexaTrackApi.categories.subcategories.create(parentId, { name });
      event.currentTarget.reset();
      await loadWorkspace();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not add subcategory.');
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteSub(parentId: string, subId: string, subName: string) {
    if (!window.confirm(`Remove subcategory "${subName}"? This cannot be used for new transactions if it had activity.`)) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await hexaTrackApi.categories.subcategories.delete(parentId, subId);
      await loadWorkspace();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not remove subcategory.');
    } finally {
      setBusy(false);
    }
  }

  const disabled = busy || loading;

  return (
    <div className="space-y-4">
      {error ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-[#FEF2F2] px-4 py-3 text-sm text-[#111827]" role="alert">
          {error}
        </div>
      ) : null}

      <section className="card p-4">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#ECFDF5] text-[#059669]">
            <Layers size={19} aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#111827]">Top-level category</p>
            <p className="mt-1 text-xs leading-5 text-[#6B7280]">Parent categories can hold subcategories. Transactions use subcategories when they exist.</p>
          </div>
        </div>
        <form className="mt-4 space-y-3" onSubmit={(e) => void handleAddRoot(e)}>
          <label className="block text-xs font-medium text-[#6B7280]">
            Name
            <input className="field mt-1" disabled={disabled} name="rootName" placeholder="e.g. Projects" type="text" />
          </label>
          <label className="block text-xs font-medium text-[#6B7280]">
            Type
            <select className="field mt-1" disabled={disabled} name="rootType" defaultValue="Expense">
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </select>
          </label>
          <button className="primary-button min-h-12 w-full" disabled={disabled} type="submit">
            <Plus size={18} aria-hidden />
            Add category
          </button>
        </form>
      </section>

      <section className="card overflow-hidden">
        <div className="border-b border-[#E5E7EB] px-4 py-3">
          <p className="text-sm font-semibold text-[#111827]">Your categories</p>
          <p className="mt-1 text-xs text-[#6B7280]">Subcategories appear under each parent. Remove only when unused by transactions.</p>
        </div>
        {roots.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-[#6B7280]">No categories yet. Add one above.</p>
        ) : (
          <ul className="divide-y divide-[#E5E7EB]">
            {roots.map((parent) => {
              const subs = subsByParent.get(parent.id) ?? [];
              return (
                <li className="px-4 py-4" key={parent.id}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-[#111827]">{parent.name}</p>
                    <span className="shrink-0 rounded-full bg-[#F8FAFC] px-2 py-0.5 text-xs font-medium text-[#6B7280]">{parent.type}</span>
                  </div>
                  {subs.length > 0 ? (
                    <ul className="mt-3 space-y-2">
                      {subs.map((sub) => (
                        <li className="flex items-center justify-between gap-2 rounded-xl bg-[#F8FAFC] px-3 py-2.5" key={sub.id}>
                          <span className="truncate text-sm text-[#111827]">{sub.name}</span>
                          <button
                            aria-label={`Remove ${sub.name}`}
                            className="grid min-h-11 min-w-11 shrink-0 place-items-center rounded-xl text-[#6B7280] transition hover:bg-white hover:text-[#FF5C75]"
                            disabled={disabled}
                            onClick={() => void handleDeleteSub(parent.id, sub.id, sub.name)}
                            type="button"
                          >
                            <Trash2 size={18} aria-hidden />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-xs text-[#6B7280]">No subcategories yet.</p>
                  )}
                  <form className="mt-3 flex gap-2" onSubmit={(e) => void handleAddSub(parent.id, e)}>
                    <input className="field min-h-11 flex-1 py-2 text-sm" disabled={disabled} name="subName" placeholder="New subcategory" type="text" />
                    <button className="min-h-11 shrink-0 rounded-[18px] bg-[#ECFDF5] px-4 text-sm font-semibold text-[#059669] transition hover:bg-[#D1FAE5] disabled:opacity-50" disabled={disabled} type="submit">
                      Add
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
