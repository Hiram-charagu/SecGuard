const SecguardAuth = (() => {
  const links = [
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

  const routes = {
    super_admin: 'organizations.html',
    company_admin: 'dashboard.html',
    security_officer: 'fraud.html',
    investigator: 'recovery-cases.html',
    sales_staff: 'device-intelligence.html',
    customer: 'customer.html',
  };

  const access = {
    super_admin: links.map(([href]) => href),
    company_admin: links.map(([href]) => href).filter(href => href !== 'organizations.html'),
    security_officer: ['fraud.html', 'theft-reports.html', 'recovery-cases.html', 'tracking.html', 'customer.html', 'audit-logs.html'],
    investigator: ['recovery-cases.html', 'theft-reports.html', 'tracking.html', 'customer.html', 'audit-logs.html'],
    sales_staff: ['device-intelligence.html', 'customer.html', 'tracking.html'],
    customer: ['customer.html', 'tracking.html'],
  };

  function getRole() {
    try {
      return localStorage.getItem('secguard_active_role') || 'company_admin';
    } catch (error) {
      console.warn('Could not read Secguard role from local storage.', error);
      return 'company_admin';
    }
  }

  function setRole(role) {
    const nextRole = routes[role] ? role : 'company_admin';
    try {
      localStorage.setItem('secguard_active_role', nextRole);
    } catch (error) {
      console.warn('Could not save Secguard role to local storage.', error);
    }
    return nextRole;
  }

  function routeForRole(role = getRole()) {
    return routes[role] || routes.company_admin;
  }

  function currentFile() {
    return location.pathname.split('/').pop() || 'dashboard.html';
  }

  function allowedPages(role = getRole()) {
    return access[role] || access.company_admin;
  }

  function canAccess(page = currentFile(), role = getRole()) {
    return allowedPages(role).includes(page);
  }

  function enforce() {
    const role = getRole();
    if (!canAccess(currentFile(), role)) {
      location.href = routeForRole(role);
      return false;
    }
    return true;
  }

  function visibleLinks(role = getRole()) {
    const allowed = allowedPages(role);
    return links.filter(([href]) => allowed.includes(href));
  }

  function labelFor(href, label, role = getRole()) {
    if (role === 'customer' && href === 'customer.html') return 'My Protection';
    return label;
  }

  return { links, routes, access, getRole, setRole, routeForRole, allowedPages, canAccess, enforce, visibleLinks, labelFor };
})();
