import { ArrowDownLeft, ArrowUpRight, ChevronRight, Archive, Info, Receipt } from 'lucide-react';
import { money } from '@/lib/format';
import type { Category, Transaction } from '@/lib/types';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type GroupedTransactions = {
  dateLabel: string;
  dateKey: string;
  items: Transaction[];
};

function formatDateKey(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  
  return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function TransactionList({ categories, transactions }: { categories: Category[]; transactions: Transaction[] }) {
  
  const groups = useMemo(() => {
    const result: GroupedTransactions[] = [];
    const map: Record<string, Transaction[]> = {};

    transactions.forEach((tx) => {
      const key = tx.occurredOn.split('T')[0];
      if (!map[key]) map[key] = [];
      map[key].push(tx);
    });

    Object.keys(map)
      .sort((a, b) => b.localeCompare(a))
      .forEach((key) => {
        result.push({
          dateKey: key,
          dateLabel: formatDateKey(key),
          items: map[key]
        });
      });

    return result;
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center flex flex-col items-center animate-in fade-in border border-white/[0.03]">
        <div className="w-14 h-14 rounded-2xl bg-[#0E152B]/50 border border-white/[0.04] flex items-center justify-center text-cyan mb-4 shadow-inner">
          <Receipt size={22} />
        </div>
        <p className="text-base font-extrabold text-on-surface tracking-tight">Zero activity traces</p>
        <p className="text-xs text-on-surface-variant/60 mt-1.5 max-w-xs mx-auto font-medium">Log your financial engagements to populate this matrix feed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none font-sans">
      {groups.map((group) => (
        <div key={group.dateKey} className="space-y-3.5">
          {/* Sticky Grouping Header */}
          <div className="flex items-center justify-between gap-4 px-1 select-none">
             <span className="text-[10px] font-black text-cyan uppercase tracking-[0.18em] font-label-caps shrink-0">
                {group.dateLabel}
             </span>
             <div className="h-px w-full bg-gradient-to-r from-white/[0.06] to-transparent" />
          </div>

          {/* Gestural Rows Wrapper */}
          <div className="space-y-2.5 overflow-hidden">
            {group.items.map((transaction) => {
              return (
                <SwipeableTransactionItem 
                  key={transaction.id} 
                  transaction={transaction} 
                  categories={categories} 
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function SwipeableTransactionItem({ transaction, categories }: { transaction: Transaction; categories: Category[] }) {
   const category = categories.find((item) => item.id === transaction.categoryId);
   const isIncome = transaction.type === 'Income';
   const [isArchived, setIsArchived] = useState(false);

   // Helper emoji map from category names
   const getEmoji = (name?: string) => {
     const lName = name?.toLowerCase() || '';
     if (lName.includes('food')) return '🍔';
     if (lName.includes('shop')) return '🛍️';
     if (lName.includes('transit') || lName.includes('transport')) return '🚗';
     if (lName.includes('salary') || lName.includes('income')) return '💰';
     if (lName.includes('bill') || lName.includes('util')) return '💡';
     return null;
   };

   const emojiIcon = getEmoji(category?.name);

   if (isArchived) return null;

   return (
      <div className="relative w-full select-none rounded-2xl group overflow-hidden bg-[#0E152B]/20 border border-white/[0.03]">
         
         {/* BACKDROP ACTIONS LAYER */}
         <div className="absolute inset-0 flex justify-between items-center z-0 px-4 select-none pointer-events-none">
            {/* LEFT DRAG ACTION (Reveals Info) */}
            <div className="flex items-center gap-1.5 text-cyan opacity-80">
               <Info size={16} />
               <span className="text-[9px] font-black uppercase font-label-caps tracking-wider">Audit</span>
            </div>

            {/* RIGHT DRAG ACTION (Reveals Archive) */}
            <div className="flex items-center gap-1.5 text-danger opacity-80">
               <span className="text-[9px] font-black uppercase font-label-caps tracking-wider">Drop</span>
               <Archive size={16} />
            </div>
         </div>

         {/* FRONT SWIPEABLE LAYER */}
         <motion.div
            drag="x"
            dragConstraints={{ left: -100, right: 100 }}
            dragElastic={0.3}
            onDragEnd={(_, info) => {
               const threshold = 85;
               if (info.offset.x < -threshold) {
                  // Perform action: locally archive/hide as demonstration
                  setIsArchived(true);
               }
               if (info.offset.x > threshold) {
                  // Action: triggers metadata popup/details view, currently visual snap
               }
            }}
            className="relative z-10 w-full bg-[#0E152B] border-y border-transparent group-hover:border-white/[0.03] rounded-2xl p-4 flex items-center justify-between touch-pan-x cursor-grab active:cursor-grabbing shadow-md transition-colors duration-200"
         >
            <div className="flex items-center gap-3.5 min-w-0 select-none">
               {/* Large Iconic Badge */}
               <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-inner select-none ${
                  isIncome 
                     ? 'bg-emerald/10 border-emerald/20 text-emerald' 
                     : 'bg-white/[0.03] border-white/[0.04] text-on-surface-variant'
               }`}>
                  {emojiIcon ? (
                     <span className="text-base">{emojiIcon}</span>
                  ) : isIncome ? (
                     <ArrowDownLeft size={18} />
                  ) : (
                     <ArrowUpRight size={18} />
                  )}
               </div>

               <div className="min-w-0 select-none">
                  <h4 className="text-[13px] font-extrabold text-on-surface truncate select-none">
                     {transaction.merchant || category?.name || 'Generic Node'}
                  </h4>
                  <p className="text-[10px] text-on-surface-variant/60 mt-0.5 flex items-center gap-1.5 font-semibold select-none uppercase tracking-wider font-label-caps">
                     {category?.name || 'Index'} 
                     <span className="w-1 h-1 rounded-full bg-white/15" />
                     {new Date(transaction.occurredOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </p>
               </div>
            </div>

            <div className="text-right shrink-0 select-none">
               <p className={`font-headline font-black text-[15px] tracking-tight ${isIncome ? 'text-emerald' : 'text-on-surface'}`}>
                  {isIncome ? '+' : '-'}{money(transaction.amount, transaction.currency)}
               </p>
               <div className="flex justify-end items-center gap-1 mt-0.5 select-none">
                  <span className="text-[9px] font-bold font-mono-data text-cyan tracking-wide uppercase bg-cyan/5 px-1.5 py-0.25 rounded border border-cyan/10">Live</span>
               </div>
            </div>
         </motion.div>
      </div>
   );
}


