import { Calendar, Check, ChevronLeft, Plus, Tag, Wallet as WalletIcon, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useFinanceStore } from '@/store/finance-store';
import { z } from 'zod';
import type { TransactionType } from '@/lib/types';
import { BottomSheet } from '@/components/ui/mobile-layout';
import { motion, AnimatePresence } from 'framer-motion';

const categoryEmojiMap: Record<string, string> = {
  food: '🍔', grocery: '🛒', shopping: '🛍️', transit: '🚗', transport: '🚆', 
  travel: '✈️', hotel: '🏨', rent: '🏠', bills: '🔌', utility: '💡',
  salary: '💰', business: '💼', dividend: '📈', invest: '📊', tax: '📄',
  gift: '🎁', fun: '🎮', entertainment: '🍿', health: '🏥', wellness: '💊',
};

export function AddTransactionSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const accounts = useFinanceStore((state) => state.accounts);
  const categories = useFinanceStore((state) => state.categories);
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const clearFinanceError = useFinanceStore((state) => state.clearError);
  
  const [type, setType] = useState<TransactionType>('Expense');
  const [amountStr, setAmountStr] = useState('0');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  
  const [isDetailedForm, setIsDetailedForm] = useState(false);
  const [merchant, setMerchant] = useState('');
  const [note, setNote] = useState('');
  const [occurredOn, setOccurredOn] = useState(() => new Date().toISOString().slice(0, 10));

  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const filteredCategories = useMemo(() => {
     return categories.filter(c => c.type === type && !c.parentCategoryId);
  }, [categories, type]);

  useEffect(() => {
     if (!open) {
        setAmountStr('0');
        setIsDetailedForm(false);
        setMerchant('');
        setNote('');
        setLocalError('');
        return;
     }
     if (accounts.length > 0 && !selectedAccountId) setSelectedAccountId(accounts[0].id);
     if (filteredCategories.length > 0) setSelectedCategoryId(filteredCategories[0].id);
  }, [open, accounts, filteredCategories]);

  const pressKey = (key: string) => {
     setLocalError('');
     if (key === 'back') {
        setAmountStr(prev => prev.length <= 1 ? '0' : prev.slice(0, -1));
        return;
     }
     if (key === '.') {
        if (amountStr.includes('.')) return;
        setAmountStr(prev => prev + '.');
        return;
     }
     if (amountStr.length > 8) return;

     setAmountStr(prev => {
        if (prev === '0') return key;
        if (prev.includes('.') && prev.split('.')[1].length >= 2) return prev;
        return prev + key;
     });
  };

  const parsedAmount = parseFloat(amountStr) || 0;

  const handleCommit = async () => {
     if (parsedAmount <= 0) {
        setLocalError('Enter a valid amount');
        return;
     }
     if (!selectedAccountId) {
        setLocalError('Choose a funding account');
        return;
     }
     if (!selectedCategoryId) {
        setLocalError('Select category');
        return;
     }

     setSubmitting(true);
     clearFinanceError();
     try {
        await addTransaction({
           accountId: selectedAccountId,
           categoryId: selectedCategoryId,
           type,
           amount: parsedAmount,
           currency: 'USD',
           merchant: merchant || undefined,
           note: note || undefined,
           occurredOn,
        });
        const stillError = useFinanceStore.getState().error;
        if (stillError) {
           setLocalError(stillError);
           return;
        }
        onOpenChange(false);
     } catch (e) {
        console.error(e);
     } finally {
        setSubmitting(false);
     }
  };

  const getEmojiForCategory = (name: string) => {
     const lName = name.toLowerCase();
     for (const key in categoryEmojiMap) {
        if (lName.includes(key)) return categoryEmojiMap[key];
     }
     return '🏷️';
  };

  return (
    <BottomSheet open={open} onClose={() => onOpenChange(false)} labelledBy="mobile-transaction-entry">
      
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 mt-1 shrink-0 bg-[#11131A]">
         <div className="flex items-center gap-2.5">
            {isDetailedForm ? (
               <button 
                 onClick={() => setIsDetailedForm(false)}
                 className="w-9 h-9 rounded-xl bg-[#1D1F27] border border-outline-variant/20 flex items-center justify-center text-emerald outline-none active:scale-95"
               >
                  <ChevronLeft size={18} />
               </button>
            ) : null}
            <div>
               <span className="text-[9px] font-black font-label-caps text-emerald uppercase tracking-wider block leading-none mb-0.5">Operational Log</span>
               <h3 id="mobile-transaction-entry" className="text-base font-extrabold tracking-tight text-on-surface">{isDetailedForm ? 'Complete Details' : 'Log Entry'}</h3>
            </div>
         </div>
         <button 
            onClick={() => onOpenChange(false)} 
            className="w-8 h-8 rounded-xl bg-[#1D1F27] border border-outline-variant/20 flex items-center justify-center text-on-surface-variant outline-none active:scale-95 transition-transform"
         >
            <X size={14} />
         </button>
      </div>

      {accounts.length === 0 ? (
         <div className="p-12 text-center text-xs text-on-surface-variant/70 font-semibold tracking-wider">Initializing ledger node accounts...</div>
      ) : (
         <div className="flex-1 flex flex-col overflow-hidden relative bg-[#0B0D11]">
            
            <AnimatePresence initial={false} mode="wait">
               {!isDetailedForm ? (
                  /* KEYPAD ENTRY */
                  <motion.div 
                    key="keypad"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="flex-1 flex flex-col overflow-hidden pb-3"
                  >
                     {/* Top Segment Control for Type */}
                     <div className="flex-1 flex flex-col justify-center items-center py-4 px-5 select-none">
                        <div className="grid grid-cols-2 w-44 mx-auto mb-4 rounded-xl border border-outline-variant/20 bg-[#11131A] p-0.5 shrink-0">
                           {(['Expense', 'Income'] as const).map(m => (
                              <button
                                key={m}
                                onClick={() => setType(m)}
                                className={`py-1.5 rounded-lg text-[9px] font-black font-label-caps uppercase tracking-wider transition-all active:scale-95 outline-none ${
                                   type === m 
                                     ? m === 'Income' 
                                        ? 'bg-emerald text-white shadow-sm' 
                                        : 'bg-danger text-white shadow-sm'
                                     : 'text-on-surface-variant/60 hover:text-on-surface'
                                }`}
                              >
                                 {m}
                              </button>
                           ))}
                        </div>

                        <div className="text-center mt-1 max-w-full overflow-hidden">
                           <motion.div 
                             key={amountStr}
                             initial={{ scale: 0.98, opacity: 0.9 }}
                             animate={{ scale: 1, opacity: 1 }}
                             className="flex items-center justify-center tracking-tighter select-none"
                           >
                              <span className="text-2xl font-extrabold text-emerald opacity-80 mr-0.5 select-none">$</span>
                              <span className="text-4xl font-black text-on-surface truncate select-none px-1">
                                 {amountStr}
                              </span>
                           </motion.div>
                           {localError && (
                              <div className="text-[8px] font-bold text-danger font-label-caps uppercase mt-2.5 tracking-wider">{localError}</div>
                           )}
                        </div>
                     </div>

                     {/* Account Matrix Row */}
                     <div className="mb-3 shrink-0">
                        <p className="px-5 text-[9px] font-bold font-label-caps text-on-surface-variant/60 uppercase tracking-wider mb-2 select-none flex items-center gap-1.5">
                           <WalletIcon size={11} className="text-emerald opacity-80" /> Source Account
                        </p>
                        <div className="flex gap-2 overflow-x-auto px-5 pb-1 hide-scrollbar">
                           {accounts.map(a => {
                              const isActive = a.id === selectedAccountId;
                              return (
                                 <button
                                   key={a.id}
                                   onClick={() => setSelectedAccountId(a.id)}
                                   className={`px-3 py-2 rounded-xl border whitespace-nowrap flex items-center gap-2 active:scale-[0.96] transition-all outline-none select-none text-xs font-bold ${
                                      isActive 
                                        ? 'bg-[#1D1F27] border-emerald/40 text-emerald shadow-sm' 
                                        : 'bg-[#11131A] border-outline-variant/20 text-on-surface-variant hover:text-on-surface'
                                   }`}
                                 >
                                    <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald shadow-[0_0_4px_#10B981]' : 'bg-on-surface-variant/30'}`} />
                                    {a.name}
                                 </button>
                              );
                           })}
                        </div>
                     </div>

                     {/* Category Matrix Row */}
                     <div className="mb-4 shrink-0">
                        <p className="px-5 text-[9px] font-bold font-label-caps text-on-surface-variant/60 uppercase tracking-wider mb-2 select-none flex items-center gap-1.5">
                           <Tag size={11} className="text-emerald opacity-80" /> Allocation Category
                        </p>
                        <div className="flex gap-2 overflow-x-auto px-5 pb-1 hide-scrollbar">
                           {filteredCategories.map(cat => {
                              const isActive = cat.id === selectedCategoryId;
                              return (
                                 <button
                                   key={cat.id}
                                   onClick={() => setSelectedCategoryId(cat.id)}
                                   className={`px-3 py-2 rounded-xl border whitespace-nowrap flex items-center gap-2 active:scale-[0.96] transition-all outline-none select-none text-xs font-bold ${
                                      isActive 
                                        ? 'bg-[#1D1F27] border-teal/40 text-teal shadow-sm' 
                                        : 'bg-[#11131A] border-outline-variant/20 text-on-surface-variant hover:text-on-surface'
                                   }`}
                                 >
                                    <span>{getEmojiForCategory(cat.name)}</span>
                                    {cat.name}
                                 </button>
                              );
                           })}
                        </div>
                     </div>

                     {/* Tactile Keypad Grid */}
                     <div className="px-5 py-3 bg-[#11131A] border-t border-outline-variant/20 shrink-0">
                        <div className="grid grid-cols-3 gap-1.5 text-center max-w-xs mx-auto select-none mb-4">
                           {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'back'].map(k => {
                              const isBack = k === 'back';
                              return (
                                 <button
                                   key={k}
                                   onClick={() => pressKey(k)}
                                   className={`h-11 rounded-xl border border-outline-variant/10 flex items-center justify-center select-none active:scale-95 outline-none transition-all font-extrabold text-lg ${
                                      isBack 
                                        ? 'bg-[#1D1F27] text-on-surface-variant/80' 
                                        : 'bg-[#1D1F27]/40 text-on-surface hover:bg-[#1D1F27]'
                                   }`}
                                 >
                                    {isBack ? <span className="text-[10px] uppercase tracking-wider font-bold font-label-caps">DEL</span> : k}
                                 </button>
                              );
                           })}
                        </div>

                        {/* Action Grid Row */}
                        <div className="grid grid-cols-[3rem_1fr] gap-2 max-w-xs mx-auto select-none">
                           <button 
                             onClick={() => setIsDetailedForm(true)}
                             className="h-12 rounded-xl bg-[#1D1F27] border border-outline-variant/20 text-on-surface flex items-center justify-center active:scale-95 outline-none"
                           >
                              <Plus size={16} />
                           </button>
                           <button 
                             onClick={handleCommit}
                             disabled={submitting}
                             className={`h-12 rounded-xl font-bold uppercase font-label-caps tracking-wider text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-white ${
                                parsedAmount > 0 
                                  ? 'bg-emerald shadow-md shadow-emerald/10' 
                                  : 'bg-[#1D1F27]/50 text-on-surface-variant/40 cursor-not-allowed'
                             }`}
                           >
                              {submitting ? (
                                 <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                              ) : <Check size={16} strokeWidth={2.5} />}
                              {submitting ? 'Loggin Entry' : 'Post Record'}
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ) : (
                  /* DETAILED METADATA LOG */
                  <motion.div 
                    key="details"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.15 }}
                    className="flex-1 flex flex-col overflow-hidden px-5 py-4"
                  >
                     <div className="flex-1 space-y-4 overflow-y-auto pb-4 hide-scrollbar pr-0.5">
                        <div className="bg-[#11131A] border border-outline-variant/20 rounded-xl p-4 select-none flex justify-between items-center">
                           <div>
                              <p className="text-[9px] font-bold uppercase font-label-caps text-on-surface-variant/60 tracking-wider mb-0.5">Staged Amount</p>
                              <p className="text-xl font-extrabold text-emerald">${amountStr}</p>
                           </div>
                           <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase font-label-caps border ${
                             type === 'Income' ? 'bg-emerald/10 text-emerald border-emerald/20' : 'bg-danger/10 text-danger border-danger/20'
                           }`}>
                              {type}
                           </span>
                        </div>

                        <div className="flex flex-col gap-4">
                           <label className="block">
                              <span className="text-[9px] font-bold font-label-caps text-on-surface-variant/75 uppercase tracking-wider mb-1.5 block flex items-center gap-1.5">
                                 <Calendar size={11} className="text-emerald opacity-75" /> Posting Date
                              </span>
                              <input 
                                type="date"
                                value={occurredOn}
                                onChange={(e) => setOccurredOn(e.target.value)}
                                className="w-full h-11 bg-[#11131A] border border-outline-variant/20 rounded-xl px-4 text-xs font-bold text-on-surface outline-none focus:border-emerald/30"
                              />
                           </label>

                           <label className="block">
                              <span className="text-[9px] font-bold font-label-caps text-on-surface-variant/75 uppercase tracking-wider mb-1.5 block">
                                 Payee / Vendor Name
                              </span>
                              <input 
                                type="text"
                                placeholder="e.g., AWS Logistics"
                                value={merchant}
                                onChange={(e) => setMerchant(e.target.value)}
                                className="w-full h-11 bg-[#11131A] border border-outline-variant/20 rounded-xl px-4 text-xs font-bold text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-emerald/30"
                              />
                           </label>

                           <label className="block">
                              <span className="text-[9px] font-bold font-label-caps text-on-surface-variant/75 uppercase tracking-wider mb-1.5 block">
                                 Notes & Descriptions
                              </span>
                              <textarea 
                                placeholder="Add memos or tags..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={3}
                                className="w-full bg-[#11131A] border border-outline-variant/20 rounded-xl p-4 text-xs font-bold text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-emerald/30 resize-none leading-relaxed"
                              />
                           </label>
                        </div>
                     </div>

                     <div className="pt-3 pb-2 border-t border-outline-variant/20 shrink-0 select-none">
                        <button 
                          onClick={handleCommit}
                          disabled={submitting}
                          className="w-full h-12 rounded-xl bg-emerald text-white font-bold uppercase font-label-caps tracking-wider text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-emerald/10"
                        >
                           {submitting ? (
                              <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                           ) : <Check size={16} strokeWidth={2.5} />}
                           {submitting ? 'Logging Entry' : 'Post Entry'}
                        </button>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>

         </div>
      )}
    </BottomSheet>
  );
}
