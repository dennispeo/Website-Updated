/*
  # Initial Schema Setup for Play E Ola CMS

  1. New Tables
    - `games`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `route` (text, unique)
      - `rtp` (text)
      - `volatility` (text)
      - `hit_frequency` (text)
      - `max_win` (text)
      - `free_spins` (text)
      - `reels_rows` (text)
      - `min_bet` (text)
      - `max_bet` (text)
      - `release_date` (date)
      - `early_access_date` (date)
      - `available` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `news`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `excerpt` (text)
      - `image_url` (text)
      - `author` (text)
      - `published` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `is_admin` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin users
*/

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text DEFAULT '',
  route text UNIQUE NOT NULL,
  rtp text DEFAULT '96.00%',
  volatility text DEFAULT 'Medium',
  hit_frequency text DEFAULT '25.00%',
  max_win text DEFAULT '1000x',
  free_spins text DEFAULT '1 in 100',
  reels_rows text DEFAULT '5x3',
  min_bet text DEFAULT '€0.10',
  max_bet text DEFAULT '€50.00',
  release_date date DEFAULT CURRENT_DATE,
  early_access_date date DEFAULT CURRENT_DATE,
  available boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text DEFAULT '',
  image_url text DEFAULT '',
  author text DEFAULT 'Play E Ola Team',
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Games policies
CREATE POLICY "Games are viewable by everyone"
  ON games
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Games are manageable by admins"
  ON games
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- News policies
CREATE POLICY "Published news are viewable by everyone"
  ON news
  FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "News are manageable by admins"
  ON news
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Profiles policies
CREATE POLICY "Profiles are viewable by owner"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Profiles are manageable by admins"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Insert sample data
INSERT INTO games (
  title,
  description,
  image_url,
  route,
  rtp,
  volatility,
  hit_frequency,
  max_win,
  free_spins,
  reels_rows,
  min_bet,
  max_bet,
  release_date,
  early_access_date,
  available
) VALUES (
  'Zeus: Clockwork Tyrant',
  'An oppressive myth-tech world where wilds move, merge, and explode. Powered by our wavE™ mechanic, this game turns tension into payoff.',
  '/image.png',
  '/games/zeus-clockwork-tyrant',
  '96.06%',
  'High',
  '31.41%',
  '99,999x',
  '1 in 249',
  '3-2-3-2-3',
  '€0.20',
  '€100.00',
  '2025-03-25',
  '2025-03-17',
  true
);

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER games_updated_at
  BEFORE UPDATE ON games
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();