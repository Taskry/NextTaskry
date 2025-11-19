import { createClient } from "@supabase/supabase-js";

export const supabaseServer = createClient(
  process.env.SUPABASE_URL!,                 // NEXT_PUBLIC❌
  process.env.SUPABASE_SERVICE_ROLE_KEY!,    // 서버에서만 사용 가능
  {
    auth: {
      persistSession: false,
    },
  }
);