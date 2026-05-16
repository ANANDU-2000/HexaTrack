'use client';

import React from 'react';
import { ShieldCheck, Eye, PenSquare, Trash2, Check, UserCog, GitBranch, FolderOpen, BarChart3, Download, Receipt, RefreshCw, ArrowLeftRight, Building2, Settings, ClipboardCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const PERMISSIONS = [
  { key: 'view_dashboard', label: 'View Dashboard', icon: Eye, group: 'Core' },
  { key: 'add_expense', label: 'Add Expense', icon: PenSquare, group: 'Transactions' },
  { key: 'edit_expense', label: 'Edit Expense', icon: PenSquare, group: 'Transactions' },
  { key: 'delete_expense', label: 'Delete Expense', icon: Trash2, group: 'Transactions' },
  { key: 'add_income', label: 'Add Income', icon: PenSquare, group: 'Transactions' },
  { key: 'edit_income', label: 'Edit Income', icon: PenSquare, group: 'Transactions' },
  { key: 'delete_income', label: 'Delete Income', icon: Trash2, group: 'Transactions' },
  { key: 'approve_transaction', label: 'Approve Transaction', icon: Check, group: 'Approvals' },
  { key: 'manage_staff', label: 'Manage Staff', icon: UserCog, group: 'Management' },
  { key: 'manage_branches', label: 'Manage Branches', icon: GitBranch, group: 'Management' },
  { key: 'manage_categories', label: 'Manage Categories', icon: FolderOpen, group: 'Management' },
  { key: 'export_reports', label: 'Export Reports', icon: Download, group: 'Reports' },
  { key: 'view_analytics', label: 'View Analytics', icon: BarChart3, group: 'Reports' },
  { key: 'manage_accounts', label: 'Manage Accounts', icon: Building2, group: 'Finance' },
  { key: 'manage_settings', label: 'Manage Settings', icon: Settings, group: 'Admin' },
  { key: 'manage_recurring', label: 'Manage Recurring', icon: RefreshCw, group: 'Finance' },
  { key: 'manage_transfers', label: 'Manage Transfers', icon: ArrowLeftRight, group: 'Finance' },
  { key: 'view_all_branches', label: 'View All Branches', icon: Eye, group: 'Branches' },
  { key: 'manage_approvals', label: 'Manage Approvals', icon: ClipboardCheck, group: 'Approvals' },
  { key: 'upload_receipts', label: 'Upload Receipts', icon: Receipt, group: 'Documents' },
];

const ROLES = [
  { name: 'Owner', color: '#F59E0B', permissions: PERMISSIONS.map(p => p.key) },
  { name: 'Staff', color: '#3B82F6', permissions: ['view_dashboard', 'add_expense', 'add_income', 'upload_receipts'] },
  { name: 'Viewer', color: '#6B7280', permissions: ['view_dashboard', 'view_analytics'] },
];

const groups = Array.from(new Set(PERMISSIONS.map(p => p.group)));

export default function PermissionsPage() {
  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      <div>
        <p className="text-[10px] font-bold text-violet-400 uppercase tracking-[0.2em] mb-1">Access Control</p>
        <h1 className="text-2xl font-bold text-white tracking-tight">Permission Matrix</h1>
        <p className="text-sm text-gray-500 mt-1">Configure granular permissions for each role</p>
      </div>

      {/* Permission Matrix */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0E1425] overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-white/[0.04]">
              <th className="text-left px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-[250px]">Permission</th>
              {ROLES.map(r => (
                <th key={r.name} className="text-center px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: r.color }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                    {r.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map(group => (
              <React.Fragment key={group}>
                <tr>
                  <td colSpan={ROLES.length + 1} className="px-5 pt-4 pb-2">
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.15em]">{group}</p>
                  </td>
                </tr>
                {PERMISSIONS.filter(p => p.group === group).map((perm, i) => {
                  const Icon = perm.icon;
                  return (
                    <motion.tr key={perm.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-white/[0.03] hover:bg-white/[0.01]">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <Icon size={14} className="text-gray-500" />
                          <span className="text-xs font-medium text-gray-300">{perm.label}</span>
                        </div>
                      </td>
                      {ROLES.map(role => {
                        const has = role.permissions.includes(perm.key);
                        return (
                          <td key={role.name} className="text-center px-4 py-3">
                            <button className={`w-7 h-7 rounded-lg flex items-center justify-center mx-auto transition-all ${has ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/[0.02] text-gray-700 hover:bg-white/[0.04]'}`}>
                              {has ? <Check size={14} /> : <span className="w-1 h-1 rounded-full bg-gray-700" />}
                            </button>
                          </td>
                        );
                      })}
                    </motion.tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
