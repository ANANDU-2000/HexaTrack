'use client';

import React, { useEffect, useState } from 'react';
import { hexaTrackApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import type { GlobalSettingDto } from '@/lib/types';
import { Settings, Save, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { accessToken } = useAuthStore();
  const [settings, setSettings] = useState<GlobalSettingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    hexaTrackApi.admin.globalSettings().then(s => { setSettings(s); setLoading(false); }).catch(() => setLoading(false));
  }, [accessToken]);

  const handleSave = async (key: string) => {
    setSaving(key);
    try {
      await hexaTrackApi.admin.setGlobalSetting(key, edits[key] ?? settings.find(s => s.key === key)?.value ?? '');
      const updated = await hexaTrackApi.admin.globalSettings();
      setSettings(updated);
      setEdits(e => { const n = { ...e }; delete n[key]; return n; });
    } catch {}
    setSaving(null);
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto space-y-6">
      <div>
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-1">Platform</p>
        <h1 className="text-2xl font-bold text-white tracking-tight">Global Settings</h1>
      </div>

      {loading ? (
        <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : (
        <div className="space-y-3">
          {settings.map((s, i) => (
            <motion.div key={s.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="rounded-2xl border border-white/[0.06] bg-[#0E1425] p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Settings size={16} className="text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white mb-1">{s.key}</p>
                  <p className="text-[10px] text-gray-600 mb-3">Updated: {new Date(s.updatedAt).toLocaleDateString()}</p>
                  <div className="flex gap-2">
                    <input
                      value={edits[s.key] ?? s.value}
                      onChange={e => setEdits(ed => ({ ...ed, [s.key]: e.target.value }))}
                      className="flex-1 h-10 px-3 rounded-lg border border-white/[0.06] bg-[#141828] text-sm text-white outline-none focus:border-emerald-500/30"
                    />
                    <button onClick={() => handleSave(s.key)} disabled={saving === s.key} className="h-10 px-4 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                      {saving === s.key ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {settings.length === 0 && (
            <div className="p-12 text-center rounded-2xl border border-white/[0.06] bg-[#0E1425]">
              <Settings size={40} className="mx-auto text-gray-600 mb-3" />
              <p className="text-sm text-gray-500">No global settings configured</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
