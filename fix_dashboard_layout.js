const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'customer-dashboard.html');
let content = fs.readFileSync(filePath, 'utf8');

function normalizeStr(str) {
  return str.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
}

const oldHTML = `        <div class="dashboard-split">
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
    </div>`;

const newHTML = `    <div class="dashboard-section" style="margin-bottom: 50px;">
      <h2 style="font-size: 1.8rem; margin-bottom: 1.5rem; color: #0f172a;">Your Order History</h2>
      <div id="ordersList">
         <div style="text-align:center; padding: 40px; color: #64748b;">
           <p>🔍 Syncing with database...</p>
         </div>
      </div>
    </div>
    
    <div class="dashboard-section" style="background: #ffffff; border-radius: 24px; padding: 30px; box-shadow: 0 12px 40px rgba(15, 76, 129, 0.05); border: 1px solid #e2e8f0; display: none; margin-bottom: 50px;" id="accountSection">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 1rem; flex-wrap: wrap; gap: 15px;">
        <h2 style="font-size: 1.8rem; color: #0f172a; margin: 0;">Account Settings</h2>
        <button class="btn-primary" style="padding: 10px 24px; font-size: 1rem; width: auto;" onclick="document.getElementById('addressModal').style.display='flex'">
          + Add New Address
        </button>
      </div>
      
      <h3 style="font-size: 1.3rem; margin-bottom: 1.5rem; color: #334155;">Saved Addresses</h3>
      <div id="addressesList" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; margin-bottom: 20px;">
        <div style="text-align:center; padding: 20px; color: #64748b; grid-column: 1 / -1;">
          <p>🔍 Loading addresses...</p>
        </div>
      </div>
    </div>`;

// Update JS for loading addresses to support grid and elegant empty state
const oldJSStart = `async function loadAddresses() {
      const container = document.getElementById('addressesList');
      const email = localStorage.getItem('am_user_email');
      if (!email) {
        container.innerHTML = \`<div style="text-align:center; padding: 20px; color: #64748b;"><p>Please log in to save addresses.</p></div>\`;
        return;
      }`;
      
const newJSStart = `async function loadAddresses() {
      const container = document.getElementById('addressesList');
      const accountSection = document.getElementById('accountSection');
      const email = localStorage.getItem('am_user_email');
      if (!email) {
        if(accountSection) accountSection.style.display = 'none';
        return;
      }
      
      if(accountSection) accountSection.style.display = 'block';`;

const oldJSEmpty = `if (!addresses || addresses.length === 0) {
          container.innerHTML = \`<div style="text-align:center; padding: 20px; color: #64748b;"><p>No saved addresses yet.</p></div>\`;
          return;
        }`;

const newJSEmpty = `if (!addresses || addresses.length === 0) {
          container.innerHTML = \`<div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 16px; padding: 40px 20px; text-align: center; color: #64748b; grid-column: 1 / -1;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" style="margin-bottom: 15px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <h3 style="margin: 0 0 10px 0; color: #334155;">No saved addresses yet</h3>
            <p style="margin: 0; font-size: 0.95rem;">Add your delivery address for faster checkout.</p>
          </div>\`;
          return;
        }`;

const oldJSMap = `container.innerHTML = addresses.map(addr => \`
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">`;

const newJSMap = `container.innerHTML = addresses.map(addr => \`
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; justify-content: space-between; transition: all 0.3s;" onmouseover="this.style.borderColor='#93c5fd'; this.style.boxShadow='0 10px 25px -5px rgba(0, 0, 0, 0.1)'" onmouseout="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.05)'">`;

let oldHTMLNorm = normalizeStr(oldHTML);
if (normalizeStr(content).includes(oldHTMLNorm)) {
  const escapedOld = oldHTMLNorm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\s+/g, '\\s+');
  content = content.replace(new RegExp(escapedOld), newHTML);
} else {
  console.log("Could not find HTML chunk");
}

let oldJSStartNorm = normalizeStr(oldJSStart);
if (normalizeStr(content).includes(oldJSStartNorm)) {
  const escapedOld = oldJSStartNorm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\s+/g, '\\s+');
  content = content.replace(new RegExp(escapedOld), newJSStart);
} else {
  console.log("Could not find JS Start chunk");
}

let oldJSEmptyNorm = normalizeStr(oldJSEmpty);
if (normalizeStr(content).includes(oldJSEmptyNorm)) {
  const escapedOld = oldJSEmptyNorm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\s+/g, '\\s+');
  content = content.replace(new RegExp(escapedOld), newJSEmpty);
} else {
  console.log("Could not find JS Empty chunk");
}

let oldJSMapNorm = normalizeStr(oldJSMap);
if (normalizeStr(content).includes(oldJSMapNorm)) {
  const escapedOld = oldJSMapNorm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\s+/g, '\\s+');
  content = content.replace(new RegExp(escapedOld), newJSMap);
} else {
  console.log("Could not find JS Map chunk");
}

// Also update the empty state for the case where relation does not exist
const oldJSEmptyRel = `if (error.message.includes('relation "public.user_addresses" does not exist')) {
            container.innerHTML = \`<div style="text-align:center; padding: 20px; color: #64748b;"><p>No saved addresses yet.</p></div>\`;
            return;
          }`;
const newJSEmptyRel = `if (error.message.includes('relation "public.user_addresses" does not exist')) {
            container.innerHTML = \`<div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 16px; padding: 40px 20px; text-align: center; color: #64748b; grid-column: 1 / -1;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" style="margin-bottom: 15px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <h3 style="margin: 0 0 10px 0; color: #334155;">No saved addresses yet</h3>
            <p style="margin: 0; font-size: 0.95rem;">Add your delivery address for faster checkout.</p>
          </div>\`;
            return;
          }`;
let oldJSEmptyRelNorm = normalizeStr(oldJSEmptyRel);
if (normalizeStr(content).includes(oldJSEmptyRelNorm)) {
  const escapedOld = oldJSEmptyRelNorm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\s+/g, '\\s+');
  content = content.replace(new RegExp(escapedOld), newJSEmptyRel);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Dashboard layout fixed!");
