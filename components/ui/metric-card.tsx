import type { LucideIcon } from 'lucide-react';

export function MetricCard({ label, value, detail, icon: Icon, tone = 'slate' }: { label: string; value: string; detail: string; icon: LucideIcon; tone?: 'slate' | 'emerald' | 'blue' }) {
  const toneClass = {
    slate: 'bg-[#4F8CFF]/12 text-[#4F8CFF]',
    emerald: 'bg-[#1FD18B]/15 text-[#1FD18B]',
    blue: 'bg-[#4F8CFF]/15 text-[#4F8CFF]',
  }[tone];

  return (
    <section className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[#8B9BB4]">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-[#F5F7FA]">{value}</p>
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${toneClass}`}>
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-3 text-xs text-[#8B9BB4]">{detail}</p>
    </section>
  );
}
