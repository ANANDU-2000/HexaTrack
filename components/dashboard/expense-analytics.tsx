'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { money } from '@/lib/format';
import { useFinanceStore } from '@/store/finance-store';

const COLORS = ['#4F8CFF', '#22C55E', '#F59E0B', '#A855F7', '#EC4899', '#14B8A6'];

export function ExpenseAnalytics() {
  const categories = useFinanceStore((state) => state.categories);
  const report = useFinanceStore((state) => state.report);
  const transactions = useFinanceStore((state) => state.transactions);

  const expenseCategories = categories.filter(c => c.type === 'Expense');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  // Prepare chart data based on categories or subcategories
  const rawSpending = report.spendingByCategory.length > 0 
    ? report.spendingByCategory 
    : expenseCategories.slice(0, 5).map(cat => {
        const amt = transactions
          .filter(t => t.categoryId === cat.id && t.type === 'Expense')
          .reduce((s, t) => s + t.amount, 0);
        return { categoryId: cat.id, categoryName: cat.name, amount: amt };
      }).filter(s => s.amount > 0);

  // Fallback static for demo if empty
  const finalSpending = rawSpending.length > 0 ? rawSpending : [
    { categoryName: 'Cloud', amount: 2400, categoryId: '1' },
    { categoryName: 'Rent', amount: 1500, categoryId: '2' },
    { categoryName: 'Marketing', amount: 900, categoryId: '3' },
    { categoryName: 'Salaries', amount: 4500, categoryId: '4' }
  ].sort((a,b) => b.amount - a.amount);

  const total = finalSpending.reduce((sum, i) => sum + i.amount, 0);
  const activeCategoryData = finalSpending.find(f => f.categoryId === selectedCategoryId);

  // Simulation of subcategories for breakdown if specific category is selected
  const subcategoriesData = [
    { name: 'Sub-item A', val: (activeCategoryData?.amount || 100) * 0.6 },
    { name: 'Sub-item B', val: (activeCategoryData?.amount || 100) * 0.3 },
    { name: 'Others', val: (activeCategoryData?.amount || 100) * 0.1 },
  ];

  return (
    <section className="mt-6 bg-[#111827] border border-white/[0.04] rounded-[32px] p-6 overflow-hidden relative">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-[#F9FAFB] font-display">Expense Analytics</h3>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 text-[#9CA3AF] border border-white/5">
          Monthly Distribution
        </span>
      </div>

      {/* Horizontal Filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 -mx-2 px-2 hide-scrollbar">
        <button
          onClick={() => setSelectedCategoryId('all')}
          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
            selectedCategoryId === 'all' 
              ? 'bg-[#4F8CFF] border-[#4F8CFF] text-white shadow-sm shadow-[#4F8CFF]/20' 
              : 'bg-[#1A2333] border-white/[0.05] text-[#9CA3AF] hover:text-white'
          }`}
        >
          All
        </button>
        {finalSpending.slice(0, 4).map((item) => (
          <button
            key={item.categoryId}
            onClick={() => setSelectedCategoryId(item.categoryId)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              selectedCategoryId === item.categoryId 
                ? 'bg-[#4F8CFF] border-[#4F8CFF] text-white shadow-sm shadow-[#4F8CFF]/20' 
                : 'bg-[#1A2333] border-white/[0.05] text-[#9CA3AF] hover:text-white'
            }`}
          >
            {item.categoryName}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-2">
        {/* Circular Ring Chart */}
        <div className="relative flex items-center justify-center h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={selectedCategoryId === 'all' ? finalSpending : subcategoriesData.map(s => ({categoryName: s.name, amount: s.val}))}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={5}
                dataKey="amount"
                stroke="none"
                animationBegin={0}
                animationDuration={800}
                className="outline-none"
              >
                {(selectedCategoryId === 'all' ? finalSpending : subcategoriesData).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="transition-opacity hover:opacity-80 cursor-pointer" />
                ))}
              </Pie>
              <Tooltip 
                cursor={false}
                contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#F9FAFB' }}
                itemStyle={{ color: '#F9FAFB' }}
                formatter={(value: number) => money(value)}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-0.5">
              {selectedCategoryId === 'all' ? 'Total' : activeCategoryData?.categoryName}
            </p>
            <p className="text-xl font-bold text-[#F9FAFB]">
              {money(selectedCategoryId === 'all' ? total : (activeCategoryData?.amount || 0))}
            </p>
          </div>
        </div>

        {/* Breakdown List / Bars */}
        <div className="flex flex-col justify-center space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategoryId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {(selectedCategoryId === 'all' ? finalSpending.slice(0, 5) : subcategoriesData.map((s, i) => ({ categoryName: s.name, amount: s.val, categoryId: `sub-${i}`})))
                .map((item, index) => {
                  const percentage = ((item.amount / (selectedCategoryId === 'all' ? total : (activeCategoryData?.amount || 100))) * 100).toFixed(0);
                  return (
                    <div key={item.categoryName + item.amount} className="group">
                      <div className="flex justify-between items-end mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <span className="text-sm font-medium text-[#F9FAFB] truncate max-w-[120px]">{item.categoryName}</span>
                          <span className="text-[10px] text-[#9CA3AF] font-semibold bg-white/5 px-1.5 rounded">{percentage}%</span>
                        </div>
                        <span className="text-sm font-bold text-[#F9FAFB]">{money(item.amount)}</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden w-full">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                      </div>
                    </div>
                  );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
