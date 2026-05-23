// Shared cart logic for all pages
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

function updateCartUI() {
  const cartItemsList = document.getElementById("cartItems");
  const totalPriceDisplay = document.getElementById("totalPrice");
  const cartCount = document.getElementById("cartCount");
  
  if (!cartItemsList || !totalPriceDisplay || !cartCount) return;

  cartItemsList.innerHTML = "";
  let total = 0;
  
  cart.forEach((item, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <img src="${item.img || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop&crop=center'}" alt="" style="width:32px;height:32px;border-radius:4px;border:1px solid #e3eaf3;background:#f4f8fb;object-fit:cover;" onerror="this.src='https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop&crop=center'">
        <div style="flex:1;">
          <span style="font-weight:500;display:block;">${item.name}</span>
          <span style="color:#1976d2;font-size:0.9rem;">₹${item.price.toFixed(2)}</span>
        </div>
      </div>
      <div class="cart-qty-controls">
        <button class="qty-btn" data-idx="${idx}" data-action="decrease">-</button>
        <span class="cart-qty">${item.quantity}</span>
        <button class="qty-btn" data-idx="${idx}" data-action="increase">+</button>
        <button class="remove-btn" data-idx="${idx}" title="Remove">🗑️</button>
      </div>
    `;
    cartItemsList.appendChild(li);
    total += item.price * item.quantity;
  });
  
  totalPriceDisplay.textContent = `Total: ₹${total.toFixed(2)}`;
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Event listeners for cart functionality
document.addEventListener("click", function(e) {
  // Add to Cart (Standard or Premium)
  if (e.target.classList.contains("add-btn") || e.target.classList.contains("add-btn-premium")) {
    const name = e.target.getAttribute("data-name");
    const price = parseFloat(e.target.getAttribute("data-price"));
    const img = e.target.getAttribute("data-img");
    
    // Read card quantity selector if available
    const card = e.target.closest(".product-card");
    const qtyValEl = card ? card.querySelector(".p-qty-val") : null;
    const qtyToAdd = qtyValEl ? parseInt(qtyValEl.textContent) : 1;
    
    const found = cart.find(item => item.name === name);
    if (found) {
      found.quantity += qtyToAdd;
    } else {
      cart.push({ name, price, img, quantity: qtyToAdd });
    }
    updateCartUI();
    
    // Reset card selector back to 1
    if (qtyValEl) qtyValEl.textContent = "1";

    // Show beautiful success toast notification
    if (typeof showCartToast === 'function') {
      showCartToast(`✓ Added ${qtyToAdd}x ${name} to cart!`, "ok");
    } else {
      const btn = e.target;
      const originalText = btn.textContent;
      btn.textContent = "✓ Added";
      btn.style.background = "#22c55e";
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "";
      }, 1000);
    }
  }
  
  // Cart quantity controls
  if (e.target.classList.contains("qty-btn")) {
    const idx = +e.target.getAttribute("data-idx");
    const action = e.target.getAttribute("data-action");
    
    if (action === "increase") {
      cart[idx].quantity += 1;
    } else if (action === "decrease") {
      cart[idx].quantity -= 1;
      if (cart[idx].quantity <= 0) cart.splice(idx, 1);
    }
    updateCartUI();
  }
  
  // Remove item
  if (e.target.classList.contains("remove-btn")) {
    const idx = +e.target.getAttribute("data-idx");
    cart.splice(idx, 1);
    updateCartUI();
  }
  
  // Cart toggle
  if (e.target.id === "cartToggle") {
    const cartPanel = document.getElementById("cartPanel");
    if (cartPanel) cartPanel.classList.toggle("hidden");
  }
});

async function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const proceed = async () => {
    try {
      // Setup payload for Supabase insertion
      const userStr = localStorage.getItem('authUser');
      const user = userStr ? JSON.parse(userStr) : { name: 'Customer', phone: 'N/A' };
      const itemsText = cart.map(i => `${i.name} (${i.quantity}x) - ₹${i.price}`).join(', ');

      const sbUrl = "https://rfcxhcucpzaplbprmbqm.supabase.co/rest/v1/orders";
      const sbKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmY3hoY3VjcHphcGxicHJtYnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NzgxOTcsImV4cCI6MjA5MDM1NDE5N30.ppk-3ExeHqkw3IHYz6Rgarr4FqMoIZaWShHgY2PI_Ls";

      const btn = document.querySelector('.checkout-btn');
      if (btn) { btn.disabled = true; btn.textContent = 'Processing...'; }

      const resp = await fetch(sbUrl, {
        method: 'POST',
        headers: {
            'apikey': sbKey,
            'Authorization': 'Bearer ' + sbKey,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({
            name: user.name,
            phone: user.phone || 'N/A',
            medicines: itemsText,
            status: 'pending',
            created_at: new Date().toISOString()
        })
      });

      if (!resp.ok) throw new Error('Failed to connect to order server');
      
      const dataArr = await resp.json();
      const orderData = dataArr[0] || { id: 'NEW' };

      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      alert(`Thank you for your purchase!\n\nOrder ID: ${orderData.id}\nTotal Items: ${itemCount}\nTotal Amount: ₹${total.toFixed(2)}\n\nYour order has been sent directly to the Admin.`);

      cart = [];
      updateCartUI();
      const cartPanel = document.getElementById("cartPanel");
      if (cartPanel) cartPanel.classList.add("hidden");
      
      if (btn) { btn.disabled = false; btn.textContent = 'Proceed to Checkout'; }
    } catch (err) {
      alert('Order error: ' + err.message + '\nPlease refresh and try again.');
      const btn = document.querySelector('.checkout-btn');
      if (btn) { btn.disabled = false; btn.textContent = 'Proceed to Checkout'; }
    }
  };

  if (!window.Auth || !Auth.getToken()) {
    if (window.Auth) {
      Auth.requireAuth(proceed);
      return;
    } else {
      alert('Please login to place the order.');
      return;
    }
  }

  await proceed();
}

// Expose checkout to global scope for inline HTML onclick
window.checkout = checkout;

// On page load, update cart UI
document.addEventListener("DOMContentLoaded", updateCartUI);