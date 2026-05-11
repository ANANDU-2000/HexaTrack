'use client';

import React, { useState, useEffect } from 'react';
import { 
  Cloud, Zap, CheckCircle2, RefreshCcw, Settings, Link2, 
  Github, Slack, Send, HardDrive, Loader2, ShieldCheck
} from 'lucide-react';
import { hexaTrackApi } from '@/lib/api';

const AVAILABLE_APPS = [
  { id: 'Stripe', name: 'Stripe', category: 'Payments', desc: 'Automate billing collection and reconciliation sync.' },
  { id: 'Razorpay', name: 'Razorpay', category: 'Payments', desc: 'Collect domestic branch revenue feeds directly.' },
  { id: 'Slack', name: 'Slack', category: 'Communication', desc: 'Stream audit alerts and recurring reports to channels.' },
  { id: 'Gmail', name: 'Gmail / Workspace', category: 'Communication', desc: 'Deploy automated billing dispatch and notifications.' },
  { id: 'GoogleDrive', name: 'Google Drive', category: 'Storage', desc: 'Automate transactional PDF statement backups.' },
  { id: 'Dropbox', name: 'Dropbox', category: 'Storage', desc: 'Cloud repository sync for compliance archives.' },
  { id: 'OpenAI', name: 'OpenAI / ChatGPT', category: 'AI Intelligence', desc: 'Generate predictive spend heuristics and forecasts.' },
  { id: 'QuickBooks', name: 'QuickBooks', category: 'Accounting', desc: 'Transmit ledger streams directly to tax registers.' }
];

export function IntegrationsHub() {
  const [connected, setConnected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const fetchConnections = async () => {
     try {
        const res = await hexaTrackApi.owner.integrations.list();
        setConnected(res.filter(r => r.isConnected).map(r => r.provider));
     } catch (e) {
        console.error(e);
     } finally {
        setLoading(false);
     }
  };

  useEffect(() => {
     void fetchConnections();
  }, []);

  const handleConnect = async (id: string) => {
     setActing(id);
     try {
        await hexaTrackApi.owner.integrations.connect(id);
        await fetchConnections();
     } catch (e) {
        console.error(e);
     } finally {
        setActing(null);
     }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-12">
       <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
             Integrations Center
             <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] uppercase tracking-widest font-bold">API Matrix</span>
          </h1>
          <p className="text-[#9CA3AF] text-sm font-medium mt-1">Establish bridges between localized data pipelines and global cloud providers.</p>
       </div>

       <div className="bg-gradient-to-r from-blue-600/20 to-transparent border border-blue-500/20 p-6 rounded-2xl flex items-center gap-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 p-6 opacity-10"><Zap size={100} /></div>
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20">
             <ShieldCheck size={24} />
          </div>
          <div>
             <h4 className="text-white font-bold text-lg tracking-tight">Secure Bridge Environment</h4>
             <p className="text-[#9CA3AF] text-xs font-medium max-w-md leading-relaxed">All API keys and credentials encrypted using hardware isolation modules (HSM) within persistent Vault architecture.</p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">
          {AVAILABLE_APPS.map((app) => {
             const isConn = connected.includes(app.id);
             const isBusy = acting === app.id;
             return (
                <div key={app.id} className="bg-[#111827] border border-white/[0.05] rounded-2xl p-6 relative group hover:border-white/[0.12] transition-all flex flex-col justify-between min-h-[200px]">
                   <div>
                      <div className="flex justify-between items-start">
                         <div className="w-12 h-12 bg-gradient-to-br from-white/[0.04] to-transparent rounded-xl border border-white/[0.08] flex items-center justify-center text-white">
                            {getIconForApp(app.id)}
                         </div>
                         {isConn ? (
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] flex items-center gap-1 bg-[#22C55E]/10 px-2 py-1 rounded-md border border-[#22C55E]/20">
                               <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"/> Active
                            </span>
                         ) : (
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] bg-white/[0.03] px-2 py-1 rounded-md border border-white/[0.05]">Offline</span>
                         )}
                      </div>
                      <h3 className="text-white font-bold text-lg mt-4 tracking-tight">{app.name}</h3>
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{app.category}</p>
                      <p className="text-xs text-[#9CA3AF] mt-2.5 leading-relaxed font-medium">{app.desc}</p>
                   </div>

                   <div className="mt-6 pt-4 border-t border-white/[0.04]">
                      {isConn ? (
                         <div className="flex items-center gap-2">
                            <button className="flex-1 h-10 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white text-xs font-bold hover:bg-white/[0.06] transition-all flex items-center justify-center gap-2">
                               <Settings size={14} /> Configure
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center bg-white/[0.03] border border-white/[0.06] rounded-lg text-[#9CA3AF] hover:text-white"><RefreshCcw size={14}/></button>
                         </div>
                      ) : (
                         <button 
                           onClick={() => handleConnect(app.id)} 
                           disabled={isBusy}
                           className="w-full h-10 bg-[#4F8CFF] text-white rounded-lg text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 hover:brightness-110 disabled:opacity-50 transition-all"
                         >
                           {isBusy ? <Loader2 className="animate-spin" size={14}/> : <><Link2 size={14}/> Authorize Bridge</>}
                         </button>
                      )}
                   </div>
                </div>
             );
          })}
       </div>
    </div>
  );
}

function getIconForApp(id: string) {
   if (id === 'GoogleDrive') return <HardDrive size={20} />;
   if (id === 'Slack') return <Slack size={20} />;
   if (id === 'Gmail') return <Send size={20} />;
   if (id === 'OpenAI') return <Zap size={20} />;
   return <Cloud size={20} />;
}
