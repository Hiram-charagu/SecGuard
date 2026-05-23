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

function renderPlatformNav() {
  const target = document.querySelector('[data-platform-nav]');
  if (!target) return;
  const current = location.pathname.split('/').pop();
  target.innerHTML = `
    <div class="brand">
      <div class="brand-crest"><span style="color:#5b87ff;font-weight:800;">S</span></div>
      <div class="brand-title">
        <h1>Secguard</h1>
        <p>Security workspace</p>
      </div>
    </div>
    <nav class="nav-group">
      ${platformLinks.map(([href, label]) => `<a href="${href}" class="${href === current ? 'active' : ''}"><span></span><span>${label}</span></a>`).join('')}
    </nav>
    <div class="sidebar-footer">
      <div class="status-chip">Local workspace active</div>
      <div class="status-pill">Supabase-ready structure</div>
    </div>
  `;
}

window.addEventListener('DOMContentLoaded', renderPlatformNav);
