import { AlertCircle, Loader2, X } from 'lucide-react';

export function StatusBanner({ error, loading, onDismiss }: { error: string | null; loading: boolean; onDismiss: () => void }) {
  if (!loading && !error) return null;

  return (
    <div className="mb-4 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`grid h-9 w-9 place-items-center rounded-xl ${error ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
          {error ? <AlertCircle size={18} /> : <Loader2 className="animate-spin" size={18} />}
        </div>
        <p className={`min-w-0 flex-1 text-sm ${error ? 'text-red-700' : 'text-slate-600'}`}>
          {error ?? 'Syncing HexaTrack data...'}
        </p>
        {error && (
          <button aria-label="Dismiss" className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100" onClick={onDismiss} type="button">
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
