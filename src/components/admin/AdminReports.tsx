import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "./AdminHeader";
import { toast } from "sonner";
import {
  Download, Calendar as CalIcon, MailOpen, ShoppingBag, TrendingUp, Users,
} from "lucide-react";

type Inquiry = {
  id: string; full_name: string; email: string; subject: string | null;
  status: string; created_at: string;
};
type Booking = {
  id: string; full_name: string; email: string; company: string | null;
  status: string; scheduled_at: string; created_at: string;
};
type Order = {
  id: string; order_number: string; customer_name: string; customer_email: string | null;
  status: string; payment_status: string; total_inr: number; created_at: string;
};

const fmtINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

const todayStr = () => new Date().toISOString().slice(0, 10);
const daysAgoStr = (d: number) => new Date(Date.now() - d * 86400000).toISOString().slice(0, 10);

const PRESETS = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
  { label: "This year", days: 365 },
];

function toCsv(rows: Record<string, any>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: any) => {
    if (v === null || v === undefined) return "";
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  return [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
}

function downloadCsv(filename: string, csv: string) {
  if (!csv) { toast.error("Nothing to export for the selected range."); return; }
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function AdminReports() {
  const [from, setFrom] = useState(daysAgoStr(30));
  const [to, setTo] = useState(todayStr());
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const fromIso = useMemo(() => new Date(`${from}T00:00:00`).toISOString(), [from]);
  const toIso = useMemo(() => new Date(`${to}T23:59:59`).toISOString(), [to]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [inq, bk, ord] = await Promise.all([
        supabase.from("inquiries")
          .select("id, full_name, email, subject, status, created_at")
          .gte("created_at", fromIso).lte("created_at", toIso)
          .order("created_at", { ascending: false }),
        supabase.from("appointments")
          .select("id, full_name, email, company, status, scheduled_at, created_at")
          .gte("created_at", fromIso).lte("created_at", toIso)
          .order("created_at", { ascending: false }),
        supabase.from("sales_orders")
          .select("id, order_number, customer_name, customer_email, status, payment_status, total_inr, created_at")
          .gte("created_at", fromIso).lte("created_at", toIso)
          .order("created_at", { ascending: false }),
      ]);
      if (inq.error) toast.error(inq.error.message);
      if (bk.error) toast.error(bk.error.message);
      if (ord.error) toast.error(ord.error.message);
      setInquiries((inq.data as Inquiry[]) ?? []);
      setBookings((bk.data as Booking[]) ?? []);
      setOrders((ord.data as Order[]) ?? []);
      setLoading(false);
    };
    load();
  }, [fromIso, toIso]);

  const inqByStatus = useMemo(() => {
    const acc: Record<string, number> = { new: 0, read: 0, resolved: 0 };
    inquiries.forEach((i) => { acc[i.status] = (acc[i.status] ?? 0) + 1; });
    return acc;
  }, [inquiries]);

  const bookingsByStatus = useMemo(() => {
    const acc: Record<string, number> = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    bookings.forEach((b) => { acc[b.status] = (acc[b.status] ?? 0) + 1; });
    return acc;
  }, [bookings]);

  const orderStats = useMemo(() => {
    const valid = orders.filter((o) => o.status !== "cancelled");
    const revenue = valid.reduce((s, o) => s + Number(o.total_inr || 0), 0);
    const aov = valid.length ? revenue / valid.length : 0;
    const byStatus: Record<string, number> = { new: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 };
    orders.forEach((o) => { byStatus[o.status] = (byStatus[o.status] ?? 0) + 1; });
    const paidRevenue = orders
      .filter((o) => o.payment_status === "paid")
      .reduce((s, o) => s + Number(o.total_inr || 0), 0);
    return { revenue, aov, byStatus, paidRevenue, count: orders.length };
  }, [orders]);

  const setPreset = (days: number) => {
    setFrom(daysAgoStr(days));
    setTo(todayStr());
  };

  const exportInquiries = () => downloadCsv(
    `inquiries_${from}_to_${to}.csv`,
    toCsv(inquiries.map((i) => ({
      created_at: i.created_at, full_name: i.full_name, email: i.email,
      subject: i.subject ?? "", status: i.status,
    })))
  );
  const exportBookings = () => downloadCsv(
    `bookings_${from}_to_${to}.csv`,
    toCsv(bookings.map((b) => ({
      created_at: b.created_at, scheduled_at: b.scheduled_at, full_name: b.full_name,
      email: b.email, company: b.company ?? "", status: b.status,
    })))
  );
  const exportOrders = () => downloadCsv(
    `orders_${from}_to_${to}.csv`,
    toCsv(orders.map((o) => ({
      created_at: o.created_at, order_number: o.order_number, customer_name: o.customer_name,
      customer_email: o.customer_email ?? "", status: o.status, payment_status: o.payment_status,
      total_inr: o.total_inr,
    })))
  );

  const exportCombined = () => {
    const sections = [
      `# Atelier report — ${from} to ${to}\n`,
      `## Summary`,
      `Inquiries,${inquiries.length}`,
      `Bookings,${bookings.length}`,
      `Orders,${orders.length}`,
      `Revenue (INR),${orderStats.revenue}`,
      `Paid revenue (INR),${orderStats.paidRevenue}`,
      `Average order value (INR),${Math.round(orderStats.aov)}`,
      ``,
      `## Inquiries`,
      toCsv(inquiries),
      ``,
      `## Bookings`,
      toCsv(bookings),
      ``,
      `## Orders`,
      toCsv(orders),
    ].join("\n");
    downloadCsv(`atelier_report_${from}_to_${to}.csv`, sections);
  };

  return (
    <div>
      <AdminHeader
        title="Reports"
        subtitle="Filter, summarise and export atelier activity."
        count={inquiries.length + bookings.length + orders.length}
      />

      <div className="px-5 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-8">
        {/* Filter bar */}
        <div className="bg-card border border-border p-4 sm:p-5 flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setPreset(p.days)}
                className="text-[11px] uppercase tracking-[0.25em] px-3 py-2 border border-border hover:border-gold hover:text-gold transition"
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 items-end lg:ml-auto">
            <label className="text-xs">
              <div className="uppercase tracking-[0.25em] text-muted-foreground mb-1">From</div>
              <input
                type="date"
                value={from}
                max={to}
                onChange={(e) => setFrom(e.target.value)}
                className="input"
              />
            </label>
            <label className="text-xs">
              <div className="uppercase tracking-[0.25em] text-muted-foreground mb-1">To</div>
              <input
                type="date"
                value={to}
                min={from}
                max={todayStr()}
                onChange={(e) => setTo(e.target.value)}
                className="input"
              />
            </label>
            <button
              onClick={exportCombined}
              className="btn-luxe-primary !py-2.5 !px-4 !text-xs gap-2"
            >
              <Download className="h-4 w-4" /> Export full report
            </button>
          </div>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Kpi icon={MailOpen} label="Inquiries" value={inquiries.length} sub={`${inqByStatus.new ?? 0} new`} />
          <Kpi icon={CalIcon} label="Bookings" value={bookings.length} sub={`${bookingsByStatus.pending ?? 0} pending`} />
          <Kpi icon={ShoppingBag} label="Orders" value={orders.length} sub={`${orderStats.byStatus.new ?? 0} new`} />
          <Kpi icon={TrendingUp} label="Revenue" value={fmtINR(orderStats.revenue)} sub={`AOV ${fmtINR(orderStats.aov)}`} />
        </div>

        {loading && (
          <div className="text-sm text-muted-foreground text-center py-10">Loading data…</div>
        )}

        {/* Section: Inquiries */}
        <ReportSection
          title="Inquiries"
          icon={MailOpen}
          onExport={exportInquiries}
          rightStats={[
            ["New", inqByStatus.new ?? 0],
            ["Read", inqByStatus.read ?? 0],
            ["Resolved", inqByStatus.resolved ?? 0],
          ]}
        >
          {inquiries.length === 0 ? (
            <Empty label="No inquiries in this range." />
          ) : (
            <Table
              headers={["Date", "Name", "Email", "Subject", "Status"]}
              rows={inquiries.slice(0, 10).map((i) => [
                new Date(i.created_at).toLocaleDateString(),
                i.full_name, i.email, i.subject ?? "—", i.status,
              ])}
              footer={inquiries.length > 10 ? `Showing 10 of ${inquiries.length} — export CSV for all.` : undefined}
            />
          )}
        </ReportSection>

        {/* Section: Bookings */}
        <ReportSection
          title="Bookings"
          icon={CalIcon}
          onExport={exportBookings}
          rightStats={[
            ["Pending", bookingsByStatus.pending ?? 0],
            ["Confirmed", bookingsByStatus.confirmed ?? 0],
            ["Completed", bookingsByStatus.completed ?? 0],
            ["Cancelled", bookingsByStatus.cancelled ?? 0],
          ]}
        >
          {bookings.length === 0 ? (
            <Empty label="No bookings in this range." />
          ) : (
            <Table
              headers={["Created", "Scheduled", "Name", "Company", "Status"]}
              rows={bookings.slice(0, 10).map((b) => [
                new Date(b.created_at).toLocaleDateString(),
                new Date(b.scheduled_at).toLocaleString(),
                b.full_name, b.company ?? "—", b.status,
              ])}
              footer={bookings.length > 10 ? `Showing 10 of ${bookings.length} — export CSV for all.` : undefined}
            />
          )}
        </ReportSection>

        {/* Section: Orders */}
        <ReportSection
          title="Sales orders"
          icon={ShoppingBag}
          onExport={exportOrders}
          rightStats={[
            ["Revenue", fmtINR(orderStats.revenue)],
            ["Paid", fmtINR(orderStats.paidRevenue)],
            ["AOV", fmtINR(orderStats.aov)],
          ]}
        >
          {orders.length === 0 ? (
            <Empty label="No orders in this range." />
          ) : (
            <Table
              headers={["Date", "Order #", "Customer", "Status", "Payment", "Total"]}
              rows={orders.slice(0, 10).map((o) => [
                new Date(o.created_at).toLocaleDateString(),
                o.order_number, o.customer_name, o.status, o.payment_status,
                fmtINR(Number(o.total_inr)),
              ])}
              footer={orders.length > 10 ? `Showing 10 of ${orders.length} — export CSV for all.` : undefined}
            />
          )}
        </ReportSection>
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, sub }: any) {
  return (
    <div className="bg-card border border-border p-4 sm:p-5">
      <Icon className="h-5 w-5 text-gold-deep mb-3" strokeWidth={1.4} />
      <div className="font-serif text-2xl sm:text-3xl">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">{label}</div>
      {sub && <div className="text-[10px] uppercase tracking-widest text-gold-deep mt-1">{sub}</div>}
    </div>
  );
}

function ReportSection({
  title, icon: Icon, onExport, rightStats, children,
}: {
  title: string; icon: any; onExport: () => void;
  rightStats: [string, string | number][]; children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold-deep">
          <Icon className="h-4 w-4" /> {title}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-3 text-[11px] text-muted-foreground">
            {rightStats.map(([k, v]) => (
              <span key={k}><b className="text-foreground">{v}</b> {k}</span>
            ))}
          </div>
          <button
            onClick={onExport}
            className="text-[11px] uppercase tracking-[0.25em] px-3 py-1.5 border border-border hover:border-gold hover:text-gold transition flex items-center gap-1.5"
          >
            <Download className="h-3 w-3" /> CSV
          </button>
        </div>
      </div>
      {children}
    </section>
  );
}

function Table({ headers, rows, footer }: { headers: string[]; rows: (string | number)[][]; footer?: string }) {
  return (
    <div className="bg-card border border-border overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b border-border">
            {headers.map((h) => (
              <th key={h} className="text-left p-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-normal">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30">
              {r.map((cell, j) => (
                <td key={j} className="p-3 text-foreground/90">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {footer && <div className="p-3 text-[11px] text-muted-foreground border-t border-border">{footer}</div>}
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="bg-card border border-border p-6 text-sm text-muted-foreground text-center">{label}</div>
  );
}
