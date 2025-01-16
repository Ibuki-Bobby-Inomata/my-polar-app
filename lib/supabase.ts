// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// サーバーサイド用 (サービスロール)
export const supabaseAdmin = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

// クライアント用 (匿名キー)
export const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);
