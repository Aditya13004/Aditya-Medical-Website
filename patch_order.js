const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'order.html');
let content = fs.readFileSync(filePath, 'utf8');

function normalizeStr(str) {
  return str.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
}

const oldFormHTML = `          <div class="form-group">
            <label for="ord-address">Delivery Address *</label>
            <textarea id="ord-address" placeholder="Enter your complete home address, street name, and landmark..." required></textarea>
          </div>`;

const newFormHTML = `          <div class="form-group">
            <label for="ord-address1">Full Address *</label>
            <textarea id="ord-address1" placeholder="House / Flat / Building / Street" required></textarea>
          </div>
          <div class="form-group">
            <label for="ord-landmark">Landmark (Optional)</label>
            <input type="text" id="ord-landmark" placeholder="Near XYZ Hospital" />
          </div>
          <div style="display:flex; gap:15px; margin-bottom: 24px;">
            <div class="form-group" style="flex:1; margin-bottom: 0;">
              <label for="ord-city">City *</label>
              <input type="text" id="ord-city" placeholder="e.g. 10, Vardhaman Nagar, Jalgaon" required />
            </div>
            <div class="form-group" style="flex:1; margin-bottom: 0;">
              <label for="ord-pincode">Pincode *</label>
              <input type="text" id="ord-pincode" placeholder="e.g. 425001" required maxlength="6" />
            </div>
          </div>
          <div class="form-group">
            <label for="ord-prescription">Upload Prescription (Optional)</label>
            <input type="file" id="ord-prescription" accept="image/*,.pdf" style="padding: 15px; height: auto;" />
          </div>`;

const oldJS1 = `      const rawMedicines = document.getElementById('ord-medicines').value.trim();
      const address   = document.getElementById('ord-address').value.trim();
      const email     = document.getElementById('ord-email').value.trim();

      if (!name || !phone || !rawMedicines || !address) {
        showToast('Please fill all fields.', 'error');
        return;
      }`;

const newJS1 = `      const rawMedicines = document.getElementById('ord-medicines').value.trim();
      const address1  = document.getElementById('ord-address1').value.trim();
      const landmark  = document.getElementById('ord-landmark').value.trim();
      const city      = document.getElementById('ord-city').value.trim();
      const pincode   = document.getElementById('ord-pincode').value.trim();
      const email     = document.getElementById('ord-email').value.trim();

      const address = \`\${address1}, \${landmark ? 'Landmark: ' + landmark + ', ' : ''}\${city} - \${pincode}\`;

      if (!name || !phone || !rawMedicines || !address1 || !city || !pincode) {
        showToast('Please fill all required fields.', 'error');
        return;
      }`;

let oldFormNorm = normalizeStr(oldFormHTML);
if (normalizeStr(content).includes(oldFormNorm)) {
  const escapedOld = oldFormNorm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\s+/g, '\\s+');
  content = content.replace(new RegExp(escapedOld), newFormHTML);
}

let oldJS1Norm = normalizeStr(oldJS1);
if (normalizeStr(content).includes(oldJS1Norm)) {
  const escapedOld = oldJS1Norm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\s+/g, '\\s+');
  content = content.replace(new RegExp(escapedOld), newJS1);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Order form updated!");
