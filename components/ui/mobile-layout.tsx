'use client';

import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import React from 'react';

type AppScreenProps = {
  children: React.ReactNode;
  className?: string;
};

export function AppScreen({ children, className = '' }: AppScreenProps) {
  return <div className={`mx-auto w-full max-w-5xl space-y-4 pb-4 sm:space-y-5 ${className}`}>{children}</div>;
}

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  labelledBy: string;
};

export function BottomSheet({ open, onClose, children, labelledBy }: BottomSheetProps) {
  
  // Handle the swipe down velocity threshold
  function handleDragEnd(_: unknown, info: PanInfo) {
    const threshold = 120;
    const velocityThreshold = 500;
    if (info.offset.y > threshold || info.velocity.y > velocityThreshold) {
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[99] bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Panel Container */}
          <div 
            className="fixed inset-0 z-[100] flex items-end justify-center overflow-hidden pointer-events-none pt-12 sm:items-center sm:pt-0"
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
          >
            <motion.div
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ 
                type: 'spring', 
                damping: 32, 
                stiffness: 400,
                mass: 0.8 
              }}
              className="pointer-events-auto relative flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-[32px] border border-white/[0.08] bg-[#121A22] shadow-[0_-12px_40px_rgba(0,0,0,0.4)] sm:rounded-[32px]"
            >
              {/* Visual Drag Handle */}
              <div className="absolute top-0 left-0 right-0 flex justify-center pt-3 pb-1 shrink-0 cursor-grab active:cursor-grabbing z-20">
                 <div className="h-1.5 w-12 rounded-full bg-white/20" />
              </div>
              
              {/* Component Payload */}
              <div className="flex flex-col flex-1 overflow-hidden pt-4">
                 {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
