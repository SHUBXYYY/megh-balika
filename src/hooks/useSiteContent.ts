import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

let cache: Record<string, string> | null = null;
const subscribers = new Set<(v: Record<string, string>) => void>();

async function load() {
  const { data } = await supabase.from("site_content").select("key, value");
  const map: Record<string, string> = {};
  (data ?? []).forEach((r) => { map[r.key] = r.value; });
  cache = map;
  subscribers.forEach((cb) => cb(map));
  return map;
}

export function useSiteContent() {
  const [content, setContent] = useState<Record<string, string>>(cache ?? {});

  useEffect(() => {
    if (!cache) load();
    else setContent(cache);
    const cb = (v: Record<string, string>) => setContent(v);
    subscribers.add(cb);
    return () => { subscribers.delete(cb); };
  }, []);

  return {
    content,
    get: (key: string, fallback = "") => content[key] ?? fallback,
    refresh: load,
  };
}

export const SITE_DEFAULTS = {
  contact_email: "reshmip632@gmail.com",
  contact_phone: "+91 70013 78042",
  whatsapp_number: "917001378042",
  whatsapp_default_message: "Namaste! I came across Megh Balika and would like to know more.",
};
