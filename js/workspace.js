const SecguardStore = (() => {
  const key = 'secguard_workspace_v1';
  const seed = {
    companies: [
      { id: 'co_001', name: 'Secguard Retail Security', plan: 'Enterprise', status: 'Active', branches: 5 },
    ],
    branches: [
      { id: 'br_001', name: 'Nairobi CBD', manager: 'H. Patel', devices: 1240, alerts: 14, status: 'Active' },
      { id: 'br_002', name: 'Westlands', manager: 'S. Kim', devices: 980, alerts: 9, status: 'Active' },
    ],
    staff: [
      { id: 'st_001', name: 'M. Ross', role: 'Security Officer', branch: 'Nairobi CBD', status: 'Active' },
      { id: 'st_002', name: 'R. Coleman', role: 'Investigator', branch: 'Westlands', status: 'Active' },
    ],
    erpSync: [
      { id: 'erp_001', module: 'Inventory', mode: 'Webhook', status: 'Connected', lastSync: '2m ago' },
      { id: 'erp_002', module: 'Sales', mode: 'Scheduled', status: 'Healthy', lastSync: '8m ago' },
    ],
    theftReports: [
      { id: 'th_001', customer: 'Alicia Nguyen', imei: '352009127765042', status: 'Open', priority: 'High' },
    ],
    recoveryCases: [
      { id: 'rc_001', caseNo: 'RC-1042', device: 'Samsung Galaxy S25 Ultra', officer: 'M. Ross', progress: 62, status: 'Monitoring' },
    ],
    policies: [
      { id: 'po_001', name: 'Admin MFA', value: 'Required', status: 'Enabled' },
      { id: 'po_002', name: 'High-risk SIM change', value: 'Auto-escalate', status: 'Enabled' },
    ],
    auditLogs: [
      { id: 'au_001', actor: 'System', action: 'Workspace initialized', target: 'Secguard', time: new Date().toISOString() },
    ],
  };

  function load() {
    const saved = localStorage.getItem(key);
    if (!saved) {
      localStorage.setItem(key, JSON.stringify(seed));
      return structuredClone(seed);
    }
    return JSON.parse(saved);
  }

  function save(data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function addAudit(data, action, target) {
    data.auditLogs.unshift({
      id: `au_${Date.now()}`,
      actor: 'Current admin',
      action,
      target,
      time: new Date().toISOString(),
    });
  }

  function add(collection, record, label) {
    const data = load();
    data[collection].unshift({ id: `${collection}_${Date.now()}`, ...record });
    addAudit(data, `Created ${label}`, record.name || record.caseNo || record.imei || record.module || 'record');
    save(data);
    return data;
  }

  function update(collection, id, updates, label) {
    const data = load();
    data[collection] = data[collection].map(item => item.id === id ? { ...item, ...updates } : item);
    addAudit(data, `Updated ${label}`, id);
    save(data);
    return data;
  }

  return { load, save, add, update };
})();

const WorkspacePages = {
  organizations: {
    collection: 'companies',
    remoteTable: 'companies',
    label: 'organization',
    columns: ['name', 'plan', 'status', 'branches'],
    form: [
      ['name', 'Organization name', 'text'],
      ['plan', 'Plan', 'text'],
      ['status', 'Status', 'text'],
      ['branches', 'Branches', 'number'],
    ],
  },
  branches: {
    collection: 'branches',
    remoteTable: 'branches',
    label: 'branch',
    columns: ['name', 'manager', 'devices', 'alerts', 'status'],
    form: [
      ['name', 'Branch name', 'text'],
      ['manager', 'Manager', 'text'],
      ['devices', 'Devices', 'number'],
      ['alerts', 'Alerts', 'number'],
      ['status', 'Status', 'text'],
    ],
  },
  staff: {
    collection: 'staff',
    remoteTable: 'staff_profiles',
    label: 'staff member',
    columns: ['name', 'role', 'branch', 'status'],
    form: [
      ['name', 'Staff name', 'text'],
      ['role', 'Role', 'text'],
      ['branch', 'Branch', 'text'],
      ['status', 'Status', 'text'],
    ],
  },
  'erp-connector': {
    collection: 'erpSync',
    remoteTable: 'erp_sync_modules',
    label: 'ERP sync',
    columns: ['module', 'mode', 'status', 'lastSync'],
    form: [
      ['module', 'ERP module', 'text'],
      ['mode', 'Sync mode', 'text'],
      ['status', 'Status', 'text'],
      ['lastSync', 'Last sync', 'text'],
    ],
  },
  'theft-reports': {
    collection: 'theftReports',
    remoteTable: 'theft_reports',
    label: 'theft report',
    columns: ['customer', 'imei', 'status', 'priority'],
    form: [
      ['customer', 'Customer', 'text'],
      ['imei', 'IMEI', 'text'],
      ['status', 'Status', 'text'],
      ['priority', 'Priority', 'text'],
    ],
  },
  'recovery-cases': {
    collection: 'recoveryCases',
    remoteTable: 'recovery_cases',
    label: 'recovery case',
    columns: ['caseNo', 'device', 'officer', 'progress', 'status'],
    form: [
      ['caseNo', 'Case number', 'text'],
      ['device', 'Device', 'text'],
      ['officer', 'Officer', 'text'],
      ['progress', 'Progress %', 'number'],
      ['status', 'Status', 'text'],
    ],
  },
  'security-policies': {
    collection: 'policies',
    remoteTable: 'security_policies',
    label: 'security policy',
    columns: ['name', 'value', 'status'],
    form: [
      ['name', 'Policy name', 'text'],
      ['value', 'Rule value', 'text'],
      ['status', 'Status', 'text'],
    ],
  },
};

const activeRealtimeSubscriptions = new Set();

function canUseSupabase() {
  return Boolean(window.SecguardSupabase?.enabled() && window.secguardSupabase);
}

async function fetchWorkspaceRows(config) {
  if (!canUseSupabase()) return null;
  const { data, error } = await window.secguardSupabase
    .from(config.remoteTable)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.warn(`Supabase read failed for ${config.remoteTable}. Falling back to local workspace.`, error);
    return null;
  }
  return data;
}

async function insertWorkspaceRow(config, payload) {
  if (!canUseSupabase()) return false;
  const { error } = await window.secguardSupabase.from(config.remoteTable).insert([payload]);
  if (error) {
    console.warn(`Supabase insert failed for ${config.remoteTable}. Saving locally.`, error);
    return false;
  }
  return true;
}

async function updateWorkspaceRow(config, id, updates) {
  if (!canUseSupabase()) return false;
  const { error } = await window.secguardSupabase.from(config.remoteTable).update(updates).eq('id', id);
  if (error) {
    console.warn(`Supabase update failed for ${config.remoteTable}. Updating locally.`, error);
    return false;
  }
  return true;
}

async function renderWorkspacePage() {
  const page = document.body.dataset.workspacePage;
  if (!page || !WorkspacePages[page]) return;

  const config = WorkspacePages[page];
  const data = SecguardStore.load();
  const remoteRows = await fetchWorkspaceRows(config);
  const rows = remoteRows || data[config.collection] || [];
  const form = document.querySelector('[data-workspace-form]');
  const table = document.querySelector('[data-workspace-table]');
  const kpis = document.querySelector('[data-workspace-kpis]');

  if (kpis) {
    kpis.innerHTML = `
      <article class="card kpi-card"><small>Total records</small><div class="value">${rows.length}</div><p>Active ${config.label} records in local workspace.</p></article>
      <article class="card kpi-card"><small>Audit events</small><div class="value">${data.auditLogs.length}</div><p>Actions captured by Secguard audit layer.</p></article>
      <article class="card kpi-card"><small>Supabase mode</small><div class="value">${remoteRows ? 'Live' : 'Local'}</div><p>${remoteRows ? 'Reading from Supabase tables.' : 'Using local fallback until schema/RLS is ready.'}</p></article>
      <article class="card kpi-card"><small>Workspace</small><div class="value">Live</div><p>Changes update immediately in this browser.</p></article>
    `;
  }

  if (form) {
    form.innerHTML = config.form.map(([name, label, type]) => `
      <div class="input-group">
        <label for="${name}">${label}</label>
        <input id="${name}" name="${name}" type="${type}" required>
      </div>
    `).join('') + `<button class="btn" type="submit">Create ${config.label}</button>`;

    form.onsubmit = async event => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(form).entries());
      const savedRemote = await insertWorkspaceRow(config, payload);
      if (!savedRemote) SecguardStore.add(config.collection, payload, config.label);
      form.reset();
      renderWorkspacePage();
    };
  }

  if (table) {
    table.innerHTML = `
      <thead><tr>${config.columns.map(col => `<th>${col}</th>`).join('')}<th>Action</th></tr></thead>
      <tbody>${rows.map(row => `
        <tr>
          ${config.columns.map(col => `<td>${row[col] ?? ''}</td>`).join('')}
          <td><button class="btn btn-ghost" data-mark-done="${row.id}">Mark reviewed</button></td>
        </tr>
      `).join('')}</tbody>
    `;

    table.querySelectorAll('[data-mark-done]').forEach(button => {
      button.addEventListener('click', async () => {
        const updatedRemote = await updateWorkspaceRow(config, button.dataset.markDone, { status: 'Reviewed' });
        if (!updatedRemote) SecguardStore.update(config.collection, button.dataset.markDone, { status: 'Reviewed' }, config.label);
        renderWorkspacePage();
      });
    });
  }

  if (canUseSupabase() && config.remoteTable && !activeRealtimeSubscriptions.has(config.remoteTable)) {
    activeRealtimeSubscriptions.add(config.remoteTable);
    window.SecguardSupabase.subscribe(config.remoteTable, () => renderWorkspacePage());
  }
}

window.addEventListener('DOMContentLoaded', renderWorkspacePage);
