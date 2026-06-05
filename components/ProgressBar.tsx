type ProgressBarProps = {
  value: number;
  label: string;
};

export function ProgressBar({ value, label }: ProgressBarProps) {
  const safeValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase text-tiktok-muted">
        <span>{label}</span>
        <span>{safeValue}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full border border-white/10 bg-white/10">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#25F4EE,#FE2C55)] transition-all duration-300"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
