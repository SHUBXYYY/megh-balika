import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, MailOpen, CheckCircle2, Reply, X, Send, History } from "lucide-react";
import AdminHeader from "./AdminHeader";

type Inquiry = {
  id: string; full_name: string; email: string; phone: string | null;
  subject: string | null; message: string; status: string; created_at: string;
};

type ReplyLog = {
  id: string; inquiry_id: string; to_email: string;
  subject: string; body: string; status: string; created_at: string;
};

const STATUSES = ["all", "new", "read", "resolved"] as const;
type Status = typeof STATUSES[number];

export default function AdminInquiries() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [replies, setReplies] = useState<Record<string, ReplyLog[]>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status>("all");
  const [replyTo, setReplyTo] = useState<Inquiry | null>(null);
  const [replyForm, setReplyForm] = useState({ subject: "", body: "" });
  const [openLog, setOpenLog] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data, error }, { data: rData }] = await Promise.all([
      supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
      supabase.from("inquiry_replies").select("*").order("created_at", { ascending: false }),
    ]);
    if (error) toast.error(error.message);
    setItems((data as Inquiry[]) ?? []);
    const grouped: Record<string, ReplyLog[]> = {};
    ((rData as ReplyLog[]) ?? []).forEach((r) => {
      (grouped[r.inquiry_id] ||= []).push(r);
    });
    setReplies(grouped);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const update = async (id: string, status: string) => {
    const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Marked ${status}`);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    load();
  };

  const openReply = (inq: Inquiry) => {
    setReplyTo(inq);
    setReplyForm({
      subject: `Re: ${inq.subject || "Your inquiry to Megh Balika"}`,
      body: `Namaskar ${inq.full_name},\n\nThank you for reaching out to Megh Balika.\n\n\n\n— Team Megh Balika\nReshmi Pradhan\nEsplanade East, Kolkata, West Bengal 700069`,
    });
  };

  const sendReply = async () => {
    if (!replyTo) return;
    if (!replyForm.subject.trim() || !replyForm.body.trim()) {
      toast.error("Subject aur message dono chahiye");
      return;
    }
    // Open mail client
    const mailto = `mailto:${encodeURIComponent(replyTo.email)}?subject=${encodeURIComponent(
      replyForm.subject
    )}&body=${encodeURIComponent(replyForm.body)}`;
    window.location.href = mailto;

    // Log it
    const { error } = await supabase.from("inquiry_replies").insert({
      inquiry_id: replyTo.id,
      to_email: replyTo.email,
      subject: replyForm.subject,
      body: replyForm.body,
      status: "sent",
      channel: "mailto",
    });
    if (error) { toast.error("Reply log failed: " + error.message); return; }

    // Auto-mark inquiry as resolved if it's still new/read
    if (replyTo.status !== "resolved") {
      await supabase.from("inquiries").update({ status: "resolved" }).eq("id", replyTo.id);
    }
    toast.success("Reply opened in your mail app & logged");
    setReplyTo(null);
    load();
  };

  const filtered = filter === "all" ? items : items.filter((i) => i.status === filter);

  return (
    <div>
      <AdminHeader
        title="Inquiries"
        subtitle="Contact form submissions. Reply opens your mail app and logs the message here."
        count={items.length}
      />
      <div className="px-5 sm:px-8 lg:px-10 py-4 sm:py-6 flex gap-1 sm:gap-2 border-b border-border overflow-x-auto">
        {STATUSES.map((f) => (
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
      <div className="px-5 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-3">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No inquiries.</div>
        ) : filtered.map((i) => {
          const log = replies[i.id] ?? [];
          const isOpen = openLog === i.id;
          return (
            <div key={i.id} className="bg-card border border-border p-4 sm:p-5 group">
              <div className="flex justify-between gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="font-serif text-lg sm:text-xl">
                    {i.full_name}
                    {i.subject && <span className="text-muted-foreground"> · {i.subject}</span>}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1 break-all">
                    <a href={`mailto:${i.email}`} className="link-edit">{i.email}</a>
                    {i.phone && <> · <a href={`tel:${i.phone}`} className="link-edit">{i.phone}</a></>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-[10px] uppercase tracking-[0.25em] px-2 py-1 ${
                    i.status === "resolved" ? "bg-gold/20 text-gold-deep"
                    : i.status === "read" ? "bg-secondary text-foreground/70"
                    : "bg-destructive/15 text-destructive"
                  }`}>{i.status}</span>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {new Date(i.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-foreground/80 italic whitespace-pre-wrap">"{i.message}"</p>
              <div className="mt-3 flex gap-3 text-xs items-center justify-end flex-wrap">
                {log.length > 0 && (
                  <button onClick={() => setOpenLog(isOpen ? null : i.id)} className="link-edit text-muted-foreground inline-flex items-center gap-1">
                    <History className="h-3.5 w-3.5" /> {log.length} repl{log.length === 1 ? "y" : "ies"}
                  </button>
                )}
                <button onClick={() => openReply(i)} className="link-edit text-gold-deep inline-flex items-center gap-1">
                  <Reply className="h-3.5 w-3.5" /> Reply
                </button>
                {i.status === "new" && (
                  <button onClick={() => update(i.id, "read")} className="link-edit text-foreground/70 inline-flex items-center gap-1">
                    <MailOpen className="h-3.5 w-3.5" /> Mark read
                  </button>
                )}
                {i.status !== "resolved" && (
                  <button onClick={() => update(i.id, "resolved")} className="link-edit text-foreground/70 inline-flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Resolve
                  </button>
                )}
                <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {isOpen && log.length > 0 && (
                <div className="mt-3 border-t border-border pt-3 space-y-2">
                  {log.map((r) => (
                    <div key={r.id} className="bg-secondary/40 border border-border p-3 text-xs">
                      <div className="flex justify-between gap-2 mb-1">
                        <span className="font-serif text-sm">{r.subject}</span>
                        <span className={`text-[10px] uppercase tracking-widest ${
                          r.status === "sent" ? "text-gold-deep" : "text-destructive"
                        }`}>{r.status}</span>
                      </div>
                      <div className="text-muted-foreground whitespace-pre-wrap">{r.body}</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2">
                        to {r.to_email} · {new Date(r.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reply modal */}
      {replyTo && (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setReplyTo(null)}>
          <div className="bg-background border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-border p-5 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold-deep">Reply to</div>
                <div className="font-serif text-xl mt-1">{replyTo.full_name}</div>
                <div className="text-xs text-muted-foreground">{replyTo.email}</div>
              </div>
              <button onClick={() => setReplyTo(null)} className="p-2 text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Subject</label>
                <input
                  value={replyForm.subject}
                  onChange={(e) => setReplyForm({ ...replyForm, subject: e.target.value })}
                  className="w-full mt-1 bg-card border border-border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Message</label>
                <textarea
                  value={replyForm.body}
                  onChange={(e) => setReplyForm({ ...replyForm, body: e.target.value })}
                  rows={12}
                  className="w-full mt-1 bg-card border border-border px-3 py-2 text-sm font-sans"
                />
              </div>
              <div className="text-xs text-muted-foreground italic">
                Tip: clicking Send opens your default mail app with this draft pre-filled. The message gets logged in the panel automatically.
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setReplyTo(null)} className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground px-4 py-2">
                  Cancel
                </button>
                <button onClick={sendReply} className="btn-luxe-primary inline-flex items-center gap-2">
                  <Send className="h-4 w-4" /> Send & log
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
