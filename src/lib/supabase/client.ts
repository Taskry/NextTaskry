// src/lib/supabase/client.ts - 클라이언트용
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase client environment variables");
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
