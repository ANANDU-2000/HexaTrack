import Image from 'next/image';

type BrandMarkProps = {
  compact?: boolean;
  className?: string;
  tone?: 'light' | 'dark';
};

export function BrandMark({ compact = false, className = '', tone = 'light' }: BrandMarkProps) {
  const titleClass = tone === 'dark' ? 'text-[#F5F7FA]' : 'text-[#111827]';
  const subtitleClass = tone === 'dark' ? 'text-[#8B9BB4]' : 'text-[#6B7280]';
  const shadowClass = tone === 'dark' ? 'shadow-lg shadow-[#4F8CFF]/15' : 'shadow-lg shadow-emerald-500/20';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl ${shadowClass}`}>
        <Image src="/icons/icon-192x192.png" alt="HexaTrack Icon" width={44} height={44} className="h-full w-full object-cover" priority />
      </div>
      {!compact && (
        <div className="min-w-0">
          <p className={`truncate text-lg font-bold ${titleClass}`}>HexaTrack</p>
          <p className={`truncate text-xs font-medium ${subtitleClass}`}>Track Smarter. Spend Better.</p>
        </div>
      )}
    </div>
  );
}
