import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a null client if environment variables are missing
let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase environment variables not configured. Database features will be disabled.');
  // Create a mock client that returns empty results
  supabase = {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
      eq: function() { return this; },
      single: function() { return this; },
      order: function() { return this; },
      gte: function() { return this; },
      onConflict: function() { return this; },
      ignoreDuplicates: function() { return this; }
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    }
  };
}

export { supabase };
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

export interface Career {
  id: string;
  title: string;
  requirements: string[];
  description: string;
  department: string;
  location: string;
  employment_type: string;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}