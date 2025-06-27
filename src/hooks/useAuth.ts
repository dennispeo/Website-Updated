import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false); // Set to false to avoid loading states

  useEffect(() => {
    // Temporarily bypass all auth checks
    // Create a mock user and profile for testing
    const mockUser = {
      id: 'mock-admin-id',
      email: 'admin@playeola.com',
    } as User;

    const mockProfile = {
      id: 'mock-admin-id',
      email: 'admin@playeola.com',
      is_admin: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Profile;

    setUser(mockUser);
    setProfile(mockProfile);
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock successful sign in
    return { data: { user: user }, error: null };
  };

  const signOut = async () => {
    // Mock sign out
    setUser(null);
    setProfile(null);
    return { error: null };
  };

  const isAdmin = profile?.is_admin ?? true; // Always true for testing

  return {
    user,
    profile,
    loading,
    isAdmin,
    signIn,
    signOut,
  };
};