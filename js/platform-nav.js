function renderPlatformNav() {
  const target = document.querySelector('[data-platform-nav]');
  if (!target) return;
  if (!window.SecguardAuth?.enforce()) return;
  const current = location.pathname.split('/').pop() || 'dashboard.html';
  const role = SecguardAuth.getRole();
  const visibleLinks = SecguardAuth.visibleLinks(role);
  target.innerHTML = `
    <div class="brand">
      <img class="brand-logo" src="assets/secguard-logo.svg" alt="Secguard" />
    </div>
    <button class="menu-toggle" type="button" aria-label="Toggle workspace navigation">Menu</button>
    <nav class="nav-group">
      ${visibleLinks.map(([href, label]) => `<a href="${href}" class="${href === current ? 'active' : ''}"><span></span><span>${SecguardAuth.labelFor(href, label, role)}</span></a>`).join('')}
    </nav>
    <div class="sidebar-footer">
      <div class="status-chip">${role.replace('_', ' ')} portal</div>
      <div class="status-pill">Role access active</div>
    </div>
  `;
}

window.addEventListener('DOMContentLoaded', renderPlatformNav);
