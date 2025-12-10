import { createClient } from '@supabase/supabase-js'

// Your Supabase credentials
const supabaseUrl = 'https://enwjmsqlhvisikljwvvz.supabase.co'
const supabaseKey = 'sb_publishable_Q1LxfAfiZ4h5XWOYUAmg_g_H6lYdZ14'

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

// Test connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('Connection test failed:', error.message)
      return { 
        connected: false, 
        error: error.message,
        message: 'Check if RLS is enabled and policies are set'
      }
    }
    
    console.log('✅ Supabase connection successful')
    return { 
      connected: true, 
      message: 'Connected to Supabase successfully'
    }
  } catch (err) {
    console.error('Connection error:', err)
    return { 
      connected: false, 
      error: err.message,
      message: 'Network or configuration error'
    }
  }
}