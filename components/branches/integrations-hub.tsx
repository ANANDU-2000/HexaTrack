'use client';

import React, { useState, useEffect } from 'react';
import { 
  Cloud, Zap, RefreshCcw, Settings, Link2, 
  Slack, Send, HardDrive, Loader2, ShieldCheck
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

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-on-surface-variant select-none animate-pulse font-sans">
         <Loader2 className="animate-spin h-5 w-5 mr-3 text-cyan" />
         <span className="text-[10px] font-black uppercase font-label-caps tracking-widest">Querying API Matrix...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-16 font-sans">
       <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_6px_#10B981]" />
             <span className="text-[10px] font-black font-label-caps tracking-widest text-cyan uppercase">Synchronous Subsystem</span>
          </div>
          <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">Integrations Cluster</h1>
          <p className="text-on-surface-variant text-[13px] font-medium mt-1 tracking-wide">Establish zero-latency bridges between localized data pipelines and trusted cloud endpoints.</p>
       </div>

       <div className="bg-gradient-to-r from-cyan/10 via-cyan/[0.02] to-transparent border border-cyan/20 p-6 rounded-[24px] flex flex-col sm:flex-row sm:items-center gap-4.5 relative overflow-hidden shadow-md">
          <div className="absolute -right-6 -top-6 opacity-[0.03] pointer-events-none"><Zap size={160} className="text-cyan" /></div>
          <div className="w-12 h-12 bg-[#0E152B] rounded-2xl flex items-center justify-center text-cyan border border-cyan/15 shadow-inner shrink-0">
             <ShieldCheck size={22} className="drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
          </div>
          <div className="min-w-0">
             <h4 className="text-on-surface font-extrabold text-base tracking-wide">Encrypted Bridge Pipeline</h4>
             <p className="text-on-surface-variant text-[11px] font-medium mt-0.5 leading-relaxed tracking-wide max-w-xl">All credentials, keys, and transmission vectors are isolated within direct hardware HSM architecture for persistent vaulted security.</p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
          {AVAILABLE_APPS.map((app) => {
             const isConn = connected.includes(app.id);
             const isBusy = acting === app.id;
             return (
                <div key={app.id} className="bg-[#0E152B]/40 border border-white/[0.05] rounded-[24px] p-6 relative group transition-all flex flex-col justify-between min-h-[230px] shadow-sm hover:border-cyan/15 hover:bg-[#0E152B]/60 backdrop-blur-md">
                   <div>
                      <div className="flex justify-between items-start">
                         <div className="w-12 h-12 bg-[#0E152B] rounded-2xl border border-white/[0.04] flex items-center justify-center text-cyan shadow-inner group-hover:scale-105 transition-transform">
                            {getIconForApp(app.id)}
                         </div>
                         {isConn ? (
                            <span className="text-[9px] font-black uppercase font-label-caps tracking-widest text-emerald flex items-center gap-1.5 bg-emerald/5 px-3 py-1 rounded-full border border-emerald/20 shadow-inner">
                               <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse shadow-[0_0_6px_#10B981]"/> ACTIVE
                            </span>
                         ) : (
                            <span className="text-[9px] font-black uppercase font-label-caps tracking-widest text-on-surface-variant/60 bg-white/[0.02] px-3 py-1 rounded-full border border-white/[0.04]">OFFLINE</span>
                         )}
                      </div>
                      <h3 className="text-on-surface font-extrabold text-base mt-5 tracking-wide font-sans">{app.name}</h3>
                      <p className="text-[9px] font-black text-cyan uppercase font-label-caps tracking-widest mt-1 select-none">{app.category}</p>
                      <p className="text-[11px] text-on-surface-variant font-medium mt-3 leading-relaxed tracking-wide">{app.desc}</p>
                   </div>

                   <div className="mt-6 pt-4 border-t border-white/[0.04]">
                      {isConn ? (
                         <div className="flex items-center gap-2">
                            <button className="flex-1 h-10.5 bg-[#0E152B] border border-white/[0.04] rounded-xl text-on-surface text-xs font-extrabold hover:border-cyan/20 hover:text-cyan transition-all flex items-center justify-center gap-2 shadow-sm font-sans active:scale-98">
                               <Settings size={13} /> Configure
                            </button>
                            <button className="w-10.5 h-10.5 flex items-center justify-center bg-[#0E152B] border border-white/[0.04] rounded-xl text-on-surface-variant hover:text-cyan hover:border-cyan/20 shadow-sm transition-all active:scale-95" title="Recalibrate">
                               <RefreshCcw size={13}/>
                            </button>
                         </div>
                      ) : (
                         <button 
                           onClick={() => handleConnect(app.id)} 
                           disabled={isBusy}
                           className="w-full h-10.5 bg-cyan text-black rounded-full text-[10px] font-black font-label-caps tracking-widest uppercase flex items-center justify-center gap-2 shadow-md hover:brightness-105 disabled:opacity-50 active:scale-[0.98] transition-all"
                         >
                           {isBusy ? <Loader2 className="animate-spin" size={14}/> : <><Link2 size={13}/> Authorize Pipeline</>}
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
   if (id === 'GoogleDrive') return <HardDrive size={18} />;
   if (id === 'Slack') return <Slack size={18} />;
   if (id === 'Gmail') return <Send size={18} />;
   if (id === 'OpenAI') return <Zap size={18} />;
   return <Cloud size={18} />;
}

