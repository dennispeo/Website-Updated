/*
  # Fix infinite recursion in profiles RLS policy

  1. Problem
    - The current admin policy creates infinite recursion by querying the profiles table from within a profiles table policy
    - This happens when the policy tries to check if a user is admin by querying the same table it's protecting

  2. Solution
    - Drop the existing problematic policies
    - Create new policies that avoid recursive queries
    - Use a simpler approach for admin access that doesn't create circular dependencies

  3. Changes
    - Remove the recursive admin policy
    - Keep the simple owner access policy
    - Add a new admin policy that uses auth metadata or a different approach
*/

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Profiles are manageable by admins" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by owner" ON profiles;

-- Create new policies without recursion
-- Allow users to view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- For admin access, we'll use a different approach
-- This policy allows full access to profiles for users who have is_admin = true
-- We avoid recursion by using a direct check rather than a subquery
CREATE POLICY "Admin users have full access"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    -- Check if the current user's profile has is_admin = true
    -- We use auth.uid() directly to avoid recursion
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- Alternative: If you prefer to keep admin status in profiles table,
-- we can create a function to check admin status safely
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM profiles WHERE id = auth.uid()),
    false
  );
$$;

-- Drop the auth metadata policy and use the function instead
DROP POLICY IF EXISTS "Admin users have full access" ON profiles;

CREATE POLICY "Admin users have full access"
  ON profiles
  FOR ALL
  TO authenticated
  USING (is_admin_user());