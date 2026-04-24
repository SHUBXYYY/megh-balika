import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Plus, Trash2, Edit3, X, IndianRupee, Package2, TrendingUp,
  CheckCircle2, Clock, Truck, XCircle,
} from "lucide-react";
import AdminHeader from "./AdminHeader";

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_address: string | null;
  status: string;
  payment_status: string;
  payment_method: string | null;
  subtotal_inr: number;
  shipping_inr: number;
  tax_inr: number;
  total_inr: number;
  notes: string | null;
  source: string | null;
  created_at: string;
};

type Item = {
  id?: string;
  product_id?: string | null;
  product_name: string;
  sku?: string | null;
  quantity: number;
  unit_price_inr: number;
  line_total_inr: number;
};

type ProductLite = { id: string; name: string; sku: string | null; price_inr: number | null };

const STATUSES = ["new", "confirmed", "shipped", "delivered", "cancelled"];
const PAYMENT = ["unpaid", "partial", "paid", "refunded"];
const SOURCES = ["manual", "whatsapp", "call", "website"];

const generateOrderNumber = () => {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `MB-${stamp}-${Math.floor(1000 + Math.random() * 9000)}`;
};

const empty: Partial<Order> = {
  order_number: "",
  customer_name: "",
  customer_email: "",
  customer_phone: "",
  shipping_address: "",
  status: "new",
  payment_status: "unpaid",
  payment_method: "",
  subtotal_inr: 0, shipping_inr: 0, tax_inr: 0, total_inr: 0,
  notes: "", source: "manual",
};

const fmtINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [items, setItems] = useState<Record<string, Item[]>>({});
  const [products, setProducts] = useState<ProductLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Order> | null>(null);
  const [editingItems, setEditingItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const [{ data: o, error }, { data: it }, { data: p }] = await Promise.all([
      supabase.from("sales_orders").select("*").order("created_at", { ascending: false }),
      supabase.from("order_items").select("*"),
      supabase.from("products").select("id, name, sku, price_inr").order("name"),
    ]);
    if (error) toast.error(error.message);
    setOrders((o as Order[]) ?? []);
    const grouped: Record<string, Item[]> = {};
    ((it as any[]) ?? []).forEach((i) => { (grouped[i.order_id] ||= []).push(i); });
    setItems(grouped);
    setProducts((p as ProductLite[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startNew = () => {
    setEditing({ ...empty, order_number: generateOrderNumber() });
    setEditingItems([{ product_name: "", quantity: 1, unit_price_inr: 0, line_total_inr: 0 }]);
  };

  const startEdit = (o: Order) => {
    setEditing({ ...o });
    setEditingItems((items[o.id] ?? []).map((i) => ({ ...i })));
  };

  const recalcTotals = (lines: Item[], shipping: number, tax: number) => {
    const subtotal = lines.reduce((s, l) => s + (l.line_total_inr || 0), 0);
    return { subtotal, total: subtotal + shipping + tax };
  };

  const updateLine = (idx: number, patch: Partial<Item>) => {
    setEditingItems((prev) => {
      const next = [...prev];
      const merged = { ...next[idx], ...patch };
      merged.line_total_inr = (Number(merged.unit_price_inr) || 0) * (Number(merged.quantity) || 0);
      next[idx] = merged;
      return next;
    });
  };

  useEffect(() => {
    if (!editing) return;
    const { subtotal, total } = recalcTotals(editingItems, Number(editing.shipping_inr) || 0, Number(editing.tax_inr) || 0);
    setEditing((e) => e ? { ...e, subtotal_inr: subtotal, total_inr: total } : e);
  }, [editingItems, editing?.shipping_inr, editing?.tax_inr]);

  const save = async () => {
    if (!editing) return;
    if (!editing.customer_name?.trim()) { toast.error("Customer name required"); return; }
    if (editingItems.length === 0 || editingItems.every((i) => !i.product_name.trim())) {
      toast.error("Add at least one product line"); return;
    }
    const cleanItems = editingItems.filter((i) => i.product_name.trim() && i.quantity > 0);

    const { id, ...payload } = editing as Order;
    const orderPayload = {
      ...payload,
      customer_email: payload.customer_email || null,
      customer_phone: payload.customer_phone || null,
      shipping_address: payload.shipping_address || null,
      payment_method: payload.payment_method || null,
      notes: payload.notes || null,
    };

    let orderId = id;
    if (id) {
      const { error } = await supabase.from("sales_orders").update(orderPayload).eq("id", id);
      if (error) { toast.error(error.message); return; }
      // Replace items
      await supabase.from("order_items").delete().eq("order_id", id);
    } else {
      const { data, error } = await supabase.from("sales_orders").insert(orderPayload).select("id").single();
      if (error) { toast.error(error.message); return; }
      orderId = data.id;
    }

    const { error: ie } = await supabase.from("order_items").insert(
      cleanItems.map(({ id: _omit, ...rest }) => ({ ...rest, order_id: orderId }))
    );
    if (ie) { toast.error(ie.message); return; }

    toast.success(id ? "Order updated" : "Order created");
    setEditing(null); setEditingItems([]);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    const { error } = await supabase.from("sales_orders").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    load();
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("sales_orders").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    load();
  };

  const updatePayment = async (id: string, payment_status: string) => {
    const { error } = await supabase.from("sales_orders").update({ payment_status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    load();
  };

  // Filters & report
  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const now = new Date();
  const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recent = orders.filter((o) => new Date(o.created_at) >= last30);
  const revenue30 = recent.filter((o) => o.status !== "cancelled").reduce((s, o) => s + Number(o.total_inr || 0), 0);
  const paid30 = recent.filter((o) => o.payment_status === "paid").reduce((s, o) => s + Number(o.total_inr || 0), 0);
  const pendingCount = orders.filter((o) => o.status === "new" || o.status === "confirmed").length;

  const statusIcon = (s: string) => {
    if (s === "delivered") return <CheckCircle2 className="h-3 w-3" />;
    if (s === "shipped") return <Truck className="h-3 w-3" />;
    if (s === "cancelled") return <XCircle className="h-3 w-3" />;
    return <Clock className="h-3 w-3" />;
  };

  return (
    <div>
      <AdminHeader
        title="Sales orders"
        subtitle="Manual orders from WhatsApp, calls, or in-person — track status, payment & revenue."
        count={orders.length}
        action={
          <button onClick={startNew} className="btn-luxe-primary inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> New order
          </button>
        }
      />

      {/* Report stats */}
      <div className="px-5 sm:px-8 lg:px-10 pt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="border border-border bg-gradient-to-br from-gold/10 to-transparent p-4">
          <TrendingUp className="h-4 w-4 text-gold-deep mb-2" />
          <div className="font-serif text-2xl">{fmtINR(revenue30)}</div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">Revenue · 30d</div>
        </div>
        <div className="border border-border bg-gradient-to-br from-gold-deep/10 to-transparent p-4">
          <IndianRupee className="h-4 w-4 text-gold-deep mb-2" />
          <div className="font-serif text-2xl">{fmtINR(paid30)}</div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">Paid · 30d</div>
        </div>
        <div className="border border-border bg-gradient-to-br from-destructive/10 to-transparent p-4">
          <Clock className="h-4 w-4 text-destructive mb-2" />
          <div className="font-serif text-2xl">{pendingCount}</div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">Open orders</div>
        </div>
        <div className="border border-border bg-gradient-to-br from-gold/10 to-transparent p-4">
          <Package2 className="h-4 w-4 text-gold-deep mb-2" />
          <div className="font-serif text-2xl">{orders.length}</div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">Total orders</div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-5 sm:px-8 lg:px-10 py-4 flex gap-1 sm:gap-2 border-b border-border overflow-x-auto mt-4">
        {["all", ...STATUSES].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-[10px] sm:text-xs uppercase tracking-[0.25em] px-2.5 sm:px-3 py-2 transition whitespace-nowrap ${
              filter === f ? "bg-gold/15 text-gold-deep" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-5 sm:px-8 lg:px-10 py-6 space-y-3">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No orders yet. Create one with "New order".</div>
        ) : filtered.map((o) => {
          const lines = items[o.id] ?? [];
          return (
            <div key={o.id} className="bg-card border border-border p-4 sm:p-5">
              <div className="flex justify-between gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-gold-deep">{o.order_number}</span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">via {o.source}</span>
                  </div>
                  <div className="font-serif text-lg sm:text-xl mt-1">{o.customer_name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {o.customer_email && <a href={`mailto:${o.customer_email}`} className="link-edit">{o.customer_email}</a>}
                    {o.customer_phone && <> · <a href={`tel:${o.customer_phone}`} className="link-edit">{o.customer_phone}</a></>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-serif text-xl">{fmtINR(Number(o.total_inr))}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {lines.length > 0 && (
                <div className="mt-3 text-xs text-foreground/80 space-y-1">
                  {lines.map((l) => (
                    <div key={l.id} className="flex justify-between gap-4 border-b border-border/50 pb-1">
                      <span>{l.product_name} × {l.quantity}</span>
                      <span className="font-mono text-muted-foreground">{fmtINR(Number(l.line_total_inr))}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-2 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className={`text-[10px] uppercase tracking-[0.25em] px-2 py-1 border bg-background ${
                      o.status === "delivered" ? "border-gold text-gold-deep"
                      : o.status === "cancelled" ? "border-destructive/50 text-destructive"
                      : "border-border"
                    }`}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select
                    value={o.payment_status}
                    onChange={(e) => updatePayment(o.id, e.target.value)}
                    className={`text-[10px] uppercase tracking-[0.25em] px-2 py-1 border bg-background ${
                      o.payment_status === "paid" ? "border-gold text-gold-deep" : "border-border"
                    }`}
                  >
                    {PAYMENT.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground inline-flex items-center gap-1 px-1">
                    {statusIcon(o.status)} {o.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(o)} className="text-muted-foreground hover:text-gold transition p-1">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(o.id)} className="text-muted-foreground hover:text-destructive transition p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editor */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 overflow-y-auto" onClick={() => setEditing(null)}>
          <div className="bg-background border border-border max-w-3xl w-full my-8" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-border p-5 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold-deep">{editing.id ? "Edit order" : "New order"}</div>
                <div className="font-mono text-sm mt-1">{editing.order_number}</div>
              </div>
              <button onClick={() => setEditing(null)} className="p-2 text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Customer */}
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Customer name *">
                  <input value={editing.customer_name ?? ""} onChange={(e) => setEditing({ ...editing, customer_name: e.target.value })}
                    className="input" />
                </Field>
                <Field label="Source">
                  <select value={editing.source ?? "manual"} onChange={(e) => setEditing({ ...editing, source: e.target.value })} className="input">
                    {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Email">
                  <input value={editing.customer_email ?? ""} onChange={(e) => setEditing({ ...editing, customer_email: e.target.value })} className="input" />
                </Field>
                <Field label="Phone">
                  <input value={editing.customer_phone ?? ""} onChange={(e) => setEditing({ ...editing, customer_phone: e.target.value })} className="input" />
                </Field>
                <Field label="Shipping address" className="sm:col-span-2">
                  <textarea value={editing.shipping_address ?? ""} onChange={(e) => setEditing({ ...editing, shipping_address: e.target.value })} className="input" rows={2} />
                </Field>
              </div>

              {/* Items */}
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-gold-deep mb-2">Line items</div>
                <div className="space-y-2">
                  {editingItems.map((line, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-12 sm:col-span-5">
                        <select
                          value={line.product_id ?? ""}
                          onChange={(e) => {
                            const p = products.find((x) => x.id === e.target.value);
                            updateLine(idx, p ? {
                              product_id: p.id, product_name: p.name, sku: p.sku,
                              unit_price_inr: Number(p.price_inr) || 0,
                            } : { product_id: null });
                          }}
                          className="input"
                        >
                          <option value="">— pick product or type below —</option>
                          {products.map((p) => <option key={p.id} value={p.id}>{p.name}{p.sku ? ` · ${p.sku}` : ""}</option>)}
                        </select>
                        <input
                          placeholder="Product name"
                          value={line.product_name}
                          onChange={(e) => updateLine(idx, { product_name: e.target.value })}
                          className="input mt-1"
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-2">
                        <input type="number" min={1} value={line.quantity}
                          onChange={(e) => updateLine(idx, { quantity: Number(e.target.value) })} className="input" placeholder="Qty" />
                      </div>
                      <div className="col-span-5 sm:col-span-2">
                        <input type="number" min={0} value={line.unit_price_inr}
                          onChange={(e) => updateLine(idx, { unit_price_inr: Number(e.target.value) })} className="input" placeholder="Unit ₹" />
                      </div>
                      <div className="col-span-3 sm:col-span-2 text-right font-mono text-sm">
                        {fmtINR(line.line_total_inr)}
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          onClick={() => setEditingItems(editingItems.filter((_, i) => i !== idx))}
                          className="text-muted-foreground hover:text-destructive p-1"
                          aria-label="Remove line"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setEditingItems([...editingItems, { product_name: "", quantity: 1, unit_price_inr: 0, line_total_inr: 0 }])}
                    className="text-xs uppercase tracking-[0.25em] text-gold-deep link-edit inline-flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add line
                  </button>
                </div>
              </div>

              {/* Totals + meta */}
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Status">
                  <select value={editing.status ?? "new"} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className="input">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Payment status">
                  <select value={editing.payment_status ?? "unpaid"} onChange={(e) => setEditing({ ...editing, payment_status: e.target.value })} className="input">
                    {PAYMENT.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Payment method">
                  <input value={editing.payment_method ?? ""} onChange={(e) => setEditing({ ...editing, payment_method: e.target.value })} className="input" placeholder="UPI, cash, card…" />
                </Field>
                <Field label="Shipping (₹)">
                  <input type="number" value={editing.shipping_inr ?? 0} onChange={(e) => setEditing({ ...editing, shipping_inr: Number(e.target.value) })} className="input" />
                </Field>
                <Field label="Tax (₹)">
                  <input type="number" value={editing.tax_inr ?? 0} onChange={(e) => setEditing({ ...editing, tax_inr: Number(e.target.value) })} className="input" />
                </Field>
                <Field label="Notes" className="sm:col-span-2">
                  <textarea value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} className="input" rows={2} />
                </Field>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="text-sm">
                  <div className="text-muted-foreground text-xs">Subtotal {fmtINR(Number(editing.subtotal_inr) || 0)}</div>
                  <div className="font-serif text-2xl">Total {fmtINR(Number(editing.total_inr) || 0)}</div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setEditing(null)} className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground px-4 py-2">
                    Cancel
                  </button>
                  <button onClick={save} className="btn-luxe-primary">Save order</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
