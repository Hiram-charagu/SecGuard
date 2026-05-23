/**
 * Secguard Mock Data Service
 * Simulates ERP data structure from MAPPHEX
 * Can be replaced with real API calls later
 */

const mockData = {
  // ERP Organization Structure
  organization: {
    id: 'org_sec_2026',
    name: 'Secguard Retail Security',
    type: 'phone-retailer',
    subscription: 'enterprise',
    status: 'active',
    branches: 5,
    staff: 84,
  },

  // Branches
  branches: [
    {
      id: 'branch_alpha',
      name: 'Branch Alpha',
      location: 'North Hub',
      city: 'City A',
      staff: 18,
      devices: 1240,
      alerts: 14,
      status: 'active',
    },
    {
      id: 'branch_sigma',
      name: 'Branch Sigma',
      location: 'South Hub',
      city: 'City B',
      staff: 16,
      devices: 980,
      alerts: 9,
      status: 'active',
    },
    {
      id: 'branch_delta',
      name: 'Branch Delta',
      location: 'East Hub',
      city: 'City C',
      staff: 14,
      devices: 1100,
      alerts: 12,
      status: 'active',
    },
    {
      id: 'branch_omega',
      name: 'Branch Omega',
      location: 'West Hub',
      city: 'City D',
      staff: 20,
      devices: 1340,
      alerts: 8,
      status: 'active',
    },
    {
      id: 'branch_theta',
      name: 'Branch Theta',
      location: 'Central Hub',
      city: 'City E',
      staff: 16,
      devices: 2182,
      alerts: 5,
      status: 'active',
    },
  ],

  // Staff Members
  staff: [
    { id: 'staff_001', name: 'H. Patel', role: 'Security Analyst', branch: 'branch_alpha', email: 'h.patel@secguard.io', active: true },
    { id: 'staff_002', name: 'S. Kim', role: 'Security Manager', branch: 'branch_sigma', email: 's.kim@secguard.io', active: true },
    { id: 'staff_003', name: 'M. Ross', role: 'Fraud Investigator', branch: 'branch_delta', email: 'm.ross@secguard.io', active: true },
    { id: 'staff_004', name: 'R. Coleman', role: 'Security Analyst', branch: 'branch_omega', email: 'r.coleman@secguard.io', active: true },
    { id: 'staff_005', name: 'J. Martinez', role: 'Operations Lead', branch: 'branch_theta', email: 'j.martinez@secguard.io', active: true },
  ],

  // Devices (from ERP inventory)
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
      customer: null,
      warranty: null,
      timestamp: new Date(Date.now() - 11 * 60000),
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
      timestamp: new Date(Date.now() - 28 * 60000),
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
      customer: null,
      warranty: null,
      timestamp: new Date(Date.now() - 8 * 60000),
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
      timestamp: new Date(Date.now() - 2 * 60000),
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
      customer: 'A. Nguyen',
      warranty: 'active',
      timestamp: new Date(Date.now() - 9 * 60000),
    },
  ],

  // Customers (protected devices)
  customers: [
    {
      id: 'cust_001',
      name: 'Alicia Nguyen',
      email: 'alicia.nguyen@email.com',
      phone: '+1-555-0121',
      devices: ['device_005'],
      protection_status: 'active',
      theft_reports: 0,
      recovery_progress: 100,
    },
    {
      id: 'cust_002',
      name: 'Morgan Rivera',
      email: 'morgan.rivera@email.com',
      phone: '+1-555-0142',
      devices: ['device_002'],
      protection_status: 'active',
      theft_reports: 0,
      recovery_progress: 100,
    },
    {
      id: 'cust_003',
      name: 'Kei Thompson',
      email: 'kei.thompson@email.com',
      phone: '+1-555-0198',
      devices: ['device_004'],
      protection_status: 'review',
      theft_reports: 1,
      recovery_progress: 28,
    },
  ],

  // Fraud Alerts
  fraud_alerts: [
    {
      id: 'alert_001',
      type: 'unsold-active',
      severity: 'critical',
      device_id: 'device_001',
      description: 'Unexpected activation after unsold ERP status',
      branch: 'branch_delta',
      devices_affected: 4,
      status: 'open',
      created_at: new Date(Date.now() - 15 * 60000),
    },
    {
      id: 'alert_002',
      type: 'sim-mismatch',
      severity: 'high',
      device_id: 'device_005',
      description: 'SIM mismatch from different region',
      branch: 'branch_theta',
      devices_affected: 19,
      status: 'open',
      created_at: new Date(Date.now() - 19 * 60000),
    },
    {
      id: 'alert_003',
      type: 'blocked-network',
      severity: 'medium',
      device_id: 'device_003',
      description: 'Activation from blocked network',
      branch: 'branch_delta',
      devices_affected: 1,
      status: 'open',
      created_at: new Date(Date.now() - 60 * 60000),
    },
  ],

  // Investigations
  investigations: [
    {
      id: 'inv_001',
      case_number: 'FT-290',
      device_id: 'device_001',
      type: 'SIM anomaly',
      status: 'ready-for-closure',
      analyst: 'R. Coleman',
      updated_at: new Date(Date.now() - 11 * 60000),
    },
    {
      id: 'inv_002',
      case_number: 'FT-289',
      device_id: 'device_005',
      type: 'High-risk SIM event',
      status: 'assigned',
      analyst: 'H. Patel',
      updated_at: new Date(Date.now() - 37 * 60000),
    },
    {
      id: 'inv_003',
      case_number: 'FT-288',
      device_id: 'device_002',
      type: 'ERP integration mismatch',
      status: 'pending-review',
      analyst: 'S. Kim',
      updated_at: new Date(Date.now() - 58 * 60000),
    },
  ],

  // Audit Logs
  audit_logs: [
    {
      time: new Date(Date.now() - 11 * 60000),
      actor: 'H. Patel',
      action: 'Reviewed fraud case',
      target: 'IMEI 3520 0912 0951 002',
      result: 'Completed',
    },
    {
      time: new Date(Date.now() - 33 * 60000),
      actor: 'S. Kim',
      action: 'Updated ERP sync rule',
      target: 'Inventory policy',
      result: 'Pending',
    },
    {
      time: new Date(Date.now() - 54 * 60000),
      actor: 'System',
      action: 'Generated anomaly alert',
      target: 'Branch Delta',
      result: 'Triggered',
    },
    {
      time: new Date(Date.now() - 98 * 60000),
      actor: 'M. Ross',
      action: 'Confirmed recovery ticket',
      target: 'IMEI 3520 0912 4923 118',
      result: 'Resolved',
    },
  ],
};

/**
 * Data Manager - Handles retrieval and formatting
 */
class DataManager {
  constructor() {
    this.data = mockData;
    this.cache = {};
  }

  // Get all devices
  getDevices(filter = {}) {
    let devices = [...this.data.devices];
    if (filter.branch) devices = devices.filter(d => d.branch === filter.branch);
    if (filter.risk_min) devices = devices.filter(d => d.risk_score >= filter.risk_min);
    return devices;
  }

  // Get single device
  getDevice(id) {
    return this.data.devices.find(d => d.id === id);
  }

  // Get fraud alerts
  getFraudAlerts(filter = {}) {
    let alerts = [...this.data.fraud_alerts];
    if (filter.severity) alerts = alerts.filter(a => a.severity === filter.severity);
    if (filter.status) alerts = alerts.filter(a => a.status === filter.status);
    return alerts;
  }

  // Get branches
  getBranches() {
    return [...this.data.branches];
  }

  // Get branch details
  getBranch(id) {
    return this.data.branches.find(b => b.id === id);
  }

  // Get dashboard metrics
  getDashboardMetrics() {
    const devices = this.data.devices;
    const alerts = this.data.fraud_alerts.filter(a => a.status === 'open');
    const customers = this.data.customers;
    
    return {
      activeDevices: devices.filter(d => d.activation_status === 'active').length + 7800,
      fraudAlerts: alerts.length + 123,
      protectedDevices: customers.length + 4300,
      erpSyncHealth: 98.9,
      suspiciousDevices: devices.filter(d => d.risk_score > 50).length,
      erpSyncWarnings: devices.filter(d => d.erp_sync_status !== 'synced').length,
      highRiskDevices: devices.filter(d => d.risk_score > 80).length,
      openInvestigations: this.data.investigations.filter(i => i.status !== 'ready-for-closure').length,
    };
  }

  // Get customer data
  getCustomers() {
    return [...this.data.customers];
  }

  // Get staff
  getStaff() {
    return [...this.data.staff];
  }

  // Update device (for future API integration)
  async updateDevice(deviceId, updates) {
    const device = this.getDevice(deviceId);
    if (device) {
      Object.assign(device, updates);
      return { success: true, device };
    }
    return { success: false, error: 'Device not found' };
  }

  // Add new device
  async addDevice(deviceData) {
    const newDevice = {
      id: `device_${this.data.devices.length + 1}`,
      ...deviceData,
      timestamp: new Date(),
    };
    this.data.devices.push(newDevice);
    return { success: true, device: newDevice };
  }

  // Format date for display
  formatDate(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 60000); // minutes ago
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  }

  // Format IMEI with spaces
  formatIMEI(imei) {
    return imei ? imei.match(/.{1,4}/g).join(' ') : 'N/A';
  }

  // Get risk level text
  getRiskLevel(score) {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }
}

// Export for use in HTML or server-side API
const dataManager = new DataManager();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { mockData };
}
