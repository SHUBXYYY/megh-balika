import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserPlus, ShieldCheck, ShieldOff, Loader2 } from "lucide-react";
import AdminHeader from "./AdminHeader";

type AdminRow = {
  user_id: string;
  created_at: string;
  display_name: string | null;
  avatar_url: string | null;
};

export default function AdminTeam() {
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [meId, setMeId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    setMeId(session?.user.id ?? null);

    const { data: roles, error } = await supabase
      .from("user_roles")
      .select("user_id, created_at")
      .eq("role", "admin")
      .order("created_at");
    if (error) { toast.error(error.message); setLoading(false); return; }

    const ids = (roles ?? []).map((r) => r.user_id);
    let profilesMap: Record<string, { display_name: string | null; avatar_url: string | null }> = {};
    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles").select("user_id, display_name, avatar_url")
        .in("user_id", ids);
      profilesMap = Object.fromEntries(
        (profs ?? []).map((p: any) => [p.user_id, { display_name: p.display_name, avatar_url: p.avatar_url }])
      );
    }

    setRows((roles ?? []).map((r) => ({
      user_id: r.user_id,
      created_at: r.created_at,
      display_name: profilesMap[r.user_id]?.display_name ?? null,
      avatar_url: profilesMap[r.user_id]?.avatar_url ?? null,
    })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const promote = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setBusy(true);
    const { data, error } = await supabase.rpc("promote_user_to_admin", { _email: trimmed });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    const res = data as { ok: boolean; error?: string };
    if (!res?.ok) { toast.error(res?.error ?? "Could not promote"); return; }
    toast.success(`${trimmed} ab admin hai 🎉`);
    setEmail("");
    load();
  };

  const revoke = async (uid: string) => {
    if (uid === meId) {
      if (!confirm("Yeh aapki apni admin access hatayegi. Continue?")) return;
    } else {
      if (!confirm("Iss user ki admin access revoke karein?")) return;
    }
    const { data, error } = await supabase.rpc("revoke_admin", { _user_id: uid });
    if (error) { toast.error(error.message); return; }
    const res = data as { ok: boolean; error?: string };
    if (!res?.ok) { toast.error(res?.error ?? "Failed"); return; }
    toast.success("Admin access revoked");
    if (uid === meId) { setTimeout(() => location.assign("/"), 700); return; }
    load();
  };

  return (
    <div>
      <AdminHeader
        title="Team & access"
        subtitle="Manage who can sign in to this atelier dashboard."
        count={rows.length}
      />

      <div className="px-5 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-8">
        <form onSubmit={promote} className="bg-card border border-border p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold-deep mb-3">
            <UserPlus className="h-4 w-4" /> Add new admin
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            User ko pehle <code className="text-gold-deep">/auth</code> par sign-up karna hoga, fir yahan unka email daal ke promote karein.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="newadmin@meghbalika.com"
              className="flex-1 bg-background border border-border focus:border-gold outline-none px-3 py-2.5 text-sm transition"
            />
            <button
              type="submit"
              disabled={busy || !email.trim()}
              className="btn-luxe-primary !py-2.5 !px-5 !text-xs gap-2 disabled:opacity-50 justify-center"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Make admin
            </button>
          </div>
        </form>

        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-gold-deep mb-3">Current admins</div>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No admins yet.</div>
          ) : (
            <div className="space-y-2">
              {rows.map((r) => {
                const isMe = r.user_id === meId;
                return (
                  <div key={r.user_id} className="bg-card border border-border p-4 sm:p-5 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3 min-w-0">
                      {r.avatar_url ? (
                        <img src={r.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gold/15 text-gold-deep font-serif flex items-center justify-center text-sm uppercase">
                          {(r.display_name ?? "A").slice(0, 1)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-serif text-base truncate">
                          {r.display_name ?? "Admin"} {isMe && <span className="text-[10px] uppercase tracking-widest text-gold-deep">· you</span>}
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                          since {new Date(r.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => revoke(r.user_id)}
                      className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-destructive flex items-center gap-2 transition"
                    >
                      <ShieldOff className="h-3.5 w-3.5" /> Revoke
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
