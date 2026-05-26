const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'customer-dashboard.html');
let content = fs.readFileSync(filePath, 'utf8');

function normalizeStr(str) {
  return str.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
}

// 1. Fix the email check
const oldCheck = `      const email = localStorage.getItem('am_user_email');
      if (!email) {
        if(accountSection) accountSection.style.display = 'none';
        return;
      }`;
      
const newCheck = `      let email = localStorage.getItem('am_user_email');
      if (!email || email === 'undefined' || email === 'null' || email.trim() === '') {
        if(accountSection) accountSection.style.display = 'none';
        return;
      }`;

let oldCheckNorm = normalizeStr(oldCheck);
if (normalizeStr(content).includes(oldCheckNorm)) {
  const escapedOld = oldCheckNorm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\s+/g, '\\s+');
  content = content.replace(new RegExp(escapedOld), newCheck);
}

// 2. Fix the error check
const oldError = `        if (error) {
          if (error.message.includes('relation "public.user_addresses" does not exist')) {
            container.innerHTML = \`<div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 16px; padding: 40px 20px; text-align: center; color: #64748b; grid-column: 1 / -1;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" style="margin-bottom: 15px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <h3 style="margin: 0 0 10px 0; color: #334155;">No saved addresses yet</h3>
            <p style="margin: 0; font-size: 0.95rem;">Add your delivery address for faster checkout.</p>
          </div>\`;
            return;
          }
          throw error;
        }`;

const newError = `        if (error) {
          if (error.code === '42P01' || (error.message && error.message.includes('does not exist'))) {
            container.innerHTML = \`<div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 16px; padding: 40px 20px; text-align: center; color: #64748b; grid-column: 1 / -1;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" style="margin-bottom: 15px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <h3 style="margin: 0 0 10px 0; color: #334155;">No saved addresses yet</h3>
            <p style="margin: 0; font-size: 0.95rem;">Add your delivery address for faster checkout. (Database setup required)</p>
          </div>\`;
            return;
          }
          throw error;
        }`;

let oldErrorNorm = normalizeStr(oldError);
if (normalizeStr(content).includes(oldErrorNorm)) {
  const escapedOld = oldErrorNorm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\s+/g, '\\s+');
  content = content.replace(new RegExp(escapedOld), newError);
} else {
    // try the alternative since previous replace might have missed public.
    const oldError2 = \`        if (error) {
          if (error.message.includes('relation "user_addresses" does not exist') || error.message.includes('relation "public.user_addresses" does not exist')) {
            container.innerHTML = \\\`<div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 16px; padding: 40px 20px; text-align: center; color: #64748b; grid-column: 1 / -1;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" style="margin-bottom: 15px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <h3 style="margin: 0 0 10px 0; color: #334155;">No saved addresses yet</h3>
            <p style="margin: 0; font-size: 0.95rem;">Add your delivery address for faster checkout.</p>
          </div>\\\`;
            return;
          }
          throw error;
        }\`;
    
    let oldErrorNorm2 = normalizeStr(oldError2);
    if (normalizeStr(content).includes(oldErrorNorm2)) {
      const escapedOld2 = oldErrorNorm2.replace(/[-\/\\^$*+?.()|[\\]{}]/g, '\\\\$&').replace(/\\s+/g, '\\\\s+');
      content = content.replace(new RegExp(escapedOld2), newError);
    }
}

// 3. Make sure the catch block shows the actual error message for debugging
const oldCatch = `      } catch(err) {
        console.error("Addresses error:", err);
        container.innerHTML = \`<div style="text-align:center; padding: 20px; color: #ef4444;"><p>Failed to load addresses.</p></div>\`;
      }`;
      
const newCatch = `      } catch(err) {
        console.error("Addresses error:", err);
        container.innerHTML = \`<div style="text-align:center; padding: 20px; color: #ef4444;"><p>Failed to load addresses. \${err.message || ''}</p></div>\`;
      }`;

let oldCatchNorm = normalizeStr(oldCatch);
if (normalizeStr(content).includes(oldCatchNorm)) {
  const escapedOld = oldCatchNorm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\s+/g, '\\s+');
  content = content.replace(new RegExp(escapedOld), newCatch);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("customer-dashboard.html JS updated!");
