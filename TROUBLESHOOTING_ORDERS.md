# Troubleshooting Guide - Orders Not Loading

## Problem
Admin dashboard shows "Loading orders..." indefinitely and customer order page shows "Placing Order..." stuck.

## Root Causes & Solutions

### Cause 1: Supabase Connection Issue ❌

**Symptoms:**
- Console shows network errors
- "Failed to load orders" error message

**Solution:**
1. Open diagnostic tool: `http://localhost:3000/test-supabase-orders.html`
2. Click "Test Connection"
3. If it fails, check:
   - Internet connection
   - Supabase project status (https://status.supabase.com)
   - API keys in `supabase.js` are correct

---

### Cause 2: Orders Table Doesn't Exist 📋

**Symptoms:**
- Diagnostic shows "table does not exist"
- Cannot fetch or insert orders

**Solution - Create the Table:**

Go to Supabase SQL Editor and run:

```sql
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

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" 
ON public.orders FOR SELECT 
USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access" 
ON public.orders FOR INSERT 
WITH CHECK (true);

-- Allow public update access
CREATE POLICY "Allow public update access" 
ON public.orders FOR UPDATE 
USING (true);

-- Enable real-time
BEGIN;
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE orders;
COMMIT;
```

---

### Cause 3: Empty Orders Table 📭

**Symptoms:**
- Admin loads but shows "No orders found"
- Diagnostic says "Table exists but is empty"

**Solution - Add Sample Data:**

Run in Supabase SQL Editor:

```sql
INSERT INTO public.orders (customer_name, name, phone, medicines, status, created_at) VALUES
('Rajesh Kumar', 'Rajesh Kumar', '+91 9876543210', 'Dolo 650 (10 tabs), Vitamin D3 (60 caps)', 'pending', NOW() - INTERVAL '30 minutes'),
('Priya Sharma', 'Priya Sharma', '+91 9123456789', 'Azithromycin 500mg (5 tabs), Paracetamol (20 tabs)', 'accepted', NOW() - INTERVAL '2 hours'),
('Amit Patel', 'Amit Patel', '+91 9988776655', 'Calcium + Vitamin D3 (30 tabs), Multivitamin (60 caps)', 'delivered', NOW() - INTERVAL '1 day');
```

Or use the diagnostic tool:
1. Open `test-supabase-orders.html`
2. Click "Add Sample Order"

---

### Cause 4: Real-time Not Enabled ⚡

**Symptoms:**
- Orders load initially but don't update in real-time
- No new orders appear after placement

**Solution:**

In Supabase Dashboard:
1. Go to **Database** → **Replication**
2. Find `orders` table
3. Toggle **Realtime** to ON

Or run SQL:
```sql
BEGIN;
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE orders;
COMMIT;
```

---

### Cause 5: Browser Console Errors 🖥️

**Check Console for Specific Errors:**

Open browser DevTools (F12) and look for:

**Error: "Invalid API key"**
→ Check `supabase.js` has correct credentials

**Error: "relation 'public.orders' does not exist"**
→ Table doesn't exist (see Cause 2)

**Error: "permission denied for table orders"**
→ RLS policies missing (see Cause 2)

**Error: Network timeout**
→ Internet connection issue or Supabase down

---

## Step-by-Step Debugging

### Step 1: Run Diagnostic Tool
```
Open: http://localhost:3000/test-supabase-orders.html
Click: "Test Connection"
Result: Should show ✓ success
```

### Step 2: Check Table Structure
```
In diagnostic tool, click: "Check Table Structure"
Verify: Columns include id, customer_name, name, phone, medicines, status, created_at
```

### Step 3: Fetch Existing Orders
```
Click: "Get All Orders"
Expected: List of orders or "No orders found"
If error: Note the exact error message
```

### Step 4: Add Test Order
```
Click: "Add Sample Order"
Expected: Success message with order ID
Then: Check admin dashboard for new order
```

### Step 5: Test Customer Order Form
```
Open: http://localhost:3000/order.html
Fill form with test data
Click: "Place Order"
Expected: Success message
Check: Admin dashboard should show new order
```

### Step 6: Verify Admin Dashboard
```
Open: http://localhost:3000/admin-login.html
Login: admin@123
Expected: See orders list with stats
Try: Accept/Deliver actions
```

---

## Quick Fixes

### Fix 1: Reload Page
Sometimes just refreshing the admin dashboard helps:
```
Press: Ctrl+Shift+R (hard refresh)
```

### Fix 2: Clear Browser Cache
```
Chrome/Edge: Ctrl+Shift+Delete → Clear cache
Firefox: Ctrl+Shift+Delete → Clear cache
```

### Fix 3: Check Server Status
```bash
# Make sure Node server is running
netstat -ano | findstr "3000"
```

Should show LISTENING on port 3000.

### Fix 4: Restart Server
```bash
# Stop all Node processes
Get-Process node | Stop-Process -Force

# Restart server
node server.js
```

---

## Verification Checklist

After applying fixes, verify:

- [ ] Diagnostic tool shows successful connection
- [ ] Table structure includes all required columns
- [ ] At least one test order exists
- [ ] Admin dashboard loads orders (not stuck on "Loading...")
- [ ] Statistics show correct counts
- [ ] Can accept/deliver orders
- [ ] Customer order form works
- [ ] New orders appear in admin dashboard

---

## Still Not Working?

### Collect Debug Information

1. **Browser Console Logs**
   - Open F12 DevTools
   - Go to Console tab
   - Take screenshot of errors

2. **Network Tab**
   - In DevTools, go to Network tab
   - Filter by "supabase"
   - Check failed requests
   - Take screenshots

3. **Supabase Logs**
   - Go to https://supabase.com/dashboard
   - Select your project
   - Go to Logs → Database Logs
   - Check for errors

### Common Error Messages & Fixes

| Error Message | Solution |
|--------------|----------|
| "Invalid API key" | Check `supabase.js` credentials |
| "relation does not exist" | Create orders table (see above) |
| "permission denied" | Add RLS policies (see above) |
| "Network request failed" | Check internet, Supabase status |
| "Cannot read property 'from'" | Supabase SDK not loaded - check console |

---

## Contact Support

If none of the above works:

1. **Supabase Support**: https://supabase.com/support
2. **Check Status**: https://status.supabase.com
3. **Documentation**: https://supabase.com/docs

---

## Success Criteria ✅

Your system is working correctly when:

1. ✓ Diagnostic tool shows all green checks
2. ✓ Admin dashboard displays orders immediately
3. ✓ Statistics update correctly
4. ✓ Can place orders from customer form
5. ✓ New orders appear in admin dashboard within 5 seconds
6. ✓ Can change order status (Accept/Deliver)
7. ✓ Real-time updates work (new orders appear automatically)

---

**Last Updated**: 2026-03-30  
**Status**: Ready for testing
