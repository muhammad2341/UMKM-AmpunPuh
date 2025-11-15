// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Ambil dari Project Settings > API di dashboard Supabase Anda
const supabaseUrl = 'https_://YOUR_PROJECT_URL.supabase.co'
const supabaseAnonKey = 'YOUR_ANON_PUBLIC_KEY'

// Simpan di file .env di root proyek Anda
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)