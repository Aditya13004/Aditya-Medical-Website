-- ================================================
-- 🔧 ADD EMAIL COLUMN TO ORDERS TABLE
-- For: Aditya Medical & General Store
--
-- 📍 HOW TO USE:
-- 1. Go to: https://supabase.com/dashboard/project/rfcxhcucpzaplbprmbqm/sql/new
-- 2. Paste this entire file
-- 3. Click "Run" button
-- 4. Done! ✅
-- ================================================

-- Add email column (safe - only adds if it doesn't exist)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Create an index for fast email lookups (used by customer dashboard)
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(email);

-- ================================================
-- ✅ DONE! Customer dashboard will now show orders
--    linked to the logged-in user's email.
-- ================================================
