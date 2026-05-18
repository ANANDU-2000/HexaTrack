'use client';

import { Key, Loader2, X, Check, Copy } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { ApiError, hexaTrackApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export function ResetPasswordModal({ open, onOpenChange, userId, userEmail }: { open: boolean; onOpenChange: (open: boolean) => void; userId: string | null; userEmail: string | null }) {
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    setPassword('');
    setSubmitting(false);
    setSuccess(false);
    setApiError(null);
    setCopied(false);
  }, [open]);

  const activeUserId = userId;
  if (!open || !activeUserId) return null;

  const handleCopy = () => {
    void navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password.length < 8) {
      setApiError('Password must be at least 8 characters.');
      return;
    }

    setSubmitting(true);
    setApiError(null);
    try {
      await hexaTrackApi.admin.resetPassword(activeUserId!, password);
      setSuccess(true);
    } catch (error) {
      setApiError(error instanceof ApiError ? error.message : 'Failed to reset password.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-[#0E152B] border border-white/[0.06] rounded-[28px] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)] relative flex flex-col"
      >
        <div className="p-6 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-[#4F8CFF]/10 flex items-center justify-center text-[#4F8CFF]">
                <Key size={20} />
             </div>
             <div>
               <h2 className="font-bold text-[#E1E2EC] tracking-tight text-lg">Reset Password</h2>
               <p className="text-xs text-[#C2C6D6] font-medium mt-0.5">{userEmail}</p>
             </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="p-2 hover:bg-white/[0.05] rounded-xl transition text-[#C2C6D6]">
            <X size={20}/>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-2">
                  <Check size={24} />
                </div>
                <h3 className="font-bold text-[#E1E2EC]">Password Reset Successful</h3>
                <p className="text-xs text-[#8B9BB4] max-w-xs mx-auto leading-relaxed">
                  The password has been updated in the database. Ensure you convey these credentials securely.
                </p>
                <div className="bg-[#080C1A] border border-white/[0.04] p-4 rounded-xl flex items-center justify-between max-w-sm mx-auto">
                  <span className="font-mono text-sm font-bold text-[#1FD18B] truncate mr-2">{password}</span>
                  <button type="button" onClick={handleCopy} className="p-1.5 hover:bg-white/[0.05] rounded-lg transition text-[#8B9BB4] hover:text-[#E1E2EC] shrink-0">
                    {copied ? <Check size={14} className="text-[#1FD18B]" /> : <Copy size={14} />}
                  </button>
                </div>
                <button onClick={() => onOpenChange(false)} className="h-11 w-full bg-[#4F8CFF] text-white rounded-xl font-bold text-sm shadow-md transition hover:brightness-105">
                  Close Overlay
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#C2C6D6] uppercase tracking-wider">New Password</label>
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter at least 8 characters"
                    className="w-full h-11 px-4 bg-[#0B1015] border border-white/[0.05] rounded-xl text-sm font-medium text-[#E1E2EC] outline-none focus:border-[#4F8CFF]/40"
                  />
                </div>

                {apiError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs font-bold text-red-400 flex gap-2 items-center">
                    <X size={14} />
                    {apiError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || password.length < 8}
                  className="h-11 w-full bg-[#FF5C75] text-white rounded-xl font-bold text-sm shadow-[0_8px_20px_-5px_rgba(255,92,117,0.25)] flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Confirm Reset'}
                </button>
              </form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
