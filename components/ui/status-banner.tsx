import { AlertCircle, Loader2, X } from 'lucide-react';

export function StatusBanner({ error, loading, onDismiss }: { error: string | null; loading: boolean; onDismiss: () => void }) {
  if (!loading && !error) return null;

  return (
    <div className="mb-4 rounded-3xl border border-white/[0.06] bg-[#121A22] px-3 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-3">
        <div
          className={`grid h-9 w-9 place-items-center rounded-xl ${
            error ? 'bg-[#FF5C75]/15 text-[#FF5C75]' : 'bg-[#4F8CFF]/15 text-[#4F8CFF]'
          }`}
        >
          {error ? <AlertCircle size={18} /> : <Loader2 className="animate-spin" size={18} />}
        </div>
        <p className={`min-w-0 flex-1 text-sm ${error ? 'text-[#FF5C75]' : 'text-[#8B9BB4]'}`}>{error ?? 'Syncing HexaTrack data...'}</p>
        {error && (
          <button
            aria-label="Dismiss"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#8B9BB4] transition hover:bg-white/[0.06] hover:text-[#F5F7FA]"
            onClick={onDismiss}
            type="button"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
