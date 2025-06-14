import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fznjwbxadwxojhvqvpro.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6bmp3YnhhZHd4b2podnF2cHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNDA4NDgsImV4cCI6MjA2NDgxNjg0OH0.wH1i2pej5roB1VnLnEp4AFZ5yqPOHPaJ1o9ah3Tg2Mw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
