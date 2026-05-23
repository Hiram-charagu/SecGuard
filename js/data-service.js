const DataServiceConfig = {
  storageKey: 'secguard_platform_v2',
};

const seedPlatformData = {
  organization: {
    id: 'org_sec_2026',
    name: 'Secguard Retail Security',
    type: 'phone-retailer',
    subscription: 'enterprise',
    status: 'active',
    branches: 5,
    staff: 84,
  },
  branches: [
    { id: 'branch_alpha', name: 'Branch Alpha', location: 'North Hub', city: 'City A', staff: 18, devices: 1240, alerts: 14, status: 'active' },
    { id: 'branch_sigma', name: 'Branch Sigma', location: 'South Hub', city: 'City B', staff: 16, devices: 980, alerts: 9, status: 'active' },
    { id: 'branch_delta', name: 'Branch Delta', location: 'East Hub', city: 'City C', staff: 14, devices: 1100, alerts: 12, status: 'active' },
    { id: 'branch_omega', name: 'Branch Omega', location: 'West Hub', city: 'City D', staff: 20, devices: 1340, alerts: 8, status: 'active' },
    { id: 'branch_theta', name: 'Branch Theta', location: 'Central Hub', city: 'City E', staff: 16, devices: 2182, alerts: 5, status: 'active' },
  ],
  staff: [
    { id: 'staff_001', name: 'H. Patel', role: 'Security Analyst', branch: 'branch_alpha', email: 'h.patel@secguard.io', active: true },
    { id: 'staff_002', name: 'S. Kim', role: 'Security Manager', branch: 'branch_sigma', email: 's.kim@secguard.io', active: true },
    { id: 'staff_003', name: 'M. Ross', role: 'Fraud Investigator', branch: 'branch_delta', email: 'm.ross@secguard.io', active: true },
    { id: 'staff_004', name: 'R. Coleman', role: 'Security Analyst', branch: 'branch_omega', email: 'r.coleman@secguard.io', active: true },
    { id: 'staff_005', name: 'J. Martinez', role: 'Operations Lead', branch: 'branch_theta', email: 'j.martinez@secguard.io', active: true },
  ],
  devices: [
    {
      id: 'device_001',
      imei: '352009127765042',
      model: 'Orion X5',
      brand: 'TechVision',
      erp_status: 'unsold',
      activation_status: 'active',
      branch: 'branch_delta',
      sim_changes: 1,
      last_sim_change: 1,
      erp_sync_status: 'desynced',
      risk_score: 92,
      customer: '',
      warranty: '',
      timestamp: new Date(Date.now() - 11 * 60000).toISOString(),
    },
    {
      id: 'device_002',
      imei: '352009121299503',
      model: 'Nova Prime',
      brand: 'ElectroCore',
      erp_status: 'sold',
      activation_status: 'active',
      branch: 'branch_alpha',
      sim_changes: 2,
      last_sim_change: 28,
      erp_sync_status: 'synced',
      risk_score: 68,
      customer: 'Morgan Rivera',
      warranty: 'active',
      timestamp: new Date(Date.now() - 28 * 60000).toISOString(),
    },
    {
      id: 'device_003',
      imei: '352009126688725',
      model: 'Azure Steel',
      brand: 'BlueTech',
      erp_status: 'reserved',
      activation_status: 'pending',
      branch: 'branch_sigma',
      sim_changes: 0,
      last_sim_change: null,
      erp_sync_status: 'sync-in-progress',
      risk_score: 24,
      customer: '',
      warranty: '',
      timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
    },
    {
      id: 'device_004',
      imei: '352009104098341',
      model: 'Vector Prime',
      brand: 'DynamicSys',
      erp_status: 'sold',
      activation_status: 'active',
      branch: 'branch_omega',
      sim_changes: 0,
      last_sim_change: null,
      erp_sync_status: 'synced',
      risk_score: 18,
      customer: 'Kei Thompson',
      warranty: 'active',
      timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    },
    {
      id: 'device_005',
      imei: '352009106674921',
      model: 'Pulse Nova',
      brand: 'ElectroCore',
      erp_status: 'sold',
      activation_status: 'active',
      branch: 'branch_theta',
      sim_changes: 1,
      last_sim_change: 9,
      erp_sync_status: 'synced',
      risk_score: 42,
      customer: 'Alicia Nguyen',
      warranty: 'active',
      timestamp: new Date(Date.now() - 9 * 60000).toISOString(),
    },
  ],
  customers: [
    { id: 'cust_001', name: 'Alicia Nguyen', email: 'alicia.nguyen@email.com', phone: '+1-555-0121', devices: ['device_005'], protection_status: 'active', theft_reports: 0, recovery_progress: 100 },
    { id: 'cust_002', name: 'Morgan Rivera', email: 'morgan.rivera@email.com', phone: '+1-555-0142', devices: ['device_002'], protection_status: 'active', theft_reports: 0, recovery_progress: 100 },
    { id: 'cust_003', name: 'Kei Thompson', email: 'kei.thompson@email.com', phone: '+1-555-0198', devices: ['device_004'], protection_status: 'review', theft_reports: 1, recovery_progress: 28 },
  ],
  fraud_alerts: [
    { id: 'alert_001', type: 'unsold-active', severity: 'critical', device_id: 'device_001', description: 'Unexpected activation after unsold ERP status', branch: 'branch_delta', devices_affected: 4, status: 'open', created_at: new Date(Date.now() - 15 * 60000).toISOString() },
    { id: 'alert_002', type: 'sim-mismatch', severity: 'high', device_id: 'device_005', description: 'SIM mismatch from different region', branch: 'branch_theta', devices_affected: 19, status: 'open', created_at: new Date(Date.now() - 19 * 60000).toISOString() },
    { id: 'alert_003', type: 'blocked-network', severity: 'medium', device_id: 'device_003', description: 'Activation from blocked network', branch: 'branch_delta', devices_affected: 1, status: 'open', created_at: new Date(Date.now() - 60 * 60000).toISOString() },
  ],
  investigations: [
    { id: 'inv_001', case_number: 'FT-290', device_id: 'device_001', type: 'SIM anomaly', status: 'ready-for-closure', analyst: 'R. Coleman', updated_at: new Date(Date.now() - 11 * 60000).toISOString() },
    { id: 'inv_002', case_number: 'FT-289', device_id: 'device_005', type: 'High-risk SIM event', status: 'assigned', analyst: 'H. Patel', updated_at: new Date(Date.now() - 37 * 60000).toISOString() },
    { id: 'inv_003', case_number: 'FT-288', device_id: 'device_002', type: 'ERP integration mismatch', status: 'pending-review', analyst: 'S. Kim', updated_at: new Date(Date.now() - 58 * 60000).toISOString() },
  ],
  audit_logs: [
    { time: new Date(Date.now() - 11 * 60000).toISOString(), actor: 'H. Patel', action: 'Reviewed fraud case', target: 'IMEI 3520 0912 0951 002', result: 'Completed' },
    { time: new Date(Date.now() - 33 * 60000).toISOString(), actor: 'S. Kim', action: 'Updated ERP sync rule', target: 'Inventory policy', result: 'Pending' },
    { time: new Date(Date.now() - 54 * 60000).toISOString(), actor: 'System', action: 'Generated anomaly alert', target: 'Branch Delta', result: 'Triggered' },
    { time: new Date(Date.now() - 98 * 60000).toISOString(), actor: 'M. Ross', action: 'Confirmed recovery ticket', target: 'IMEI 3520 0912 4923 118', result: 'Resolved' },
  ],
  settings: {
    workspace: 'Secguard Enterprise',
    timezone: 'GMT+3',
    notify: 'Email only',
    mfa: 'Enabled',
    risk: 'Medium',
    erpLink: 'Auto',
    adminNotes: 'Review ERP sync discrepancies weekly and validate unauthorized activity tickets within 24 hours.',
  },
};

function clonePlatformData(data) {
  return JSON.parse(JSON.stringify(data));
}

class DataManager {
  constructor(config = {}) {
    this.config = { ...DataServiceConfig, ...config };
    this.data = clonePlatformData(seedPlatformData);
  }

  async load() {
    const saved = localStorage.getItem(this.config.storageKey);
    this.data = saved ? JSON.parse(saved) : clonePlatformData(seedPlatformData);
    this.normalizeDates();
    this.save();
    return this.data;
  }

  save() {
    localStorage.setItem(this.config.storageKey, JSON.stringify(this.serialize()));
  }

  serialize() {
    return {
      ...this.data,
      devices: this.data.devices.map(device => ({ ...device, timestamp: this.toIso(device.timestamp) })),
      fraud_alerts: this.data.fraud_alerts.map(alert => ({ ...alert, created_at: this.toIso(alert.created_at) })),
      investigations: this.data.investigations.map(item => ({ ...item, updated_at: this.toIso(item.updated_at) })),
      audit_logs: this.data.audit_logs.map(log => ({ ...log, time: this.toIso(log.time) })),
    };
  }

  normalizeDates() {
    this.data.devices = this.data.devices.map(device => ({ ...device, timestamp: new Date(device.timestamp) }));
    this.data.fraud_alerts = this.data.fraud_alerts.map(alert => ({ ...alert, created_at: new Date(alert.created_at) }));
    this.data.investigations = this.data.investigations.map(item => ({ ...item, updated_at: new Date(item.updated_at) }));
    this.data.audit_logs = this.data.audit_logs.map(log => ({ ...log, time: new Date(log.time) }));
  }

  toIso(value) {
    return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
  }

  addAudit(action, target, result = 'Recorded', actor = 'Current admin') {
    this.data.audit_logs.unshift({
      time: new Date(),
      actor,
      action,
      target,
      result,
    });
    this.save();
  }

  getDevices(filter = {}) {
    let devices = [...this.data.devices];
    if (filter.branch) devices = devices.filter(device => device.branch === filter.branch);
    if (filter.risk_min) devices = devices.filter(device => device.risk_score >= filter.risk_min);
    return devices;
  }

  getDevice(id) {
    return this.data.devices.find(device => device.id === id);
  }

  getFraudAlerts(filter = {}) {
    let alerts = [...this.data.fraud_alerts];
    if (filter.severity) alerts = alerts.filter(alert => alert.severity === filter.severity);
    if (filter.status) alerts = alerts.filter(alert => alert.status === filter.status);
    return alerts;
  }

  getBranches() {
    return [...this.data.branches];
  }

  getBranch(id) {
    return this.data.branches.find(branch => branch.id === id);
  }

  getDashboardMetrics() {
    const devices = this.data.devices;
    const openAlerts = this.getFraudAlerts({ status: 'open' });
    const syncedDevices = devices.filter(device => device.erp_sync_status === 'synced').length;
    return {
      activeDevices: devices.filter(device => device.activation_status === 'active').length,
      fraudAlerts: openAlerts.length,
      protectedDevices: this.data.customers.filter(customer => customer.protection_status === 'active').length,
      erpSyncHealth: devices.length ? Math.round((syncedDevices / devices.length) * 1000) / 10 : 100,
      suspiciousDevices: devices.filter(device => device.risk_score > 50).length,
      erpSyncWarnings: devices.filter(device => device.erp_sync_status !== 'synced').length,
      highRiskDevices: devices.filter(device => device.risk_score > 80).length,
      openInvestigations: this.data.investigations.filter(item => item.status !== 'ready-for-closure').length,
    };
  }

  getCustomers() {
    return [...this.data.customers];
  }

  getStaff() {
    return [...this.data.staff];
  }

  async updateDevice(deviceId, updates) {
    const index = this.data.devices.findIndex(device => device.id === deviceId);
    if (index < 0) return { success: false, error: 'Device not found' };
    this.data.devices[index] = { ...this.data.devices[index], ...updates, timestamp: updates.timestamp || new Date() };
    this.addAudit('Updated device telemetry', this.data.devices[index].imei);
    this.evaluateDeviceRules(this.data.devices[index]);
    this.save();
    return { success: true, device: this.data.devices[index] };
  }

  async addDevice(deviceData) {
    const branch = deviceData.branch || deviceData.assigned_branch || 'branch_alpha';
    const newDevice = {
      id: `device_${Date.now()}`,
      brand: deviceData.brand || 'Field intake',
      erp_status: (deviceData.erp_status || 'unsold').toLowerCase(),
      activation_status: (deviceData.activation_status || 'pending').toLowerCase(),
      branch,
      sim_changes: Number(deviceData.sim_changes || 0),
      last_sim_change: Number(deviceData.last_sim_change || 0),
      erp_sync_status: (deviceData.erp_sync_status || 'synced').toLowerCase(),
      risk_score: Number(deviceData.risk_score || 24),
      customer: deviceData.customer || '',
      warranty: deviceData.warranty || '',
      timestamp: new Date(),
      ...deviceData,
    };
    this.data.devices.unshift(newDevice);
    this.addAudit('Registered tracked device', newDevice.imei);
    this.evaluateDeviceRules(newDevice);
    this.save();
    return { success: true, device: newDevice };
  }

  evaluateDeviceRules(device) {
    const isUnsoldActive = device.activation_status === 'active' && device.erp_status === 'unsold';
    const hasExistingAlert = this.data.fraud_alerts.some(alert => alert.device_id === device.id && alert.status === 'open');
    if (!isUnsoldActive || hasExistingAlert) return;
    this.data.fraud_alerts.unshift({
      id: `alert_${Date.now()}`,
      type: 'unsold-active',
      severity: 'critical',
      device_id: device.id,
      description: 'Device active while ERP status remains unsold',
      branch: device.branch || 'branch_alpha',
      devices_affected: 1,
      status: 'open',
      created_at: new Date(),
    });
    this.data.investigations.unshift({
      id: `inv_${Date.now()}`,
      case_number: `FT-${Math.floor(300 + Math.random() * 700)}`,
      device_id: device.id,
      type: 'Unsold active device',
      status: 'assigned',
      analyst: 'Security queue',
      updated_at: new Date(),
    });
  }

  resolveOpenAlerts() {
    let resolved = 0;
    this.data.fraud_alerts = this.data.fraud_alerts.map(alert => {
      if (alert.status !== 'open') return alert;
      resolved += 1;
      return { ...alert, status: 'reviewed' };
    });
    this.addAudit('Resolved open fraud alerts', `${resolved} alert(s)`, 'Completed');
    this.save();
    return resolved;
  }

  createCustomerCase() {
    const caseId = `device_${Date.now()}`;
    const customerName = `Walk-in Customer ${this.data.customers.length + 1}`;
    const device = {
      id: caseId,
      imei: `352009${Math.floor(100000000 + Math.random() * 899999999)}`,
      model: 'Customer reported handset',
      brand: 'Unknown',
      erp_status: 'sold',
      activation_status: 'active',
      branch: 'branch_alpha',
      sim_changes: 0,
      last_sim_change: 0,
      erp_sync_status: 'synced',
      risk_score: 55,
      customer: customerName,
      warranty: 'review',
      timestamp: new Date(),
    };
    const customer = {
      id: `cust_${Date.now()}`,
      name: customerName,
      email: 'customer@example.com',
      phone: '+000-000-0000',
      devices: [caseId],
      protection_status: 'review',
      theft_reports: 1,
      recovery_progress: 15,
    };
    this.data.devices.unshift(device);
    this.data.customers.unshift(customer);
    this.data.investigations.unshift({
      id: `inv_${Date.now()}`,
      case_number: `RC-${Math.floor(1000 + Math.random() * 9000)}`,
      device_id: caseId,
      type: 'Customer theft report',
      status: 'assigned',
      analyst: 'Recovery queue',
      updated_at: new Date(),
    });
    this.addAudit('Created customer protection case', customerName);
    this.save();
    return { customer, device };
  }

  exportSnapshot() {
    this.addAudit('Exported security report', 'Dashboard snapshot', 'Completed');
    return JSON.stringify(this.serialize(), null, 2);
  }

  getSettings() {
    return { ...(this.data.settings || seedPlatformData.settings) };
  }

  saveSettings(settings) {
    this.data.settings = { ...this.getSettings(), ...settings };
    this.addAudit('Saved platform configuration', 'Settings');
    this.save();
    return this.getSettings();
  }

  formatDate(date) {
    const safeDate = date instanceof Date ? date : new Date(date);
    const diff = Math.floor((Date.now() - safeDate.getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return safeDate.toLocaleDateString();
  }

  formatIMEI(imei) {
    return imei ? String(imei).replace(/\s/g, '').match(/.{1,4}/g).join(' ') : 'N/A';
  }

  getRiskLevel(score) {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }
}

window.dataManager = new DataManager();
