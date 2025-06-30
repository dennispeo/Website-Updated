/*
  # Create Careers Management Table

  1. New Tables
    - `careers`
      - `id` (uuid, primary key)
      - `title` (text)
      - `requirements` (text array)
      - `description` (text)
      - `department` (text)
      - `location` (text)
      - `employment_type` (text)
      - `active` (boolean)
      - `sort_order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on careers table
    - Add policies for public viewing and admin management
*/

-- Create careers table
CREATE TABLE IF NOT EXISTS careers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  requirements text[] DEFAULT '{}',
  description text DEFAULT '',
  department text DEFAULT 'General',
  location text DEFAULT 'Remote',
  employment_type text DEFAULT 'Full-time',
  active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;

-- Policies for careers table
CREATE POLICY "Active careers are viewable by everyone"
  ON careers
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Careers are manageable by admins"
  ON careers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER careers_updated_at
  BEFORE UPDATE ON careers
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Insert default career positions
INSERT INTO careers (title, requirements, description, department, sort_order) VALUES
(
  'Game Artists & Designers',
  ARRAY['3+ years in game art', 'Strong portfolio', 'UI/UX expertise'],
  'Create stunning visual experiences and intuitive user interfaces for our innovative slot games.',
  'Design',
  1
),
(
  'Game Developers',
  ARRAY['JavaScript/TypeScript', 'WebGL/Three.js', 'React expertise'],
  'Build cutting-edge game mechanics and bring our creative visions to life with modern web technologies.',
  'Engineering',
  2
),
(
  'Mathematicians & Game Analysts',
  ARRAY['Statistics background', 'Game theory', 'Data analysis'],
  'Design game mathematics, analyze player behavior, and optimize game performance through data-driven insights.',
  'Analytics',
  3
);