interface Props {
  title: string;
  subtitle?: string;
  count?: number;
  action?: React.ReactNode;
}
export default function AdminHeader({ title, subtitle, count, action }: Props) {
  return (
    <div className="border-b border-border px-10 py-8 flex items-end justify-between gap-6">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-2">Atelier</div>
        <h1 className="font-serif text-4xl flex items-baseline gap-3">
          {title}
          {typeof count === "number" && (
            <span className="text-2xl text-muted-foreground font-sans">— {count}</span>
          )}
        </h1>
        {subtitle && <p className="text-muted-foreground text-sm mt-2">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
