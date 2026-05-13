'use client';

import { useState, useMemo } from 'react';
import { 
  Bell, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownLeft,
  Lightbulb,
  ChevronRight,
  PieChart,
  ShoppingBag,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { money } from '@/lib/format';
import { useFinanceStore } from '@/store/finance-store';
import { useAuthStore } from '@/store/auth-store';

type Timeframe = 'W' | 'M' | 'Y';

export function DashboardScreen({ onNavigate }: { compact?: boolean; onAddTransaction: () => void; onNavigate?: (screen: any) => void }) {
  const [timeframe, setTimeframe] = useState<Timeframe>('M');
  const user = useAuthStore(s => s.user);
  const accounts = useFinanceStore(s => s.accounts);
  const report = useFinanceStore(s => s.report);
  const transactions = useFinanceStore(s => s.transactions);

  const greetingName = user?.displayName?.split(' ')[0] || 'Manager';
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  
  const recentTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.occurredOn).getTime() - new Date(a.occurredOn).getTime()).slice(0, 4);
  }, [transactions]);

  const budgetLimit = 5000;
  const budgetUsedPct = Math.min(100, Math.max(0, (report.expense / budgetLimit) * 100));

  const sparkPoints = "M0,30 L0,20 Q10,25 20,15 T40,20 T60,10 T80,15 T100,5 L100,30 Z";
  const sparkLine = "M0,20 Q10,25 20,15 T40,20 T60,10 T80,15 T100,5";

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-5 pb-28 pt-4 select-none font-sans">
      
      <header className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1D1F27] border border-outline-variant/20 flex-shrink-0 flex items-center justify-center">
            <span className="text-emerald text-xs font-black tracking-tighter">{greetingName.slice(0, 2).toUpperCase()}</span>
          </div>
          <div>
             <h1 className="text-lg font-extrabold tracking-tight leading-none text-on-surface">HexaTrack</h1>
             <p className="text-[10px] font-semibold text-on-surface-variant/70 tracking-wide mt-0.5 uppercase font-label-caps">WorkSpace Live</p>
          </div>
        </div>
        
        <button className="w-10 h-10 rounded-xl bg-[#191B22] border border-outline-variant/10 flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-95 transition-all relative">
           <Bell size={18} strokeWidth={2.2} />
           <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-emerald shadow-[0_0_4px_#10B981]" />
        </button>
      </header>

      <section className="relative bg-[#11131A] rounded-2xl p-6 border border-outline-variant/20 overflow-hidden flex flex-col gap-6 shadow-sm group">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald/10 transition-all duration-500" />
         
         <div className="flex justify-between items-start relative z-10">
            <div className="flex flex-col gap-1">
               <span className="text-[10px] font-semibold font-label-caps text-on-surface-variant uppercase tracking-widest">Current Wealth</span>
               <span className="text-3xl font-extrabold tracking-tight text-on-surface leading-none">{money(totalBalance)}</span>
            </div>
            <div className="bg-[#1D1F27] rounded-lg p-0.5 flex border border-outline-variant/10">
               {(['W', 'M', 'Y'] as Timeframe[]).map((t) => (
                  <button
                     key={t}
                     onClick={() => setTimeframe(t)}
                     className={`px-2.5 py-1 rounded-md text-[9px] font-bold font-label-caps tracking-wider transition-all ${
                        timeframe === t 
                          ? 'bg-[#11131A] text-emerald shadow-sm border border-outline-variant/20' 
                          : 'text-on-surface-variant/60 hover:text-on-surface'
                     }`}
                  >
                     {t}
                  </button>
               ))}
            </div>
         </div>

         <div className="h-12 w-full relative z-10 flex items-end opacity-70 px-1">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
               <path d={sparkPoints} fill="url(#spark-gradient)"></path>
               <path d={sparkLine} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"></path>
               <defs>
                  <linearGradient id="spark-gradient" x1="0" x2="0" y1="0" y2="1">
                     <stop offset="0%" stopColor="#10B981" stopOpacity="0.2"></stop>
                     <stop offset="100%" stopColor="#10B981" stopOpacity="0"></stop>
                  </linearGradient>
               </defs>
            </svg>
         </div>

         <div className="flex gap-3 relative z-10">
            <div className="flex-1 bg-[#1D1F27]/40 rounded-xl p-3 flex items-center gap-3 border border-outline-variant/10">
               <div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald">
                  <ArrowDownLeft size={16} strokeWidth={2.5} />
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-bold font-label-caps tracking-wider text-on-surface-variant uppercase">Inflow</span>
                  <span className="text-xs font-bold text-on-surface">{money(report.income)}</span>
               </div>
            </div>
            <div className="flex-1 bg-[#1D1F27]/40 rounded-xl p-3 flex items-center gap-3 border border-outline-variant/10">
               <div className="w-8 h-8 rounded-lg bg-danger/10 flex items-center justify-center text-danger">
                  <ArrowUpRight size={16} strokeWidth={2.5} />
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-bold font-label-caps tracking-wider text-on-surface-variant uppercase">Outflow</span>
                  <span className="text-xs font-bold text-on-surface">{money(report.expense)}</span>
               </div>
            </div>
         </div>
      </section>

      <motion.section 
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         onClick={() => onNavigate?.('assistant')}
         className="bg-[#1D1F27]/40 rounded-xl p-4 border border-outline-variant/20 flex gap-4 items-start shadow-sm cursor-pointer active:scale-[0.99] transition-transform"
      >
         <div className="w-9 h-9 rounded-xl bg-indigo/10 flex items-center justify-center text-indigo flex-shrink-0 mt-0.5">
            <Lightbulb size={18} />
         </div>
         <div className="flex-grow flex flex-col gap-1">
            <div className="flex items-center gap-2">
               <span className="text-[9px] font-black font-label-caps text-indigo uppercase tracking-widest leading-none">AI Insight Signal</span>
               <span className="w-1 h-1 rounded-full bg-indigo animate-ping" />
            </div>
            <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed">
               Operational costs are trending 8% lower this cycle. Capital reserves are optimized for deployment.
            </p>
         </div>
         <ChevronRight size={14} className="text-on-surface-variant/40 self-center ml-1 shrink-0" />
      </motion.section>

      <section className="grid grid-cols-2 gap-3">
         <div className="bg-[#11131A] rounded-xl p-4 border border-outline-variant/20 flex flex-col gap-2 relative overflow-hidden shadow-sm group hover:border-emerald/30 transition-colors">
            <div className="absolute -right-4 -bottom-4 w-14 h-14 bg-emerald/5 rounded-full blur-xl group-hover:bg-emerald/10 transition-all" />
            <div className="flex justify-between items-center relative z-10">
               <span className="text-[9px] font-bold font-label-caps text-on-surface-variant uppercase tracking-wider">Revenue</span>
               <TrendingUp size={14} className="text-emerald opacity-75" />
            </div>
            <span className="text-base font-extrabold text-on-surface mt-1.5 relative z-10">{money(report.income)}</span>
         </div>

         <div className="bg-[#11131A] rounded-xl p-4 border border-outline-variant/20 flex flex-col gap-2 relative overflow-hidden shadow-sm group hover:border-danger/30 transition-colors">
            <div className="absolute -right-4 -bottom-4 w-14 h-14 bg-danger/5 rounded-full blur-xl group-hover:bg-danger/10 transition-all" />
            <div className="flex justify-between items-center relative z-10">
               <span className="text-[9px] font-bold font-label-caps text-on-surface-variant uppercase tracking-wider">Expenses</span>
               <TrendingDown size={14} className="text-danger opacity-75" />
            </div>
            <span className="text-base font-extrabold text-on-surface mt-1.5 relative z-10">{money(report.expense)}</span>
         </div>

         <div className="bg-[#11131A] rounded-xl p-4 border border-outline-variant/20 flex flex-col gap-2 relative overflow-hidden shadow-sm group hover:border-teal/30 transition-colors">
            <div className="absolute -right-4 -bottom-4 w-14 h-14 bg-teal/5 rounded-full blur-xl group-hover:bg-teal/10 transition-all" />
            <div className="flex justify-between items-center relative z-10">
               <span className="text-[9px] font-bold font-label-caps text-on-surface-variant uppercase tracking-wider">Net Margin</span>
               <DollarSign size={14} className="text-teal opacity-75" />
            </div>
            <span className={`text-base font-extrabold mt-1.5 relative z-10 ${report.net >= 0 ? 'text-emerald' : 'text-danger'}`}>{money(report.net)}</span>
         </div>

         <div className="bg-[#11131A] rounded-xl p-4 border border-outline-variant/20 flex flex-col gap-2 relative overflow-hidden shadow-sm group hover:border-indigo/30 transition-colors">
            <div className="flex justify-between items-center relative z-10">
               <span className="text-[9px] font-bold font-label-caps text-on-surface-variant uppercase tracking-wider">Op-Budget</span>
               <PieChart size={14} className="text-indigo opacity-75" />
            </div>
            <div className="flex flex-col gap-2 mt-1.5 relative z-10">
               <span className="text-base font-extrabold text-on-surface leading-none">{Math.round(budgetUsedPct)}%</span>
               <div className="h-1 w-full bg-[#1D1F27] rounded-full overflow-hidden">
                  <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${budgetUsedPct}%` }}
                     transition={{ duration: 0.8, delay: 0.2 }}
                     className="h-full bg-indigo rounded-full" 
                  />
               </div>
            </div>
         </div>
      </section>

      <section className="bg-[#11131A] rounded-xl p-5 border border-outline-variant/20 flex flex-col gap-4 shadow-sm">
         <div className="flex justify-between items-center">
            <h3 className="text-[13px] font-extrabold text-on-surface tracking-wide">Operational Mix</h3>
            <button onClick={() => onNavigate?.('reports')} className="text-[9px] font-black font-label-caps text-emerald uppercase tracking-wider flex items-center gap-1">
               Open Engine <ArrowRight size={10} />
            </button>
         </div>

         <div className="flex items-center gap-6 py-1">
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
               <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                     className="text-[#1D1F27]"
                     strokeWidth="3.5"
                     stroke="currentColor"
                     fill="none"
                     d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <motion.path
                     initial={{ strokeDasharray: "0, 100" }}
                     animate={{ strokeDasharray: "70, 100" }}
                     transition={{ duration: 1, ease: "easeOut" }}
                     className="text-emerald"
                     strokeWidth="3.5"
                     strokeLinecap="round"
                     stroke="currentColor"
                     fill="none"
                     d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center font-sans">
                  <span className="text-[13px] font-black text-on-surface tracking-tighter leading-none">70%</span>
                  <span className="text-[7px] font-bold uppercase text-on-surface-variant/60 font-label-caps mt-0.5">Direct</span>
               </div>
            </div>

            <div className="flex-grow flex flex-col gap-2.5">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-sm bg-emerald" />
                     <span className="text-xs font-bold text-on-surface-variant">Inventory Purchases</span>
                  </div>
                  <span className="text-xs font-mono text-on-surface font-semibold">70%</span>
               </div>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-sm bg-[#1D1F27] border border-outline-variant/20" />
                     <span className="text-xs font-bold text-on-surface-variant">Overhead & Logistics</span>
                  </div>
                  <span className="text-xs font-mono text-on-surface font-semibold">30%</span>
               </div>
            </div>
         </div>
      </section>

      <section className="flex flex-col gap-3 mt-1">
         <div className="flex justify-between items-center px-1">
            <h3 className="text-[13px] font-extrabold text-on-surface tracking-wide">Ledger Summary</h3>
            <button onClick={() => onNavigate?.('history')} className="text-[9px] font-black font-label-caps text-on-surface-variant uppercase tracking-wider hover:text-emerald">
               View Records
            </button>
         </div>
         
         <div className="flex flex-col border border-outline-variant/20 rounded-xl overflow-hidden bg-[#11131A] shadow-sm">
            {recentTransactions.length > 0 ? (
               recentTransactions.map((tx, idx) => {
                  const isExpense = tx.type === 'Expense';
                  return (
                     <div key={tx.id} className={`flex justify-between items-center p-4 ${idx !== recentTransactions.length - 1 ? 'border-b border-outline-variant/10' : ''}`}>
                        <div className="flex items-center gap-3 min-w-0">
                           <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isExpense ? 'bg-[#1D1F27] text-on-surface-variant' : 'bg-emerald/10 text-emerald'}`}>
                              {isExpense ? <ShoppingBag size={16} /> : <TrendingUp size={16} />}
                           </div>
                           <div className="min-w-0 flex flex-col">
                              <span className="text-xs font-bold text-on-surface truncate leading-tight">{tx.merchant || 'Log Entry'}</span>
                              <span className="text-[9px] font-bold font-label-caps text-on-surface-variant/60 tracking-wide uppercase mt-0.5 truncate">{tx.type}</span>
                           </div>
                        </div>
                        <span className={`text-xs font-extrabold tracking-tight shrink-0 ${isExpense ? 'text-on-surface' : 'text-emerald'}`}>
                           {isExpense ? '-' : '+'}{money(tx.amount)}
                        </span>
                     </div>
                  );
               })
            ) : (
               <div className="p-6 text-center text-xs font-semibold text-on-surface-variant/50">No recorded ledger nodes.</div>
            )}
         </div>
      </section>

    </div>
  );
}
