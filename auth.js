(function(){
  function getApiBase() {
    try {
      if (window && window.location && /^https?:/i.test(window.location.origin)) {
        return window.location.origin;
      }
    } catch(_) {}
    return 'http://localhost:3000';
  }
  function getApiUrl(path) {
    const base = getApiBase();
    const p = (path.startsWith('/') ? path : '/' + path);
    return base + p;
  }

  const Auth = {
    tokenKey: 'authToken',
    userKey: 'authUser',

    getToken() {
      return localStorage.getItem(this.tokenKey);
    },

    setSession(token, user) {
      localStorage.setItem(this.tokenKey, token);
      if (user) localStorage.setItem(this.userKey, JSON.stringify(user));
    },

    clearSession() {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    },

    fetchWithAuth(url, options = {}) {
      const token = this.getToken();
      const headers = Object.assign({}, options.headers || {}, { 'Content-Type': 'application/json' });
      if (token) headers['Authorization'] = 'Bearer ' + token;
      return fetch(getApiUrl(url), Object.assign({}, options, { headers }));
    },

    requireAuth(callback) {
      const token = this.getToken();
      if (token) {
        callback && callback();
        return;
      }
      this.showAuthModal(callback);
    },

    showAuthModal(onSuccessCallback) {
      let modal = document.getElementById('auth-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'auth-modal';
        modal.innerHTML = this._modalHTML();
        document.body.appendChild(modal);
        this._attachHandlers(onSuccessCallback);
      }
      modal.style.display = 'flex';
    },

    hideAuthModal() {
      const modal = document.getElementById('auth-modal');
      if (modal) modal.style.display = 'none';
    },

    _attachHandlers(onSuccessCallback) {
      const modal = document.getElementById('auth-modal');
      const tabs = modal.querySelectorAll('.auth-tab');
      const forms = modal.querySelectorAll('.auth-form');

      function activate(tab) {
        tabs.forEach(t => t.classList.remove('active'));
        forms.forEach(f => f.classList.add('hidden'));
        tab.classList.add('active');
        const target = tab.getAttribute('data-target');
        modal.querySelector(target).classList.remove('hidden');
      }

      tabs.forEach(tab => tab.addEventListener('click', () => activate(tab)));
      activate(tabs[0]);

      // Signup submit
      modal.querySelector('#signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const payload = {
          name: form.name.value.trim(),
          email: form.email.value.trim(),
          password: form.password.value,
          phone: form.phone.value.trim(),
          age: parseInt(form.age.value, 10),
          gender: form.gender.value,
        };
        try {
          const resp = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await resp.json();
          if (!resp.ok || !data.success) throw new Error(data.message || 'Signup failed');
          Auth.setSession(data.token, data.user);
          Auth.hideAuthModal();
          onSuccessCallback && onSuccessCallback();
        } catch (err) {
          alert('Signup error: ' + err.message);
        }
      });

      // Login submit
      modal.querySelector('#loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const payload = {
          email: form.email.value.trim(),
          password: form.password.value
        };
        try {
          const resp = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await resp.json();
          if (!resp.ok || !data.success) throw new Error(data.message || 'Login failed');
          Auth.setSession(data.token, data.user);
          Auth.hideAuthModal();
          onSuccessCallback && onSuccessCallback();
        } catch (err) {
          alert('Login error: ' + err.message);
        }
      });

      // Close
      modal.querySelector('#auth-close').addEventListener('click', () => Auth.hideAuthModal());
    },

    _modalHTML() {
      return `
        <div class="auth-backdrop" style="position:fixed;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:10000;">
          <div class="auth-card" style="width: 380px; background:#fff; border-radius:12px; box-shadow:0 20px 40px rgba(0,0,0,.2); overflow:hidden;">
            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border-bottom:1px solid #e5e7eb;">
              <div style="font-weight:700;color:#1e293b;">Sign in to continue</div>
              <button id="auth-close" style="background:none;border:none;font-size:20px;cursor:pointer;">✖</button>
            </div>

            <div style="display:flex;">
              <button class="auth-tab active" data-target="#loginPanel" style="flex:1;padding:12px;border:none;background:#f3f4f6;cursor:pointer;font-weight:600;">Login</button>
              <button class="auth-tab" data-target="#signupPanel" style="flex:1;padding:12px;border:none;background:#f3f4f6;cursor:pointer;font-weight:600;">Sign up</button>
            </div>

            <div style="padding:16px;">
              <form id="loginForm" class="auth-form" style="display:block;" >
                <div id="loginPanel">
                  <div style="margin-bottom:12px;">
                    <label style="display:block;font-weight:600;margin-bottom:6px;">Email</label>
                    <input name="email" type="email" required style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
                  </div>
                  <div style="margin-bottom:12px;">
                    <label style="display:block;font-weight:600;margin-bottom:6px;">Password</label>
                    <input name="password" type="password" required style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
                  </div>
                  <button type="submit" style="width:100%;padding:12px;background:#2563eb;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;">Login</button>
                </div>
              </form>

              <form id="signupForm" class="auth-form hidden" >
                <div id="signupPanel">
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    <div>
                      <label style="display:block;font-weight:600;margin-bottom:6px;">Name</label>
                      <input name="name" required style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
                    </div>
                    <div>
                      <label style="display:block;font-weight:600;margin-bottom:6px;">Phone</label>
                      <input name="phone" required pattern="^[0-9]{10}$" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
                    </div>
                  </div>
                  <div style="margin-top:10px;">
                    <label style="display:block;font-weight:600;margin-bottom:6px;">Email</label>
                    <input name="email" type="email" required style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
                  </div>
                  <div style="margin-top:10px;">
                    <label style="display:block;font-weight:600;margin-bottom:6px;">Password</label>
                    <input name="password" type="password" minlength="6" required style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
                  </div>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px;">
                    <div>
                      <label style="display:block;font-weight:600;margin-bottom:6px;">Age</label>
                      <input name="age" type="number" min="1" max="150" required style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
                    </div>
                    <div>
                      <label style="display:block;font-weight:600;margin-bottom:6px;">Gender</label>
                      <select name="gender" required style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" style="width:100%;margin-top:12px;padding:12px;background:#10b981;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;">Create account</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <style>
          .auth-form.hidden{ display:none; }
          .auth-tab.active{ background:#fff !important; border-bottom:3px solid #2563eb; }
        </style>
      `;
    }
  };

  window.Auth = Auth;
  window.getApiUrl = getApiUrl;
})();
