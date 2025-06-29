/*
  # User Analytics Schema

  1. New Tables
    - `page_views` - Track page visits and user journeys
    - `user_interactions` - Track button clicks, form submissions, etc.
    - `user_sessions` - Track user sessions and engagement
    - `conversion_events` - Track important conversion actions

  2. Security
    - Enable RLS on all analytics tables
    - Allow anonymous data collection for public users
    - Admin access for viewing analytics data
*/

-- Page Views Table
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  page_path text NOT NULL,
  page_title text,
  referrer text,
  user_agent text,
  ip_address inet,
  country text,
  device_type text, -- mobile, desktop, tablet
  browser text,
  os text,
  screen_resolution text,
  viewport_size text,
  time_on_page integer, -- seconds
  scroll_depth integer, -- percentage
  created_at timestamptz DEFAULT now()
);

-- User Interactions Table
CREATE TABLE IF NOT EXISTS user_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  page_path text NOT NULL,
  interaction_type text NOT NULL, -- click, form_submit, download, etc.
  element_id text,
  element_class text,
  element_text text,
  target_url text,
  form_name text,
  button_text text,
  position_x integer,
  position_y integer,
  created_at timestamptz DEFAULT now()
);

-- User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  first_page text,
  last_page text,
  total_pages_viewed integer DEFAULT 1,
  total_interactions integer DEFAULT 0,
  session_duration integer, -- seconds
  bounce boolean DEFAULT false,
  conversion boolean DEFAULT false,
  conversion_type text,
  device_type text,
  browser text,
  country text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

-- Conversion Events Table
CREATE TABLE IF NOT EXISTS conversion_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type text NOT NULL, -- contact_form, game_demo, career_apply, etc.
  event_value text,
  page_path text,
  funnel_step integer,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;

-- Policies for analytics tables (allow anonymous data collection)
CREATE POLICY "Allow anonymous analytics data insertion"
  ON page_views
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anonymous interactions data insertion"
  ON user_interactions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anonymous sessions data insertion"
  ON user_sessions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anonymous conversion data insertion"
  ON conversion_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admin access policies
CREATE POLICY "Admins can view all analytics"
  ON page_views
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all interactions"
  ON user_interactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all sessions"
  ON user_sessions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all conversions"
  ON conversion_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);

CREATE INDEX IF NOT EXISTS idx_user_interactions_session_id ON user_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_created_at ON user_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_user_interactions_type ON user_interactions(interaction_type);

CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON user_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);

CREATE INDEX IF NOT EXISTS idx_conversion_events_created_at ON conversion_events(created_at);
CREATE INDEX IF NOT EXISTS idx_conversion_events_type ON conversion_events(event_type);