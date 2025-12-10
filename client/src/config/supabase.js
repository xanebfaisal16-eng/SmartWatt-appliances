import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://enwjmsqlhvisikljwvvz.supabase.co';
const supabaseKey = 'sb_publishable_Q1LxfAfiZ4h5XWOYUAmg_g_H6lYdZ14';

export const supabase = createClient(supabaseUrl, supabaseKey);