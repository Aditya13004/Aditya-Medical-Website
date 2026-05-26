const fs = require('fs');

const headerHtml = `  <!-- ══ HEADER ══ -->
  <header id="siteHeader">
    <div class="hdr-inner">
      <a href="index.html" class="hdr-logo" id="logoClickAdmin">
        <img src="images/Aditya Medical.png" alt="Aditya Medical Logo" />
        <div>
          <span class="hdr-logo-name">Aditya Medical</span>
          <span class="hdr-logo-sub">&amp; General Store </span>
        </div>
      </a>

      <!-- Desktop Navigation -->
      <nav class="hdr-nav" id="desktopNav">
        <a href="index.html" class="hn nav-home">Home</a>
        <a href="products.html" class="hn nav-products">Products</a>
        <a href="order.html" class="hn nav-order">Quick Order</a>
        <a href="prescription-upload.html" class="hn nav-prescription">Prescription</a>
        <a href="ai-recommendations.html" class="hn nav-ai">AI Help</a>
        <a href="contact.html" class="hn nav-contact">Contact</a>
        <a href="customer-dashboard.html" class="hn nav-orders">My Orders</a>
        
        <div class="hdr-nav-right">
          <!-- Premium Search Bar -->
          <form action="products.html" method="GET" class="hdr-search-form">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2" style="margin-right:6px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" name="q" placeholder="Search..." />
          </form>

          <!-- Unified User Welcome (Top Right) -->
          <div id="userWelcome" style="display:none; align-items:center;"></div>
          <a href="login.html" class="hn hn-ghost nav-login login-link" title="Account">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span class="account-text">Account</span>
          </a>
          <button id="cartToggle" class="hn-cart" title="View Cart">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <span>Cart (<span id="cartCount">0</span>)</span>
          </button>
        </div>
      </nav>

      <!-- Hamburger (mobile only) -->
      <button class="hdr-hamburger" id="hamburgerBtn" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>

    <!-- Mobile Menu Drawer -->
    <div class="hdr-drawer" id="mobileDrawer">
      <a href="index.html" class="hd-link nav-home">Home</a>
      <a href="products.html" class="hd-link nav-products">Products</a>
      <a href="order.html" class="hd-link hd-order nav-order">Quick Order</a>
      <a href="prescription-upload.html" class="hd-link nav-prescription">Prescription</a>
      <a href="ai-recommendations.html" class="hd-link nav-ai">AI Help</a>
      <a href="contact.html" class="hd-link nav-contact">Contact</a>
      <a href="customer-dashboard.html" class="hd-link nav-orders">My Orders</a>
      <a href="login.html" class="hd-link nav-login login-link">Login</a>
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
              vel.innerHTML = '<div class="user-welcome"><div class="user-avatar">' + firstChar + '</div><span class="user-name-text">' + storedName.split(" ")[0] + '</span></div>';
              vel.style.display = 'block';
            }
            const loginLinks = document.querySelectorAll('.login-link');
            loginLinks.forEach(l => {
              l.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> <span class="account-text">' + storedName.split(" ")[0] + '</span>';
              l.classList.remove('hn-ghost');
              l.classList.add('hn-account-active');
            });
          }
        }, 20);
      })();
    </script>
  </header>`;

const filesToUpdate = [
    'index.html',
    'products.html',
    'prescription-upload.html',
    'ai-recommendations.html',
    'contact.html',
    'customer-dashboard.html',
    'login.html',
    'about.html',
    'faq.html',
    'admin-login.html',
    'test-admin-login.html',
    'test-admin-orders.html',
    'test-supabase-orders.html'
];

const pattern1 = /<!-- ══ HEADER ══ -->\s*<header id="siteHeader">[\s\S]*?<\/header>/g;
const pattern2 = /<header id="siteHeader">[\s\S]*?<\/header>/g;

for (const file of filesToUpdate) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        let newContent = content;
        if (content.includes('<!-- ══ HEADER ══ -->')) {
            newContent = content.replace(pattern1, headerHtml);
        } else {
            newContent = content.replace(pattern2, headerHtml);
        }
        
        fs.writeFileSync(file, newContent, 'utf8');
        console.log("Updated " + file);
    }
}
