'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CornerDownLeft, Search } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

export type AdminCommandItem = {
  id: string;
  label: string;
  hint?: string;
  keywords?: string[];
  icon?: LucideIcon;
  onSelect: () => void;
};

type AdminCommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands: AdminCommandItem[];
};

export function AdminCommandPalette({ open, onOpenChange, commands }: AdminCommandPaletteProps) {
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) setQ('');
  }, [open]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        onOpenChange(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return commands;
    return commands.filter((c) => {
      if (c.label.toLowerCase().includes(s)) return true;
      return c.keywords?.some((k) => k.toLowerCase().includes(s));
    });
  }, [commands, q]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[299] bg-black/60 backdrop-blur-sm"
            aria-label="Close command palette"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -12, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -12, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="fixed left-1/2 top-[max(12px,env(safe-area-inset-top),8vh)] z-[300] w-[min(560px,calc(100vw-16px))] max-h-[min(560px,calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-24px))] overflow-hidden rounded-3xl border border-[rgba(255,255,255,0.1)] bg-[#121A22]/95 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
          >
            <div className="flex min-w-0 items-center gap-2 border-b border-[rgba(255,255,255,0.06)] px-3 py-3 sm:gap-3 sm:px-4">
              <Search className="h-5 w-5 shrink-0 text-[#8B9BB4]" aria-hidden />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm text-[#F5F7FA] outline-none placeholder:text-[#8B9BB4]"
                placeholder="Search pages, actions…"
                autoComplete="off"
                autoCorrect="off"
              />
              <kbd className="hidden shrink-0 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#0B1015] px-2 py-1 font-mono text-[10px] text-[#8B9BB4] sm:inline">
                Esc
              </kbd>
            </div>
            <ul
              className="max-h-[min(400px,calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-140px))] overflow-y-auto overscroll-contain py-2"
              role="listbox"
            >
              {filtered.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-[#8B9BB4]">No matches</li>
              ) : (
                filtered.map((c) => {
                  const Icon = c.icon;
                  return (
                    <li key={c.id} role="option">
                      <button
                        type="button"
                        onClick={() => {
                          c.onSelect();
                          onOpenChange(false);
                        }}
                        className="group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.06]"
                      >
                        {Icon ? (
                          <Icon className="h-4 w-4 shrink-0 text-[#4F8CFF] opacity-90" aria-hidden />
                        ) : (
                          <CornerDownLeft className="h-4 w-4 shrink-0 text-[#8B9BB4] opacity-0 group-hover:opacity-70" aria-hidden />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-[#F5F7FA]">{c.label}</p>
                          {c.hint ? (
                            <p className="truncate text-xs text-[#8B9BB4]">{c.hint}</p>
                          ) : null}
                        </div>
                        <CornerDownLeft
                          className="h-4 w-4 shrink-0 text-[#8B9BB4] opacity-0 transition-opacity group-hover:opacity-60"
                          aria-hidden
                        />
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
