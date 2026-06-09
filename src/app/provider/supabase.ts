import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string; // Use service role key to bypass RLS if writing from backend
export const supabase = createClient(supabaseUrl, supabaseKey);
