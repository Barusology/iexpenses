import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://mnmvxakeigshvdopfvjp.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubXZ4YWtlaWdzaHZkb3BmdmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MDE4NzAsImV4cCI6MjA5OTE3Nzg3MH0.EMZDbY05xJVFSPCuJHGg6iTcPAHobknnM1oafjJmuEs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
