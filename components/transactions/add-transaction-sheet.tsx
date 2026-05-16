'use client';

import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Delete,
  Landmark,
  Repeat,
  Tag,
  Wallet as WalletIcon,
  X,
  Banknote,
  ShoppingBag,
  Car,
  Zap,
  Home,
  Briefcase,
  Cloud,
  Heart,
  Smartphone,
  Gift,
  Coffee,
  Fuel,
  Stethoscope,
  TrendingUp,
  DollarSign,
  Users,
  RefreshCw,
  Star,
  Camera,
  Search,
  Plus
} from 'lucide-react';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useFinanceStore } from '@/store/finance-store';
import { useWorkspaceStore } from '@/store/workspace-store';
import type { TransactionType, RecurrenceFrequency, Category, Account } from '@/lib/types';
import { BottomSheet } from '@/components/ui/mobile-layout';
import { motion, AnimatePresence } from 'framer-motion';
import { hexaTrackApi } from '@/lib/api';

/* ── Category Icon Map ── */
const catIconMap: Record<string, React.ElementType> = {
  food: Coffee,
  grocery: ShoppingBag,
  shopping: ShoppingBag,
  travel: Car,
  transport: Car,
  bills: Zap,
  utility: Zap,
  rent: Home,
  salary: Briefcase,
  cloud: Cloud,
  health: Heart,
  healthcare: Stethoscope,
  subscription: Smartphone,
  fuel: Fuel,
  office: Briefcase,
  marketing: TrendingUp,
  gift: Gift,
  entertainment: Star,
  invest: TrendingUp,
  business: Briefcase,
  client: Users,
  refund: RefreshCw,
  bonus: Gift,
  rental: Home,
  interest: DollarSign,
  commission: DollarSign,
  default: Tag,
};

function getCatIcon(name: string): React.ElementType {
  const l = name.toLowerCase();
  for (const k in catIconMap) {
    if (l.includes(k)) return catIconMap[k];
  }
  return catIconMap.default;
}

type Step = 'menu' | 'amount' | 'category' | 'subcategory' | 'account' | 'details';

export function AddTransactionSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const accounts = useFinanceStore((s) => s.accounts);
  const categories = useFinanceStore((s) => s.categories);
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const clearFinanceError = useFinanceStore((s) => s.clearError);
  const loadWorkspace = useFinanceStore((s) => s.loadWorkspace);
  
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const currencySymbol = activeWorkspace?.currency === 'INR' ? '₹' : '$';
  const currencyCode = activeWorkspace?.currency || 'USD';
  const [step, setStep] = useState<Step>('menu');
  const [type, setType] = useState<TransactionType>('Expense');
  const [amountStr, setAmountStr] = useState('0');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');
  const [merchant, setMerchant] = useState('');
  const [note, setNote] = useState('');
  const [occurredOn, setOccurredOn] = useState(() => new Date().toISOString().slice(0, 10));
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<RecurrenceFrequency>('Monthly');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successFlash, setSuccessFlash] = useState(false);

  // Transfer state
  const [toAccountId, setToAccountId] = useState('');

  const mainCategories = useMemo(
    () => categories.filter((c) => c.type === type && !c.parentCategoryId),
    [categories, type]
  );

  const subCategories = useMemo(
    () => categories.filter((c) => c.parentCategoryId === selectedCategoryId),
    [categories, selectedCategoryId]
  );

  const reset = useCallback(() => {
    setStep('menu');
    setAmountStr('0');
    setSelectedAccountId('');
    setSelectedCategoryId('');
    setSelectedSubcategoryId('');
    setMerchant('');
    setNote('');
    setOccurredOn(new Date().toISOString().slice(0, 10));
    setIsRecurring(false);
    setLocalError('');
    setSuccessFlash(false);
    setToAccountId('');
  }, []);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  useEffect(() => {
    if (open && accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [open, accounts, selectedAccountId]);

  const pressKey = (key: string) => {
    setLocalError('');
    if (key === 'del') {
      setAmountStr((p) => (p.length <= 1 ? '0' : p.slice(0, -1)));
      return;
    }
    if (key === '.') {
      if (amountStr.includes('.')) return;
      setAmountStr((p) => p + '.');
      return;
    }
    if (amountStr.length > 9) return;
    setAmountStr((p) => {
      if (p === '0') return key;
      if (p.includes('.') && p.split('.')[1].length >= 2) return p;
      return p + key;
    });
  };

  const parsedAmount = parseFloat(amountStr) || 0;

  const selectAction = (t: TransactionType) => {
    setType(t);
    setStep('amount');
  };

  const handleCommit = async () => {
    if (parsedAmount <= 0) {
      setLocalError('Enter a valid amount');
      return;
    }
    if (!selectedAccountId) {
      setLocalError('Select an account');
      return;
    }

    if (type === 'Transfer') {
      if (!toAccountId || toAccountId === selectedAccountId) {
        setLocalError('Select a different destination account');
        return;
      }
      setSubmitting(true);
      try {
        await hexaTrackApi.transfer({
          fromAccountId: selectedAccountId,
          toAccountId,
          amount: parsedAmount,
          currency: 'USD',
          note: note || undefined,
          transferOn: occurredOn,
          idempotencyKey: crypto.randomUUID(),
        });
        await loadWorkspace();
        setSuccessFlash(true);
        setTimeout(() => onOpenChange(false), 800);
      } catch (e) {
        setLocalError(e instanceof Error ? e.message : 'Transfer failed');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!selectedCategoryId) {
      setLocalError('Select a category');
      return;
    }
    setSubmitting(true);
    clearFinanceError();
    try {
      await addTransaction({
        accountId: selectedAccountId,
        categoryId: selectedSubcategoryId || selectedCategoryId,
        type,
        amount: parsedAmount,
        currency: 'USD',
        merchant: merchant || undefined,
        note: note || undefined,
        occurredOn,
      });

      if (isRecurring) {
        try {
          await useFinanceStore.getState().addRecurring({
            accountId: selectedAccountId,
            categoryId: selectedSubcategoryId || selectedCategoryId,
            type,
            frequency,
            amount: parsedAmount,
            currency: 'USD',
            note: note || undefined,
            nextRunOn: occurredOn,
          });
        } catch {
          /* best-effort */
        }
      }
      setSuccessFlash(true);
      setTimeout(() => onOpenChange(false), 1200);
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const close = () => onOpenChange(false);

  const goBack = () => {
    if (step === 'details') setStep('account');
    else if (step === 'account') setStep(type === 'Transfer' ? 'amount' : (subCategories.length > 0 ? 'subcategory' : 'category'));
    else if (step === 'subcategory') setStep('category');
    else if (step === 'category') setStep('amount');
    else if (step === 'amount') setStep('menu');
    else close();
  };

  const proceedFromCategory = (catId: string) => {
    setSelectedCategoryId(catId);
    setSelectedSubcategoryId('');
    const subs = categories.filter(c => c.parentCategoryId === catId);
    if (subs.length > 0) {
      setStep('subcategory');
    } else {
      setStep('account');
    }
  };

  return (
    <BottomSheet open={open} onClose={close} labelledBy="tx-sheet" fullHeight={step !== 'menu'}>
      {/* ── SUCCESS OVERLAY ── */}
      <AnimatePresence>
        {successFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[110] flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex flex-col items-center"
            >
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                <Check size={48} className="text-primary" strokeWidth={3} />
              </div>
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-2xl font-black text-on-surface tracking-tight"
              >
                Done!
              </motion.h2>
              <motion.p 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-on-surface-variant/70 mt-2 font-medium"
              >
                Transaction recorded successfully
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-1 min-h-0 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {/* ── STEP: MENU ── */}
          {step === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="px-6 pb-8 pt-2"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 id="tx-sheet" className="text-2xl font-black text-on-surface tracking-tight">Create New</h3>
                  <p className="text-xs text-on-surface-variant/60 font-medium mt-1">Select transaction type</p>
                </div>
                <button onClick={close} className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-on-surface-variant active:scale-90 transition shadow-sm">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <ActionMenuItem
                  icon={ArrowUpRight}
                  title="Add Expense"
                  subtitle="Record spending transaction"
                  color="text-rose-400"
                  bg="bg-rose-400/10"
                  border="border-rose-400/20"
                  onClick={() => selectAction('Expense')}
                />
                <ActionMenuItem
                  icon={ArrowDownLeft}
                  title="Add Income"
                  subtitle="Record incoming amount"
                  color="text-emerald"
                  bg="bg-emerald/10"
                  border="border-emerald/20"
                  onClick={() => selectAction('Income')}
                />
                <ActionMenuItem
                  icon={Repeat}
                  title="Transfer"
                  subtitle="Move money between accounts"
                  color="text-sky-400"
                  bg="bg-sky-400/10"
                  border="border-sky-400/20"
                  onClick={() => selectAction('Transfer')}
                />
              </div>
            </motion.div>
          )}

          {/* ── STEP: AMOUNT ── */}
          {step === 'amount' && (
            <motion.div
              key="amount"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <SheetHeader title={type === 'Transfer' ? 'Transfer' : type} subtitle="Enter Amount" onBack={goBack} onClose={close} />
              
              <div className="flex-1 flex flex-col items-center justify-center py-6">
                <motion.div 
                  layoutId="amount-display"
                  className="flex items-baseline justify-center gap-2 select-none"
                >
                  <span className="text-3xl font-bold text-primary/60">{currencySymbol}</span>
                  <span className="text-6xl font-black text-on-surface tracking-tighter tabular-nums">
                    {Number(amountStr).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).replace('.00', '')}
                  </span>
                </motion.div>
                {localError && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-[10px] font-bold text-danger uppercase tracking-widest bg-danger/10 px-3 py-1 rounded-full">
                    {localError}
                  </motion.p>
                )}
              </div>

              <div className="px-6 pb-6">
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'].map((k) => (
                    <button
                      key={k}
                      onClick={() => pressKey(k)}
                      className={`h-14 rounded-2xl flex items-center justify-center text-xl font-bold transition-all active:scale-90 ${
                        k === 'del' ? 'bg-white/[0.04] text-rose-400' : 'bg-white/[0.02] border border-white/[0.05] text-on-surface active:bg-white/[0.08]'
                      }`}
                    >
                      {k === 'del' ? <Delete size={22} /> : k}
                    </button>
                  ))}
                </div>

                <PrimaryButton 
                  onClick={() => type === 'Transfer' ? setStep('account') : setStep('category')}
                  disabled={parsedAmount <= 0}
                  label={type === 'Transfer' ? 'Next' : 'Continue'}
                  icon={ChevronRight}
                />
              </div>
            </motion.div>
          )}

          {/* ── STEP: CATEGORY ── */}
          {step === 'category' && (
            <motion.div
              key="category"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <SheetHeader title="Category" subtitle={type} onBack={goBack} onClose={close} />
              
              <div className="flex-1 overflow-y-auto px-6 py-4 hide-scrollbar">
                <div className="grid grid-cols-3 gap-3">
                  {mainCategories.map((cat) => {
                    const Icon = getCatIcon(cat.name);
                    const isActive = selectedCategoryId === cat.id;
                    return (
                      <CategoryCard
                        key={cat.id}
                        cat={cat}
                        icon={Icon}
                        isActive={isActive}
                        onClick={() => proceedFromCategory(cat.id)}
                      />
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP: SUBCATEGORY ── */}
          {step === 'subcategory' && (
            <motion.div
              key="subcategory"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <SheetHeader title="Subcategory" subtitle={categories.find(c => c.id === selectedCategoryId)?.name || ''} onBack={goBack} onClose={close} />
              
              <div className="flex-1 overflow-y-auto px-6 py-4 hide-scrollbar">
                <div className="space-y-2">
                  {subCategories.map((cat) => (
                    <SubCategoryRow
                      key={cat.id}
                      cat={cat}
                      isActive={selectedSubcategoryId === cat.id}
                      onClick={() => {
                        setSelectedSubcategoryId(cat.id);
                        setStep('account');
                      }}
                    />
                  ))}
                  <button 
                    onClick={() => setStep('account')}
                    className="w-full flex items-center justify-between px-4 py-4 rounded-2xl border border-white/[0.05] bg-white/[0.01] active:bg-white/[0.04] transition-colors"
                  >
                    <span className="text-sm font-bold text-on-surface-variant/60 italic">Skip Subcategory</span>
                    <ChevronRight size={16} className="text-on-surface-variant/30" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP: ACCOUNT ── */}
          {step === 'account' && (
            <motion.div
              key="account"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <SheetHeader 
                title={type === 'Transfer' ? 'Accounts' : 'Payment Method'} 
                subtitle={type === 'Transfer' ? 'From → To' : 'Select Account'} 
                onBack={goBack} 
                onClose={close} 
              />
              
              <div className="flex-1 overflow-y-auto px-6 py-4 hide-scrollbar space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 mb-3 block">
                    {type === 'Transfer' ? 'Source Account' : 'Pay From'}
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {accounts.map(acc => (
                      <AccountRow 
                        key={acc.id} 
                        acc={acc} 
                        isActive={selectedAccountId === acc.id} 
                        onClick={() => setSelectedAccountId(acc.id)} 
                      />
                    ))}
                  </div>
                </div>

                {type === 'Transfer' && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 mb-3 block">
                      Target Account
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {accounts.filter(a => a.id !== selectedAccountId).map(acc => (
                        <AccountRow 
                          key={acc.id} 
                          acc={acc} 
                          isActive={toAccountId === acc.id} 
                          onClick={() => setToAccountId(acc.id)} 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 pb-6 pt-2">
                <PrimaryButton 
                  onClick={() => type === 'Transfer' ? handleCommit() : setStep('details')}
                  disabled={!selectedAccountId || (type === 'Transfer' && !toAccountId)}
                  label={type === 'Transfer' ? 'Execute Transfer' : 'Add Details'}
                  icon={type === 'Transfer' ? Check : ChevronRight}
                  loading={submitting}
                />
              </div>
            </motion.div>
          )}

          {/* ── STEP: DETAILS ── */}
          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <SheetHeader title="Details" subtitle="Finalize Transaction" onBack={goBack} onClose={close} />
              
              <div className="flex-1 overflow-y-auto px-6 py-4 hide-scrollbar space-y-5">
                {/* Summary Mini-Card */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      {React.createElement(getCatIcon(categories.find(c => c.id === selectedCategoryId)?.name || ''), { size: 20 })}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">
                        {categories.find(c => c.id === selectedSubcategoryId || c.id === selectedCategoryId)?.name}
                      </p>
                      <p className="text-[10px] text-on-surface-variant/60">{accounts.find(a => a.id === selectedAccountId)?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-on-surface">{currencySymbol}{amountStr}</p>
                    <p className={`text-[9px] font-bold uppercase tracking-widest ${type === 'Income' ? 'text-emerald' : 'text-rose-400'}`}>{type}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <FormInput label="Date" icon={Calendar}>
                    <input type="date" value={occurredOn} onChange={e => setOccurredOn(e.target.value)} className="w-full bg-transparent outline-none text-sm font-bold text-on-surface" />
                  </FormInput>

                  <FormInput label={type === 'Expense' ? 'Merchant / Payee' : 'Source'} icon={type === 'Expense' ? ShoppingBag : Banknote}>
                    <input type="text" placeholder="e.g. Starbucks, Uber..." value={merchant} onChange={e => setMerchant(e.target.value)} className="w-full bg-transparent outline-none text-sm font-bold text-on-surface placeholder:text-on-surface-variant/30" />
                  </FormInput>

                  <FormInput label="Note" icon={Tag}>
                    <input type="text" placeholder="Add a memo..." value={note} onChange={e => setNote(e.target.value)} className="w-full bg-transparent outline-none text-sm font-bold text-on-surface placeholder:text-on-surface-variant/30" />
                  </FormInput>

                  {/* Receipt Upload UI */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center text-on-surface-variant/40">
                        <Camera size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface">Receipt / Invoice</p>
                        <p className="text-[10px] text-on-surface-variant/40">Optional attachment</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[10px] font-black uppercase tracking-widest text-on-surface active:scale-95 transition">Upload</button>
                  </div>

                  {/* Recurring Toggle */}
                  <div className={`p-4 rounded-2xl border transition-all ${isRecurring ? 'bg-primary/5 border-primary/20' : 'bg-white/[0.02] border-white/[0.05]'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isRecurring ? 'bg-primary/20 text-primary' : 'bg-white/[0.04] text-on-surface-variant/40'}`}>
                          <Repeat size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-on-surface">Recurring</p>
                          <p className="text-[10px] text-on-surface-variant/40">Repeat this transaction</p>
                        </div>
                      </div>
                      <div 
                        onClick={() => setIsRecurring(!isRecurring)}
                        className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${isRecurring ? 'bg-primary' : 'bg-white/10'}`}
                      >
                        <motion.div animate={{ x: isRecurring ? 20 : 0 }} className="w-4 h-4 rounded-full bg-white shadow-sm" />
                      </div>
                    </div>
                    <AnimatePresence>
                      {isRecurring && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 pt-4 border-t border-white/5 overflow-hidden">
                          <div className="flex gap-2">
                            {(['Daily', 'Weekly', 'Monthly', 'Yearly'] as const).map(f => (
                              <button key={f} onClick={() => setFrequency(f)} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${frequency === f ? 'bg-primary text-white' : 'bg-white/[0.04] text-on-surface-variant/60'}`}>
                                {f}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {localError && (
                  <p className="text-[10px] font-bold text-danger text-center uppercase tracking-widest bg-danger/10 py-2 rounded-xl">
                    {localError}
                  </p>
                )}
              </div>

              <div className="px-6 pb-6 pt-2">
                <PrimaryButton 
                  onClick={handleCommit}
                  loading={submitting}
                  label={`Save ${type}`}
                  icon={Check}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BottomSheet>
  );
}

/* ── HELPER COMPONENTS ── */

import React from 'react';

function ActionMenuItem({ icon: Icon, title, subtitle, color, bg, border, onClick }: any) {
  return (
    <motion.button
      whileTap={{ scale: 0.96, backgroundColor: 'rgba(255,255,255,0.06)' }}
      onClick={onClick}
      className={`flex items-center gap-4 w-full p-4 rounded-[24px] bg-white/[0.02] border ${border} transition-all duration-200 text-left group`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-active:scale-90 ${bg} ${color}`}>
        <Icon size={24} strokeWidth={2.2} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-black text-on-surface tracking-tight">{title}</h4>
        <p className="text-xs text-on-surface-variant/60 font-medium mt-0.5">{subtitle}</p>
      </div>
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant/30 group-hover:text-on-surface-variant/60 transition-colors">
        <ChevronRight size={18} />
      </div>
    </motion.button>
  );
}

function SheetHeader({ title, subtitle, onBack, onClose }: any) {
  return (
    <div className="px-6 pt-2 pb-4 flex items-center justify-between border-b border-white/[0.04]">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-on-surface-variant active:scale-90 transition">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h3 className="text-lg font-black text-on-surface tracking-tight">{title}</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-0.5">{subtitle}</p>
        </div>
      </div>
      <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-on-surface-variant active:scale-90 transition">
        <X size={18} />
      </button>
    </div>
  );
}

function CategoryCard({ cat, icon: Icon, isActive, onClick }: any) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all duration-200 ${
        isActive 
          ? 'bg-primary/10 border-primary/30 shadow-[0_8px_20px_rgba(16,185,129,0.15)]' 
          : 'bg-white/[0.02] border-white/[0.05] active:border-white/[0.15]'
      }`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isActive ? 'bg-primary/20 text-primary' : 'bg-white/[0.04] text-on-surface-variant'}`}>
        <Icon size={22} strokeWidth={2.2} />
      </div>
      <span className={`text-[11px] font-bold tracking-tight text-center leading-tight ${isActive ? 'text-primary' : 'text-on-surface-variant/80'}`}>
        {cat.name}
      </span>
    </motion.button>
  );
}

function SubCategoryRow({ cat, isActive, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-200 ${
        isActive 
          ? 'bg-primary/10 border-primary/20' 
          : 'bg-white/[0.02] border-white/[0.05] active:bg-white/[0.05]'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary shadow-[0_0_8px_#10B981]' : 'bg-white/10'}`} />
        <span className={`text-sm font-bold ${isActive ? 'text-primary' : 'text-on-surface'}`}>{cat.name}</span>
      </div>
      <ChevronRight size={16} className={isActive ? 'text-primary' : 'text-on-surface-variant/30'} />
    </button>
  );
}

function AccountRow({ acc, isActive, onClick }: any) {
  const Icon = acc.type === 'Bank' ? Landmark : acc.type === 'Card' ? CreditCard : WalletIcon;
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 w-full p-4 rounded-2xl border transition-all duration-200 ${
        isActive 
          ? 'bg-primary/10 border-primary/30 shadow-sm' 
          : 'bg-white/[0.01] border-white/[0.05] active:bg-white/[0.04]'
      }`}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isActive ? 'bg-primary/20 text-primary' : 'bg-white/[0.04] text-on-surface-variant'}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 text-left">
        <h4 className={`text-sm font-bold ${isActive ? 'text-primary' : 'text-on-surface'}`}>{acc.name}</h4>
        <p className="text-[10px] text-on-surface-variant/50 font-medium">{acc.type}</p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-black ${isActive ? 'text-primary' : 'text-on-surface'}`}>${acc.balance.toLocaleString()}</p>
        <div className={`ml-auto mt-1 w-1.5 h-1.5 rounded-full ${isActive ? 'bg-primary shadow-[0_0_8px_#10B981]' : 'bg-transparent'}`} />
      </div>
    </button>
  );
}

function FormInput({ label, icon: Icon, children }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 ml-1">
        {label}
      </label>
      <div className="flex items-center gap-3 px-4 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.06] focus-within:border-primary/30 focus-within:bg-white/[0.04] transition-all">
        <Icon size={18} className="text-on-surface-variant/40" />
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}

function PrimaryButton({ onClick, disabled, loading, label, icon: Icon }: any) {
  return (
    <motion.button
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full h-15 rounded-[22px] flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden ${
        disabled || loading
          ? 'bg-white/[0.05] text-on-surface-variant/30 cursor-not-allowed'
          : 'bg-primary text-white shadow-[0_12px_24px_rgba(16,185,129,0.3)] active:shadow-none active:translate-y-0.5'
      }`}
    >
      {loading ? (
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          <span className="text-sm font-black uppercase tracking-[0.1em]">{label}</span>
          {Icon && <Icon size={20} strokeWidth={2.5} />}
        </>
      )}
    </motion.button>
  );
}
