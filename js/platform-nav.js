async function renderPlatformNav() {
  const target = document.querySelector('[data-platform-nav]');
  if (!target) return;
  await window.SecguardAuth?.initSession?.();
  if (!window.SecguardAuth?.enforce()) return;
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
      ${visibleLinks.map(([href, label]) => `<a href="${href}" class="${href === current ? 'active' : ''}"><span></span><span>${SecguardAuth.labelFor(href, label, role)}</span></a>`).join('')}
    </nav>
    <div class="sidebar-footer">
      <div class="status-chip">${role.replace('_', ' ')} portal</div>
      <div class="status-pill">Role access active</div>
      <button class="btn btn-ghost" type="button" data-logout>Logout</button>
    </div>
    <aside class="notifications-panel" data-notifications-panel>
      <div class="top-bar"><strong>Notifications</strong><button class="btn btn-ghost" type="button" data-notifications-toggle>Close</button></div>
      <div class="activity-list" data-notifications-list></div>
    </aside>
  `;
}

window.addEventListener('DOMContentLoaded', renderPlatformNav);
