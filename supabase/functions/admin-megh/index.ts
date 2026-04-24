import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Admin Megh — concierge inside the dashboard.
 * Validates JWT, ensures caller is an admin, fetches a snapshot of the atelier,
 * and asks Lovable AI to answer + suggest next actions in clear English.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing auth" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Admin only" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const messages: Array<{ role: string; content: string }> = Array.isArray(body.messages) ? body.messages : [];
    const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
    if (!lastUser || typeof lastUser !== "string" || lastUser.length > 4000) {
      return new Response(JSON.stringify({ error: "Invalid message" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Snapshot atelier state
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayIso = today.toISOString();

    const [
      { count: leadsTotal },
      { count: leadsToday },
      { data: recentLeads },
      { count: bookingsTotal },
      { count: bookingsPending },
      { data: upcoming },
      { count: chatSessions },
      { count: collectionsTotal },
      { count: collectionsDraft },
      { count: productsTotal },
      { count: productsDraft },
      { count: lowStock },
      { count: inquiriesTotal },
      { count: inquiriesNew },
      { data: recentInquiries },
      { count: adminCount },
    ] = await Promise.all([
      admin.from("leads").select("*", { count: "exact", head: true }),
      admin.from("leads").select("*", { count: "exact", head: true }).gte("created_at", todayIso),
      admin.from("leads").select("full_name,email,company,country,source,created_at").order("created_at", { ascending: false }).limit(5),
      admin.from("appointments").select("*", { count: "exact", head: true }),
      admin.from("appointments").select("*", { count: "exact", head: true }).eq("status", "pending"),
      admin.from("appointments").select("full_name,email,company,scheduled_at,status").gte("scheduled_at", new Date().toISOString()).order("scheduled_at").limit(5),
      admin.from("chat_sessions").select("*", { count: "exact", head: true }).gte("created_at", since),
      admin.from("collections").select("*", { count: "exact", head: true }),
      admin.from("collections").select("*", { count: "exact", head: true }).eq("published", false),
      admin.from("products").select("*", { count: "exact", head: true }),
      admin.from("products").select("*", { count: "exact", head: true }).eq("published", false),
      admin.from("products").select("*", { count: "exact", head: true }).lte("stock", 2),
      admin.from("inquiries").select("*", { count: "exact", head: true }),
      admin.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
      admin.from("inquiries").select("full_name,email,subject,created_at").order("created_at", { ascending: false }).limit(5),
      admin.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "admin"),
    ]);

    const snapshot = {
      leads: { total: leadsTotal ?? 0, today: leadsToday ?? 0, recent: recentLeads ?? [] },
      bookings: { total: bookingsTotal ?? 0, pending: bookingsPending ?? 0, upcoming: upcoming ?? [] },
      inquiries: { total: inquiriesTotal ?? 0, new: inquiriesNew ?? 0, recent: recentInquiries ?? [] },
      chats: { sessionsLast7Days: chatSessions ?? 0 },
      collections: { total: collectionsTotal ?? 0, drafts: collectionsDraft ?? 0 },
      products: { total: productsTotal ?? 0, drafts: productsDraft ?? 0, lowStock: lowStock ?? 0 },
      team: { admins: adminCount ?? 0 },
    };

    const SYSTEM = `You are Megh, the warm concierge of the Megh Balika atelier dashboard.
You help the admin (Reshmi Pradhan or her team) understand what is happening across leads, bookings, inquiries, orders, chat sessions and the saree collections.

Style:
- Reply in clear, professional, friendly English — 2 to 6 short sentences.
- Use small bullet lists when summarising numbers.
- Always end with one or two concrete next steps the admin can take, prefixed with "Next steps:".
- Reference ONLY the data provided in the snapshot. If the answer is not there, say so honestly.
- Never invent leads, bookings, or contacts. Never expose secrets or technical jargon.

Today's atelier snapshot (JSON):
${JSON.stringify(snapshot, null, 2)}
`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM },
          ...messages.slice(-10).map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: String(m.content).slice(0, 4000),
          })),
        ],
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Megh is a little busy (rate limit). Please try again in a minute." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please top up in the Lovable workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResp.text();
      console.error("AI error", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResp.json();
    const reply = data.choices?.[0]?.message?.content ?? "Sorry, no reply received.";
    return new Response(JSON.stringify({ reply, snapshot }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-megh error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
