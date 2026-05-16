'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, TrendingUp, AlertTriangle, Cpu, ArrowRight, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { money } from '@/lib/format';
import { useFinanceStore } from '@/store/finance-store';

type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  insight?: {
    type: 'trend' | 'risk' | 'action';
    title: string;
    data: string;
  };
  options?: string[];
};

export function AssistantScreen() {
  const report = useFinanceStore((state) => state.report);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [inputStr, setInputStr] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: "Audit complete. Operating revenues are healthy this period, and overall net margins are positive. I've identified two cost-saving optimization paths for review.",
      timestamp: new Date(),
      insight: {
        type: 'action',
        title: 'Subscription Cost Pruning',
        data: 'Three automated SaaS billing cycles increased by 15% this month.'
      },
      options: ['Analyze Overhead Increase', 'Run Runway Estimate', 'Optimize Vendor Outflow']
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const triggerResponse = (query: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      let resText = "Financial model calculations complete.";
      let insightObj: Message['insight'] | undefined;
      let resOptions: string[] = ['Download PDF Summary', 'Back to Home'];

      const lower = query.toLowerCase();
      if (lower.includes('runway') || lower.includes('estimate') || lower.includes('burn')) {
        resText = "Based on average monthly outflows of " + money(report.expense) + ", the current liquid assets secure approximately 22 months of operational stability.";
        insightObj = {
          type: 'trend',
          title: 'Operating Capital Buffer',
          data: 'Core reserves are sufficient to absorb seasonal variances safely.'
        };
        resOptions = ['Run Recession Model', 'Adjust Overhead Allocation'];
      } else if (lower.includes('optimize') || lower.includes('vendor') || lower.includes('increase')) {
        resText = "Revising active SaaS licenses and logistics vendor contracts could decrease operating expenses by 7.5% starting next quarterly billing cycle.";
        insightObj = {
          type: 'action',
          title: 'Cost Recovery Projections',
          data: 'Target adjustments will recover $480.00 in free cash flow.'
        };
        resOptions = ['Approve Negotiations', 'View Line-by-Line Ledger'];
      } else {
        resText = "Total operational net margin for this interval stands at " + money(report.net) + ". Overall momentum is on track.";
        insightObj = {
          type: 'trend',
          title: 'Historical Profit Trajectory',
          data: 'Operating revenues outpaced fixed expenses by 18.5%.'
        };
      }

      setMessages(prev => [...prev, {
         id: `res-${Date.now()}`,
         sender: 'ai',
         text: resText,
         timestamp: new Date(),
         insight: insightObj,
         options: resOptions
      }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputStr.trim()) return;

    const userQ = inputStr.trim();
    setMessages(prev => [...prev, {
       id: `u-${Date.now()}`,
       sender: 'user',
       text: userQ,
       timestamp: new Date()
    }]);
    setInputStr('');
    triggerResponse(userQ);
  };

  const handleOptionClick = (opt: string) => {
    setMessages(prev => [...prev, {
       id: `u-opt-${Date.now()}`,
       sender: 'user',
       text: opt,
       timestamp: new Date()
    }]);
    triggerResponse(opt);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col h-[calc(100dvh-6.5rem)] pt-4 select-none relative overflow-hidden font-sans">
       
       {/* Header bar */}
       <header className="relative z-10 flex items-center justify-between bg-[#0E152B] border border-outline-variant/20 rounded-xl p-3 shadow-sm mb-4 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-8.5 h-8.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 relative">
                <Bot size={16} />
             </div>
             <div>
                <h2 className="text-[13px] font-extrabold text-on-surface tracking-wide leading-none mb-1">Assistant Insight</h2>
                <div className="flex items-center gap-1.5">
                   <span className="w-1 h-1 rounded-full bg-emerald shadow-[0_0_3px_#10B981]" />
                   <p className="text-[9px] font-bold font-label-caps uppercase tracking-wider text-on-surface-variant/60">Operations Evaluated</p>
                </div>
             </div>
          </div>
          
          <span className="text-[8px] font-bold bg-[#1D1F27] border border-outline-variant/20 px-2 py-0.5 rounded-md text-on-surface-variant/70 font-label-caps tracking-wider uppercase">
             CFO Agent
          </span>
       </header>

       {/* Chat feed */}
       <div className="flex-grow overflow-y-auto hide-scrollbar relative z-10 space-y-4 mb-4 flex flex-col px-1">
          <div className="flex-grow" />

          <AnimatePresence initial={false}>
             {messages.map((msg) => {
                const isAi = msg.sender === 'ai';
                
                return (
                   <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex w-full flex-col ${isAi ? 'items-start' : 'items-end'}`}
                   >
                      <div className={`max-w-[88%] flex flex-col gap-2 rounded-xl px-4 py-3 text-xs ${
                         isAi 
                           ? 'bg-[#0E152B] border border-outline-variant/20 text-on-surface shadow-sm' 
                           : 'bg-primary text-white font-bold tracking-wide shadow-sm'
                      }`}>
                         <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                         
                         {isAi && msg.insight && (
                            <div className="mt-1.5 bg-[#1D1F27] border border-outline-variant/20 rounded-lg p-3 flex items-start gap-3 select-none">
                               <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                  msg.insight.type === 'risk' 
                                    ? 'bg-danger/10 text-danger border border-danger/20' 
                                    : msg.insight.type === 'action' 
                                      ? 'bg-primary/10 text-primary border border-primary/20' 
                                      : 'bg-emerald/10 text-emerald border border-emerald/20'
                               }`}>
                                  {msg.insight.type === 'risk' ? <AlertTriangle size={13} /> : msg.insight.type === 'action' ? <Cpu size={13} /> : <TrendingUp size={13} />}
                                </div>
                               <div>
                                  <p className="text-[8px] font-bold font-label-caps tracking-wider uppercase text-on-surface-variant/60 mb-0.5">{msg.insight.title}</p>
                                  <p className="text-[11px] text-on-surface font-bold leading-snug">{msg.insight.data}</p>
                               </div>
                            </div>
                         )}
                      </div>

                      {isAi && msg.options && msg.options.length > 0 && (
                         <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[92%] select-none">
                            {msg.options.map((opt, idx) => (
                               <motion.button
                                  key={idx}
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => handleOptionClick(opt)}
                                  className="px-2.5 py-1.5 bg-[#1D1F27] border border-outline-variant/20 text-on-surface-variant hover:text-emerald rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all shadow-sm flex items-center gap-1.5 font-label-caps"
                               >
                                  {opt} <ArrowRight size={10} />
                               </motion.button>
                            ))}
                         </div>
                      )}
                   </motion.div>
                );
             })}
             
             {isTyping && (
                <motion.div 
                   initial={{ opacity: 0, y: 8 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="flex items-center gap-2 rounded-xl bg-[#0E152B] border border-outline-variant/20 px-3 py-2.5 text-xs text-on-surface-variant tracking-wider w-fit"
                >
                   <div className="flex gap-1">
                      <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                   </div>
                   <span className="font-bold text-[8px] font-label-caps uppercase tracking-widest ml-1">Calculating</span>
                </motion.div>
             )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
       </div>

       {/* Bottom command row */}
       <form 
          onSubmit={handleSubmit} 
          className="relative z-10 bg-[#0E152B] border border-outline-variant/20 focus-within:border-primary/30 rounded-xl p-1.5 shadow-md flex items-center shrink-0"
       >
          <div className="pl-2.5 text-on-surface-variant/40 shrink-0">
             <Sparkles size={14} className="text-primary opacity-75" />
          </div>
          <input
             ref={inputRef}
             type="text"
             value={inputStr}
             onChange={(e) => setInputStr(e.target.value)}
             placeholder="Ask a financial question..."
             className="w-full bg-transparent border-none outline-none text-[12px] text-on-surface font-semibold px-3 py-2 placeholder:text-on-surface-variant/40"
          />
          <motion.button
             whileTap={{ scale: 0.95 }}
             type="submit"
             disabled={!inputStr.trim() || isTyping}
             className="w-8.5 h-8.5 rounded-lg bg-primary text-white flex items-center justify-center transition-opacity disabled:opacity-40 shrink-0 shadow-sm shadow-primary/10"
          >
             <Send size={13} strokeWidth={2.5} className="ml-0.5" />
          </motion.button>
       </form>

    </div>
  );
}
