import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://tjnkttkckzoyfhicotdd.supabase.co'
const supabaseAnonKey = 'sb_publishable_uxHAESRw0Yu4w3K240NUZQ_PQCtQYkb'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  ITEMS: 'items',
  // Must match the actual Supabase Storage bucket name in your project
  STORAGE: 'item-images'
} as const

export default supabase
