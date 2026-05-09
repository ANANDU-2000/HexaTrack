import type { LucideIcon } from 'lucide-react';

export function MetricCard({ label, value, detail, icon: Icon, tone = 'slate' }: { label: string; value: string; detail: string; icon: LucideIcon; tone?: 'slate' | 'emerald' | 'blue' }) {
  const toneClass = {
    slate: 'bg-[#F8FAFC] text-[#111827]',
    emerald: 'bg-[#D1FAE5] text-[#059669]',
    blue: 'bg-[#ECFDF5] text-[#059669]',
  }[tone];

  return (
    <section className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[#6B7280]">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-[#111827]">{value}</p>
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${toneClass}`}>
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-3 text-xs text-[#6B7280]">{detail}</p>
    </section>
  );
}
