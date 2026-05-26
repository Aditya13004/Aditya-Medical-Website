/**
 * mobile-fixes.js — Aditya Medical & General Store
 * ===================================================
 * Fixes THREE critical mobile bugs:
 *   1. Cart key unification  (cart.js="cart" vs script.js="am_cart")
 *   2. Mobile cart toggle    (SVG/span child clicks not bubbling to button)
 *   3. Mobile hamburger menu (duplicate listeners, DOMContentLoaded timing)
 *
 * Load this file LAST — after cart.js and script.js on every page.
 * ===================================================
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     ISSUE 1 — UNIFIED CART STORAGE KEY
     cart.js uses localStorage key "cart"
     script.js uses localStorage key "am_cart"
     Result: different pages show different counts.
     Fix: migrate "am_cart" → "cart" on every load so both files
          always read/write the SAME key ("am_cart" is canonical).
  ──────────────────────────────────────────────────────────────── */
  const CART_KEY = 'am_cart';

  // If old key has data and new key doesn't, migrate it
  (function migrateCartKey() {
    const oldKey = 'cart';
    const newKey = CART_KEY;

    const oldData = localStorage.getItem(oldKey);
    const newData = localStorage.getItem(newKey);

    if (oldData && !newData) {
      // Migrate: copy old → new
      localStorage.setItem(newKey, oldData);
      localStorage.removeItem(oldKey);
    } else if (oldData && newData) {
      // Both exist — merge (add items not in new to new)
      try {
        const oldCart = JSON.parse(oldData) || [];
        const newCart = JSON.parse(newData) || [];
        let merged = [...newCart];
        oldCart.forEach(function (item) {
          const existing = merged.find(function (i) { return i.name === item.name; });
          if (existing) {
            existing.quantity = Math.max(existing.quantity, item.quantity);
          } else {
            merged.push(item);
          }
        });
        localStorage.setItem(newKey, JSON.stringify(merged));
        localStorage.removeItem(oldKey);
      } catch (e) {
        localStorage.removeItem(oldKey);
      }
    }
    // If only newData exists — nothing to do (correct state)
  })();

  // Patch cart.js to use 'am_cart' instead of 'cart'
  // cart.js reads from localStorage on load, but we migrated before it ran.
  // However cart.js writes back to "cart" on updateCartUI.
  // We intercept localStorage.setItem to redirect "cart" writes → "am_cart"
  (function patchLocalStorageKey() {
    const _origSetItem = localStorage.setItem.bind(localStorage);
    const _origGetItem = localStorage.getItem.bind(localStorage);

    localStorage.setItem = function (key, value) {
      if (key === 'cart') key = CART_KEY;
      return _origSetItem(key, value);
    };

    localStorage.getItem = function (key) {
      if (key === 'cart') key = CART_KEY;
      return _origGetItem(key);
    };
  })();


  /* ─────────────────────────────────────────────────────────────
     ISSUE 2 — MOBILE CART TOGGLE
     Problem: cart.js checks e.target.id === "cartToggle"
     but on mobile the click hits the SVG or <span> child.
     Fix: Use event delegation with .closest() to reliably catch
          clicks on the button OR any of its children.
          Also inject the cartPanel on pages that don't have one.
  ──────────────────────────────────────────────────────────────── */
  function injectCartPanelIfMissing() {
    if (document.getElementById('cartPanel')) return;

    const panel = document.createElement('aside');
    panel.id = 'cartPanel';
    panel.className = 'hidden';
    panel.innerHTML = [
      '<div class="cart-header">',
      '  <div class="cart-title">',
      '    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>',
      '    <h2>Your Cart</h2>',
      '  </div>',
      '  <button class="cart-close" id="cartClose" aria-label="Close cart">',
      '    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
      '  </button>',
      '</div>',
      '<div class="cart-body">',
      '  <ul id="cartItems"></ul>',
      '</div>',
      '<div class="cart-footer">',
      '  <div class="cart-total-row">',
      '    <span>Total</span>',
      '    <span id="totalPrice">₹0.00</span>',
      '  </div>',
      '  <button class="checkout-btn" onclick="checkout()">Proceed to Checkout</button>',
      '</div>'
    ].join('');
    document.body.appendChild(panel);
  }

  function openCartPanel() {
    const panel = document.getElementById('cartPanel');
    if (!panel) return;
    panel.classList.remove('hidden');
    panel.classList.add('cart-open');
    // Refresh cart display
    if (typeof updateCartUI === 'function') updateCartUI();
  }

  function closeCartPanel() {
    const panel = document.getElementById('cartPanel');
    if (!panel) return;
    panel.classList.add('hidden');
    panel.classList.remove('cart-open');
  }

  function attachCartToggleListeners() {
    // Use event delegation on document — catches button + all children
    document.addEventListener('click', function (e) {
      // Open cart: click on #cartToggle or any child of it
      const toggleBtn = e.target.closest('#cartToggle');
      if (toggleBtn) {
        e.preventDefault();
        e.stopPropagation();
        const panel = document.getElementById('cartPanel');
        if (panel) {
          if (panel.classList.contains('hidden')) {
            openCartPanel();
          } else {
            closeCartPanel();
          }
        }
        return;
      }

      // Close cart: click on .cart-close button or overlay
      const closeBtn = e.target.closest('.cart-close, #cartClose');
      if (closeBtn) {
        closeCartPanel();
        return;
      }
    }, true); // Use capture phase so this fires before cart.js's listener

    // Close on overlay click (outside the panel)
    document.addEventListener('click', function (e) {
      const panel = document.getElementById('cartPanel');
      if (!panel || panel.classList.contains('hidden')) return;
      if (!panel.contains(e.target) && !e.target.closest('#cartToggle')) {
        closeCartPanel();
      }
    });

    // Touch support — prevent ghost clicks blocking the cart button
    document.addEventListener('touchend', function (e) {
      const toggleBtn = e.target.closest('#cartToggle');
      if (toggleBtn) {
        e.preventDefault(); // prevent 300ms click delay
        const panel = document.getElementById('cartPanel');
        if (panel) {
          if (panel.classList.contains('hidden')) {
            openCartPanel();
          } else {
            closeCartPanel();
          }
        }
      }
    }, { passive: false });
  }


  /* ─────────────────────────────────────────────────────────────
     ISSUE 3 — MOBILE HAMBURGER MENU
     Problem: order.html has an inline <script> that attaches
              hamburger events before DOM is ready + script.js
              also attaches them → duplicate/broken events.
     Fix: Centralise hamburger init here, guard against duplicates.
  ──────────────────────────────────────────────────────────────── */
  function initHamburger() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');

    if (!hamburgerBtn || !mobileDrawer) return;

    // Remove old listeners by cloning the button (removes all attached events)
    const newBtn = hamburgerBtn.cloneNode(true);
    hamburgerBtn.parentNode.replaceChild(newBtn, hamburgerBtn);

    function openMenu() {
      newBtn.classList.add('open');
      mobileDrawer.classList.add('open');
      newBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      newBtn.classList.remove('open');
      mobileDrawer.classList.remove('open');
      newBtn.setAttribute('aria-expanded', 'false');
    }

    // Click to toggle
    newBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (mobileDrawer.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Touch support
    newBtn.addEventListener('touchend', function (e) {
      e.preventDefault();
      if (mobileDrawer.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    }, { passive: false });

    // Close when a menu link is tapped
    mobileDrawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { closeMenu(); });
      a.addEventListener('touchend', function () { closeMenu(); });
    });

    // Close when clicking outside drawer
    document.addEventListener('click', function (e) {
      if (mobileDrawer.classList.contains('open')) {
        if (!mobileDrawer.contains(e.target) && e.target !== newBtn && !newBtn.contains(e.target)) {
          closeMenu();
        }
      }
    });
  }


  /* ─────────────────────────────────────────────────────────────
     CART PANEL CSS INJECTION
     Inject the cartPanel slide-in styles if not already defined.
     This ensures the panel works on ALL pages even if style.css
     doesn't define it.
  ──────────────────────────────────────────────────────────────── */
  function injectCartPanelCSS() {
    if (document.getElementById('am-cart-panel-css')) return;

    const style = document.createElement('style');
    style.id = 'am-cart-panel-css';
    style.textContent = [
      '/* ── Injected by mobile-fixes.js ── */',

      /* Cart panel — slide from right */
      'aside#cartPanel {',
      '  position: fixed;',
      '  top: 0;',
      '  right: -110%;',           /* off-screen to the right */
      '  width: 380px;',
      '  max-width: 95vw;',
      '  height: 100vh;',
      '  background: #fff;',
      '  z-index: 9000;',
      '  display: flex !important;', /* always rendered */
      '  flex-direction: column;',
      '  box-shadow: -8px 0 32px rgba(15,23,42,0.15);',
      '  transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1);',
      '  border-left: 1px solid #e2e8f0;',
      '  overflow: hidden;',
      '}',
      /* Remove old .hidden toggle — we use right: -110% / 0 instead */
      'aside#cartPanel.hidden { right: -110% !important; pointer-events: none; }',
      'aside#cartPanel:not(.hidden), aside#cartPanel.cart-open { right: 0 !important; pointer-events: auto; }',

      /* Overlay backdrop when cart is open */
      'aside#cartPanel:not(.hidden)::before,',
      'aside#cartPanel.cart-open::before {',
      '  content: "";',
      '  position: fixed;',
      '  inset: 0;',
      '  background: rgba(15,23,42,0.45);',
      '  backdrop-filter: blur(2px);',
      '  z-index: -1;',
      '  right: 380px;',
      '  max-right: 5vw;',
      '}',

      /* Cart header */
      '.cart-header {',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  padding: 1.25rem 1.5rem;',
      '  border-bottom: 1px solid #f1f5f9;',
      '  background: #fff;',
      '  flex-shrink: 0;',
      '}',
      '.cart-title {',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 0.6rem;',
      '  color: #0f172a;',
      '}',
      '.cart-title h2 { font-size: 1.2rem; font-weight: 700; margin: 0; }',
      '.cart-close {',
      '  background: #f8fafc;',
      '  border: 1px solid #e2e8f0;',
      '  border-radius: 50%;',
      '  width: 36px; height: 36px;',
      '  cursor: pointer;',
      '  display: flex; align-items: center; justify-content: center;',
      '  color: #64748b;',
      '  transition: all 0.2s;',
      '  flex-shrink: 0;',
      '  -webkit-tap-highlight-color: transparent;',
      '}',
      '.cart-close:hover { background: #fff; border-color: #cbd5e1; color: #0f172a; }',

      /* Cart body scrollable */
      '.cart-body {',
      '  flex: 1;',
      '  overflow-y: auto;',
      '  padding: 1rem 1.5rem;',
      '  -webkit-overflow-scrolling: touch;',
      '}',
      '#cartItems { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; }',
      '#cartItems li {',
      '  display: flex; align-items: center; justify-content: space-between;',
      '  padding: 0.85rem; background: #f8fafc; border-radius: 12px;',
      '  border: 1px solid #f1f5f9; gap: 0.75rem;',
      '}',
      '.cart-item-info { display: flex; align-items: center; gap: 0.75rem; flex: 1; min-width: 0; }',
      '.cart-item-img { width: 52px; height: 52px; border-radius: 8px; object-fit: contain; background: #fff; border: 1px solid #e2e8f0; flex-shrink: 0; }',
      '.cart-item-details { min-width: 0; }',
      '.cart-item-name { font-size: 0.9rem; font-weight: 600; color: #1e293b; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }',
      '.cart-item-price { font-size: 0.85rem; color: #2563eb; font-weight: 700; display: block; }',
      '.cart-item-actions { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }',
      '.cart-qty-controls { display: flex; align-items: center; gap: 0.35rem; }',
      '.qty-btn {',
      '  width: 28px; height: 28px;',
      '  border: 1px solid #e2e8f0; border-radius: 6px;',
      '  background: #fff; cursor: pointer;',
      '  font-size: 1rem; font-weight: 700; color: #475569;',
      '  display: flex; align-items: center; justify-content: center;',
      '  transition: all 0.15s; -webkit-tap-highlight-color: transparent;',
      '  min-width: 28px;',
      '}',
      '.qty-btn:hover { background: #2563eb; color: #fff; border-color: #2563eb; }',
      '.cart-qty { font-size: 0.9rem; font-weight: 700; color: #1e293b; min-width: 20px; text-align: center; }',
      '.remove-btn {',
      '  background: none; border: none; cursor: pointer;',
      '  color: #94a3b8; padding: 4px;',
      '  border-radius: 6px; transition: all 0.15s;',
      '  -webkit-tap-highlight-color: transparent;',
      '}',
      '.remove-btn:hover { color: #ef4444; background: #fef2f2; }',

      /* Cart footer */
      '.cart-footer {',
      '  padding: 1.25rem 1.5rem;',
      '  border-top: 1px solid #f1f5f9;',
      '  background: #fff;',
      '  flex-shrink: 0;',
      '}',
      '.cart-total-row {',
      '  display: flex; justify-content: space-between; align-items: center;',
      '  font-size: 1.1rem; font-weight: 700; color: #0f172a;',
      '  margin-bottom: 1rem;',
      '}',
      '.checkout-btn {',
      '  width: 100%; padding: 0.9rem;',
      '  background: linear-gradient(135deg, #2563eb, #1d4ed8);',
      '  color: #fff; border: none; border-radius: 12px;',
      '  font-size: 1rem; font-weight: 700; cursor: pointer;',
      '  transition: all 0.2s; box-shadow: 0 4px 12px rgba(37,99,235,0.25);',
      '  -webkit-tap-highlight-color: transparent;',
      '}',
      '.checkout-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(37,99,235,0.35); }',

      /* ── Make cart-toggle button touch-friendly ── */
      '#cartToggle {',
      '  -webkit-tap-highlight-color: transparent;',
      '  touch-action: manipulation;',
      '  cursor: pointer;',
      '  min-height: 44px;',   /* iOS minimum touch target */
      '  min-width: 44px;',
      '}',

      /* ── Hamburger button touch-friendly ── */
      '.hdr-hamburger {',
      '  -webkit-tap-highlight-color: transparent;',
      '  touch-action: manipulation;',
      '  cursor: pointer;',
      '  min-height: 44px;',
      '  min-width: 44px;',
      '  display: none;',      /* default hidden; shown by nav.css at ≤900px */
      '}',
      '@media (max-width: 900px) {',
      '  .hdr-hamburger { display: flex !important; }',
      '}',

      /* ── Ensure drawer z-index is above everything ── */
      '.hdr-drawer {',
      '  z-index: 1050;',
      '  position: relative;',
      '}',
      '#siteHeader { z-index: 1100; }',

      /* ── Mobile cart: full-width bottom sheet on very small screens ── */
      '@media (max-width: 480px) {',
      '  aside#cartPanel {',
      '    width: 100vw !important;',
      '    max-width: 100vw !important;',
      '    height: 90vh !important;',
      '    top: auto !important;',
      '    bottom: -100% !important;',
      '    right: 0 !important;',
      '    border-left: none;',
      '    border-top: 1px solid #e2e8f0;',
      '    border-radius: 24px 24px 0 0;',
      '    transition: bottom 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;',
      '    box-shadow: 0 -8px 32px rgba(15,23,42,0.15);',
      '  }',
      '  aside#cartPanel.hidden { bottom: -100% !important; right: 0 !important; }',
      '  aside#cartPanel:not(.hidden), aside#cartPanel.cart-open {',
      '    bottom: 0 !important;',
      '    right: 0 !important;',
      '  }',
      '  aside#cartPanel:not(.hidden)::before,',
      '  aside#cartPanel.cart-open::before {',
      '    right: 0;',
      '    bottom: 90vh;',
      '    height: calc(100vh - 90vh);',
      '    width: 100%;',
      '  }',
      '}',

      /* ── Cross-tab cart sync badge update ── */
      '',
    ].join('\n');

    document.head.appendChild(style);
  }


  /* ─────────────────────────────────────────────────────────────
     CROSS-TAB CART SYNC
     When cart changes in another tab, update the badge here.
  ──────────────────────────────────────────────────────────────── */
  function attachCrossTabSync() {
    window.addEventListener('storage', function (e) {
      if (e.key === CART_KEY) {
        // Update cart count badge without full re-render
        try {
          const cart = JSON.parse(e.newValue) || [];
          const total = cart.reduce(function (sum, item) { return sum + item.quantity; }, 0);
          const badge = document.getElementById('cartCount');
          if (badge) badge.textContent = total;
        } catch (err) { /* ignore */ }

        // If cart.js or script.js defined updateCartUI, call it
        if (typeof updateCartUI === 'function') {
          try { updateCartUI(); } catch (err) { /* ignore */ }
        }
      }
    });
  }


  /* ─────────────────────────────────────────────────────────────
     INITIALISE — run after DOM is ready
  ──────────────────────────────────────────────────────────────── */
  function init() {
    injectCartPanelCSS();
    injectCartPanelIfMissing();
    attachCartToggleListeners();
    initHamburger();
    attachCrossTabSync();

    // Initial cart count update from correct key
    try {
      const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
      const total = cart.reduce(function (sum, item) { return sum + item.quantity; }, 0);
      const badge = document.getElementById('cartCount');
      if (badge) badge.textContent = total;
    } catch (e) { /* ignore */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
