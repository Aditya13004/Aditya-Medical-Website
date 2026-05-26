-- ================================================
-- 🚀 ADDRESS SYSTEM SETUP
-- For: Aditya Medical & General Store
-- 
-- 📍 HOW TO USE:
-- 1. Go to: https://supabase.com/dashboard/project/rfcxhcucpzaplbprmbqm/sql/new
-- 2. Copy this entire file
-- 3. Paste in SQL Editor
-- 4. Click "Run" button
-- ================================================

-- Create User Addresses Table (completely independent, won't harm existing tables)
CREATE TABLE IF NOT EXISTS public.user_addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  landmark TEXT,
  city TEXT NOT NULL,
  state TEXT,
  pincode TEXT NOT NULL,
  address_type TEXT DEFAULT 'Home',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_user_addresses_email ON public.user_addresses(user_email);

-- Enable RLS
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies quietly in case they exist, then recreate them
DROP POLICY IF EXISTS "allow_all_addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "allow_insert_addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "allow_select_addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "allow_update_addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "allow_delete_addresses" ON public.user_addresses;

-- We allow public access since the client filters by email from localStorage
CREATE POLICY "allow_select_addresses" ON public.user_addresses FOR SELECT USING (true);
CREATE POLICY "allow_insert_addresses" ON public.user_addresses FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update_addresses" ON public.user_addresses FOR UPDATE USING (true);
CREATE POLICY "allow_delete_addresses" ON public.user_addresses FOR DELETE USING (true);

-- Ensure realtime updates can reach the client for this table too
BEGIN;
  -- Remove from publication if exists to avoid errors, then add
  ALTER PUBLICATION supabase_realtime ADD TABLE user_addresses;
EXCEPTION
  WHEN OTHERS THEN
    -- Table already added or publication error
END;
COMMIT;
