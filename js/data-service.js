const DataServiceConfig = {
  useMock: true,
  apiBaseUrl: '',
  mapphexBaseUrl: '',
};

class DataManager {
  constructor(config = {}) {
    this.config = { ...DataServiceConfig, ...config };
    this.data = {
      organization: {},
      branches: [],
      devices: [],
      customers: [],
      fraud_alerts: [],
      investigations: [],
      audit_logs: [],
      staff: [],
      metrics: {},
    };
  }

  async request(endpoint, options = {}) {
    const base = this.config.useMock ? '' : this.config.mapphexBaseUrl;
    const url = base + `/api/${endpoint}`;
    const config = { method: options.method || 'GET', headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } };
    if (options.body) config.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);

    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  }

  async load() {
    const [organization, branches, devices, customers, fraudAlerts, investigations, auditLogs, staff, metrics] = await Promise.all([
      this.request('organization'),
      this.request('branches'),
      this.request('devices'),
      this.request('customers'),
      this.request('fraud-alerts'),
      this.request('investigations'),
      this.request('audit-logs'),
      this.request('staff'),
      this.request('metrics'),
    ]);

    this.data = {
      organization,
      branches,
      devices: devices.map(item => ({ ...item, timestamp: new Date(item.timestamp) })),
      customers,
      fraud_alerts: fraudAlerts.map(item => ({ ...item, created_at: new Date(item.created_at) })),
      investigations: investigations.map(item => ({ ...item, updated_at: new Date(item.updated_at) })),
      audit_logs: auditLogs.map(item => ({ ...item, time: new Date(item.time) })),
      staff,
      metrics,
    };
  }

  getDevices(filter = {}) {
    let devices = [...this.data.devices];
    if (filter.branch) devices = devices.filter(d => d.branch === filter.branch);
    if (filter.risk_min) devices = devices.filter(d => d.risk_score >= filter.risk_min);
    return devices;
  }

  getDevice(id) {
    return this.data.devices.find(d => d.id === id);
  }

  getFraudAlerts(filter = {}) {
    let alerts = [...this.data.fraud_alerts];
    if (filter.severity) alerts = alerts.filter(a => a.severity === filter.severity);
    if (filter.status) alerts = alerts.filter(a => a.status === filter.status);
    return alerts;
  }

  getBranches() {
    return [...this.data.branches];
  }

  getBranch(id) {
    return this.data.branches.find(b => b.id === id);
  }

  getDashboardMetrics() {
    return { ...this.data.metrics };
  }

  getCustomers() {
    return [...this.data.customers];
  }

  getStaff() {
    return [...this.data.staff];
  }

  async updateDevice(deviceId, updates) {
    const result = await this.request(`devices/${deviceId}`, { method: 'PUT', body: updates });
    if (result.success) {
      const index = this.data.devices.findIndex(d => d.id === deviceId);
      if (index >= 0) {
        this.data.devices[index] = { ...this.data.devices[index], ...result.device, timestamp: new Date(result.device.timestamp) };
      }
    }
    return result;
  }

  async addDevice(deviceData) {
    const result = await this.request('devices', { method: 'POST', body: deviceData });
    if (result.success) {
      const newDevice = { ...result.device, timestamp: new Date(result.device.timestamp) };
      this.data.devices.push(newDevice);
      return { success: true, device: newDevice };
    }
    return result;
  }

  formatDate(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  }

  formatIMEI(imei) {
    return imei ? imei.match(/.{1,4}/g).join(' ') : 'N/A';
  }

  getRiskLevel(score) {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }
}

window.dataManager = new DataManager();
