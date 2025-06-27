/*
  # Fix RLS infinite recursion

  1. Security Changes
    - Remove recursive policy that causes infinite loop
    - Create safe admin check using auth metadata
    - Maintain proper access control without recursion

  2. Policy Updates
    - Users can view/update own profiles
    - Admins get full access via auth metadata check
    - No recursive queries to profiles table
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Admin users have full access" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Drop the problematic function
DROP FUNCTION IF EXISTS is_admin_user();

-- Create policies that don't cause recursion
-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 3: Admin access using a safe approach
-- We'll check admin status by looking at a specific admin user ID
-- This avoids querying the profiles table from within its own policy
CREATE POLICY "Admin users have full access"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    -- Allow access if user is a known admin
    -- We'll identify admins by their specific user IDs
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE email = 'admin@playeola.com'
      OR raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Alternative approach: Create a separate admin_users table to avoid recursion
CREATE TABLE IF NOT EXISTS admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy for admin_users table
CREATE POLICY "Admin users can view admin list"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Update the admin policy to use the admin_users table
DROP POLICY IF EXISTS "Admin users have full access" ON profiles;

CREATE POLICY "Admin users have full access"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Function to safely add admin users
CREATE OR REPLACE FUNCTION add_admin_user(user_email TEXT)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Get the user ID from auth.users
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Add to admin_users table
  INSERT INTO admin_users (user_id)
  VALUES (target_user_id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Update the profile to mark as admin
  UPDATE profiles 
  SET is_admin = true 
  WHERE id = target_user_id;
  
  RETURN true;
END;
$$;

-- Add the admin user we created earlier
-- This will work because we're not querying profiles from within a profiles policy
DO $$
BEGIN
  -- Add admin status for the admin user
  PERFORM add_admin_user('admin@playeola.com');
END $$;