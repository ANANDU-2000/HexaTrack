import type { ReactNode } from 'react';

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  /** Classes for the body wrapper below the optional header (default `p-5`). */
  bodyClassName?: string;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function GlassCard({
  children,
  className = '',
  bodyClassName = 'p-5',
  title,
  subtitle,
  actions,
}: GlassCardProps) {
  const hasHeader = Boolean(title || subtitle || actions);
  return (
    <div
      className={`rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[#121A22]/85 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-2xl ${className}`}
    >
      {hasHeader ? (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[rgba(255,255,255,0.06)] px-5 py-4">
          <div className="min-w-0">
            {title ? <h3 className="text-sm font-semibold tracking-tight text-[#F5F7FA]">{title}</h3> : null}
            {subtitle ? <p className="mt-0.5 text-xs leading-relaxed text-[#8B9BB4]">{subtitle}</p> : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      ) : null}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
