import { createClient } from "@supabase/supabase-js";

export const client = createClient("https://example.supabase.co", "anon");
