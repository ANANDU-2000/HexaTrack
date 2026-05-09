export function AnimatePresence({ animationKey, children }: { animationKey: string; children: React.ReactNode }) {
  return (
    <div key={animationKey} className="animate-rise-in">
      {children}
    </div>
  );
}
