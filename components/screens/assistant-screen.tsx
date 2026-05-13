'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, TrendingUp, AlertTriangle, Cpu, ArrowRight, Check, Bot } from 'lucide-react';
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
      text: "Command accepted. I've audited your workspace aggregates. Liquidity velocity remains stable, but I've mapped two operational recommendations.",
      timestamp: new Date(),
      insight: {
        type: 'risk',
        title: 'Recurring Outflow Escalation',
        data: 'Two subscription node tiers increased rates by 12% this cycle. Potential burn risk.'
      },
      options: ['Simulate Burn Rate', 'Optimize Subscriptions', 'Net Position Projection']
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
    
    // Mock advanced conversational CFO triggers
    setTimeout(() => {
      let resText = "Processing node parameters. Simulation matrix complete.";
      let insightObj: Message['insight'] | undefined;
      let resOptions: string[] = ['Generate PDF Report', 'Return to Shell'];

      const lower = query.toLowerCase();
      if (lower.includes('burn') || lower.includes('risk')) {
        resText = "Burn rates simulated. Current cash runway parameters are sustained for 18 months at your average monthly cadence of " + money(report.expense) + ".";
        insightObj = {
          type: 'trend',
          title: 'Liquidity Longevity',
          data: 'Active cash reserves safely secure 548 operating cycles.'
        };
        resOptions = ['Refine Outflow Limits', 'Simulate Stress Event'];
      } else if (lower.includes('optimize') || lower.includes('sub')) {
        resText = "Identified three dormant service channels. Pruning these clusters reduces overall expenditures by approximately 8.4% next cycle.";
        insightObj = {
          type: 'action',
          title: 'Operational Pruning',
          data: 'Pruning active channels will recover $240.00 monthly.'
        };
        resOptions = ['Approve Pruning', 'Review Channels'];
      } else {
        resText = "Global telemetry shows a positive capital trajectory. Workspace consolidated capital nets " + money(report.net) + " over this interval period.";
        insightObj = {
          type: 'trend',
          title: 'Net Trajectory Delta',
          data: 'Historical inflows outpace outgoings by 14.2%.'
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
    }, 1500);
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
    <div className="flex flex-col h-[calc(100dvh-7.5rem)] lg:h-[calc(100vh-5rem)] pb-20 lg:pb-4 pt-3 select-none relative overflow-hidden font-sans max-w-3xl mx-auto px-4">
       
       {/* Kinetic Atmospheric Aura */}
       <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan/10 blur-[100px] rounded-full animate-pulse" />
       </div>

       {/* Persistent Digital Brain Capsule Head */}
       <header className="relative z-10 flex items-center justify-between bg-[#111827]/60 border border-white/[0.05] rounded-[24px] p-4 backdrop-blur-md shadow-md mb-4 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan to-[#0369A1] flex items-center justify-center text-black shadow-[0_0_12px_rgba(6,182,212,0.3)] shrink-0 relative">
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-2xl" />
                <Bot size={20} strokeWidth={2.2} className="relative z-10 text-white" />
             </div>
             <div>
                <h2 className="text-[13px] font-extrabold text-on-surface tracking-wide leading-none mb-1">CFO Neural Agent</h2>
                <div className="flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald shadow-[0_0_6px_#10B981] animate-ping" />
                   <p className="text-[9px] font-black font-label-caps uppercase tracking-widest text-cyan">Telemetry Synced</p>
                </div>
             </div>
          </div>
          
          <span className="text-[8px] font-bold font-mono bg-[#111827] border border-cyan/20 px-2 py-0.5 rounded text-cyan tracking-widest uppercase shadow-inner">
             L7-Core
          </span>
       </header>

       {/* Chronological Dynamic Chat Matrix Feed */}
       <div className="flex-grow overflow-y-auto hide-scrollbar relative z-10 space-y-5 px-1 mb-4 flex flex-col">
          <div className="flex-grow" /> {/* Push to bottom container */}

          <AnimatePresence initial={false}>
             {messages.map((msg) => {
                const isAi = msg.sender === 'ai';
                
                return (
                   <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className={`flex w-full flex-col ${isAi ? 'items-start' : 'items-end'}`}
                   >
                      <div className={`max-w-[88%] flex flex-col gap-2 rounded-[22px] p-4 ${
                         isAi 
                           ? 'bg-[#111827]/40 border border-white/[0.04] rounded-tl-md text-on-surface shadow-inner backdrop-blur-sm' 
                           : 'bg-cyan text-black rounded-tr-md font-semibold tracking-wide shadow-lg shadow-cyan/10'
                      }`}>
                         <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                         
                         {isAi && msg.insight && (
                            <div className="mt-2 bg-[#111827]/80 border border-white/[0.05] rounded-xl p-3 flex items-start gap-3 shadow-inner select-none">
                               <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                  msg.insight.type === 'risk' 
                                    ? 'bg-danger/10 text-danger border border-danger/20' 
                                    : msg.insight.type === 'action' 
                                      ? 'bg-indigo/10 text-[#A5B4FC] border border-indigo/20' 
                                      : 'bg-emerald/10 text-emerald border border-emerald/20'
                               }`}>
                                  {msg.insight.type === 'risk' ? <AlertTriangle size={15} /> : msg.insight.type === 'action' ? <Cpu size={15} /> : <TrendingUp size={15} />}
                               </div>
                               <div>
                                  <p className="text-[9px] font-black font-label-caps tracking-wider uppercase text-on-surface-variant mb-0.5">{msg.insight.title}</p>
                                  <p className="text-[11px] text-on-surface font-bold leading-tight">{msg.insight.data}</p>
                               </div>
                            </div>
                         )}
                      </div>

                      {/* Action Choices Layer */}
                      {isAi && msg.options && msg.options.length > 0 && (
                         <div className="flex flex-wrap gap-2 mt-2.5 max-w-[90%] select-none">
                            {msg.options.map((opt, idx) => (
                               <motion.button
                                  key={idx}
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => handleOptionClick(opt)}
                                  className="px-3 py-1.5 bg-[#111827]/60 hover:bg-[#111827]/90 border border-white/[0.04] hover:border-cyan/20 text-on-surface rounded-xl text-[10px] font-black tracking-wide uppercase transition-all shadow-sm flex items-center gap-1.5 font-label-caps"
                               >
                                  {opt} <ArrowRight size={10} className="text-cyan" />
                               </motion.button>
                            ))}
                         </div>
                      )}
                   </motion.div>
                );
             })}
             
             {isTyping && (
                <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="flex items-center gap-2 rounded-[20px] bg-[#111827]/30 border border-white/[0.03] px-4 py-3 text-xs text-on-surface-variant tracking-widest font-label-caps w-fit"
                >
                   <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
                   </div>
                   <span className="font-black text-[9px] uppercase tracking-[0.2em] text-cyan ml-1">Computing</span>
                </motion.div>
             )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
       </div>

       {/* Bottom Command Capsule Input Field */}
       <form 
          onSubmit={handleSubmit} 
          className="relative z-10 bg-[#111827]/70 border border-white/[0.06] focus-within:border-cyan/30 rounded-[26px] p-2 shadow-2xl flex items-center backdrop-blur-xl shrink-0"
       >
          <div className="pl-3.5 text-on-surface-variant/50 shrink-0">
             <Sparkles size={16} className="text-cyan opacity-70" />
          </div>
          <input
             ref={inputRef}
             type="text"
             value={inputStr}
             onChange={(e) => setInputStr(e.target.value)}
             placeholder="Initiate predictive CFO query..."
             className="w-full bg-transparent border-none outline-none text-[13px] text-on-surface font-semibold px-3.5 py-2 placeholder:text-on-surface-variant/40"
          />
          <motion.button
             whileTap={{ scale: 0.92 }}
             type="submit"
             disabled={!inputStr.trim() || isTyping}
             className="w-10 h-10 rounded-full bg-cyan text-black flex items-center justify-center shadow-lg transition-opacity disabled:opacity-40 shrink-0"
          >
             <Send size={15} strokeWidth={2.6} className="ml-0.5" />
          </motion.button>
       </form>

    </div>
  );
}
