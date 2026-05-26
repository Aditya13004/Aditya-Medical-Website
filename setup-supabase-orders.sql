-- ================================================
-- 🚀 ONE-CLICK SUPABASE FULL SHOP SETUP
-- For: Aditya Medical & General Store
-- 
-- 📍 HOW TO USE:
-- 1. Go to: https://supabase.com/dashboard/project/rfcxhcucpzaplbprmbqm/sql/new
-- 2. Copy this entire file
-- 3. Paste in SQL Editor
-- 4. Click "Run" button
-- 5. Done! ✅
-- ================================================

-- ================================================
-- Step 1: Create Orders Table (with exact production policies)
-- ================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id         BIGSERIAL    PRIMARY KEY,
  name       TEXT         NOT NULL,
  email      TEXT,        -- Added email field here
  phone      TEXT         NOT NULL,
  medicines  TEXT         NOT NULL,
  status     TEXT         NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending','accepted','delivered')),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 🔑 CRITICAL: This line forces the email column to be attached to your existing table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS email TEXT;
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(email);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies quietly in case they exist, then recreate them
DROP POLICY IF EXISTS "allow_insert_orders" ON public.orders;
DROP POLICY IF EXISTS "allow_select_orders" ON public.orders;
DROP POLICY IF EXISTS "allow_update_orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public select orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public update orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public delete orders" ON public.orders;

CREATE POLICY "allow_insert_orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_select_orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "allow_update_orders" ON public.orders FOR UPDATE USING (true);

-- ================================================
-- Step 2: Create Medicines Catalogue Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.medicines (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  stock TEXT DEFAULT 'in-stock',
  image_url TEXT,
  rating NUMERIC DEFAULT 4.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;

-- Drop existing medicine policies quietly
DROP POLICY IF EXISTS "Allow public select medicines" ON public.medicines;
DROP POLICY IF EXISTS "Allow public insert medicines" ON public.medicines;
DROP POLICY IF EXISTS "Allow public update medicines" ON public.medicines;
DROP POLICY IF EXISTS "Allow public delete medicines" ON public.medicines;

CREATE POLICY "Allow public select medicines" ON public.medicines FOR SELECT USING (true);
CREATE POLICY "Allow public insert medicines" ON public.medicines FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update medicines" ON public.medicines FOR UPDATE USING (true);
CREATE POLICY "Allow public delete medicines" ON public.medicines FOR DELETE USING (true);

-- ================================================
-- Step 3: Create Prescriptions Uploads Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id BIGSERIAL PRIMARY KEY,
  patient_name TEXT,
  patient_email TEXT,
  doctor_name TEXT,
  prescription_date TEXT,
  special_instructions TEXT,
  file_url TEXT,
  extracted_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing prescription policies quietly
DROP POLICY IF EXISTS "Allow public select prescriptions" ON public.prescriptions;
DROP POLICY IF EXISTS "Allow public insert prescriptions" ON public.prescriptions;
DROP POLICY IF EXISTS "Allow public update prescriptions" ON public.prescriptions;
DROP POLICY IF EXISTS "Allow public delete prescriptions" ON public.prescriptions;

CREATE POLICY "Allow public select prescriptions" ON public.prescriptions FOR SELECT USING (true);
CREATE POLICY "Allow public insert prescriptions" ON public.prescriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update prescriptions" ON public.prescriptions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete prescriptions" ON public.prescriptions FOR DELETE USING (true);

-- ================================================
-- Step 4: Create Saved Addresses Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.saved_addresses (
  id BIGSERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'home' CHECK (type IN ('home','office','other')),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_addresses_user_email ON public.saved_addresses(user_email);

ALTER TABLE public.saved_addresses ENABLE ROW LEVEL SECURITY;

-- Drop existing address policies quietly
DROP POLICY IF EXISTS "Allow public select addresses" ON public.saved_addresses;
DROP POLICY IF EXISTS "Allow public insert addresses" ON public.saved_addresses;
DROP POLICY IF EXISTS "Allow public update addresses" ON public.saved_addresses;
DROP POLICY IF EXISTS "Allow public delete addresses" ON public.saved_addresses;

CREATE POLICY "Allow public select addresses" ON public.saved_addresses FOR SELECT USING (true);
CREATE POLICY "Allow public insert addresses" ON public.saved_addresses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update addresses" ON public.saved_addresses FOR UPDATE USING (true);
CREATE POLICY "Allow public delete addresses" ON public.saved_addresses FOR DELETE USING (true);

-- ================================================
-- Step 5: Enable Real-time Updates for All Tables
-- ================================================
BEGIN;
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE orders, medicines, prescriptions, saved_addresses;
COMMIT;

-- ================================================
-- Step 6: Seed Sample Test Data
-- ================================================
INSERT INTO public.orders (name, phone, medicines, status, created_at) VALUES
('Rajesh Kumar', '+91 9876543210', 'Dolo 650 (10 tabs), Vitamin D3 (60 caps)', 'pending', NOW() - INTERVAL '30 minutes'),
('Priya Sharma', '+91 9123456789', 'Azithromycin 500mg (5 tabs), Paracetamol (20 tabs)', 'accepted', NOW() - INTERVAL '2 hours'),
('Amit Patel', '+91 9988776655', 'Calcium + Vitamin D3 (30 tabs), Multivitamin (60 caps)', 'delivered', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

INSERT INTO public.medicines (name, category, price, stock, rating) VALUES
('Paracetamol 500mg', 'pain-relief', 45, 'in-stock', 4.5),
('Ibuprofen 400mg', 'pain-relief', 60, 'in-stock', 4.3),
('Dolo 650mg', 'pain-relief', 55, 'in-stock', 4.8),
('Amoxicillin 500mg', 'antibiotics', 120, 'in-stock', 4.6),
('Azithromycin 500mg', 'antibiotics', 150, 'in-stock', 4.7),
('Vitamin D3 1000IU', 'supplements', 80, 'in-stock', 4.5),
('Digital Thermometer', 'devices', 250, 'in-stock', 4.2)
ON CONFLICT DO NOTHING;

-- ================================================
-- ✅ SETUP COMPLETE!
-- 
-- Next Steps:
-- 1. Create a public Storage bucket named 'prescriptions' in Supabase Storage dashboard.
-- 2. Open Admin Panel: http://localhost:3000/admin.html
-- ================================================
