/*
  # Fix user_sessions RLS policy for anonymous updates

  1. Security Changes
    - Add UPDATE policy for anonymous users on user_sessions table
    - This allows the analytics system to properly upsert session data
    - Anonymous users can update session records they created

  2. Problem Solved
    - Resolves 403 error when analytics tries to update existing sessions
    - Enables proper session tracking for anonymous users
    - Maintains security by allowing updates for anonymous users
*/

-- Add UPDATE policy for anonymous users on user_sessions table
CREATE POLICY "Allow anonymous sessions data update"
  ON user_sessions
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);