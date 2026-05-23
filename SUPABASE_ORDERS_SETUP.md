# Supabase Configuration - Admin Dashboard Orders

## ✅ Configuration Complete

The admin dashboard is now configured to work with **Supabase** for order management.

## Architecture

```
Admin Dashboard (admin.html)
        ↓
    getSupabase()
        ↓
   Supabase Client
        ↓
   Supabase Cloud Database
   Table: public.orders
```

## What's Working

### 1. **Load Orders from Supabase**
```javascript
const { data, error } = await supabase
  .from('orders')
  .select('*')
  .order('created_at', { ascending: false });
```

### 2. **Update Order Status**
```javascript
const { error } = await supabase
  .from('orders')
  .update({ status: newStatus })
  .eq('id', id);
```

### 3. **Real-time Updates**
```javascript
supabase.channel('orders-changes')
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'orders' 
  }, payload => {
    // Handle INSERT, UPDATE, DELETE
  })
  .subscribe();
```

## Supabase Table Schema

Your `orders` table should have these columns:

| Column Name | Type | Description |
|------------|------|-------------|
| `id` | int8 (PK) | Primary key |
| `customer_name` | text | Customer name |
| `phone` | text | Contact number |
| `medicines` | text/jsonb | Order items |
| `status` | text | pending/accepted/delivered |
| `created_at` | timestamptz | Order timestamp |
| `updated_at` | timestamptz | Last update |

## Testing Instructions

### 1. Open Admin Login
```
http://localhost:3000/admin-login.html
Password: admin@123
```

### 2. Verify Orders Load
- Check browser console (F12)
- Look for: `✅ Loaded orders from Supabase: X`
- Orders should display in the table

### 3. Test Actions
- Click "✅ Accept" on pending orders
- Click "🚚 Deliver" on accepted orders
- Success toast should appear
- Status should update in real-time

## Supabase Setup Checklist

If orders aren't loading, verify:

### ✓ Supabase Project
- [ ] Project URL: `https://rfcxhcucpzaplbprmbqm.supabase.co`
- [ ] Anon Key is valid (check `supabase.js`)
- [ ] Table `orders` exists
- [ ] Table has data

### ✓ Row Level Security (RLS)
- [ ] RLS is enabled on `orders` table
- [ ] Policy allows SELECT for anon users
- [ ] Policy allows UPDATE for anon users

**Example RLS Policies:**
```sql
-- Allow anyone to read orders
CREATE POLICY "Allow public read access" 
ON orders FOR SELECT 
USING (true);

-- Allow anyone to update orders
CREATE POLICY "Allow public update access" 
ON orders FOR UPDATE 
USING (true);
```

### ✓ Real-time Settings
- [ ] Real-time is enabled on `orders` table
- [ ] Publication includes `orders` table

**Enable Real-time:**
```sql
-- In Supabase SQL Editor
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table orders;
commit;
```

## File Changes

| File | Status | Change |
|------|--------|--------|
| `admin.html` | ✅ Updated | Restored Supabase integration |
| `supabase.js` | ✅ Active | Supabase client configuration |
| `server.js` | ℹ️ Backend API kept | Optional fallback |

## Features

✅ Load orders from Supabase cloud database  
✅ Filter by status (All/Pending/Accepted/Delivered)  
✅ Update order status (Accept/Deliver)  
✅ Real-time synchronization via Supabase channels  
✅ Auto-refresh every 30 seconds  
✅ Error handling with user feedback  
✅ Authentication required  

## Troubleshooting

### Issue: "Failed to load orders"
**Check:**
1. Browser console for Supabase errors
2. Supabase project is active
3. Internet connection
4. Table exists and has data

### Issue: No orders displayed
**Solution:**
```sql
-- Add test data to Supabase
INSERT INTO orders (customer_name, phone, medicines, status, created_at)
VALUES 
  ('Test Customer 1', '+91 9876543210', 'Dolo 650, Vitamin D3', 'pending', NOW()),
  ('Test Customer 2', '+91 9123456789', 'Azithromycin, Paracetamol', 'accepted', NOW()),
  ('Test Customer 3', '+91 9988776655', 'Calcium + D3, Multivitamin', 'delivered', NOW());
```

### Issue: Cannot update order status
**Check:**
1. RLS policies allow UPDATE
2. Order ID exists in database
3. Network tab shows successful request

### Issue: Real-time not working
**Solution:**
1. Enable real-time on `orders` table in Supabase dashboard
2. Check publication includes `orders`
3. Verify WebSocket connection in browser dev tools

## Backend API Status

The backend API endpoints (`/api/orders`) are still available in `server.js` but **not used** by the admin dashboard. They can serve as:
- Fallback if Supabase goes down
- Future features (analytics, reports)
- Alternative integration method

## Next Steps

1. ✅ Test admin dashboard loads orders
2. ✅ Verify you can accept/deliver orders
3. ✅ Check real-time updates work
4. ℹ️ Optionally add more test data to Supabase
5. ℹ️ Configure RLS policies if needed

## Support

For Supabase-specific issues:
- Check Supabase dashboard: https://supabase.com/dashboard
- View logs in Supabase dashboard
- Test queries in SQL Editor

---

**Status**: ✅ Connected to Supabase  
**Database**: Supabase Cloud (PostgreSQL)  
**Real-time**: Enabled via Supabase Channels
