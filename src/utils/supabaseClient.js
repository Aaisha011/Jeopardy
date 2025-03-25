import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY; // Only for server-side

//  Client-side Supabase (Public)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Persist session across page reloads
    autoRefreshToken: true, // Automatically refresh token
    detectSessionInUrl: true, // Detect session in URL (useful for OAuth)
  },
});

//  Server-side Supabase (Admin - Use Only in API Routes)
// export const supabaseAdmin = createClient(supabaseUrl,supabaseServiceRole , {
//   auth: {
//     persistSession: false, // Admin doesn't need session persistence
//   },
// });
