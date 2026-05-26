const fs = require('fs');
const path = require('path');

const dashPath = path.join(__dirname, 'customer-dashboard.html');
const loginPath = path.join(__dirname, 'login.html');

let dashContent = fs.readFileSync(dashPath, 'utf8');
let loginContent = fs.readFileSync(loginPath, 'utf8');

// --- EXTRACT FROM DASHBOARD ---

// Extract the account section HTML
const accountSectionRegex = /<div class="dashboard-section" style="background: #ffffff; border-radius: 24px; padding: 30px; box-shadow: 0 12px 40px rgba\(15, 76, 129, 0\.05\); border: 1px solid #e2e8f0; display: none; margin-bottom: 50px;" id="accountSection">[\s\S]*?<\/div>\s*<\/div>/;
const accountSectionMatch = dashContent.match(accountSectionRegex);
let extractedAccountSection = '';
if (accountSectionMatch) {
  extractedAccountSection = accountSectionMatch[0];
  dashContent = dashContent.replace(accountSectionRegex, '');
} else {
  console.log('Account section not found in dashboard');
}

// Extract the address modal
const addressModalRegex = /<!-- Address Modal -->[\s\S]*?<\/form>\s*<\/div>\s*<\/div>/;
const addressModalMatch = dashContent.match(addressModalRegex);
let extractedAddressModal = '';
if (addressModalMatch) {
  extractedAddressModal = addressModalMatch[0];
  dashContent = dashContent.replace(addressModalRegex, '');
} else {
  console.log('Address modal not found in dashboard');
}

// Extract the address JS logic
const addressJSRegex = /\/\/ --- Address System Logic ---[\s\S]*?async function setDefaultAddress\(id\) {[\s\S]*?}\s*}/;
const addressJSMatch = dashContent.match(addressJSRegex);
let extractedAddressJS = '';
if (addressJSMatch) {
  extractedAddressJS = addressJSMatch[0];
  dashContent = dashContent.replace(addressJSRegex, '');
} else {
  console.log('Address JS not found in dashboard');
}

// Remove loadAddresses() call from window.onload in dashboard
dashContent = dashContent.replace(/loadAddresses\(\);\s*/, '');

// --- INJECT INTO LOGIN ---

// Inject HTML inside the db-content area, below db-main-grid
const dbMainGridEndRegex = /(<div class="db-actions-card">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>)/;
if (loginContent.match(dbMainGridEndRegex) && extractedAccountSection) {
  // We'll wrap the extracted section to match the dashboard style slightly
  let modifiedAccountSection = extractedAccountSection.replace(/margin-bottom: 50px;/, 'margin-top: 30px; margin-bottom: 30px;');
  // Also we want it visible by default on the account page since it's the logged-in view
  modifiedAccountSection = modifiedAccountSection.replace(/display: none;/, 'display: block;');
  
  // Clean up any double injection if we run this twice
  if (!loginContent.includes('<!-- Saved Addresses Section -->')) {
    loginContent = loginContent.replace(dbMainGridEndRegex, `$1\n\n      <!-- Saved Addresses Section -->\n      ${modifiedAccountSection}\n`);
  }
} else {
  console.log('Could not find injection point for HTML in login.html');
}

// Inject Address Modal before </body>
if (!loginContent.includes('<!-- Address Modal -->') && extractedAddressModal) {
  loginContent = loginContent.replace(/<\/body>/, `${extractedAddressModal}\n</body>`);
}

// Inject Address JS logic before closing script tag
if (!loginContent.includes('// --- Address System Logic ---') && extractedAddressJS) {
  loginContent = loginContent.replace(/<\/script>\s*<\/body>/, `\n\n    ${extractedAddressJS}\n  </script>\n</body>`);
}

// Call loadAddresses when showSuccess is called
const showSuccessStartRegex = /function showSuccess\(name,\s*isRegister\)\s*\{/;
if (loginContent.match(showSuccessStartRegex)) {
  if (!loginContent.includes('if (typeof loadAddresses === \'function\') loadAddresses();')) {
    loginContent = loginContent.replace(showSuccessStartRegex, `function showSuccess(name, isRegister) {\n      if (typeof loadAddresses === 'function') loadAddresses();`);
  }
} else {
  console.log('Could not find showSuccess in login.html');
}

// Also call loadAddresses if checkSess determines the user is logged in
const checkSessRegex = /if \(email\) \{\s*showSuccess\(name\);\s*\}/;
if (loginContent.match(checkSessRegex)) {
  loginContent = loginContent.replace(checkSessRegex, `if (email) {\n        showSuccess(name);\n      }`);
}

// Fix the email check in loadAddresses inside login.html, we don't need to hide accountSection, it's part of loggedInDashboard
loginContent = loginContent.replace(/if\s*\(accountSection\)\s*accountSection.style.display\s*=\s*'none';/g, '');
loginContent = loginContent.replace(/if\s*\(accountSection\)\s*accountSection.style.display\s*=\s*'block';/g, '');

fs.writeFileSync(dashPath, dashContent, 'utf8');
fs.writeFileSync(loginPath, loginContent, 'utf8');

console.log('Migration complete!');
