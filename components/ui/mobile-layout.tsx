type AppScreenProps = {
  children: React.ReactNode;
  className?: string;
};

export function AppScreen({ children, className = '' }: AppScreenProps) {
  return <div className={`mx-auto w-full max-w-5xl space-y-4 pb-4 sm:space-y-5 ${className}`}>{children}</div>;
}

type BottomSheetProps = {
  children: React.ReactNode;
  labelledBy: string;
};

export function BottomSheet({ children, labelledBy }: BottomSheetProps) {
  return (
    <div
      className="sheet-backdrop fixed inset-0 flex h-[100dvh] items-end justify-center overflow-hidden bg-black/50 px-0 pt-6 backdrop-blur-sm sm:px-4 lg:items-center lg:py-8"
      style={{ zIndex: 100 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <div className="sheet-panel flex max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] border border-white/[0.06] bg-[#121A22] shadow-2xl sm:rounded-[28px] lg:max-h-[calc(100dvh-4rem)]">
        <div className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-white/15" />
        {children}
      </div>
    </div>
  );
}
