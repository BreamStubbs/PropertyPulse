import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { AppData } from "@/lib/types";

// NEXT_PUBLIC_* are inlined at build time, so these are known at module load.
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when the app is configured to sync to Supabase (else it uses localStorage). */
export const SUPABASE_ENABLED = Boolean(URL && ANON);

let client: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  client = SUPABASE_ENABLED ? createClient(URL!, ANON!, { auth: { persistSession: false } }) : null;
  return client;
}

// Simple cloud-sync model: the entire app dataset lives in one row.
const STATE_TABLE = "app_state";
const STATE_ID = "singleton";

export async function loadRemoteData(sb: SupabaseClient): Promise<AppData | null> {
  const { data, error } = await sb.from(STATE_TABLE).select("data").eq("id", STATE_ID).maybeSingle();
  if (error) {
    console.warn("[supabase] load failed:", error.message);
    return null;
  }
  return (data?.data as AppData) ?? null;
}

export async function saveRemoteData(sb: SupabaseClient, data: AppData): Promise<boolean> {
  const { error } = await sb
    .from(STATE_TABLE)
    .upsert({ id: STATE_ID, data, updated_at: new Date().toISOString() });
  if (error) {
    console.warn("[supabase] save failed:", error.message);
    return false;
  }
  return true;
}
