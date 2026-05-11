'use client';

import { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { hexaTrackApi } from '@/lib/api';
import type { AdminUserListItem, LightBranch } from '@/lib/types';
import { BranchBadge } from '@/components/branches/branch-badge';

export function ReassignBranchModal({
  staff,
  branches,
  onClose,
  onSaved,
}: {
  staff: AdminUserListItem;
  branches: LightBranch[];
  onClose: () => void;
  onSaved: (staff: AdminUserListItem) => void;
}) {
  const [branchId, setBranchId] = useState(staff.branchId ?? '');
  const [department, setDepartment] = useState(staff.department ?? 'Finance');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setBranchId(staff.branchId ?? '');
    setDepartment(staff.department ?? 'Finance');
  }, [staff]);

  async function save() {
    setError(null);
    if (!branchId) {
      setError('Choose a branch before saving.');
      return;
    }

    const previous = staff;
    const selected = branches.find((branch) => branch.id === branchId);
    onSaved({ ...staff, branchId, branchName: selected?.name ?? staff.branchName, department });
    setSaving(true);
    try {
      const updated = await hexaTrackApi.staff.reassign(staff.id, { branchId, department });
      onSaved(updated);
      onClose();
    } catch (err) {
      onSaved(previous);
      setError(err instanceof Error ? err.message : 'Could not reassign staff.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm md:items-center md:p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-full max-w-lg rounded-t-[32px] border border-white/[0.08] bg-[#0B1015] p-6 shadow-2xl md:rounded-[32px]"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#8B9BB4]">Change branch</p>
            <h3 className="mt-1 text-xl font-black text-[#F5F7FA]">{staff.displayName}</h3>
            <div className="mt-3">
              <BranchBadge name={staff.branchName} />
            </div>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.05] text-[#8B9BB4]">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-[#8B9BB4]">Assigned branch</label>
            <select
              value={branchId}
              onChange={(event) => setBranchId(event.target.value)}
              className="h-12 w-full rounded-xl border border-white/[0.06] bg-[#121A22] px-3 text-sm font-semibold text-[#F5F7FA] outline-none focus:border-[#4F8CFF]/50"
            >
              <option value="">Select branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-[#8B9BB4]">Department</label>
            <input
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              className="h-12 w-full rounded-xl border border-white/[0.06] bg-[#121A22] px-4 text-sm font-semibold text-[#F5F7FA] outline-none focus:border-[#4F8CFF]/50"
            />
          </div>

          {error ? <p className="rounded-xl border border-[#FF5C75]/25 bg-[#FF5C75]/10 p-3 text-xs font-bold text-[#FF5C75]">{error}</p> : null}
        </div>

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="h-12 flex-1 rounded-[18px] border border-white/[0.08] text-sm font-bold text-[#F5F7FA]">
            Cancel
          </button>
          <button type="button" onClick={save} disabled={saving} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[18px] bg-[#4F8CFF] text-sm font-bold text-white disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}
