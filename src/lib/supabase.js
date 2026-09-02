import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Public pages include verified bundled content, so a missing deployment
// variable must never prevent React from rendering the website. API calls made
// without configuration reject inside their existing loading boundaries and
// the public pages keep using their bundled content. The admin still requires
// the two VITE_SUPABASE values to be configured by the deployment provider.
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

