const fs = require('fs');
const path = require('path');

const checkoutHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Checkout | Aditya Medical & General Store</title>
  <link rel="stylesheet" href="style.css" />
  <link rel="stylesheet" href="nav.css" />
  <link rel="stylesheet" href="responsive.css" />
  <link rel="icon" type="image/x-icon" href="images/Aditya Medical.png" />
  <style>
    body { background: #f8fafc; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
    .checkout-container { max-width: 1200px; margin: 40px auto 80px; padding: 0 20px; display: grid; grid-template-columns: 1fr 400px; gap: 30px; }
    
    @media (max-width: 900px) { .checkout-container { grid-template-columns: 1fr; } }
    
    .section-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 20px; }
    
    .card { background: #ffffff; border-radius: 24px; padding: 30px; box-shadow: 0 12px 40px rgba(15, 76, 129, 0.05); border: 1px solid #e2e8f0; }
    
    .address-card { background: #ffffff; border: 2px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 15px; cursor: pointer; transition: all 0.3s; position: relative; }
    .address-card:hover { border-color: #93c5fd; }
    .address-card.selected { border-color: #2563eb; background: #eff6ff; }
    
    .addr-type { padding: 4px 10px; border-radius: 50px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; display: inline-block; margin-bottom: 10px; }
    .addr-type.Home { background: #dbeafe; color: #1d4ed8; }
    .addr-type.Work { background: #f3e8ff; color: #7e22ce; }
    .addr-type.Other { background: #f1f5f9; color: #475569; }
    
    .btn-primary { display: inline-block; background: linear-gradient(135deg, #2563EB, #1D4ED8); color: #fff; padding: 12px 32px; border-radius: 50px; border: none; font-weight: 700; font-size: 1.1rem; cursor: pointer; width: 100%; transition: all 0.3s; box-shadow: 0 4px 12px rgba(37,99,235,0.25); }
    .btn-primary:hover { background: linear-gradient(135deg, #1D4ED8, #1E3A8A); transform: translateY(-2px); box-shadow: 0 8px 16px rgba(37,99,235,0.3); }
    
    .order-summary-item { display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #f1f5f9; }
    .order-summary-item:last-child { border-bottom: none; }
    .order-total { display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-top: 20px; padding-top: 20px; border-top: 2px dashed #cbd5e1; }
    
    /* ── Toast ── */
    #toast { position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%) translateY(20px); background: #1e293b; color: #fff; padding: 1rem 2rem; border-radius: 50px; font-weight: 600; z-index: 9999; opacity: 0; transition: all .4s; pointer-events: none; }
    #toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
    #toast.success { background: linear-gradient(135deg, #10b981, #059669); }
    #toast.error   { background: linear-gradient(135deg, #ef4444, #dc2626); }
  </style>
</head>
<body>

  <!-- ══ HEADER ══ -->
  <header id="siteHeader">
    <div class="hdr-inner">
      <a href="index.html" class="hdr-logo">
        <img src="images/Aditya Medical.png" alt="Logo" />
        <div>
          <span class="hdr-logo-name">Aditya Medical</span>
          <span class="hdr-logo-sub">&amp; General Store </span>
        </div>
      </a>
      <nav class="hdr-nav">
        <a href="index.html" class="hn">Home</a>
        <a href="products.html" class="hn">Products</a>
        <a href="order.html" class="hn">Quick Order</a>
        <a href="customer-dashboard.html" class="hn">My Orders</a>
      </nav>
    </div>
  </header>

  <div class="checkout-container">
    <!-- Left Column: Addresses -->
    <div>
      <h1 class="section-title">Select Delivery Address</h1>
      <div id="addressList">
        <div style="text-align:center; padding: 40px; color: #64748b;">
          <p>🔍 Loading addresses...</p>
        </div>
      </div>
      
      <button class="btn-primary" style="background: #f1f5f9; color: #0f172a; margin-top: 20px; box-shadow: none;" onclick="document.getElementById('addressModal').style.display='flex'">
        + Add New Address
      </button>
    </div>
    
    <!-- Right Column: Order Summary -->
    <div>
      <div class="card">
        <h2 class="section-title" style="margin-bottom: 25px;">Order Summary</h2>
        <div id="orderItems"></div>
        <div class="order-total">
          <span>Total Amount</span>
          <span id="orderTotal">₹0.00</span>
        </div>
        <button class="btn-primary" id="confirmOrderBtn" style="margin-top: 30px;" onclick="placeOrder()">
          Confirm Order
        </button>
      </div>
    </div>
  </div>

  <!-- Address Modal -->
  <div id="addressModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; justify-content:center; align-items:center;">
    <div style="background:#fff; padding:30px; border-radius:24px; width:90%; max-width:500px; max-height:90vh; overflow-y:auto;">
      <h2 style="margin-bottom:20px; font-size:1.5rem;">Add New Address</h2>
      <form id="addressForm" onsubmit="saveAddress(event)">
        <input type="text" id="addr-name" placeholder="Full Name *" required style="width:100%; padding:12px; margin-bottom:15px; border-radius:12px; border:1px solid #dbeafe; box-sizing: border-box;">
        <input type="tel" id="addr-phone" placeholder="Mobile Number *" required maxlength="10" style="width:100%; padding:12px; margin-bottom:15px; border-radius:12px; border:1px solid #dbeafe; box-sizing: border-box;">
        <input type="text" id="addr-line1" placeholder="House / Flat / Building *" required style="width:100%; padding:12px; margin-bottom:15px; border-radius:12px; border:1px solid #dbeafe; box-sizing: border-box;">
        <input type="text" id="addr-line2" placeholder="Area / Street *" required style="width:100%; padding:12px; margin-bottom:15px; border-radius:12px; border:1px solid #dbeafe; box-sizing: border-box;">
        <input type="text" id="addr-landmark" placeholder="Landmark (Optional)" style="width:100%; padding:12px; margin-bottom:15px; border-radius:12px; border:1px solid #dbeafe; box-sizing: border-box;">
        <div style="display:flex; gap:15px; margin-bottom:15px;">
          <input type="text" id="addr-city" placeholder="City *" required style="flex:1; padding:12px; border-radius:12px; border:1px solid #dbeafe; box-sizing: border-box;">
          <input type="text" id="addr-pincode" placeholder="Pincode *" required maxlength="6" style="flex:1; padding:12px; border-radius:12px; border:1px solid #dbeafe; box-sizing: border-box;">
        </div>
        <select id="addr-type" style="width:100%; padding:12px; margin-bottom:20px; border-radius:12px; border:1px solid #dbeafe; box-sizing: border-box;">
          <option value="Home">Home</option>
          <option value="Work">Work</option>
          <option value="Other">Other</option>
        </select>
        <div style="display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" onclick="document.getElementById('addressModal').style.display='none'" style="padding:10px 20px; border:none; border-radius:50px;">Cancel</button>
          <button type="submit" class="btn-primary" style="width:auto; padding:10px 24px;" id="saveAddrBtn">Save Address</button>
        </div>
      </form>
    </div>
  </div>

  <div id="toast"></div>

  <script src="supabase.js"></script>
  <script>
    let selectedAddress = null;
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    function showToast(msg, type = 'success') {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.className = 'show ' + type;
      setTimeout(() => { t.className = ''; }, 3500);
    }

    function renderCart() {
      if (cart.length === 0) {
        window.location.href = 'products.html';
        return;
      }
      
      let html = '';
      let total = 0;
      cart.forEach(item => {
        html += \`
          <div class="order-summary-item">
            <div>
              <div style="font-weight:600; color:#1e293b;">\${item.name}</div>
              <div style="font-size:0.9rem; color:#64748b;">Qty: \${item.quantity}</div>
            </div>
            <div style="font-weight:700;">₹\${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        \`;
        total += (item.price * item.quantity);
      });
      document.getElementById('orderItems').innerHTML = html;
      document.getElementById('orderTotal').textContent = '₹' + total.toFixed(2);
    }

    async function loadAddresses() {
      const email = localStorage.getItem('am_user_email');
      if (!email) {
        window.location.href = 'login.html';
        return;
      }
      
      try {
        const sb = await getSupabase();
        const { data: addresses, error } = await sb
          .from('user_addresses')
          .select('*')
          .eq('user_email', email)
          .order('is_default', { ascending: false })
          .order('created_at', { ascending: false });
          
        const container = document.getElementById('addressList');
        
        if (error || !addresses || addresses.length === 0) {
          container.innerHTML = \`<div style="text-align:center; padding: 20px; color: #64748b;"><p>No saved addresses. Please add one below.</p></div>\`;
          return;
        }
        
        // Auto select first address (default)
        if (!selectedAddress) selectedAddress = addresses[0];
        
        container.innerHTML = addresses.map(addr => \`
          <div class="address-card \${selectedAddress && selectedAddress.id === addr.id ? 'selected' : ''}" onclick='selectAddress(\${JSON.stringify(addr)})'>
            <div class="addr-type \${addr.address_type}">\${addr.address_type} \${addr.is_default ? '(Default)' : ''}</div>
            <div style="font-weight: 700; margin-bottom: 5px;">\${addr.full_name}</div>
            <div style="color: #475569; font-size: 0.9rem; line-height: 1.5; margin-bottom: 8px;">
              \${addr.address_line_1}, \${addr.address_line_2}<br>
              \${addr.city}, \${addr.pincode}
            </div>
            <div style="color: #0f172a; font-weight: 600; font-size: 0.9rem;">📞 \${addr.phone}</div>
          </div>
        \`).join('');
        
      } catch(err) {
        console.error(err);
      }
    }
    
    window.selectAddress = function(addr) {
      selectedAddress = addr;
      loadAddresses(); // re-render to show selection
    };

    async function saveAddress(e) {
      e.preventDefault();
      const email = localStorage.getItem('am_user_email');
      const btn = document.getElementById('saveAddrBtn');
      btn.textContent = 'Saving...'; btn.disabled = true;
      
      try {
        const sb = await getSupabase();
        const { data, error } = await sb.from('user_addresses').insert({
          user_email: email,
          full_name: document.getElementById('addr-name').value,
          phone: document.getElementById('addr-phone').value,
          address_line_1: document.getElementById('addr-line1').value,
          address_line_2: document.getElementById('addr-line2').value,
          landmark: document.getElementById('addr-landmark').value,
          city: document.getElementById('addr-city').value,
          pincode: document.getElementById('addr-pincode').value,
          address_type: document.getElementById('addr-type').value,
          is_default: false
        }).select();
        
        if (error) throw error;
        
        document.getElementById('addressForm').reset();
        document.getElementById('addressModal').style.display = 'none';
        
        // Auto select new address
        if (data && data[0]) selectedAddress = data[0];
        loadAddresses();
        
      } catch(err) {
        showToast("Failed to save address", "error");
      } finally {
        btn.textContent = 'Save Address'; btn.disabled = false;
      }
    }

    async function placeOrder() {
      if (!selectedAddress) {
        showToast("Please select or add a delivery address", "error");
        return;
      }
      if (cart.length === 0) return;

      const email = localStorage.getItem('am_user_email');
      const itemsText = cart.map(i => \`\${i.name} (\${i.quantity}x) - ₹\${i.price}\`).join(', ');
      
      const fullAddress = \`\${selectedAddress.address_line_1}, \${selectedAddress.address_line_2}
City: \${selectedAddress.city} - \${selectedAddress.pincode}
Landmark: \${selectedAddress.landmark || 'N/A'}\`;

      const finalMedicinesStr = \`\${itemsText}\n\n---\nDelivery Address:\n\${fullAddress}\`;

      const btn = document.getElementById('confirmOrderBtn');
      btn.textContent = 'Processing...'; btn.disabled = true;

      try {
        const sb = await getSupabase();
        
        const { error } = await sb.from('orders').insert({
          name: selectedAddress.full_name,
          phone: selectedAddress.phone,
          email: email,
          medicines: finalMedicinesStr,
          status: 'pending'
        });

        if (error) throw error;
        
        localStorage.removeItem("cart");
        window.location.href = "customer-dashboard.html";
        
      } catch(err) {
        console.error(err);
        showToast("Order failed. Please try again.", "error");
        btn.textContent = 'Confirm Order'; btn.disabled = false;
      }
    }

    window.onload = function() {
      renderCart();
      loadAddresses();
    };
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'checkout.html'), checkoutHTML, 'utf8');
console.log("checkout.html created!");
