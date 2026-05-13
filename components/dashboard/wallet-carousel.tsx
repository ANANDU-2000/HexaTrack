'use client';

import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useFinanceStore } from '@/store/finance-store';
import { money } from '@/lib/format';
import { Wallet, ArrowRight, CreditCard, Activity } from 'lucide-react';

export function WalletCarousel() {
  const accounts = useFinanceStore((s) => s.accounts);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!accounts || accounts.length === 0) {
    return (
      <div className="w-full h-44 rounded-[28px] border border-dashed border-white/[0.1] bg-[#111827]/40 flex flex-col items-center justify-center gap-3 px-6 text-center">
         <div className="w-10 h-10 rounded-2xl bg-[#111827] flex items-center justify-center text-cyan border border-cyan/10 shadow-inner">
           <Wallet size={18} />
         </div>
         <p className="text-xs text-on-surface-variant font-semibold tracking-wide">Initialize a Liquidity Node to map metrics.</p>
      </div>
    );
  }

  // Rotate active items safely
  const handleSwipe = (direction: number) => {
     let next = activeIndex + direction;
     if (next < 0) next = 0;
     if (next >= accounts.length) next = accounts.length - 1;
     setActiveIndex(next);
  };

  return (
    <div className="w-full select-none font-sans">
      {/* Carousel Header */}
      <div className="flex items-center justify-between px-1 mb-4">
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-black text-cyan tracking-[0.15em] uppercase font-label-caps">Active Nodes</span>
           <span className="px-1.5 py-0.5 rounded-md bg-cyan/10 border border-cyan/20 text-[9px] font-bold text-cyan">
             {accounts.length}
           </span>
        </div>
        <button className="flex items-center gap-1 text-[10px] font-black text-on-surface-variant/80 tracking-widest font-label-caps uppercase hover:text-cyan transition-colors outline-none">
           Matrix <ArrowRight size={11} />
        </button>
      </div>

      {/* Swiper Viewport */}
      <div className="relative h-[210px] w-full flex items-center justify-center overflow-hidden px-2">
         <AnimatePresence initial={false} mode="popLayout">
           {accounts.map((account, idx) => {
              // Stack offsets
              const offset = idx - activeIndex;
              
              // Limit visible cards to +2 stack
              if (Math.abs(offset) > 2) return null;

              // Physical layers calculations
              const isCenter = offset === 0;
              const isRight = offset > 0;
              const isLeft = offset < 0;

              // Styles mapped to stack depth
              const zIndex = 10 - Math.abs(offset);
              const xPos = offset * 160; // stack separation distance
              const scale = 1 - Math.abs(offset) * 0.08;
              const rotate = offset * 6;
              const opacity = 1 - Math.abs(offset) * 0.35;

              // Construct dynamic gradient template based on card index
              const gradients = [
                'from-[#1E293B] via-[#0F172A] to-[#020617]', // Space Black
                'from-[#0F172A] via-[#1E1B4B] to-[#030712]', // Deep Indigo
                'from-[#111827] via-[#022C22] to-[#050505]', // Emerald Matrix
                'from-[#1F2937] via-[#311111] to-[#0B0F19]', // Deep Crimson
              ];
              const activeGradient = gradients[idx % gradients.length];

              return (
                <motion.div
                  key={account.id}
                  drag="x"
                  dragElastic={0.4}
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    const threshold = 60;
                    if (info.offset.x < -threshold) handleSwipe(1);
                    if (info.offset.x > threshold) handleSwipe(-1);
                  }}
                  whileDrag={{ scale: scale * 1.02 }}
                  initial={{ opacity: 0, scale: 0.75, x: offset * 100 }}
                  animate={{
                     x: xPos,
                     scale: scale,
                     rotate: rotate,
                     opacity: opacity,
                     zIndex: zIndex
                  }}
                  exit={{ opacity: 0, scale: 0.6, x: offset * -150 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  className={`absolute w-[280px] h-[176px] rounded-[28px] bg-gradient-to-br ${activeGradient} border ${
                     isCenter ? 'border-white/[0.1] shadow-2xl shadow-black/60' : 'border-white/[0.04] shadow-lg shadow-black/40 pointer-events-none'
                  } p-6 flex flex-col justify-between overflow-hidden touch-pan-x cursor-grab active:cursor-grabbing`}
                  style={{
                     transformOrigin: 'bottom center'
                  }}
                >
                   {/* Visual Details */}
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.04),transparent_50%)] pointer-events-none" />
                   
                   <div className="flex justify-between items-start z-10">
                      <div>
                         <p className="text-[9px] font-black text-white/40 uppercase tracking-widest font-label-caps mb-0.5">{account.type}</p>
                         <h4 className="text-sm font-extrabold text-on-surface tracking-tight truncate max-w-[140px]">{account.name}</h4>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.05] backdrop-blur-md flex items-center justify-center text-cyan shadow-inner">
                         <CreditCard size={15} />
                      </div>
                   </div>

                   <div className="mt-auto z-10">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] font-label-caps mb-1">Net Available</p>
                      <div className="flex items-baseline gap-1.5">
                         <span className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">{money(account.balance)}</span>
                         <span className="text-[10px] font-mono-data text-cyan font-bold tracking-wide">{account.currency}</span>
                      </div>
                   </div>

                   {/* Footer bar */}
                   <div className="absolute bottom-0 inset-x-0 h-2 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
                </motion.div>
              );
           })}
         </AnimatePresence>
      </div>

      {/* Indicator Dots */}
      <div className="flex justify-center items-center gap-1.5 mt-2">
         {accounts.map((_, i) => (
           <button
             key={i}
             onClick={() => setActiveIndex(i)}
             className={`h-1.5 rounded-full transition-all duration-300 ${
               activeIndex === i ? 'w-4 bg-cyan shadow-[0_0_6px_rgba(6,182,212,0.6)]' : 'w-1.5 bg-white/10 hover:bg-white/20'
             }`}
           />
         ))}
      </div>
    </div>
  );
}
