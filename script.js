// Enhanced JS for Aditya Medical & General Store Website
// Theme is handled by theme.js — do not add theme code here.

// --- Product Data Split ---
const medicines = [
  { name: "Paracetamol", price: 456.06 },
  { name: "Ibuprofen", price: 190.87 },
  { name: "Amoxicillin", price: 755.87 },
  { name: "Cetrizine", price: 110.26 },
  { name: "Dolo 650", price: 521.17 },
  { name: "Crocin Advance", price: 613.88 },
  { name: "Aspirin", price: 387.2 },
  { name: "Metformin", price: 1127.96 },
  { name: "Pantoprazole", price: 118.53 },
  { name: "Omeprazole", price: 487.26 },
  { name: "Azithromycin", price: 967.97 },
  { name: "Losartan", price: 1000.73 },
  { name: "Amlodipine", price: 100.74 },
  { name: "Atorvastatin", price: 315.67 },
  { name: "Thyronorm", price: 774.14 },
  { name: "Folic Acid", price: 973.7 },
  { name: "ORS Sachet", price: 782.86 },
  { name: "Insulin", price: 734.85 },
  { name: "Cough Syrup", price: 554.69 },
  { name: "Vicks Vaporub", price: 514.7 }
];

const generalProducts = [
  { name: "Bandages", price: 949.04 },
  { name: "Crepe Bandage", price: 1051.18 },
  { name: "Cotton Rolls", price: 732.72 },
  { name: "Surgical Gloves", price: 847.6 },
  { name: "Syringes", price: 854.27 },
  { name: "IV Set", price: 968.65 },
  { name: "Disinfectant Liquid", price: 1042.69 },
  { name: "Dettol Soap", price: 488.62 },
  { name: "Savlon Liquid", price: 260.58 },
  { name: "Toothpaste", price: 1047.07 },
  { name: "Toothbrush", price: 1070.59 },
  { name: "Shampoo", price: 619.26 },
  { name: "Hair Oil", price: 260.71 },
  { name: "Comb", price: 607.29 },
  { name: "Body Lotion", price: 433.9 },
  { name: "Talcum Powder", price: 665.49 },
  { name: "Bathing Soap", price: 1119.55 },
  { name: "Face Wash", price: 342.67 },
  { name: "Lip Balm", price: 1073.84 },
  { name: "Deodorant", price: 947.5 }
];

// --- Ensure Cart Panel Exists Globally ---
if (!document.getElementById("cartPanel")) {
  const cartHTML = `
  <aside id="cartPanel" class="hidden">
    <div class="cart-header">
      <h2>Your Cart</h2>
      <button class="cart-close" onclick="document.getElementById('cartPanel').classList.add('hidden')">×</button>
    </div>
    <div class="cart-content">
      <ul id="cartItems"></ul>
    </div>
    <div class="cart-footer">
      <h3 id="totalPrice">Total: ₹0.00</h3>
      <button class="btn-primary" onclick="checkout()">Checkout</button>
    </div>
  </aside>`;
  document.body.insertAdjacentHTML('beforeend', cartHTML);
}

// --- DOM Elements ---
const medicineList = document.getElementById("medicine-list");
const generalList = document.getElementById("general-list");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const cartItemsList = document.getElementById("cartItems");
const totalPriceDisplay = document.getElementById("totalPrice");
const cartCount = document.getElementById("cartCount");
const cartToggle = document.getElementById("cartToggle");
const cartPanel = document.getElementById("cartPanel");

let cart = JSON.parse(localStorage.getItem('am_cart')) || [];

window.addEventListener('storage', (e) => {
  if (e.key === 'am_cart') {
    cart = JSON.parse(e.newValue) || [];
    updateCartUI();
  }
});

// --- Product Card Rendering ---
function renderProductList(list, products) {
  list.innerHTML = "";
  products.forEach((product) => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <h3>${product.name}</h3>
      <p>Price: ₹${product.price.toFixed(2)}</p>
      <button class="add-btn" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
    `;
    list.appendChild(div);
  });
}

// --- Initial Render ---
if (medicineList) renderProductList(medicineList, medicines);
if (generalList) renderProductList(generalList, generalProducts);

// --- Add to Cart with Quantity ---
function addToCart(name, price) {
  const found = cart.find(item => item.name === name);
  if (found) {
    found.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  localStorage.setItem('am_cart', JSON.stringify(cart));
  updateCartUI();
  if (cartPanel) {
    cartPanel.classList.remove("hidden");
  }
}

// --- Cart UI with Quantity Controls ---
function updateCartUI() {
  if (!cartItemsList || !totalPriceDisplay || !cartCount) return;
  cartItemsList.innerHTML = "";
  let total = 0;
  cart.forEach((item, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span style="font-weight:500;">${item.name}</span>
      <br>
      <span style="color:#1976d2;">₹${item.price.toFixed(2)}</span>
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
  if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Call updateCartUI once on load to show items across pages
updateCartUI();

// --- Cart Quantity Button Events ---
if (cartItemsList) {
  cartItemsList.addEventListener("click", function(e) {
    if (e.target.classList.contains("qty-btn")) {
      const idx = +e.target.getAttribute("data-idx");
      const action = e.target.getAttribute("data-action");
      if (action === "increase") {
        cart[idx].quantity += 1;
      } else if (action === "decrease") {
        cart[idx].quantity -= 1;
        if (cart[idx].quantity <= 0) cart.splice(idx, 1);
      }
      localStorage.setItem('am_cart', JSON.stringify(cart));
      updateCartUI();
    }
    if (e.target.classList.contains("remove-btn")) {
      const idx = +e.target.getAttribute("data-idx");
      cart.splice(idx, 1);
      localStorage.setItem('am_cart', JSON.stringify(cart));
      updateCartUI();
    }
  });
}

// --- Add to Cart Button Events ---
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("add-btn")) {
    const name = e.target.getAttribute("data-name");
    const price = parseFloat(e.target.getAttribute("data-price"));
    addToCart(name, price);
  }
});

// --- Search and Sort ---
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();
    if (medicineList) {
      renderProductList(
        medicineList,
        medicines.filter(p => p.name.toLowerCase().includes(keyword))
      );
    }
    if (generalList) {
      renderProductList(
        generalList,
        generalProducts.filter(p => p.name.toLowerCase().includes(keyword))
      );
    }
  });
}

if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    let medSorted = [...medicines];
    let genSorted = [...generalProducts];
    if (sortSelect.value === "asc") {
      medSorted.sort((a, b) => a.price - b.price);
      genSorted.sort((a, b) => a.price - b.price);
    } else if (sortSelect.value === "desc") {
      medSorted.sort((a, b) => b.price - a.price);
      genSorted.sort((a, b) => b.price - a.price);
    }
    if (medicineList) renderProductList(medicineList, medSorted);
    if (generalList) renderProductList(generalList, genSorted);
  });
}

// --- Cart Toggle ---
if (cartToggle && cartPanel) {
  cartToggle.addEventListener("click", () => {
    cartPanel.classList.toggle("hidden");
  });
}

// --- Contact Form Handling ---
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Thank you! We'll get in touch with you soon.");
    this.reset();
  });
}

// Checkout logic is handled in cart.js

// Dynamic WhatsApp Widget Injection
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('floating-whatsapp-widget')) return;
  
  // Hide on Account/Orders page as requested by user
  if (window.location.pathname.includes('customer-dashboard.html') || window.location.pathname.includes('login.html')) {
    return;
  }
  
  const wa = document.createElement('a');
  wa.id = 'floating-whatsapp-widget';
  wa.href = 'https://wa.me/917588662926?text=Hello%2C%20I%20want%20to%20order%20medicines';
  wa.target = '_blank';
  wa.className = 'floating-wa';
  wa.innerHTML = '💬';
  
  wa.style.position = 'fixed';
  wa.style.bottom = '90px'; // positioned above sticky mobile footer
  wa.style.right = '24px';
  wa.style.backgroundColor = '#25d366';
  wa.style.color = '#ffffff';
  wa.style.width = '56px';
  wa.style.height = '56px';
  wa.style.borderRadius = '50%';
  wa.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
  wa.style.display = 'flex';
  wa.style.alignItems = 'center';
  wa.style.justifyContent = 'center';
  wa.style.fontSize = '26px';
  wa.style.textDecoration = 'none';
  wa.style.zIndex = '9999';
  wa.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  wa.style.cursor = 'pointer';
  
  wa.onmouseenter = () => {
    wa.style.transform = 'translateY(-5px) scale(1.05)';
    wa.style.backgroundColor = '#128c7e';
    wa.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
  };
  wa.onmouseleave = () => {
    wa.style.transform = 'none';
    wa.style.backgroundColor = '#25d366';
    wa.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
  };
  
  document.body.appendChild(wa);
});

// ============================================================================
// GLOBAL HEADER UI LOGIC (Hamburger Menu, Sticky Header, Search)
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // ── Hamburger menu ──
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('open');
      mobileDrawer.classList.toggle('open');
    });
    // Close drawer on link click
    mobileDrawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburgerBtn.classList.remove('open');
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // ── Scroll-shrink header ──
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // ── Global Search ──
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function() {
      const t = searchInput.value.trim();
      if (t) window.location.href = `products.html?search=${encodeURIComponent(t)}`;
    });
    searchInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') searchBtn.click();
    });
  }
});