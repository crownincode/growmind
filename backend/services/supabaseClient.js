import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Test database connection
export async function testConnection() {
  try {
    const { error } = await supabase.from('plants').select('count')
    if (error) throw error
    console.log('✅ Supabase connection successful')
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message)
    return false
  }
}
