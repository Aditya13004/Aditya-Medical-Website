import os
import re

header_html = """  <header id="siteHeader">
    <div class="hdr-inner">
      <a href="index.html" class="hdr-logo" id="logoClickAdmin">
        <img src="images/Aditya Medical.png" alt="Aditya Medical Logo" />
        <div>
          <span class="hdr-logo-name">Aditya Medical</span>
          <span class="hdr-logo-sub">&amp; General Store · Jalgaon</span>
        </div>
      </a>

      <!-- Desktop Navigation -->
      <nav class="hdr-nav" id="desktopNav">
        <a href="index.html" class="hn nav-home">Home</a>
        <a href="products.html" class="hn nav-products">Products</a>
        <a href="prescription-upload.html" class="hn nav-prescription">Prescription</a>
        <a href="ai-recommendations.html" class="hn nav-ai">🤖 AI Help</a>
        <a href="contact.html" class="hn nav-contact">Contact</a>
        <a href="customer-dashboard.html" class="hn nav-orders">📊 My Orders</a>
        
        <div class="hdr-nav-right">
          <!-- Unified User Welcome (Top Right) -->
          <div id="userWelcome" style="display:none; align-items:center; margin-right: 0.5rem;"></div>
          <a href="login.html" class="hn hn-ghost nav-login login-link">👤 Login</a>
          <a href="order.html" class="hn hn-cta nav-order">🛒 Order Now</a>
        </div>
        
        <button id="cartToggle" class="hn-cart" title="View Cart">
          🛒 <span id="cartCount">0</span>
        </button>
      </nav>

      <!-- Hamburger (mobile only) -->
      <button class="hdr-hamburger" id="hamburgerBtn" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>

    <!-- Mobile Menu Drawer -->
    <div class="hdr-drawer" id="mobileDrawer">
      <a href="index.html" class="hd-link nav-home">🏠 Home</a>
      <a href="products.html" class="hd-link nav-products">💊 Products</a>
      <a href="order.html" class="hd-link hd-order nav-order">🛒 Place Order</a>
      <a href="prescription-upload.html" class="hd-link nav-prescription">📋 Upload Prescription</a>
      <a href="ai-recommendations.html" class="hd-link nav-ai">🤖 AI Recommendations</a>
      <a href="contact.html" class="hd-link nav-contact">📞 Contact</a>
      <a href="customer-dashboard.html" class="hd-link nav-orders">📊 My Orders</a>
      <a href="login.html" class="hd-link nav-login login-link">👤 Login</a>
    </div>

    <script>
      // Automatically keep the navbar state completely consistent across all pages
      (function(){
        // 1. Set Active Link
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        const mapper = {
          'index.html': 'nav-home',
          'products.html': 'nav-products',
          'prescription-upload.html': 'nav-prescription',
          'ai-recommendations.html': 'nav-ai',
          'contact.html': 'nav-contact',
          'customer-dashboard.html': 'nav-orders',
          'login.html': 'nav-login',
          'order.html': 'nav-order'
        };
        const activeClass = mapper[page];
        
        // 2. Global Check Session
        const storedName = localStorage.getItem('am_user_name');

        setTimeout(() => {
          // highlight active nav tab
          if(activeClass) {
            document.querySelectorAll('.' + activeClass).forEach(el => el.classList.add('active'));
          }

          // render logged-in state across all pages!
          if (storedName) {
            const vel = document.getElementById('userWelcome');
            if (vel) {
              const firstChar = (storedName.charAt(0) || 'U').toUpperCase();
              vel.innerHTML = `
                <div class="user-welcome">
                  <div class="user-avatar">${firstChar}</div>
                  <span class="user-name-text">${storedName.split(' ')[0]}</span>
                </div>
              `;
              vel.style.display = 'flex';
              
              const loginLinks = document.querySelectorAll('.login-link');
              loginLinks.forEach(l => {
                l.textContent = '👤 Account';
                l.classList.remove('hn-ghost');
                l.classList.add('hn-account');
              });
            }
          }
        }, 20);
      })();
    </script>
  </header>"""

files_to_update = [
    'index.html',
    'products.html',
    'prescription-upload.html',
    'ai-recommendations.html',
    'contact.html',
    'customer-dashboard.html',
    'login.html',
    'order.html'
]

pattern = re.compile(r'<header id="siteHeader">.*?</header>', re.DOTALL)

for f in files_to_update:
    path = f
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        new_content = pattern.sub(header_html, content)
        
        with open(path, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Updated {f}")

