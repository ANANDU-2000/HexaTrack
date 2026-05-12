'use client';

import { motion } from 'framer-motion';
import { PieChart, Utensils, Car, Wrench, Package } from 'lucide-react';
import { useFinanceStore } from '@/store/finance-store';
import { money } from '@/lib/format';

export function ExpenseCategoryWidget() {
  const report = useFinanceStore((state) => state.report);
  const categories = useFinanceStore((state) => state.categories);
  const transactions = useFinanceStore((state) => state.transactions);
  
  // Group actual recent data by category for realistic visual render
  const expenses = transactions.filter(t => t.type === 'Expense');
  const totalExp = expenses.reduce((sum, t) => sum + t.amount, 0) || 1;
  
  const mapped = categories.map(cat => {
     const amount = expenses.filter(t => t.categoryId === cat.id).reduce((sum, t) => sum + t.amount, 0);
     return {
        name: cat.name,
        amount,
        percentage: Math.round((amount / totalExp) * 100)
     };
  }).filter(c => c.amount > 0).sort((a, b) => b.amount - a.amount).slice(0, 4);

  // Fallback if zero data for initial load render
  const items = mapped.length > 0 ? mapped : [
     { name: 'General', amount: 0, percentage: 0 }
  ];

  const getIcon = (i: number) => {
     const icons = [Utensils, Car, Wrench, Package];
     const Icon = icons[i % icons.length];
     return <Icon size={14} />;
  };

  const getColor = (i: number) => {
     const colors = ['text-primary', 'text-secondary', 'text-emerald-400', 'text-orange-400'];
     return colors[i % colors.length];
  };
  
  const getBg = (i: number) => {
     const bgs = ['bg-primary', 'bg-secondary', 'bg-emerald-400', 'bg-orange-400'];
     return bgs[i % bgs.length];
  };

  return (
    <div className="glass-card rounded-[32px] p-6 border border-white/[0.03] flex flex-col h-full w-full">
       <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
             <PieChart size={18} className="text-primary opacity-80" />
             <h3 className="font-bold text-[#F5F7FA] text-lg tracking-tight">Distribution</h3>
          </div>
          <div className="text-[10px] font-black font-label-mono text-on-surface-variant tracking-widest uppercase opacity-60">Top Vectors</div>
       </div>

       <div className="space-y-6 flex-grow">
          {items.map((item, i) => (
             <div key={item.name} className="space-y-2">
                <div className="flex justify-between items-end">
                   <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.02] border border-white/[0.05] ${getColor(i)}`}>
                         {getIcon(i)}
                      </div>
                      <div>
                         <p className="text-xs font-bold text-[#F5F7FA]">{item.name}</p>
                         <p className="text-[10px] font-medium text-on-surface-variant opacity-60">{money(item.amount)}</p>
                      </div>
                   </div>
                   <span className="font-label-mono text-xs font-bold text-[#F5F7FA]">{item.percentage}%</span>
                </div>
                
                <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden border border-white/[0.02]">
                   <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                      className={`h-full rounded-full shadow-[0_0_10px_currentColor] ${getBg(i)} opacity-80`}
                   />
                </div>
             </div>
          ))}
       </div>
    </div>
  );
}
