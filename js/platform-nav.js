const platformLinks = [
  ['dashboard.html', 'Dashboard'],
  ['organizations.html', 'Organizations'],
  ['branches.html', 'Branches'],
  ['staff.html', 'Staff & Roles'],
  ['device-intelligence.html', 'Device Intelligence'],
  ['erp-connector.html', 'ERP Connector'],
  ['fraud.html', 'Fraud Detection'],
  ['theft-reports.html', 'Theft Reports'],
  ['recovery-cases.html', 'Recovery Cases'],
  ['tracking.html', 'Live Tracking'],
  ['customer.html', 'Customers'],
  ['analytics.html', 'Analytics'],
  ['audit-logs.html', 'Audit Logs'],
  ['security-policies.html', 'Security Policies'],
  ['settings.html', 'Settings'],
];

const platformRoleRoutes = {
  super_admin: 'organizations.html',
  company_admin: 'dashboard.html',
  security_officer: 'fraud.html',
  investigator: 'recovery-cases.html',
  sales_staff: 'device-intelligence.html',
  customer: 'customer.html',
};

const platformRoleAccess = {
  super_admin: platformLinks.map(([href]) => href),
  company_admin: platformLinks.map(([href]) => href).filter(href => href !== 'organizations.html'),
  security_officer: ['fraud.html', 'theft-reports.html', 'recovery-cases.html', 'tracking.html', 'customer.html', 'audit-logs.html'],
  investigator: ['recovery-cases.html', 'theft-reports.html', 'tracking.html', 'customer.html', 'audit-logs.html'],
  sales_staff: ['device-intelligence.html', 'customer.html', 'tracking.html'],
  customer: ['customer.html', 'tracking.html'],
};

function getPlatformRole() {
  return localStorage.getItem('secguard_active_role') || 'company_admin';
}

function enforcePlatformRoleAccess() {
  const role = getPlatformRole();
  const allowed = platformRoleAccess[role] || platformRoleAccess.company_admin;
  const current = location.pathname.split('/').pop();
  if (!allowed.includes(current)) {
    location.href = platformRoleRoutes[role] || 'dashboard.html';
    return false;
  }
  return true;
}

function renderPlatformNav() {
  const target = document.querySelector('[data-platform-nav]');
  if (!target) return;
  if (!enforcePlatformRoleAccess()) return;
  const current = location.pathname.split('/').pop();
  const role = getPlatformRole();
  const allowed = platformRoleAccess[role] || platformRoleAccess.company_admin;
  const visibleLinks = platformLinks.filter(([href]) => allowed.includes(href));
  target.innerHTML = `
    <div class="brand">
      <img class="brand-logo" src="assets/secguard-logo.svg" alt="Secguard" />
    </div>
    <nav class="nav-group">
      ${visibleLinks.map(([href, label]) => `<a href="${href}" class="${href === current ? 'active' : ''}"><span></span><span>${role === 'customer' && href === 'customer.html' ? 'My Protection' : label}</span></a>`).join('')}
    </nav>
    <div class="sidebar-footer">
      <div class="status-chip">${role.replace('_', ' ')} portal</div>
      <div class="status-pill">Role access active</div>
    </div>
  `;
}

window.addEventListener('DOMContentLoaded', renderPlatformNav);
