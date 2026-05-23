-- ================================================
-- 🚀 ONE-CLICK SUPABASE ORDERS SETUP
-- For: Aditya Medical & General Store
-- 
-- 📍 HOW TO USE:
-- 1. Go to: https://supabase.com/dashboard/project/rfcxhcucpzaplbprmbqm/sql/new
-- 2. Copy this entire file
-- 3. Paste in SQL Editor
-- 4. Click "Run" button
-- 5. Done! ✅
-- ================================================

-- Step 1: Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id BIGSERIAL PRIMARY KEY,
  customer_name TEXT,
  name TEXT,
  phone TEXT NOT NULL,
  medicines TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Step 3: Create Security Policies (Allow everyone for now)
CREATE POLICY "Allow public read access" 
ON public.orders FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access" 
ON public.orders FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access" 
ON public.orders FOR UPDATE 
USING (true);

-- Step 4: Enable Real-time Updates
BEGIN;
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE orders;
COMMIT;

-- Step 5: Add Sample Test Data
INSERT INTO public.orders (customer_name, name, phone, medicines, status, created_at) VALUES
('Rajesh Kumar', 'Rajesh Kumar', '+91 9876543210', 'Dolo 650 (10 tabs), Vitamin D3 (60 caps)', 'pending', NOW() - INTERVAL '30 minutes'),
('Priya Sharma', 'Priya Sharma', '+91 9123456789', 'Azithromycin 500mg (5 tabs), Paracetamol (20 tabs)', 'accepted', NOW() - INTERVAL '2 hours'),
('Amit Patel', 'Amit Patel', '+91 9988776655', 'Calcium + Vitamin D3 (30 tabs), Multivitamin (60 caps)', 'delivered', NOW() - INTERVAL '1 day');

-- ================================================
-- ✅ SETUP COMPLETE!
-- 
-- Next Steps:
-- 1. Open Admin Login: http://localhost:3000/admin-login.html
-- 2. Password: admin@123
-- 3. You should see 3 orders!
-- ================================================
