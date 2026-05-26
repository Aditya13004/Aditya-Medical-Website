/* ================================================================
   theme.js — Aditya Medical & General Store
   Self-contained, bulletproof theme toggle system
   Works on every page independently of any other script.
   ================================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'am_theme';
  var DARK = 'dark';
  var LIGHT = 'light';

  /* ── 1. Apply saved theme ASAP (called in <head> too) ── */
  function applySavedTheme() {
    var t = localStorage.getItem(STORAGE_KEY) || LIGHT;
    document.documentElement.setAttribute('data-theme', t);
    // Clear any conflicting inline styles
    if (document.body) {
      document.body.style.removeProperty('background-color');
      document.body.style.removeProperty('background');
      document.body.style.removeProperty('color');
    }
    return t;
  }

  /* ── 2. Update button icon ── */
  function syncIcon(theme) {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    var icon = btn.querySelector('.icon');
    if (icon) {
      icon.textContent = theme === DARK ? '☀️' : '🌙';
    }
    btn.setAttribute('title', theme === DARK ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    btn.setAttribute('aria-label', theme === DARK ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  }

  /* ── 3. Toggle ── */
  function toggle() {
    var current = document.documentElement.getAttribute('data-theme') || LIGHT;
    var next = current === DARK ? LIGHT : DARK;

    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);

    // Clear any inline styles that may be fighting CSS vars
    document.body.style.removeProperty('background-color');
    document.body.style.removeProperty('background');
    document.body.style.removeProperty('color');

    syncIcon(next);

    // Dispatch custom event for any listeners
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
  }

  /* ── 4. Bind button ── */
  function bindButton() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    // Remove all existing listeners by cloning
    var clone = btn.cloneNode(true);
    btn.parentNode.replaceChild(clone, btn);
    clone.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    });
    // Sync icon immediately
    syncIcon(document.documentElement.getAttribute('data-theme') || LIGHT);
  }

  /* ── 5. Init ── */
  function init() {
    var theme = applySavedTheme();
    syncIcon(theme);
    bindButton();
  }

  /* ── 6. Expose globally ── */
  window.amToggleTheme = toggle;
  window.amGetTheme = function () {
    return document.documentElement.getAttribute('data-theme') || LIGHT;
  };

  /* ── 7. Run ── */
  applySavedTheme(); // runs immediately even before DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
