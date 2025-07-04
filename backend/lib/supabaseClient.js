import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://ibgkltqlgbafpoljizdu.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliZ2tsdHFsZ2JhZnBvbGppemR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMjU1NzksImV4cCI6MjA2NDkwMTU3OX0.Awa-Gdd3b4uR_1MnQySyA5s6hfVfyZB6jlVS1Jj_Afk"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)