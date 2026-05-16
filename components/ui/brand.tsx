import Image from 'next/image';

type BrandMarkProps = {
  compact?: boolean;
  className?: string;
  tone?: 'light' | 'dark';
};

export function BrandMark({ compact = false, className = '', tone = 'dark' }: BrandMarkProps) {
  const titleClass = tone === 'dark' ? 'text-on-surface' : 'text-[#0E152B]';
  const subtitleClass = tone === 'dark' ? 'text-on-surface-variant' : 'text-[#6B7280]';
  const shadowClass = tone === 'dark' ? 'shadow-lg shadow-cyan/10 border border-cyan/20' : 'shadow-lg shadow-cyan/5 border border-cyan/10';

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      <div className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl bg-[#0E152B] ${shadowClass}`}>
        <Image src="/icons/icon-192x192.png" alt="HexaTrack Logo" width={44} height={44} className="h-full w-full object-cover" priority />
      </div>
      {!compact && (
        <div className="min-w-0">
          <p className={`truncate text-lg font-extrabold tracking-tight font-headline ${titleClass}`}>HexaTrack</p>
          <p className={`truncate text-[11px] font-medium tracking-wide font-sans ${subtitleClass}`}>Autonomous Financial Suite</p>
        </div>
      )}
    </div>
  );
}

