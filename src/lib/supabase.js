import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://umgztbsclpznwgdocgbh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtZ3p0YnNjbHB6bndnZG9jZ2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxOTI0MjQsImV4cCI6MjA4MDc2ODQyNH0.SDEI1cEjL7_zJLz94ZbdowY0m4QwSBrC3CKsvuKdGzY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

