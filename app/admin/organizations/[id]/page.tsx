'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, ChevronLeft, GitBranch, ShieldCheck, Users, TrendingUp,
  Activity, Calendar, CreditCard, Settings, ArrowUpRight, Plus,
  Loader2, CheckCircle2, AlertCircle, Globe, Briefcase, Mail, Lock
} from 'lucide-react';
import { hexaTrackApi } from '@/lib/api';
import { AdminOrganizationDetailsDto } from '@/lib/types';
import { CreateBranchModal, AddOwnerModal, AddStaffModal } from '@/components/admin/organizations-manager';
import { BranchBadge } from '@/components/branches/branch-badge';
import { OrganizationNavigationHeader } from '@/components/ui/navigation';

export default function OrganizationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<AdminOrganizationDetailsDto | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'branches' | 'owners' | 'staff'>('overview');
  const [activeModal, setActiveModal] = useState<'branch' | 'owner' | 'staff' | null>(null);

  const loadDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await hexaTrackApi.admin.getOrganizationDetails(id);
      setDetails(res);
    } catch (err) {
      console.error('Failed to load details:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadDetails();
  }, [loadDetails]);

  if (loading && !details) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1015] text-[#8B9BB4]">
         <div className="flex flex-col items-center gap-3">
           <Loader2 className="animate-spin text-[#4F8CFF]" size={32} />
           <p className="font-medium text-sm">Initiating Core Drill-down...</p>
         </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B1015] text-white gap-4">
         <AlertCircle size={48} className="text-red-500" />
         <h1 className="text-xl font-bold">Organization Node Offline</h1>
         <button onClick={() => router.back()} className="text-[#4F8CFF] text-sm font-bold">← Return to Registry</button>
      </div>
    );
  }

  const organizationListWrapper = [{ id: details.info.id, name: details.info.name }] as any;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'branches', label: 'Branches', icon: GitBranch, count: details.branches.length },
    { id: 'owners', label: 'Owners', icon: ShieldCheck, count: details.owners.length },
    { id: 'staff', label: 'Staff List', icon: Users, count: details.staff.length },
  ];

  return (
    <div className="min-h-screen bg-[#0B1015] pb-20">
      {/* Top Persistent Header */}
      <OrganizationNavigationHeader
        title={details.info.name}
        iconLetter={details.info.name.charAt(0)}
        fallbackHref="/admin/organizations"
        breadcrumbs={[
          { label: 'Registry', href: '/admin/organizations' },
          { label: details.info.name, href: `/admin/organizations/${details.info.id}` }
        ]}
        actions={
          <>
            <button onClick={() => setActiveModal('branch')} className="h-9 px-3.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-xs font-bold text-white hover:bg-white/[0.08] flex items-center gap-2 transition-all whitespace-nowrap">
              <GitBranch size={13} /> + Branch
            </button>
            <button onClick={() => setActiveModal('owner')} className="h-9 px-3.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-xs font-bold text-white hover:bg-white/[0.08] flex items-center gap-2 transition-all whitespace-nowrap">
              <ShieldCheck size={13} /> + Owner
            </button>
            <button onClick={() => setActiveModal('staff')} className="h-9 px-4 bg-[#4F8CFF] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all whitespace-nowrap">
              <Plus size={14} /> Add Staff
            </button>
          </>
        }
      />

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Profile Block */}
        <div className="relative bg-[#121A22] border border-white/[0.05] rounded-3xl p-6 overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-[#4F8CFF] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
           <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
              <div className="flex gap-5">
                 <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 rounded-3xl flex items-center justify-center text-3xl font-black text-white shadow-xl border border-white/10">
                   {details.info.name.substring(0,2).toUpperCase()}
                 </div>
                 <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                      {details.info.name}
                      <span className="px-2.5 py-0.5 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        {details.info.plan}
                      </span>
                    </h1>
                    <p className="text-[#8B9BB4] text-sm font-medium mt-1">Registered via /org/{details.info.slug || 'direct'}</p>
                    
                    <div className="flex items-center gap-4 mt-4">
                       <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                         <Globe size={14} className="text-[#8B9BB4]"/> {details.currency} Operations
                       </div>
                       <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                         <Calendar size={14} className="text-[#8B9BB4]"/> Created {new Date(details.info.createdAt).toLocaleDateString()}
                       </div>
                       <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/> Active Cluster
                       </div>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 flex flex-col justify-center">
                    <div className="text-[10px] font-bold text-[#8B9BB4] uppercase tracking-widest mb-0.5">Estimated MRR</div>
                    <div className="text-2xl font-black text-white">${details.info.estimatedMrr.toLocaleString()}</div>
                 </div>
                 <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 flex flex-col justify-center">
                    <div className="text-[10px] font-bold text-[#8B9BB4] uppercase tracking-widest mb-0.5">Operational State</div>
                    <div className="text-xl font-bold text-emerald-400">HEALTHY</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-white/[0.06] gap-8">
           {tabs.map((t) => (
             <button
               key={t.id}
               onClick={() => setActiveTab(t.id as any)}
               className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all relative ${
                 activeTab === t.id ? 'text-white border-[#4F8CFF]' : 'text-[#8B9BB4] border-transparent hover:text-white'
               }`}
             >
               <t.icon size={16} />
               {t.label}
               {t.count !== undefined && (
                 <span className={`px-1.5 py-0.5 text-[10px] rounded-md font-bold ${activeTab === t.id ? 'bg-[#4F8CFF] text-white' : 'bg-white/[0.08] text-[#8B9BB4]'}`}>
                   {t.count}
                 </span>
               )}
             </button>
           ))}
        </div>

        {/* Content Renderer */}
        <div className="min-h-[400px]">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
             >
                {activeTab === 'overview' && renderOverview(details)}
                {activeTab === 'branches' && renderBranches(details)}
                {activeTab === 'owners' && renderOwners(details)}
                {activeTab === 'staff' && renderStaff(details)}
             </motion.div>
           </AnimatePresence>
        </div>
      </main>

      {/* Generic Creation Modals integrated dynamically */}
      <AnimatePresence>
         {activeModal === 'branch' && (
           <CreateBranchModal 
              onClose={() => setActiveModal(null)} 
              onComplete={() => { loadDetails(); setActiveTab('branches'); }} 
              organizations={organizationListWrapper} 
           />
         )}
         {activeModal === 'owner' && (
           <AddOwnerModal 
              onClose={() => setActiveModal(null)} 
              onComplete={() => { loadDetails(); setActiveTab('owners'); }} 
              organizations={organizationListWrapper} 
           />
         )}
         {activeModal === 'staff' && (
           <AddStaffModal 
              onClose={() => setActiveModal(null)} 
              onComplete={() => { loadDetails(); setActiveTab('staff'); }} 
              organizations={organizationListWrapper} 
           />
         )}
      </AnimatePresence>
    </div>
  );
}

/* --- PANEL RENDER HELPERS --- */

function renderOverview(details: AdminOrganizationDetailsDto) {
  const metrics = [
    { label: 'Branches Provisioned', value: details.branches.length, max: details.maxBranches, color: 'bg-purple-500' },
    { label: 'Owner Nodes Active', value: details.owners.length, max: 50, color: 'bg-blue-500' }, // generic tech limit for view
    { label: 'Human Resources (Staff)', value: details.staff.length, max: details.maxStaff, color: 'bg-emerald-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       <div className="md:col-span-2 space-y-6">
          <div className="bg-[#121A22] border border-white/[0.05] rounded-2xl p-6">
             <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Activity size={16} className="text-[#4F8CFF]" /> Licensing Constraints</h3>
             <div className="space-y-5">
                {metrics.map((m, i) => {
                  const pct = Math.min(100, (m.value / m.max) * 100);
                  return (
                    <div key={i}>
                       <div className="flex justify-between text-xs font-bold mb-1.5">
                          <span className="text-[#8B9BB4]">{m.label}</span>
                          <span className="text-white">{m.value} / {m.max}</span>
                       </div>
                       <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
                          <div className={`h-full ${m.color} rounded-full`} style={{ width: `${pct}%` }} />
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>

          <div className="bg-[#121A22] border border-white/[0.05] rounded-2xl p-6">
             <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Briefcase size={16} className="text-[#4F8CFF]" /> Active Operations Pulse</h3>
             <div className="h-48 flex items-center justify-center text-[#8B9BB4] text-xs font-medium italic border border-dashed border-white/[0.1] rounded-xl bg-white/[0.01]">
                Operational activity streams converging...
             </div>
          </div>
       </div>

       <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#1E2532] to-[#121A22] border border-white/[0.08] rounded-2xl p-6 shadow-xl">
             <CreditCard size={24} className="text-[#4F8CFF] mb-4" />
             <h3 className="font-black text-xl text-white">Subscription Core</h3>
             <p className="text-[#8B9BB4] text-xs font-medium mt-1">Institutional grade enterprise stack activated.</p>
             
             <div className="mt-6 pt-6 border-t border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between text-sm">
                   <span className="text-[#8B9BB4]">Level</span>
                   <span className="text-white font-bold font-mono uppercase">{details.info.plan}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                   <span className="text-[#8B9BB4]">Status</span>
                   <span className="text-emerald-400 font-bold">Enabled</span>
                </div>
             </div>

             <button className="w-full mt-6 h-10 bg-[#4F8CFF] text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-all">
               Modify Allocation
             </button>
          </div>
       </div>
    </div>
  );
}

function renderBranches(details: AdminOrganizationDetailsDto) {
  if (details.branches.length === 0) return renderEmpty("No Branches Defined", "Provision the first physical or digital node to track transactions locally.", GitBranch);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
       {details.branches.map((br) => (
         <div key={br.id} className="bg-[#121A22] border border-white/[0.05] rounded-2xl p-5 hover:border-white/[0.1] transition-all group relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-[0.02] text-white group-hover:scale-110 transition-transform">
               <GitBranch size={100} />
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
               <div>
                  <h4 className="font-bold text-white tracking-tight">{br.name}</h4>
                  <p className="text-[10px] font-bold text-[#8B9BB4] uppercase tracking-widest mt-0.5">{br.code || 'NO_CODE'}</p>
               </div>
               <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-md">Online</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6 relative z-10">
               <div className="bg-white/[0.03] rounded-xl p-3">
                  <div className="text-[10px] font-bold text-[#8B9BB4] uppercase mb-1">Workforce</div>
                  <div className="text-white font-bold flex items-center gap-1.5"><Users size={14} className="text-violet-400"/> {br.staffCount} Staff</div>
               </div>
               <div className="bg-white/[0.03] rounded-xl p-3">
                  <div className="text-[10px] font-bold text-[#8B9BB4] uppercase mb-1">Currency</div>
                  <div className="text-white font-bold flex items-center gap-1.5"><Globe size={14} className="text-blue-400"/> {br.currency || 'USD'}</div>
               </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/[0.05] flex justify-end gap-2 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="h-8 px-3 rounded-lg text-xs font-bold text-[#8B9BB4] bg-white/[0.05] hover:bg-white/[0.1] hover:text-white transition-all">Edit</button>
               <button className="h-8 px-3 rounded-lg text-xs font-bold text-[#4F8CFF] bg-[#4F8CFF]/10 hover:bg-[#4F8CFF] hover:text-white transition-all flex items-center gap-1">View Workspace <ArrowUpRight size={12}/></button>
            </div>
         </div>
       ))}
    </div>
  );
}

function renderOwners(details: AdminOrganizationDetailsDto) {
  if (details.owners.length === 0) return renderEmpty("No Owners Authorized", "Elevated authorization required to direct operational decisions.", ShieldCheck);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
       {details.owners.map((own) => (
         <div key={own.id} className="bg-[#121A22] border border-white/[0.05] rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
               {own.displayName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
               <div className="font-bold text-white truncate leading-tight">{own.displayName}</div>
               <div className="text-xs text-[#8B9BB4] truncate flex items-center gap-1 mt-0.5"><Mail size={10}/> {own.email}</div>
               <div className="mt-2 flex gap-1.5">
                 <span className="px-1.5 py-0.5 text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase rounded">Owner Root</span>
               </div>
            </div>
         </div>
       ))}
    </div>
  );
}

function renderStaff(details: AdminOrganizationDetailsDto) {
  if (details.staff.length === 0) return renderEmpty("Personnel Roster Empty", "Recruit and provision staff vectors to begin operating the ledger network.", Users);

  return (
    <div className="bg-[#121A22] border border-white/[0.05] rounded-2xl overflow-hidden">
       <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.02] text-[11px] font-bold uppercase tracking-widest text-[#8B9BB4] border-b border-white/[0.05]">
             <tr>
                <th className="px-6 py-4">Identified Vector</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Assigned Branch</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
             {details.staff.map((s) => (
               <tr key={s.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-[#1A232E] border border-white/[0.08] flex items-center justify-center font-bold text-[#8B9BB4] text-xs flex-shrink-0">
                        {s.displayName.charAt(0)}
                     </div>
                     <div>
                        <div className="font-bold text-white group-hover:text-[#4F8CFF] transition-colors">{s.displayName}</div>
                        <div className="text-xs text-[#8B9BB4]">{s.email}</div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold rounded-md uppercase">{s.department || 'OPERATIONS'}</span>
                  </td>
                  <td className="px-6 py-4">
                     <BranchBadge name={s.branchName} />
                  </td>
                  <td className="px-6 py-4">
                     {s.isLocked ? (
                       <span className="flex items-center gap-1.5 text-xs text-red-400 font-bold"><Lock size={12} /> Terminated</span>
                     ) : (
                       <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold"><CheckCircle2 size={12} /> Active Session</span>
                     )}
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                       <button className="h-8 px-3 bg-[#4F8CFF]/10 hover:bg-[#4F8CFF]/15 text-[#4F8CFF] text-xs font-bold rounded-lg border border-[#4F8CFF]/20 transition-all">Change Branch</button>
                       <button className="h-8 px-3 bg-white/[0.05] hover:bg-red-500/10 text-[#8B9BB4] hover:text-red-400 text-xs font-bold rounded-lg border border-transparent hover:border-red-500/20 transition-all">Suspend</button>
                     </div>
                  </td>
               </tr>
             ))}
          </tbody>
       </table>
    </div>
  );
}

function renderEmpty(title: string, desc: string, Icon: any) {
  return (
    <div className="py-20 bg-[#121A22] border border-dashed border-white/[0.1] rounded-2xl flex flex-col items-center justify-center text-center px-6">
       <div className="w-16 h-16 bg-white/[0.03] border border-white/[0.06] rounded-2xl flex items-center justify-center mb-4">
         <Icon size={28} className="text-[#8B9BB4]" />
       </div>
       <h3 className="text-lg font-bold text-white">{title}</h3>
       <p className="text-sm text-[#8B9BB4] max-w-xs mt-1">{desc}</p>
    </div>
  );
}
