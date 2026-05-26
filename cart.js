// Shared cart logic for all pages
// KEY: 'am_cart' — canonical key shared with script.js and mobile-fixes.js
let cart = JSON.parse(localStorage.getItem("am_cart") || "[]");

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
      <div class="cart-item-info">
        <img src="${item.img || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop&crop=center'}" alt="" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop&crop=center'">
        <div class="cart-item-details">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">₹${item.price.toFixed(2)}</span>
        </div>
      </div>
      <div class="cart-item-actions">
        <div class="cart-qty-controls">
          <button class="qty-btn" data-idx="${idx}" data-action="decrease">-</button>
          <span class="cart-qty">${item.quantity}</span>
          <button class="qty-btn" data-idx="${idx}" data-action="increase">+</button>
        </div>
        <button class="remove-btn" data-idx="${idx}" title="Remove">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      </div>
    `;
    cartItemsList.appendChild(li);
    total += item.price * item.quantity;
  });
  
  totalPriceDisplay.textContent = `₹${total.toFixed(2)}`;
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  localStorage.setItem("am_cart", JSON.stringify(cart));
}

// Event listeners for cart functionality
document.addEventListener("click", function(e) {
  // Add to Cart (Standard or Premium)
  const addBtn = e.target.closest(".add-btn, .add-btn-premium");
  if (addBtn) {
    if (addBtn.classList.contains("is-adding")) return;
    addBtn.classList.add("is-adding");
    const name = addBtn.getAttribute("data-name");
    const price = parseFloat(addBtn.getAttribute("data-price"));
    const img = addBtn.getAttribute("data-img");
    
    // Read card quantity selector if available
    const card = addBtn.closest(".product-card");
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
      showCartToast(`✓ ${qtyToAdd}x ${name} added to cart`, "ok");
    }

    // Modern professional button feedback
    const originalHTML = addBtn.innerHTML;
    const originalWidth = addBtn.offsetWidth + "px"; // prevent jumping
    
    addBtn.style.width = originalWidth;
    addBtn.style.background = "linear-gradient(135deg, #10B981, #059669)";
    addBtn.style.color = "#ffffff";
    addBtn.style.boxShadow = "0 8px 16px rgba(16, 185, 129, 0.3)";
    addBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Added`;
    
    // Cleanly revert
    setTimeout(() => {
      addBtn.innerHTML = originalHTML;
      addBtn.style.background = "";
      addBtn.style.color = "";
      addBtn.style.boxShadow = "";
      addBtn.style.width = "";
      addBtn.classList.remove("is-adding");
    }, 1500);
  }
  
  // Cart quantity controls
  const qtyBtn = e.target.closest(".qty-btn");
  if (qtyBtn) {
    const idx = parseInt(qtyBtn.getAttribute("data-idx"), 10);
    const action = qtyBtn.getAttribute("data-action");

    if (!isNaN(idx) && cart[idx]) {
      if (action === "increase") {
        cart[idx].quantity += 1;
      } else if (action === "decrease") {
        cart[idx].quantity -= 1;
        if (cart[idx].quantity <= 0) cart.splice(idx, 1);
      }
      updateCartUI();
    }
  }

  // Remove item
  const removeBtn = e.target.closest(".remove-btn");
  if (removeBtn) {
    const idx = parseInt(removeBtn.getAttribute("data-idx"), 10);
    if (!isNaN(idx)) {
      cart.splice(idx, 1);
      updateCartUI();
    }
  }

  // Cart toggle — use .closest() so child clicks (SVG, span) also work
  const cartToggleBtn = e.target.closest("#cartToggle");
  if (cartToggleBtn) {
    const cartPanel = document.getElementById("cartPanel");
    if (cartPanel) cartPanel.classList.toggle("hidden");
  }
});

async function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const email = localStorage.getItem('am_user_email');
  const hasAuthToken = window.Auth && Auth.getToken();

  if (!email && !hasAuthToken) {
    if (window.Auth) {
      Auth.requireAuth(() => { window.location.href = 'checkout.html'; });
      return;
    } else {
      alert('Please login to checkout.');
      window.location.href = 'login.html';
      return;
    }
  }

  window.location.href = 'checkout.html';
}

window.checkout = checkout;

// On page load, update cart UI
document.addEventListener("DOMContentLoaded", updateCartUI);