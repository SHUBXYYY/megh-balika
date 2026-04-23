import { useEffect, useState } from "react";
import { Routes, Route, NavLink, Navigate, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Users, MessageSquare, Calendar, ShieldAlert, LogOut,
  LayoutGrid, FileText, ChevronLeft, Menu, X, LayoutDashboard,
  Package, MailOpen, ShieldCheck,
} from "lucide-react";
import AdminLeads from "@/components/admin/AdminLeads";
import AdminBookings from "@/components/admin/AdminBookings";
import AdminChats from "@/components/admin/AdminChats";
import AdminCollections from "@/components/admin/AdminCollections";
import AdminContent from "@/components/admin/AdminContent";
import AdminMegh from "@/components/admin/AdminMegh";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminInquiries from "@/components/admin/AdminInquiries";
import AdminTeam from "@/components/admin/AdminTeam";

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [navOpen, setNavOpen] = useState(false);
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
        <div className="max-w-md text-center bg-card p-8 sm:p-10 border border-border relative z-10">
          <ShieldAlert className="h-10 w-10 text-gold mx-auto mb-4" strokeWidth={1.2} />
          <h1 className="font-serif text-2xl sm:text-3xl mb-3">Admin access only</h1>
          <p className="text-sm text-muted-foreground mb-6">
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
    { to: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "leads", label: "Leads", icon: Users },
    { to: "bookings", label: "Bookings", icon: Calendar },
    { to: "inquiries", label: "Inquiries", icon: MailOpen },
    { to: "chats", label: "Chat sessions", icon: MessageSquare },
    { to: "collections", label: "Collections", icon: LayoutGrid },
    { to: "products", label: "Products", icon: Package },
    { to: "content", label: "Site content", icon: FileText },
    { to: "team", label: "Team & access", icon: ShieldCheck },
  ];

  const SidebarBody = (
    <>
      <div className="p-5 sm:p-6 border-b border-ink-foreground/10">
        <Link
          to="/"
          className="font-serif text-base tracking-[0.2em] flex items-center gap-2 hover:text-gold transition"
          onClick={() => setNavOpen(false)}
        >
          <ChevronLeft className="h-4 w-4" />
          MEGH<span className="text-gold-shimmer mx-0.5">·</span>BALIKA
        </Link>
        <div className="text-[10px] uppercase tracking-[0.3em] text-gold-deep mt-2">Atelier dashboard</div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            onClick={() => setNavOpen(false)}
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
    </>
  );

  return (
    <main className="min-h-screen bg-background lg:flex">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 bg-ink text-ink-foreground border-b border-ink-foreground/10 flex items-center justify-between px-4 py-3">
        <Link to="/" className="font-serif text-sm tracking-[0.2em] flex items-center gap-1.5">
          MEGH<span className="text-gold-shimmer">·</span>BALIKA
        </Link>
        <button
          onClick={() => setNavOpen(true)}
          className="p-2 -mr-2 text-ink-foreground/80 hover:text-gold"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {navOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex" onClick={() => setNavOpen(false)}>
          <aside
            onClick={(e) => e.stopPropagation()}
            className="w-72 max-w-[85vw] bg-ink text-ink-foreground flex flex-col animate-in slide-in-from-left duration-200"
          >
            <button
              onClick={() => setNavOpen(false)}
              className="absolute top-4 right-4 p-2 text-ink-foreground/60 hover:text-gold"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {SidebarBody}
          </aside>
          <div className="flex-1 bg-ink/60 backdrop-blur-sm" />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-ink text-ink-foreground flex-col">
        {SidebarBody}
      </aside>

      {/* Content */}
      <section className="flex-1 overflow-auto">
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="chats" element={<AdminChats />} />
          <Route path="collections" element={<AdminCollections />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="team" element={<AdminTeam />} />
        </Routes>
      </section>

      {/* Floating Megh concierge — only visible to authenticated admins */}
      <AdminMegh />
    </main>
  );
};

export default Admin;
