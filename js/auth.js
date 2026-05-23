const SecguardAuth = (() => {
  const publicPages = ['index.html', 'about.html', 'features.html', 'pricing.html', 'security.html', 'contact.html', 'demo-request.html', 'portals.html', 'login.html'];
  const state = {
    role: null,
    user: null,
    session: null,
    ready: false,
    demo: false,
  };

  const links = [
    ['dashboard.html', 'Dashboard'],
    ['organizations.html', 'Organizations'],
    ['branches.html', 'Branches'],
    ['staff.html', 'Staff & Roles'],
    ['device-intelligence.html', 'Device Intelligence'],
    ['device-detail.html', 'Device Detail'],
    ['erp-connector.html', 'ERP Connector'],
    ['fraud.html', 'Fraud Detection'],
    ['theft-reports.html', 'Theft Reports'],
    ['recovery-cases.html', 'Recovery Cases'],
    ['tracking.html', 'Live Tracking'],
    ['customer.html', 'Customers'],
    ['analytics.html', 'Analytics'],
    ['audit-logs.html', 'Audit Logs'],
    ['reports.html', 'Reports'],
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
    security_officer: ['fraud.html', 'theft-reports.html', 'recovery-cases.html', 'tracking.html', 'customer.html', 'audit-logs.html', 'device-detail.html', 'reports.html'],
    investigator: ['recovery-cases.html', 'theft-reports.html', 'tracking.html', 'customer.html', 'audit-logs.html', 'device-detail.html', 'reports.html'],
    sales_staff: ['device-intelligence.html', 'device-detail.html', 'customer.html', 'tracking.html'],
    customer: ['customer.html', 'tracking.html', 'device-detail.html'],
  };

  function safeStorageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Could not read ${key} from local storage.`, error);
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`Could not save ${key} to local storage.`, error);
    }
  }

  function safeStorageRemove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Could not remove ${key} from local storage.`, error);
    }
  }

  function normalizeRole(role) {
    return routes[role] ? role : 'company_admin';
  }

  function roleFromUser(user) {
    return normalizeRole(user?.app_metadata?.role || user?.user_metadata?.role || user?.user_metadata?.portal_role || user?.user_metadata?.secguard_role);
  }

  function getRole() {
    if (state.role) return state.role;
    return normalizeRole(safeStorageGet('secguard_active_role') || 'company_admin');
  }

  function setRole(role, options = {}) {
    const nextRole = normalizeRole(role);
    state.role = nextRole;
    if (!options.memoryOnly) safeStorageSet('secguard_active_role', nextRole);
    return nextRole;
  }

  async function initSession() {
    if (state.ready) return state;
    const supabase = window.SecguardSupabase;
    if (supabase?.getSession) {
      const { data } = await supabase.getSession();
      state.session = data?.session || null;
      state.user = state.session?.user || null;
      if (state.user) {
        setRole(roleFromUser(state.user), { memoryOnly: false });
        state.ready = true;
        return state;
      }
    }

    state.demo = safeStorageGet('secguard_demo_session') === 'true';
    if (state.demo) setRole(safeStorageGet('secguard_active_role') || 'company_admin');
    state.ready = true;
    return state;
  }

  function isPublicPage(page = currentFile()) {
    return publicPages.includes(page);
  }

  function isAuthenticated() {
    return Boolean(state.session || state.demo || safeStorageGet('secguard_demo_session') === 'true');
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
    if (isPublicPage(page)) return true;
    return allowedPages(role).includes(page);
  }

  function enforce() {
    if (isPublicPage(currentFile())) return true;
    if (!isAuthenticated()) {
      location.href = `login.html?next=${encodeURIComponent(currentFile())}`;
      return false;
    }
    const role = getRole();
    if (!canAccess(currentFile(), role)) {
      location.href = routeForRole(role);
      return false;
    }
    return true;
  }

  function visibleLinks(role = getRole()) {
    const allowed = allowedPages(role);
    return links.filter(([href]) => allowed.includes(href) && href !== 'device-detail.html');
  }

  function labelFor(href, label, role = getRole()) {
    if (role === 'customer' && href === 'customer.html') return 'My Protection';
    return label;
  }

  function clearSessionState() {
    state.role = null;
    state.user = null;
    state.session = null;
    state.ready = false;
    state.demo = false;
    safeStorageRemove('secguard_active_role');
    safeStorageRemove('secguard_demo_session');
  }

  return {
    links,
    routes,
    access,
    initSession,
    isAuthenticated,
    getRole,
    setRole,
    routeForRole,
    allowedPages,
    canAccess,
    enforce,
    visibleLinks,
    labelFor,
    clearSessionState,
    roleFromUser,
  };
})();
