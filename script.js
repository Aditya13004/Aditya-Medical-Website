// Enhanced JS for Aditya Medical & General Store Website

// Theme Toggle Functionality
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  
  if (!themeToggle) {
    console.log('Theme toggle button not found');
    return;
  }
  
  const icon = themeToggle.querySelector('.icon');
  const text = themeToggle.querySelector('span:last-child');
  
  if (!icon || !text) {
    console.log('Theme toggle button elements not found');
    return;
  }
  
  // Check for saved theme preference or default to light
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeButton(currentTheme);
  
  // Remove any existing event listeners
  themeToggle.removeEventListener('click', handleThemeToggle);
  
  // Add new event listener
  themeToggle.addEventListener('click', handleThemeToggle);
  
  function handleThemeToggle() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    console.log('Theme toggle clicked! Switching from', currentTheme, 'to', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
    
    // Force immediate visual change
    document.body.style.backgroundColor = newTheme === 'dark' ? '#1e293b' : '#f8fafc';
    document.body.style.color = newTheme === 'dark' ? '#f8fafc' : '#1e293b';
    
    // Apply dark theme to all sections
    if (newTheme === 'dark') {
      applyDarkTheme();
    } else {
      applyLightTheme();
    }
  }
  
  function updateThemeButton(theme) {
    if (theme === 'dark') {
      icon.textContent = '☀️';
      text.textContent = 'Light';
    } else {
      icon.textContent = '🌙';
      text.textContent = 'Dark';
    }
  }
  
  function applyDarkTheme() {
    // Apply dark theme to all sections
    const sections = document.querySelectorAll('.search-section, .products-section, .about, .services, .contact');
    sections.forEach(section => {
      section.style.backgroundColor = '#1e293b';
      section.style.color = '#f8fafc';
    });
    
    // Apply dark theme to cards
    const cards = document.querySelectorAll('.product-card, .feature-item, .service-card');
    cards.forEach(card => {
      card.style.backgroundColor = '#334155';
      card.style.borderColor = '#475569';
      card.style.color = '#f8fafc';
    });
    
    // Apply dark theme to inputs
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.style.backgroundColor = '#475569';
      input.style.color = '#f8fafc';
      input.style.borderColor = '#64748b';
    });
  }
  
  function applyLightTheme() {
    // Apply light theme to all sections
    const sections = document.querySelectorAll('.search-section, .products-section, .about, .services, .contact');
    sections.forEach(section => {
      section.style.backgroundColor = '';
      section.style.color = '';
    });
    
    // Apply light theme to cards
    const cards = document.querySelectorAll('.product-card, .feature-item, .service-card');
    cards.forEach(card => {
      card.style.backgroundColor = '';
      card.style.borderColor = '';
      card.style.color = '';
    });
    
    // Apply light theme to inputs
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.style.backgroundColor = '';
      input.style.color = '';
      input.style.borderColor = '';
    });
  }
}

// Test function to manually switch themes (for debugging)
function testThemeSwitch() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  console.log('Manual theme switch from', currentTheme, 'to', newTheme);
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Force immediate visual change
  document.body.style.backgroundColor = newTheme === 'dark' ? '#1e293b' : '#f8fafc';
  document.body.style.color = newTheme === 'dark' ? '#f8fafc' : '#1e293b';
  
  // Apply theme changes
  if (newTheme === 'dark') {
    applyDarkTheme();
  } else {
    applyLightTheme();
  }
  
  // Update button if it exists
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const icon = themeToggle.querySelector('.icon');
    const text = themeToggle.querySelector('span:last-child');
    if (icon && text) {
      if (newTheme === 'dark') {
        icon.textContent = '☀️';
        text.textContent = 'Light';
      } else {
        icon.textContent = '🌙';
        text.textContent = 'Dark';
      }
    }
  }
}

// Global theme functions
function applyDarkTheme() {
  // Apply dark theme to all sections
  const sections = document.querySelectorAll('.search-section, .products-section, .about, .services, .contact');
  sections.forEach(section => {
    section.style.backgroundColor = '#1e293b';
    section.style.color = '#f8fafc';
  });
  
  // Apply dark theme to cards
  const cards = document.querySelectorAll('.product-card, .feature-item, .service-card');
  cards.forEach(card => {
    card.style.backgroundColor = '#334155';
    card.style.borderColor = '#475569';
    card.style.color = '#f8fafc';
  });
  
  // Apply dark theme to inputs
  const inputs = document.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.style.backgroundColor = '#475569';
    input.style.color = '#f8fafc';
    input.style.borderColor = '#64748b';
  });
}

function applyLightTheme() {
  // Apply light theme to all sections
  const sections = document.querySelectorAll('.search-section, .products-section, .about, .services, .contact');
  sections.forEach(section => {
    section.style.backgroundColor = '';
    section.style.color = '';
  });
  
  // Apply light theme to cards
  const cards = document.querySelectorAll('.product-card, .feature-item, .service-card');
  cards.forEach(card => {
    card.style.backgroundColor = '';
    card.style.borderColor = '';
    card.style.color = '';
  });
  
  // Apply light theme to inputs
  const inputs = document.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.style.backgroundColor = '';
    input.style.color = '';
    input.style.borderColor = '';
  });
}

// Initialize theme toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initThemeToggle();
  
  // Debug: Check if theme is being applied
  console.log('Current theme:', document.documentElement.getAttribute('data-theme'));
  console.log('Saved theme:', localStorage.getItem('theme'));
  
  // Apply current theme on page load
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    applyDarkTheme();
  }
  
  // Add test function to window for manual testing
  window.testThemeSwitch = testThemeSwitch;
});

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

let cart = [];

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
renderProductList(medicineList, medicines);
renderProductList(generalList, generalProducts);

// --- Add to Cart with Quantity ---
function addToCart(name, price) {
  const found = cart.find(item => item.name === name);
  if (found) {
    found.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCartUI();
}

// --- Cart UI with Quantity Controls ---
function updateCartUI() {
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
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// --- Cart Quantity Button Events ---
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
    updateCartUI();
  }
  if (e.target.classList.contains("remove-btn")) {
    const idx = +e.target.getAttribute("data-idx");
    cart.splice(idx, 1);
    updateCartUI();
  }
});

// --- Add to Cart Button Events ---
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("add-btn")) {
    const name = e.target.getAttribute("data-name");
    const price = parseFloat(e.target.getAttribute("data-price"));
    addToCart(name, price);
  }
});

// --- Search and Sort ---
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  renderProductList(
    medicineList,
    medicines.filter(p => p.name.toLowerCase().includes(keyword))
  );
  renderProductList(
    generalList,
    generalProducts.filter(p => p.name.toLowerCase().includes(keyword))
  );
});

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
  renderProductList(medicineList, medSorted);
  renderProductList(generalList, genSorted);
});

// --- Cart Toggle ---
cartToggle.addEventListener("click", () => {
  cartPanel.classList.toggle("hidden");
});

// --- Contact Form Handling ---
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Thank you! We'll get in touch with you soon.");
  this.reset();
});

// --- Checkout ---
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Thank you for your purchase!");
  cart = [];
  updateCartUI();
  cartPanel.classList.add("hidden");
}

// Expose checkout to global scope for inline HTML onclick
window.checkout = checkout;