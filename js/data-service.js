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
  tracking_logs: [
    { id: 'track_001', device_id: 'device_001', latitude: -1.286389, longitude: 36.817223, network_type: '4G', carrier: 'Safaricom', battery: 72, sim_serial_hash: 'sim_9a21', event_time: new Date(Date.now() - 11 * 60000).toISOString() },
    { id: 'track_002', device_id: 'device_002', latitude: -1.265, longitude: 36.804, network_type: '5G', carrier: 'Airtel', battery: 61, sim_serial_hash: 'sim_21fa', event_time: new Date(Date.now() - 28 * 60000).toISOString() },
    { id: 'track_003', device_id: 'device_005', latitude: -1.25, longitude: 36.89, network_type: '4G', carrier: 'Safaricom', battery: 44, sim_serial_hash: 'sim_77bd', event_time: new Date(Date.now() - 9 * 60000).toISOString() },
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
    this.storageAvailable = true;
    this.lastError = null;
    this.remoteReady = false;
    this.usingRemote = false;
  }

  async load() {
    if (this.hasRemote()) {
      const loaded = await this.loadRemote();
      if (loaded) return this.data;
    }

    try {
      const saved = localStorage.getItem(this.config.storageKey);
      this.data = saved ? JSON.parse(saved) : clonePlatformData(seedPlatformData);
      this.normalizeDates();
      this.save();
    } catch (error) {
      this.storageAvailable = false;
      this.lastError = error;
      this.data = clonePlatformData(seedPlatformData);
      this.normalizeDates();
      console.warn('Secguard storage is unavailable. Running in memory-only mode.', error);
    }
    return this.data;
  }

  hasRemote() {
    return Boolean(window.SecguardSupabase?.enabled?.() && window.SecguardSupabase?.client);
  }

  async query(table, select = '*') {
    const { data, error } = await window.SecguardSupabase.client.from(table).select(select);
    if (error) throw error;
    return data || [];
  }

  async loadRemote() {
    try {
      const [companies, branches, staff, devices, customers, alerts, trackingLogs, auditLogs, settingsRows] = await Promise.all([
        this.query('companies'),
        this.query('branches'),
        this.query('staff_profiles'),
        this.query('devices'),
        this.query('customers'),
        this.query('fraud_alerts'),
        this.query('tracking_logs'),
        this.query('audit_logs'),
        this.query('company_settings').catch(() => []),
      ]);

      this.data = {
        ...clonePlatformData(seedPlatformData),
        organization: this.mapOrganization(companies[0]),
        branches: branches.map(row => this.mapBranch(row)),
        staff: staff.map(row => this.mapStaff(row)),
        devices: devices.map(row => this.mapDevice(row)),
        customers: customers.map(row => this.mapCustomer(row, devices)),
        fraud_alerts: alerts.map(row => this.mapFraudAlert(row)),
        tracking_logs: trackingLogs.map(row => this.mapTrackingLog(row)),
        audit_logs: auditLogs.map(row => this.mapAuditLog(row)),
        settings: settingsRows[0]?.settings || seedPlatformData.settings,
      };
      if (!this.data.branches.length) this.data.branches = clonePlatformData(seedPlatformData.branches);
      if (!this.data.staff.length) this.data.staff = clonePlatformData(seedPlatformData.staff);
      this.normalizeDates();
      this.remoteReady = true;
      this.usingRemote = true;
      this.subscribeRemote();
      return true;
    } catch (error) {
      this.remoteReady = false;
      this.usingRemote = false;
      this.lastError = error;
      console.warn('Supabase data load failed. Falling back to local demo data.', error);
      return false;
    }
  }

  subscribeRemote() {
    if (this.remoteSubscribed || !window.SecguardSupabase?.subscribe) return;
    this.remoteSubscribed = true;
    ['devices', 'fraud_alerts', 'tracking_logs', 'audit_logs', 'customers'].forEach(table => {
      window.SecguardSupabase.subscribe(table, async () => {
        await this.loadRemote();
        window.dispatchEvent(new CustomEvent('secguard:data-updated'));
      });
    });
  }

  mapOrganization(row = {}) {
    return {
      id: row.id || 'org_sec_2026',
      name: row.name || 'Secguard Retail Security',
      type: row.type || 'phone-retailer',
      subscription: row.plan || row.subscription || 'enterprise',
      status: row.status || 'active',
      branches: Number(row.branches || 0),
      staff: Number(row.staff || 0),
    };
  }

  mapBranch(row = {}) {
    return {
      id: row.id,
      name: row.name,
      location: row.location || row.city || row.manager || 'Branch network',
      city: row.city || '',
      staff: Number(row.staff || 0),
      devices: Number(row.devices || 0),
      alerts: Number(row.alerts || 0),
      status: row.status || 'active',
    };
  }

  mapStaff(row = {}) {
    return {
      id: row.id,
      name: row.name,
      role: row.role,
      branch: row.branch_id || row.branch || '',
      email: row.email || '',
      active: row.status !== 'inactive',
    };
  }

  mapDevice(row = {}) {
    return {
      id: row.id,
      imei: row.imei1 || row.imei || row.imei2 || '',
      imei2: row.imei2 || '',
      serial_number: row.serial_number || '',
      model: row.model || 'Unknown handset',
      brand: row.brand || 'Unknown',
      erp_status: (row.erp_status || row.current_status || 'unsold').toLowerCase(),
      activation_status: (row.activation_status || 'inactive').toLowerCase(),
      branch: row.branch_id || row.branch || 'branch_alpha',
      sim_changes: Number(row.sim_changes || 0),
      last_sim_change: Number(row.last_sim_change || 0),
      erp_sync_status: row.erp_sync_status || 'synced',
      risk_score: Number(row.risk_score || 20),
      customer: row.customer || '',
      warranty: row.warranty || '',
      customer_owned: Boolean(row.customer_owned),
      timestamp: row.updated_at || row.created_at || new Date().toISOString(),
    };
  }

  mapCustomer(row = {}) {
    return {
      id: row.id,
      name: row.full_name || row.name || 'Customer',
      email: row.email || '',
      phone: row.phone || '',
      devices: row.devices || [],
      protection_status: row.status || row.protection_status || 'active',
      theft_reports: Number(row.theft_reports || 0),
      recovery_progress: Number(row.recovery_progress || 0),
    };
  }

  mapFraudAlert(row = {}) {
    return {
      id: row.id,
      type: row.alert_type || row.type || 'anomaly',
      severity: row.severity || 'medium',
      device_id: row.device_id || '',
      description: row.description || row.evidence?.description || row.alert_type || 'Security anomaly detected',
      branch: row.branch || row.evidence?.branch || 'security queue',
      devices_affected: Number(row.devices_affected || row.evidence?.devices_affected || 1),
      status: row.status || 'open',
      created_at: row.created_at || new Date().toISOString(),
      assigned_to: row.assigned_to || '',
      notes: row.notes || '',
    };
  }

  mapTrackingLog(row = {}) {
    return {
      id: row.id,
      device_id: row.device_id,
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      accuracy: Number(row.accuracy || 0),
      network_type: row.network_type || 'unknown',
      sim_serial_hash: row.sim_serial_hash || '',
      carrier: row.carrier || '',
      battery: Number(row.battery || 0),
      event_time: row.event_time || row.created_at || new Date().toISOString(),
    };
  }

  mapAuditLog(row = {}) {
    return {
      time: row.created_at || row.time || new Date().toISOString(),
      actor: row.actor || 'System',
      action: row.action || 'Recorded event',
      target: row.target || '',
      result: row.result || 'Recorded',
    };
  }

  save() {
    if (!this.storageAvailable) return;
    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(this.serialize()));
    } catch (error) {
      this.storageAvailable = false;
      this.lastError = error;
      console.warn('Secguard could not save to local storage. Continuing in memory-only mode.', error);
    }
  }

  serialize() {
    return {
      ...this.data,
      devices: this.data.devices.map(device => ({ ...device, timestamp: this.toIso(device.timestamp) })),
      fraud_alerts: this.data.fraud_alerts.map(alert => ({ ...alert, created_at: this.toIso(alert.created_at) })),
      investigations: this.data.investigations.map(item => ({ ...item, updated_at: this.toIso(item.updated_at) })),
      audit_logs: this.data.audit_logs.map(log => ({ ...log, time: this.toIso(log.time) })),
      tracking_logs: (this.data.tracking_logs || []).map(log => ({ ...log, event_time: this.toIso(log.event_time) })),
    };
  }

  normalizeDates() {
    this.data.devices = this.data.devices.map(device => ({ ...device, timestamp: new Date(device.timestamp) }));
    this.data.fraud_alerts = this.data.fraud_alerts.map(alert => ({ ...alert, created_at: new Date(alert.created_at) }));
    this.data.investigations = this.data.investigations.map(item => ({ ...item, updated_at: new Date(item.updated_at) }));
    this.data.audit_logs = this.data.audit_logs.map(log => ({ ...log, time: new Date(log.time) }));
    this.data.tracking_logs = (this.data.tracking_logs || []).map(log => ({ ...log, event_time: new Date(log.event_time) }));
  }

  toIso(value) {
    return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
  }

  addAudit(action, target, result = 'Recorded', actor = 'Current admin') {
    const entry = {
      time: new Date(),
      actor,
      action,
      target,
      result,
    };
    this.data.audit_logs.unshift(entry);
    if (this.usingRemote) {
      window.SecguardSupabase.client.from('audit_logs').insert([{
        actor,
        action,
        target,
        metadata: { result },
      }]).then(({ error }) => {
        if (error) console.warn('Audit log remote write failed.', error);
      });
    }
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

  getTrackingLogs(deviceId) {
    const logs = [...(this.data.tracking_logs || [])];
    return deviceId ? logs.filter(log => log.device_id === deviceId) : logs;
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
    if (this.usingRemote) {
      const payload = {
        activation_status: this.data.devices[index].activation_status,
        erp_status: this.data.devices[index].erp_status,
        risk_score: this.data.devices[index].risk_score,
      };
      await window.SecguardSupabase.client.from('devices').update(payload).eq('id', deviceId);
    }
    this.addAudit('Updated device telemetry', this.data.devices[index].imei);
    await this.evaluateDeviceRules(this.data.devices[index]);
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
    if (this.usingRemote) {
      const { data, error } = await window.SecguardSupabase.client
        .from('devices')
        .insert([{
          imei1: newDevice.imei,
          imei2: newDevice.imei2 || null,
          serial_number: newDevice.serial_number || null,
          brand: newDevice.brand,
          model: newDevice.model,
          current_status: newDevice.erp_status,
          erp_status: newDevice.erp_status,
          activation_status: newDevice.activation_status,
          risk_score: newDevice.risk_score,
        }])
        .select()
        .single();
      if (error) throw error;
      if (data?.id) newDevice.id = data.id;
    }
    this.addAudit('Registered tracked device', newDevice.imei);
    await this.evaluateDeviceRules(newDevice);
    this.save();
    return { success: true, device: newDevice };
  }

  async evaluateDeviceRules(device) {
    const isUnsoldActive = device.activation_status === 'active' && device.erp_status === 'unsold';
    const hasExistingAlert = this.data.fraud_alerts.some(alert => alert.device_id === device.id && alert.status === 'open');
    if (!isUnsoldActive || hasExistingAlert) return;
    const alert = {
      id: `alert_${Date.now()}`,
      type: 'unsold-active',
      severity: 'critical',
      device_id: device.id,
      description: 'Device active while ERP status remains unsold',
      branch: device.branch || 'branch_alpha',
      devices_affected: 1,
      status: 'open',
      created_at: new Date(),
    };
    this.data.fraud_alerts.unshift(alert);
    const investigation = {
      id: `inv_${Date.now()}`,
      case_number: `FT-${Math.floor(300 + Math.random() * 700)}`,
      device_id: device.id,
      type: 'Unsold active device',
      status: 'assigned',
      analyst: 'Security queue',
      updated_at: new Date(),
    };
    this.data.investigations.unshift(investigation);
    if (this.usingRemote) {
      await window.SecguardSupabase.client.from('fraud_alerts').insert([{
        device_id: device.id,
        alert_type: alert.type,
        severity: alert.severity,
        status: alert.status,
        evidence: {
          description: alert.description,
          branch: alert.branch,
          devices_affected: alert.devices_affected,
        },
      }]);
    }
  }

  async assignFraudAlert(alertId, analyst = 'Current officer') {
    const alert = this.data.fraud_alerts.find(item => item.id === alertId);
    if (!alert) return false;
    alert.status = 'assigned';
    alert.assigned_to = analyst;
    this.data.investigations.unshift({
      id: `inv_${Date.now()}`,
      case_number: `FT-${Math.floor(300 + Math.random() * 700)}`,
      device_id: alert.device_id,
      type: alert.type,
      status: 'assigned',
      analyst,
      updated_at: new Date(),
    });
    if (this.usingRemote) {
      await window.SecguardSupabase.client.from('fraud_alerts').update({ status: 'assigned' }).eq('id', alertId);
    }
    this.addAudit('Assigned fraud alert', alertId, 'Assigned', analyst);
    this.save();
    return true;
  }

  async escalateFraudAlert(alertId) {
    const order = ['low', 'medium', 'high', 'critical'];
    const alert = this.data.fraud_alerts.find(item => item.id === alertId);
    if (!alert) return false;
    const next = order[Math.min(order.indexOf(alert.severity) + 1, order.length - 1)] || 'high';
    alert.severity = next;
    alert.status = 'escalated';
    if (this.usingRemote) {
      await window.SecguardSupabase.client.from('fraud_alerts').update({ severity: next, status: 'escalated' }).eq('id', alertId);
    }
    this.addAudit('Escalated fraud alert', alertId, next);
    this.save();
    return true;
  }

  async dismissFraudAlert(alertId, reason = 'Reviewed as false positive') {
    const alert = this.data.fraud_alerts.find(item => item.id === alertId);
    if (!alert) return false;
    alert.status = 'dismissed';
    alert.dismiss_reason = reason;
    if (this.usingRemote) {
      await window.SecguardSupabase.client.from('fraud_alerts').update({ status: 'dismissed', evidence: { dismiss_reason: reason } }).eq('id', alertId);
    }
    this.addAudit('Dismissed fraud alert', alertId, reason);
    this.save();
    return true;
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

  async createCustomerCase(input = {}) {
    const caseId = `device_${Date.now()}`;
    const customerName = input.customerName || `Walk-in Customer ${this.data.customers.length + 1}`;
    const device = {
      id: caseId,
      imei: String(input.imei || `352009${Math.floor(100000000 + Math.random() * 899999999)}`).replace(/\s/g, ''),
      model: input.model || 'Customer reported handset',
      brand: 'Unknown',
      erp_status: 'sold',
      activation_status: 'active',
      branch: 'branch_alpha',
      sim_changes: input.reportType === 'sim-change' ? 1 : 0,
      last_sim_change: input.reportType === 'sim-change' ? 1 : 0,
      erp_sync_status: 'synced',
      risk_score: input.reportType === 'stolen' ? 82 : 55,
      customer: customerName,
      warranty: 'review',
      customer_owned: true,
      timestamp: new Date(),
    };
    const customer = {
      id: `cust_${Date.now()}`,
      name: customerName,
      email: 'customer@example.com',
      phone: input.phone || '+000-000-0000',
      devices: [caseId],
      protection_status: 'review',
      theft_reports: input.reportType === 'stolen' ? 1 : 0,
      recovery_progress: 15,
    };
    this.data.devices.unshift(device);
    this.data.customers.unshift(customer);
    this.data.investigations.unshift({
      id: `inv_${Date.now()}`,
      case_number: `RC-${Math.floor(1000 + Math.random() * 9000)}`,
      device_id: caseId,
      type: input.reportType === 'sim-change' ? 'Customer SIM change report' : 'Customer theft report',
      status: 'assigned',
      analyst: 'Recovery queue',
      updated_at: new Date(),
    });
    this.addAudit('Created customer protection case', customerName);
    if (this.usingRemote) {
      try {
        const { data: remoteDevice } = await window.SecguardSupabase.client.from('devices').insert([{
          imei1: device.imei,
          brand: device.brand,
          model: device.model,
          current_status: device.erp_status,
          erp_status: device.erp_status,
          activation_status: device.activation_status,
          risk_score: device.risk_score,
        }]).select().single();
        if (remoteDevice?.id) {
          device.id = remoteDevice.id;
          customer.devices = [remoteDevice.id];
        }

        const { data: remoteCustomer, error: customerError } = await window.SecguardSupabase.client.from('customers').insert([{
          full_name: customer.name,
          phone: customer.phone,
          email: customer.email,
          status: customer.protection_status,
        }]).select().single();
        if (customerError) console.warn('Customer remote write failed.', customerError);

        const { data: report, error: reportError } = await window.SecguardSupabase.client.from('theft_reports').insert([{
          customer_id: remoteCustomer?.id || null,
          device_id: remoteDevice?.id || null,
          customer: customer.name,
          imei: device.imei,
          priority: input.reportType === 'stolen' ? 'high' : 'medium',
          status: input.reportType === 'stolen' ? 'open' : 'review',
        }]).select().single();
        if (reportError) console.warn('Theft report remote write failed.', reportError);
        await window.SecguardSupabase.client.from('recovery_cases').insert([{
          theft_report_id: report?.id || null,
          caseNo: `RC-${Math.floor(1000 + Math.random() * 9000)}`,
          device: device.model,
          officer: 'Recovery queue',
          progress: customer.recovery_progress,
          status: 'monitoring',
        }]);
      } catch (error) {
        console.warn('Customer protection remote workflow failed. Local workflow is still saved.', error);
      }
    }
    this.save();
    return { customer, device };
  }

  async ingestTelemetry(input = {}) {
    const device = this.getDevice(input.device_id) || this.data.devices.find(item => item.imei === input.imei);
    if (!device) return { success: false, error: 'Device not found' };
    const log = {
      id: `track_${Date.now()}`,
      device_id: device.id,
      latitude: Number(input.latitude),
      longitude: Number(input.longitude),
      accuracy: Number(input.accuracy || 0),
      network_type: input.network_type || 'unknown',
      sim_serial_hash: input.sim_serial_hash || '',
      carrier: input.carrier || '',
      battery: Number(input.battery || 0),
      event_time: new Date(),
    };
    this.data.tracking_logs.unshift(log);
    await this.updateDevice(device.id, {
      activation_status: 'active',
      timestamp: new Date(),
      risk_score: input.risk_score || device.risk_score,
    });
    if (this.usingRemote) {
      await window.SecguardSupabase.client.from('tracking_logs').insert([{
        device_id: device.id,
        latitude: log.latitude,
        longitude: log.longitude,
        accuracy: log.accuracy,
        network_type: log.network_type,
        sim_serial_hash: log.sim_serial_hash,
        carrier: log.carrier,
        battery: log.battery,
        event_time: log.event_time.toISOString(),
      }]);
    }
    this.addAudit('Ingested device telemetry', device.imei);
    this.save();
    return { success: true, log };
  }

  findDeviceByImei(imei) {
    const normalized = String(imei || '').replace(/\s/g, '');
    return this.data.devices.find(device => String(device.imei || '').replace(/\s/g, '') === normalized);
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
    if (this.usingRemote) {
      const companyId = /^[0-9a-f-]{36}$/i.test(this.data.organization?.id || '') ? this.data.organization.id : null;
      window.SecguardSupabase.client.from('company_settings').upsert([{
        company_id: companyId,
        settings: this.data.settings,
      }]).then(({ error }) => {
        if (error) console.warn('Remote settings save failed.', error);
      });
    }
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
    const raw = imei ? String(imei).replace(/\s/g, '') : '';
    if (!raw) return 'N/A';
    const groups = raw.match(/.{1,4}/g);
    return groups ? groups.join(' ') : raw;
  }

  getRiskLevel(score) {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }
}

window.dataManager = new DataManager();
