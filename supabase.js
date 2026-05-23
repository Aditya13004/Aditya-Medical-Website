// =============================================================
//  supabase.js — Aditya Medical & General Store
//  Supabase Client Configuration (Fixed Race-Condition Version)
// =============================================================

const SUPABASE_URL  = 'https://rfcxhcucpzaplbprmbqm.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmY3hoY3VjcHphcGxicHJtYnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NzgxOTcsImV4cCI6MjA5MDM1NDE5N30.ppk-3ExeHqkw3IHYz6Rgarr4FqMoIZaWShHgY2PI_Ls';

// Queue of resolve callbacks waiting for the client
window._supabaseResolvers = window._supabaseResolvers || [];
window._supabaseClient    = window._supabaseClient    || null;

/**
 * Returns a Promise that resolves with the Supabase client.
 * Safe to call at any time — before or after the SDK loads.
 */
function getSupabase() {
  return new Promise(function(resolve) {
    if (window._supabaseClient) {
      // Client already ready
      resolve(window._supabaseClient);
    } else {
      // Queue for when the SDK finishes loading
      window._supabaseResolvers.push(resolve);
    }
  });
}

// Only inject the script once per page
if (!document.getElementById('supabase-sdk-script')) {
  var sdkScript    = document.createElement('script');
  sdkScript.id     = 'supabase-sdk-script';
  sdkScript.src    = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
  sdkScript.async  = true;

  sdkScript.onload = function() {
    try {
      // The UMD bundle exposes window.supabase.createClient
      var client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
      window._supabaseClient = client;

      // Resolve every pending caller
      var resolvers = window._supabaseResolvers || [];
      for (var i = 0; i < resolvers.length; i++) {
        resolvers[i](client);
      }
      window._supabaseResolvers = [];

      // Also fire a legacy event for any older listeners
      window.dispatchEvent(new Event('supabaseReady'));
      console.log('✅ Supabase client initialised');
    } catch (err) {
      console.error('❌ Failed to initialise Supabase client:', err);
    }
  };

  sdkScript.onerror = function() {
    console.error('❌ Failed to load Supabase SDK from CDN. Check your internet connection or Content-Security-Policy.');
  };

  document.head.appendChild(sdkScript);
}
