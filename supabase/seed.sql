-- Seed file for initial setup
-- After creating your first user via the signup page, run this to make them a super admin:
-- Replace 'YOUR_USER_ID' with the actual UUID from auth.users table

-- Example: Make a user super admin
-- UPDATE public.profiles SET role = 'super_admin' WHERE id = 'YOUR_USER_ID';

-- Or you can set it via Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Click on your user
-- 3. Edit user metadata and add: {"role": "super_admin"}
-- 4. The trigger will sync it to the profiles table

-- Alternatively, if you know the email:
-- UPDATE public.profiles 
-- SET role = 'super_admin' 
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');