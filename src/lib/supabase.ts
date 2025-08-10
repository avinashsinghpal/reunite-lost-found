import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://tjnkttkckzoyfhicotdd.supabase.co'
const supabaseAnonKey = 'sb_publishable_uxHAESRw0Yu4w3K240NUZQ_PQCtQYkb'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  ITEMS: 'items',
  STORAGE: 'lost_found_images'
} as const

export default supabase
