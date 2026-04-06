import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gavhkkrnsuisqsjnnaow.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdhdmhra3Juc3Vpc3Fzam5uYW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0ODg5MDYsImV4cCI6MjA5MTA2NDkwNn0.zbReeZvpWB4SRn6-zorwh1rUJWE2yt2vG3WyT2CblJI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

