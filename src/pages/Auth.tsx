import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import MenuTrigger from "@/components/MenuTrigger";
import MenuOverlay from "@/components/MenuOverlay";

const Auth = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate("/admin");
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. Check your inbox if confirmation is required.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (e: any) {
      toast.error(e.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center silk-bg px-6 py-20">
      <MenuTrigger onOpen={() => setMenuOpen(true)} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-card border border-gold-deep/20 p-10 shadow-luxe"
      >
        <Link to="/" className="font-serif text-xl tracking-[0.2em] block text-center mb-8">
          MEGH<span className="text-gold-shimmer mx-1">·</span>BALIKA
        </Link>
        <h1 className="font-serif text-3xl text-center mb-2">{mode === "signin" ? "Atelier sign-in" : "Create account"}</h1>
        <p className="text-center text-sm text-muted-foreground mb-8">
          For Megh Balika team & admins only.
        </p>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-2"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Password</label>
            <input
              type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-border focus:border-gold outline-none py-2"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-luxe-primary w-full disabled:opacity-50">
            {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 w-full text-sm text-muted-foreground hover:text-gold transition"
        >
          {mode === "signin" ? "No account? Create one" : "Have an account? Sign in"}
        </button>
      </motion.div>
    </main>
  );
};

export default Auth;
