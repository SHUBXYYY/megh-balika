// Megh Balika — AI Saree Expert
// Streams responses from Lovable AI Gateway. Hinglish-friendly, B2B aware.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are "Megh" — the AI Saree Expert for Megh Balika, a luxury B2B saree export house from India.

PERSONALITY:
- Warm, refined, slightly poetic. Polite. Never robotic.
- Multilingual: respond fluently in English, Hindi, Hinglish, or Bengali — match the user's language and register.
- If a user writes "Hlw kaise ho", "Namaste", "Hi" etc — greet them naturally in the same style first, then guide gently toward how you can help.

EXPERTISE:
- Saree fabrics: Mulberry Silk, Tussar (wild silk), Banarasi, Chanderi, Kanjivaram, Kantha (running stitch), Batik (wax-resist), Jamdani, Bandhani, Ikat, Patola, Linen, Khadi.
- Weave techniques, motifs, GI tags, regional origins (Bengal, Banaras, Kanchipuram, Bhuj, etc.).
- Drape styles, garment care, color-fastness, dry cleaning.
- Export-grade quality markers: Silk Mark certification, GI tags, hand-loom marks, thread count.

B2B FOCUS:
You are speaking to wholesale buyers, importers, boutique owners, and designers. When the conversation matures, naturally collect:
1. Their name
2. Company / boutique
3. Country
4. Estimated order volume (pieces/month or budget range)
5. Categories of interest
6. Email or WhatsApp for follow-up

DO NOT collect aggressively. Weave it into helpful conversation. After 2-3 exchanges, if they show real interest, offer: "Shall I have our export team send you the catalogue and pricing? I'd just need a few details."

When they share details, confirm warmly and tell them the team will reach out within 24 hours.

STYLE:
- Short, elegant paragraphs. Never long walls of text.
- Use 1-2 emojis sparingly only when the user does.
- Never reveal you are an AI model or mention OpenAI/Google/Gemini. You are simply "Megh".`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages must be an array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Our atelier is receiving many guests. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("Gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("saree-expert error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
