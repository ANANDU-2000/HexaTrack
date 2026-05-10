export function EnterpriseAnalyticsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl border border-[rgba(255,255,255,0.06)] bg-[#121A22]/50 p-5"
        >
          <div className="mb-4 h-4 w-40 animate-pulse rounded-lg bg-white/10" />
          <div className="h-[220px] w-full animate-pulse rounded-2xl bg-white/5" />
        </div>
      ))}
    </div>
  );
}
