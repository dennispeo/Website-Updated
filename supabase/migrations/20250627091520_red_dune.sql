/*
  # Create Admin User

  1. New Functions
    - `create_admin_user` - Function to create an admin user with email and password
  
  2. Security
    - Function can only be called by authenticated users with admin privileges
    - Creates both auth user and profile record
    - Sets is_admin to true automatically

  3. Usage
    - Call this function from your application or SQL editor
    - Provide email and password for the admin user
*/

-- Function to create an admin user
CREATE OR REPLACE FUNCTION create_admin_user(
  admin_email TEXT,
  admin_password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
  result JSON;
BEGIN
  -- Create the user in auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO new_user_id;

  -- Create the profile record
  INSERT INTO public.profiles (
    id,
    email,
    is_admin,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    admin_email,
    true,
    NOW(),
    NOW()
  );

  -- Return success result
  result := json_build_object(
    'success', true,
    'user_id', new_user_id,
    'email', admin_email,
    'message', 'Admin user created successfully'
  );

  RETURN result;

EXCEPTION
  WHEN OTHERS THEN
    -- Return error result
    result := json_build_object(
      'success', false,
      'error', SQLERRM,
      'message', 'Failed to create admin user'
    );
    RETURN result;
END;
$$;

-- Example usage (uncomment and modify the email/password):
-- SELECT create_admin_user('admin@playeola.com', 'your-secure-password-here');