import { useEffect, useState } from "react";
import { Routes, Route, NavLink, Navigate, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Users, MessageSquare, Calendar, ShieldAlert, LogOut,
  LayoutGrid, FileText, ChevronLeft,
} from "lucide-react";
import AdminLeads from "@/components/admin/AdminLeads";
import AdminBookings from "@/components/admin/AdminBookings";
import AdminChats from "@/components/admin/AdminChats";
import AdminCollections from "@/components/admin/AdminCollections";
import AdminContent from "@/components/admin/AdminContent";
import AdminMegh from "@/components/admin/AdminMegh";

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      setUserId(session.user.id);
      setUserEmail(session.user.email ?? "");
      const { data: roles } = await supabase
        .from("user_roles").select("role").eq("user_id", session.user.id);
      setIsAdmin(roles?.some((r) => r.role === "admin") ?? false);
    };
    init();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) navigate("/auth");
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const promoteSelf = async () => {
    if (!userId) return;
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    if (error) { toast.error("Could not self-promote (likely already admin)."); return; }
    toast.success("You are now admin.");
    setTimeout(() => location.reload(), 700);
  };

  if (isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 silk-bg">
        <div className="max-w-md text-center bg-card p-10 border border-border relative z-10">
          <ShieldAlert className="h-10 w-10 text-gold mx-auto mb-4" strokeWidth={1.2} />
          <h1 className="font-serif text-3xl mb-3">Admin access only</h1>
          <p className="text-muted-foreground mb-6">
            Your account isn't admin yet. If this is the first admin, click below.
            Otherwise ask an existing admin to add you.
          </p>
          <button onClick={promoteSelf} className="btn-luxe-primary">Make me admin</button>
          <div className="mt-4">
            <button onClick={() => supabase.auth.signOut()} className="text-sm text-muted-foreground link-edit">
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { to: "leads", label: "Leads", icon: Users },
    { to: "bookings", label: "Bookings", icon: Calendar },
    { to: "chats", label: "Chat sessions", icon: MessageSquare },
    { to: "collections", label: "Collections", icon: LayoutGrid },
    { to: "content", label: "Site content", icon: FileText },
  ];

  return (
    <main className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-ink text-ink-foreground flex flex-col">
        <div className="p-6 border-b border-ink-foreground/10">
          <Link to="/" className="font-serif text-base tracking-[0.2em] flex items-center gap-2 hover:text-gold transition">
            <ChevronLeft className="h-4 w-4" />
            MEGH<span className="text-gold-shimmer mx-0.5">·</span>BALIKA
          </Link>
          <div className="text-[10px] uppercase tracking-[0.3em] text-gold-deep mt-2">Atelier dashboard</div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm transition relative ${
                  isActive
                    ? "bg-ink-foreground/5 text-gold"
                    : "text-ink-foreground/70 hover:text-ink-foreground hover:bg-ink-foreground/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute left-0 top-0 bottom-0 w-px bg-gold" />}
                  <it.icon className="h-4 w-4" strokeWidth={1.4} />
                  <span className="font-serif tracking-wide">{it.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-ink-foreground/10">
          <div className="text-xs text-ink-foreground/50 mb-2 truncate" title={userEmail}>{userEmail}</div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-xs uppercase tracking-[0.25em] text-ink-foreground/60 hover:text-gold flex items-center gap-2 transition"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <section className="flex-1 overflow-auto">
        <Routes>
          <Route index element={<Navigate to="leads" replace />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="chats" element={<AdminChats />} />
          <Route path="collections" element={<AdminCollections />} />
          <Route path="content" element={<AdminContent />} />
        </Routes>
      </section>

      {/* Floating Megh concierge — only visible to authenticated admins */}
      <AdminMegh />
    </main>
  );
};

export default Admin;
