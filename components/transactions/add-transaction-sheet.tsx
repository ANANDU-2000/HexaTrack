import { Calendar, Check, ChevronLeft, Plus, Tag, Wallet, X } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useFinanceStore } from '@/store/finance-store';
import { z } from 'zod';
import type { TransactionType } from '@/lib/types';
import { BottomSheet } from '@/components/ui/mobile-layout';
import { motion, AnimatePresence } from 'framer-motion';

const transactionSchema = z.object({
  type: z.enum(['Income', 'Expense']),
  amount: z.number().positive('Amount must be greater than zero'),
  accountId: z.string().min(1, 'Choose account'),
  occurredOn: z.string().min(1, 'Choose date'),
  merchant: z.string().max(120).optional(),
  note: z.string().max(240).optional(),
  tags: z.string().optional(),
});

// Helper emoji map for immersive categories list
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
  
  // Internal Input state
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
     // Reset defaults on open
     if (accounts.length > 0 && !selectedAccountId) setSelectedAccountId(accounts[0].id);
     if (filteredCategories.length > 0) setSelectedCategoryId(filteredCategories[0].id);
  }, [open, accounts, filteredCategories]);

  // Custom keypad logic
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
     
     // Cap entry to 9 characters for UI sanity
     if (amountStr.length > 8) return;

     setAmountStr(prev => {
        if (prev === '0') return key;
        // Enforce 2 decimal maximums
        if (prev.includes('.') && prev.split('.')[1].length >= 2) return prev;
        return prev + key;
     });
  };

  const parsedAmount = parseFloat(amountStr) || 0;

  const handleCommit = async () => {
     if (parsedAmount <= 0) {
        setLocalError('Enter an active quantity');
        return;
     }
     if (!selectedAccountId) {
        setLocalError('Select an active node');
        return;
     }
     if (!selectedCategoryId) {
        setLocalError('Map index category');
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
      
      {/* Immersive Sticky Mobile Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 mt-1.5 shrink-0 bg-[#111827]/20">
         <div className="flex items-center gap-2.5">
            {isDetailedForm ? (
               <button 
                 onClick={() => setIsDetailedForm(false)}
                 className="w-9 h-9 rounded-xl bg-[#111827] border border-white/[0.04] flex items-center justify-center text-cyan outline-none active:scale-95"
               >
                  <ChevronLeft size={18} />
               </button>
            ) : null}
            <div>
               <span className="text-[9px] font-black font-label-caps text-cyan uppercase tracking-[0.22em] block leading-none mb-1">Entry Protocol</span>
               <h3 id="mobile-transaction-entry" className="text-lg font-extrabold tracking-tight text-on-surface">{isDetailedForm ? 'Extended Ledger' : 'Record Flow'}</h3>
            </div>
         </div>
         <button 
            onClick={() => onOpenChange(false)} 
            className="w-9 h-9 rounded-full bg-[#111827] border border-white/[0.04] flex items-center justify-center text-on-surface-variant outline-none active:scale-95 transition-transform"
         >
            <X size={16} />
         </button>
      </div>

      {accounts.length === 0 ? (
         <div className="p-10 text-center text-xs text-on-surface-variant font-bold tracking-widest uppercase">Initializing assets registry...</div>
      ) : (
         <div className="flex-1 flex flex-col overflow-hidden relative bg-[#111827]/25">
            
            <AnimatePresence initial={false} mode="wait">
               {!isDetailedForm ? (
                  /* MODE 1: QUICK KEYPAD ENTRY SCREEN */
                  <motion.div 
                    key="keypad"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 flex flex-col overflow-hidden pb-4"
                  >
                     {/* Massive Animated Amount counter */}
                     <div className="flex-1 flex flex-col justify-center items-center py-5 px-5 select-none">
                        <div className="grid grid-cols-2 w-48 mx-auto mb-4 rounded-full border border-white/[0.04] bg-[#111827] p-1 shrink-0">
                           {(['Expense', 'Income'] as const).map(m => (
                              <button
                                key={m}
                                onClick={() => setType(m)}
                                className={`py-2 rounded-full text-[9px] font-black font-label-caps uppercase tracking-widest transition-all active:scale-95 outline-none ${
                                   type === m 
                                     ? m === 'Income' 
                                        ? 'bg-emerald text-black shadow-inner' 
                                        : 'bg-danger text-white shadow-inner'
                                     : 'text-on-surface-variant/70 hover:text-on-surface'
                                }`}
                              >
                                 {m}
                              </button>
                           ))}
                        </div>

                        <div className="text-center mt-1 max-w-full overflow-hidden">
                           <motion.div 
                             key={amountStr}
                             initial={{ scale: 0.95, opacity: 0.8 }}
                             animate={{ scale: 1, opacity: 1 }}
                             transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                             className="flex items-center justify-center tracking-tighter select-none"
                           >
                              <span className="text-3xl md:text-4xl font-headline font-extrabold text-cyan opacity-80 mr-1 select-none">$</span>
                              <span className="text-5xl md:text-6xl font-headline font-black text-on-surface truncate select-none px-1">
                                 {amountStr}
                              </span>
                           </motion.div>
                           {localError && (
                              <div className="text-[9px] font-black text-danger font-label-caps uppercase mt-3 tracking-widest">{localError}</div>
                           )}
                        </div>
                     </div>

                     {/* Account Matrix Selector (Horizontal Loop) */}
                     <div className="mb-3.5 shrink-0">
                        <p className="px-5 text-[9px] font-black font-label-caps text-on-surface-variant/60 uppercase tracking-widest mb-2.5 select-none flex items-center gap-1.5">
                           <Wallet size={11} className="text-cyan" /> Source Active Node
                        </p>
                        <div className="flex gap-2.5 overflow-x-auto px-5 pb-1 custom-scrollbar">
                           {accounts.map(a => {
                              const isActive = a.id === selectedAccountId;
                              return (
                                 <button
                                   key={a.id}
                                   onClick={() => setSelectedAccountId(a.id)}
                                   className={`px-3.5 py-2.5 rounded-[16px] border whitespace-nowrap flex items-center gap-2 active:scale-[0.96] transition-all outline-none select-none shadow-inner ${
                                      isActive 
                                        ? 'bg-cyan/10 border-cyan/25 text-cyan' 
                                        : 'bg-[#111827]/60 border-white/[0.04] text-on-surface-variant hover:text-on-surface'
                                   }`}
                                 >
                                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan shadow-[0_0_5px_rgba(6,182,212,0.8)]' : 'bg-white/20'}`} />
                                    <span className="text-[11px] font-extrabold tracking-wide select-none">{a.name}</span>
                                 </button>
                              );
                           })}
                        </div>
                     </div>

                     {/* Category Matrix Selector (Horizontal Loop with Custom Emojis) */}
                     <div className="mb-4.5 shrink-0">
                        <p className="px-5 text-[9px] font-black font-label-caps text-on-surface-variant/60 uppercase tracking-widest mb-2.5 select-none flex items-center gap-1.5">
                           <Tag size={11} className="text-cyan" /> Flow Category
                        </p>
                        <div className="flex gap-2.5 overflow-x-auto px-5 pb-1 custom-scrollbar">
                           {filteredCategories.map(cat => {
                              const isActive = cat.id === selectedCategoryId;
                              return (
                                 <button
                                   key={cat.id}
                                   onClick={() => setSelectedCategoryId(cat.id)}
                                   className={`px-3.5 py-2.5 rounded-[16px] border whitespace-nowrap flex items-center gap-2.5 active:scale-[0.96] transition-all outline-none select-none shadow-inner ${
                                      isActive 
                                        ? 'bg-indigo/10 border-indigo/25 text-indigo' 
                                        : 'bg-[#111827]/60 border-white/[0.04] text-on-surface-variant hover:text-on-surface'
                                   }`}
                                 >
                                    <span className="text-sm select-none">{getEmojiForCategory(cat.name)}</span>
                                    <span className="text-[11px] font-extrabold tracking-wide select-none">{cat.name}</span>
                                 </button>
                              );
                           })}
                        </div>
                     </div>

                     {/* Bespoke Tactile Numeric Keypad (Grid) */}
                     <div className="px-5 py-2 bg-[#111827]/40 border-t border-white/[0.03] shrink-0">
                        <div className="grid grid-cols-3 gap-2 text-center max-w-xs mx-auto select-none mb-4">
                           {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'back'].map(k => {
                              const isBack = k === 'back';
                              return (
                                 <button
                                   key={k}
                                   onClick={() => pressKey(k)}
                                   className={`h-11.5 rounded-[18px] border border-white/[0.03] flex items-center justify-center select-none active:scale-90 outline-none transition-transform font-headline font-black text-lg ${
                                      isBack 
                                        ? 'bg-white/[0.03] text-on-surface-variant/80' 
                                        : 'bg-[#111827]/50 text-on-surface hover:bg-[#111827]/90 active:bg-[#111827]'
                                   }`}
                                 >
                                    {isBack ? <span className="text-sm uppercase tracking-wider font-label-caps font-bold">Clear</span> : k}
                                 </button>
                              );
                           })}
                        </div>

                        {/* Bottom Row Grid: More details button and Commit! */}
                        <div className="grid grid-cols-[3.25rem_1fr] gap-3 select-none">
                           <button 
                             onClick={() => setIsDetailedForm(true)}
                             className="h-12.5 rounded-2xl bg-white/[0.03] border border-white/[0.04] text-on-surface flex items-center justify-center active:scale-95 outline-none"
                             title="More detail metadata"
                           >
                              <Plus size={18} />
                           </button>
                           <button 
                             onClick={handleCommit}
                             disabled={submitting}
                             className={`h-12.5 rounded-2xl font-black uppercase font-label-caps tracking-[0.15em] text-[11px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-black ${
                                parsedAmount > 0 
                                  ? 'bg-cyan shadow-lg shadow-cyan/20' 
                                  : 'bg-white/[0.08] text-on-surface-variant/40 cursor-not-allowed'
                             }`}
                           >
                              {submitting ? (
                                 <div className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                              ) : <Check size={16} strokeWidth={2.6} />}
                              {submitting ? 'Syncing Vector' : 'Execute Entry'}
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ) : (
                  /* MODE 2: EXTENDED METADATA LEDGER SCREEN */
                  <motion.div 
                    key="details"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 flex flex-col overflow-hidden px-5 py-4"
                  >
                     <div className="flex-1 space-y-4 overflow-y-auto pb-4 custom-scrollbar pr-1">
                        <div className="bg-[#111827]/50 border border-white/[0.04] rounded-[20px] p-4 select-none flex justify-between items-center shadow-inner">
                           <div>
                              <p className="text-[9px] font-black uppercase font-label-caps text-on-surface-variant/60 tracking-wider mb-0.5">Staged Total</p>
                              <p className="text-2xl font-headline font-black text-cyan">${amountStr}</p>
                           </div>
                           <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase font-label-caps border ${
                             type === 'Income' ? 'bg-emerald/10 text-emerald border-emerald/20' : 'bg-danger/10 text-danger border-danger/20'
                           }`}>
                              {type}
                           </span>
                        </div>

                        <label className="block">
                           <span className="text-[9px] font-black font-label-caps text-on-surface-variant/75 uppercase tracking-[0.15em] mb-1.5 block flex items-center gap-1.5">
                              <Calendar size={11} className="text-cyan" /> Posting Cycle Date
                           </span>
                           <input 
                             type="date"
                             value={occurredOn}
                             onChange={(e) => setOccurredOn(e.target.value)}
                             className="w-full h-12.5 bg-[#111827]/60 border border-white/[0.05] rounded-2xl px-4 text-xs font-bold font-mono-data text-on-surface outline-none focus:border-cyan/25 shadow-inner"
                           />
                        </label>

                        <label className="block">
                           <span className="text-[9px] font-black font-label-caps text-on-surface-variant/75 uppercase tracking-[0.15em] mb-1.5 block">
                              External Party / Recipient
                           </span>
                           <input 
                             type="text"
                             placeholder="External Ledger ID"
                             value={merchant}
                             onChange={(e) => setMerchant(e.target.value)}
                             className="w-full h-12.5 bg-[#111827]/60 border border-white/[0.05] rounded-2xl px-4 text-xs font-bold text-on-surface placeholder:text-on-surface-variant/30 outline-none focus:border-cyan/25 shadow-inner"
                           />
                        </label>

                        <label className="block">
                           <span className="text-[9px] font-black font-label-caps text-on-surface-variant/75 uppercase tracking-[0.15em] mb-1.5 block">
                              Metadata Memoranda
                           </span>
                           <textarea 
                             placeholder="Map contextual data to this transaction packet..."
                             value={note}
                             onChange={(e) => setNote(e.target.value)}
                             rows={4}
                             className="w-full bg-[#111827]/60 border border-white/[0.05] rounded-2xl p-4 text-xs font-bold text-on-surface placeholder:text-on-surface-variant/30 outline-none focus:border-cyan/25 shadow-inner resize-none leading-relaxed"
                           />
                        </label>
                     </div>

                     {/* Persistent Action Bar at bottom of metadata mode */}
                     <div className="pt-3 pb-1 border-t border-white/[0.03] shrink-0 select-none">
                        <button 
                          onClick={handleCommit}
                          disabled={submitting}
                          className="w-full h-12.5 rounded-2xl bg-cyan text-black font-black uppercase font-label-caps tracking-[0.15em] text-[11px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-cyan/15"
                        >
                           {submitting ? (
                              <div className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                           ) : <Check size={16} strokeWidth={2.6} />}
                           {submitting ? 'Committing Packet' : 'Execute & Post'}
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


