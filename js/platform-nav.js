async function renderPlatformNav() {
  const target = document.querySelector('[data-platform-nav]');
  if (!target) return;
  try {
    await window.SecguardAuth?.initSession?.();
  } catch (error) {
    console.warn('Secguard auth initialization failed. Rendering demo navigation fallback.', error);
  }
  if (!window.SecguardAuth?.enforce()) {
    target.innerHTML = `
      <div class="brand">
        <img class="brand-logo" src="assets/secguard-logo.svg" alt="Secguard" />
      </div>
      <div class="sidebar-empty">
        <strong>Session required</strong>
        <span>Open the login page and use Demo access or sign in with a Supabase user.</span>
        <a class="btn" href="login.html">Go to login</a>
      </div>
    `;
    return;
  }
  const current = location.pathname.split('/').pop() || 'dashboard.html';
  const role = SecguardAuth.getRole();
  const visibleLinks = SecguardAuth.visibleLinks(role);
  target.innerHTML = `
    <div class="brand">
      <img class="brand-logo" src="assets/secguard-logo.svg" alt="Secguard" />
    </div>
    <button class="notification-bell" type="button" data-notifications-toggle aria-label="Open notifications">
      Alerts <span data-notification-count>0</span>
    </button>
    <button class="menu-toggle" type="button" aria-label="Toggle workspace navigation">Menu</button>
    <nav class="nav-group">
      ${visibleLinks.length ? visibleLinks.map(([href, label]) => `<a href="${href}" class="${href === current ? 'active' : ''}"><span></span><span>${SecguardAuth.labelFor(href, label, role)}</span></a>`).join('') : '<div class="sidebar-empty"><strong>No portal links</strong><span>This role has no workspace links configured.</span></div>'}
    </nav>
    <div class="sidebar-footer">
      <div class="status-chip">${role.replace('_', ' ')} portal</div>
      <div class="status-pill" data-data-mode>Checking data mode</div>
      <button class="btn btn-ghost" type="button" data-logout>Logout</button>
    </div>
    <aside class="notifications-panel" data-notifications-panel>
      <div class="top-bar"><strong>Notifications</strong><button class="btn btn-ghost" type="button" data-notifications-toggle>Close</button></div>
      <div class="activity-list" data-notifications-list></div>
    </aside>
  `;
  bindPlatformNav(target);
}

function bindPlatformNav(target) {
  const toggle = target.querySelector('.menu-toggle');
  toggle?.addEventListener('click', () => {
    target.classList.toggle('sidebar-open');
  });

  target.querySelector('[data-logout]')?.addEventListener('click', () => {
    window.SecguardSupabase?.logout?.();
  });

  const panel = target.querySelector('[data-notifications-panel]');
  target.querySelectorAll('[data-notifications-toggle]').forEach(button => {
    button.addEventListener('click', () => panel?.classList.toggle('open'));
  });
}

window.addEventListener('DOMContentLoaded', renderPlatformNav);
