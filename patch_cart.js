const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'cart.js');
let content = fs.readFileSync(filePath, 'utf8');

// Find the index of "async function checkout() {"
const startIndex = content.indexOf('async function checkout() {');
if (startIndex !== -1) {
  const nextFunctionIndex = content.indexOf('window.checkout = checkout;', startIndex);
  if (nextFunctionIndex !== -1) {
    const before = content.substring(0, startIndex);
    const after = content.substring(nextFunctionIndex);
    
    const newCheckout = `async function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const email = localStorage.getItem('am_user_email');
  if (!window.Auth || !Auth.getToken()) {
    if (window.Auth) {
      Auth.requireAuth(() => { window.location.href = 'checkout.html'; });
      return;
    } else if (!email) {
      alert('Please login to checkout.');
      window.location.href = 'login.html';
      return;
    }
  }

  window.location.href = 'checkout.html';
}

`;
    
    fs.writeFileSync(filePath, before + newCheckout + after, 'utf8');
    console.log("cart.js updated!");
  } else {
    console.log("Could not find window.checkout = checkout;");
  }
} else {
  console.log("Could not find checkout function");
}
