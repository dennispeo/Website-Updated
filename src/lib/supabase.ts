import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Game {
  id: string;
  title: string;
  description: string;
  image_url: string;
  route: string;
  rtp: string;
  volatility: string;
  hit_frequency: string;
  max_win: string;
  free_spins: string;
  reels_rows: string;
  min_bet: string;
  max_bet: string;
  release_date: string;
  early_access_date: string;
  available: boolean;
  features: string;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  author: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}