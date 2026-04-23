interface Props {
  title: string;
  subtitle?: string;
  count?: number;
  action?: React.ReactNode;
}
export default function AdminHeader({ title, subtitle, count, action }: Props) {
  return (
    <div className="border-b border-border px-5 sm:px-8 lg:px-10 py-6 sm:py-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div className="min-w-0">
        <div className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold-deep mb-2">Atelier</div>
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl flex items-baseline gap-3 flex-wrap">
          <span className="truncate">{title}</span>
          {typeof count === "number" && (
            <span className="text-xl sm:text-2xl text-muted-foreground font-sans">— {count}</span>
          )}
        </h1>
        {subtitle && <p className="text-muted-foreground text-xs sm:text-sm mt-2">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
