const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'customer-dashboard.html');
let content = fs.readFileSync(filePath, 'utf8');

// Replace orderList closing section with dashboard split
const oldSection = `<div id="ordersList">
       <div style="text-align:center; padding: 40px; color: #64748b;">
         <p>🔍 Syncing with database...</p>
       </div>
    </div>
  </div>

      </div>
    </div>`;

const newSection = `    <div class="dashboard-split">
      <div class="dashboard-main">
        <h2 style="font-size: 1.5rem; margin-bottom: 1rem; color: #0f172a; padding-left: 5px;">Your Order History</h2>
        <div id="ordersList">
           <div style="text-align:center; padding: 40px; color: #64748b;">
             <p>🔍 Syncing with database...</p>
           </div>
        </div>
      </div>
      
      <div class="dashboard-sidebar">
        <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem;">Saved Addresses</h2>
        <div id="addressesList" style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px;">
          <div style="text-align:center; padding: 20px; color: #64748b;">
            <p>🔍 Loading addresses...</p>
          </div>
        </div>
        <button class="btn-primary" style="width: 100%; text-align: center; padding: 12px; font-size: 1rem;" onclick="document.getElementById('addressModal').style.display='flex'">
          + Add New Address
        </button>
      </div>
    </div>
  </div>

  <!-- Address Modal -->
  <div id="addressModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; justify-content:center; align-items:center;">
    <div style="background:#fff; padding:30px; border-radius:24px; width:90%; max-width:500px; max-height:90vh; overflow-y:auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
      <h2 style="margin-bottom:20px; font-size:1.5rem; color: #0f172a;">Add New Address</h2>
      <form id="addressForm" onsubmit="saveAddress(event)">
        <div style="margin-bottom:15px;">
          <label style="display:block; margin-bottom:5px; font-weight:600; color:#334155; font-size: 0.9rem;">Full Name *</label>
          <input type="text" id="addr-name" required style="width:100%; padding:12px; border:1px solid #dbeafe; border-radius:12px; background:#f8fafc; box-sizing: border-box;">
        </div>
        <div style="margin-bottom:15px;">
          <label style="display:block; margin-bottom:5px; font-weight:600; color:#334155; font-size: 0.9rem;">Mobile Number *</label>
          <input type="tel" id="addr-phone" required maxlength="10" style="width:100%; padding:12px; border:1px solid #dbeafe; border-radius:12px; background:#f8fafc; box-sizing: border-box;">
        </div>
        <div style="margin-bottom:15px;">
          <label style="display:block; margin-bottom:5px; font-weight:600; color:#334155; font-size: 0.9rem;">House / Flat / Building *</label>
          <input type="text" id="addr-line1" required style="width:100%; padding:12px; border:1px solid #dbeafe; border-radius:12px; background:#f8fafc; box-sizing: border-box;">
        </div>
        <div style="margin-bottom:15px;">
          <label style="display:block; margin-bottom:5px; font-weight:600; color:#334155; font-size: 0.9rem;">Area / Street *</label>
          <input type="text" id="addr-line2" required style="width:100%; padding:12px; border:1px solid #dbeafe; border-radius:12px; background:#f8fafc; box-sizing: border-box;">
        </div>
        <div style="margin-bottom:15px;">
          <label style="display:block; margin-bottom:5px; font-weight:600; color:#334155; font-size: 0.9rem;">Landmark</label>
          <input type="text" id="addr-landmark" style="width:100%; padding:12px; border:1px solid #dbeafe; border-radius:12px; background:#f8fafc; box-sizing: border-box;">
        </div>
        <div style="display:flex; gap:15px; margin-bottom:15px;">
          <div style="flex:1;">
            <label style="display:block; margin-bottom:5px; font-weight:600; color:#334155; font-size: 0.9rem;">City *</label>
            <input type="text" id="addr-city" required style="width:100%; padding:12px; border:1px solid #dbeafe; border-radius:12px; background:#f8fafc; box-sizing: border-box;">
          </div>
          <div style="flex:1;">
            <label style="display:block; margin-bottom:5px; font-weight:600; color:#334155; font-size: 0.9rem;">Pincode *</label>
            <input type="text" id="addr-pincode" required maxlength="6" style="width:100%; padding:12px; border:1px solid #dbeafe; border-radius:12px; background:#f8fafc; box-sizing: border-box;">
          </div>
        </div>
        <div style="margin-bottom:20px;">
          <label style="display:block; margin-bottom:5px; font-weight:600; color:#334155; font-size: 0.9rem;">Address Type</label>
          <select id="addr-type" style="width:100%; padding:12px; border:1px solid #dbeafe; border-radius:12px; background:#f8fafc; box-sizing: border-box;">
            <option value="Home">Home</option>
            <option value="Work">Work</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div style="margin-bottom:20px; display:flex; align-items:center; gap: 8px;">
          <input type="checkbox" id="addr-default" style="width: 18px; height: 18px; cursor: pointer;">
          <label for="addr-default" style="font-weight:600; color:#334155; font-size: 0.9rem; cursor: pointer;">Set as Default Address</label>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" onclick="document.getElementById('addressModal').style.display='none'" style="padding:12px 24px; background:#f1f5f9; color: #475569; border:none; border-radius:50px; cursor:pointer; font-weight:700;">Cancel</button>
          <button type="submit" class="btn-primary" id="saveAddrBtn" style="border:none; cursor:pointer;">Save Address</button>
        </div>
      </form>
    </div>
  </div>`;

// Function to normalize whitespace for matching
function normalizeStr(str) {
  return str.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
}

let contentNorm = normalizeStr(content);
let oldNorm = normalizeStr(oldSection);

if (contentNorm.includes(oldNorm)) {
  // It's safer to use regex to replace with flexible whitespace
  const escapedOld = oldNorm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\s+/g, '\\s+');
  content = content.replace(new RegExp(escapedOld), newSection);
} else {
  console.log("Could not find chunk 1");
}

const oldEnd = `    window.onload = loadOrders;
  </script>
</body>
</html>`;

const newEnd = `    window.onload = function() {
      loadOrders();
      loadAddresses();
    };

    // --- Address System Logic ---
    async function loadAddresses() {
      const container = document.getElementById('addressesList');
      const email = localStorage.getItem('am_user_email');
      if (!email) {
        container.innerHTML = \`<div style="text-align:center; padding: 20px; color: #64748b;"><p>Please log in to save addresses.</p></div>\`;
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
          
        if (error) {
          if (error.message.includes('relation "public.user_addresses" does not exist')) {
            container.innerHTML = \`<div style="text-align:center; padding: 20px; color: #64748b;"><p>No saved addresses yet.</p></div>\`;
            return;
          }
          throw error;
        }
        
        if (!addresses || addresses.length === 0) {
          container.innerHTML = \`<div style="text-align:center; padding: 20px; color: #64748b;"><p>No saved addresses yet.</p></div>\`;
          return;
        }
        
        container.innerHTML = addresses.map(addr => \`
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
              <div>
                <span style="background: \${addr.address_type === 'Home' ? '#dbeafe' : (addr.address_type === 'Work' ? '#f3e8ff' : '#f1f5f9')}; color: \${addr.address_type === 'Home' ? '#1d4ed8' : (addr.address_type === 'Work' ? '#7e22ce' : '#475569')}; padding: 4px 10px; border-radius: 50px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">\${addr.address_type}</span>
                \${addr.is_default ? '<span style="background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 50px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; margin-left: 8px;">Default</span>' : ''}
              </div>
              <button onclick="deleteAddress('\${addr.id}')" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 5px;" title="Delete">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
            <div style="font-weight: 700; color: #0f172a; margin-bottom: 5px;">\${addr.full_name}</div>
            <div style="color: #475569; font-size: 0.9rem; line-height: 1.5; margin-bottom: 8px;">
              \${addr.address_line_1}, \${addr.address_line_2 || ''}<br>
              \${addr.landmark ? 'Landmark: ' + addr.landmark + '<br>' : ''}
              \${addr.city}, \${addr.pincode}
            </div>
            <div style="color: #0f172a; font-weight: 600; font-size: 0.9rem;">
              📞 \${addr.phone}
            </div>
            \${!addr.is_default ? \`
            <div style="margin-top: 15px; border-top: 1px solid #f1f5f9; padding-top: 10px;">
              <button onclick="setDefaultAddress('\${addr.id}')" style="background: none; border: none; color: #2563eb; font-weight: 600; cursor: pointer; padding: 0; font-size: 0.85rem;">Set as Default</button>
            </div>\` : ''}
          </div>
        \`).join('');
        
      } catch(err) {
        console.error("Addresses error:", err);
        container.innerHTML = \`<div style="text-align:center; padding: 20px; color: #ef4444;"><p>Failed to load addresses.</p></div>\`;
      }
    }

    async function saveAddress(e) {
      e.preventDefault();
      const email = localStorage.getItem('am_user_email');
      if (!email) { alert("Please log in first!"); return; }
      
      const btn = document.getElementById('saveAddrBtn');
      btn.textContent = 'Saving...';
      btn.disabled = true;
      
      try {
        const sb = await getSupabase();
        const isDefault = document.getElementById('addr-default').checked;
        
        if (isDefault) {
          await sb.from('user_addresses').update({ is_default: false }).eq('user_email', email);
        }
        
        const { error } = await sb.from('user_addresses').insert({
          user_email: email,
          full_name: document.getElementById('addr-name').value,
          phone: document.getElementById('addr-phone').value,
          address_line_1: document.getElementById('addr-line1').value,
          address_line_2: document.getElementById('addr-line2').value,
          landmark: document.getElementById('addr-landmark').value,
          city: document.getElementById('addr-city').value,
          pincode: document.getElementById('addr-pincode').value,
          address_type: document.getElementById('addr-type').value,
          is_default: isDefault
        });
        
        if (error) throw error;
        
        document.getElementById('addressForm').reset();
        document.getElementById('addressModal').style.display = 'none';
        loadAddresses();
        
      } catch(err) {
        alert("Failed to save address. Did you run the setup-addresses.sql script?");
        console.error(err);
      } finally {
        btn.textContent = 'Save Address';
        btn.disabled = false;
      }
    }
    
    async function deleteAddress(id) {
      if (!confirm("Are you sure you want to delete this address?")) return;
      try {
        const sb = await getSupabase();
        await sb.from('user_addresses').delete().eq('id', id);
        loadAddresses();
      } catch(err) {
        alert("Failed to delete address");
      }
    }
    
    async function setDefaultAddress(id) {
      const email = localStorage.getItem('am_user_email');
      try {
        const sb = await getSupabase();
        await sb.from('user_addresses').update({ is_default: false }).eq('user_email', email);
        await sb.from('user_addresses').update({ is_default: true }).eq('id', id);
        loadAddresses();
      } catch(err) {
        alert("Failed to set default address");
      }
    }
  </script>
</body>
</html>`;

let oldEndNorm = normalizeStr(oldEnd);
if (normalizeStr(content).includes(oldEndNorm)) {
  const escapedOldEnd = oldEndNorm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\s+/g, '\\s+');
  content = content.replace(new RegExp(escapedOldEnd), newEnd);
} else {
  console.log("Could not find chunk 2");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Dashboard Updated Successfully");
