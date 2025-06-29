/*
  # Add Features Column to Games Table

  1. Changes
    - Add `features` column to games table
    - Update existing Zeus game with wavE feature
    - Set default value for new games

  2. Security
    - No changes to RLS policies needed
*/

-- Add features column to games table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'games' AND column_name = 'features'
  ) THEN
    ALTER TABLE games ADD COLUMN features text DEFAULT '';
  END IF;
END $$;

-- Update existing Zeus game with wavE feature
UPDATE games 
SET features = 'wavE'
WHERE title = 'Zeus: Clockwork Tyrant';