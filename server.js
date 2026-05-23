const express = require('express');
const path = require('path');
const { mockData } = require('./mock-data.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(require('cors')());
app.use(express.static(path.join(__dirname)));

const rateBuckets = new Map();

function sanitizeText(value, fallback = '') {
  return String(value ?? fallback).replace(/[<>]/g, '').trim();
}

function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  const bucket = rateBuckets.get(key) || { count: 0, reset: now + windowMs };
  if (now > bucket.reset) {
    bucket.count = 0;
    bucket.reset = now + windowMs;
  }
  bucket.count += 1;
  rateBuckets.set(key, bucket);
  return bucket.count <= limit;
}

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

function parseNumber(value) {
  if (value == null) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function formatDates(data) {
  return JSON.parse(JSON.stringify(data, (key, value) => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
      return new Date(value).toISOString();
    }
    return value;
  }));
}

let storage = JSON.parse(JSON.stringify(mockData));

function runFraudRules() {
  storage.devices.forEach(device => {
    const duplicate = storage.devices.find(other => other.id !== device.id && other.imei === device.imei);
    const hasOpen = storage.fraud_alerts.some(alert => alert.device_id === device.id && alert.status === 'open');
    if (hasOpen) return;
    if (device.activation_status === 'active' && device.erp_status === 'unsold') {
      storage.fraud_alerts.unshift({
        id: `alert_${Date.now()}_${device.id}`,
        type: 'unsold-active',
        severity: 'critical',
        device_id: device.id,
        description: 'Device active while ERP status remains unsold',
        branch: device.branch,
        devices_affected: 1,
        status: 'open',
        created_at: new Date().toISOString(),
      });
    }
    if (duplicate) {
      storage.fraud_alerts.unshift({
        id: `alert_${Date.now()}_dup_${device.id}`,
        type: 'duplicate-imei',
        severity: 'critical',
        device_id: device.id,
        description: 'IMEI appears in more than one branch or record',
        branch: device.branch,
        devices_affected: 2,
        status: 'open',
        created_at: new Date().toISOString(),
      });
    }
    if ((device.sim_changes || 0) > 3) {
      storage.fraud_alerts.unshift({
        id: `alert_${Date.now()}_sim_${device.id}`,
        type: 'rapid-sim-change',
        severity: 'high',
        device_id: device.id,
        description: 'SIM changed more than three times in the review window',
        branch: device.branch,
        devices_affected: 1,
        status: 'open',
        created_at: new Date().toISOString(),
      });
    }
  });
}

setInterval(runFraudRules, 15 * 60 * 1000);

app.get('/api/organization', (req, res) => {
  res.json(storage.organization);
});

app.get('/api/branches', (req, res) => {
  const branch = req.query.branch;
  let branches = storage.branches;
  if (branch) branches = branches.filter(b => b.id === branch);
  res.json(branches);
});

app.get('/api/devices', (req, res) => {
  let devices = storage.devices;
  const branch = req.query.branch;
  const riskMin = parseNumber(req.query.risk_min);
  if (branch) devices = devices.filter(d => d.branch === branch);
  if (riskMin != null) devices = devices.filter(d => d.risk_score >= riskMin);
  res.json(devices);
});

app.get('/api/devices/:id', (req, res) => {
  const device = storage.devices.find(d => d.id === req.params.id);
  if (!device) return res.status(404).json({ error: 'Device not found' });
  res.json(device);
});

app.post('/api/devices', (req, res) => {
  const payload = req.body;
  const newDevice = {
    id: `device_${storage.devices.length + 1}`,
    imei: sanitizeText(payload.imei, 'unknown'),
    model: sanitizeText(payload.model, 'unknown'),
    brand: sanitizeText(payload.brand, 'unknown'),
    erp_status: sanitizeText(payload.erp_status, 'unsold'),
    activation_status: sanitizeText(payload.activation_status, 'active'),
    branch: sanitizeText(payload.branch, 'branch_alpha'),
    sim_changes: payload.sim_changes || 0,
    last_sim_change: payload.last_sim_change == null ? null : payload.last_sim_change,
    erp_sync_status: payload.erp_sync_status || 'synced',
    risk_score: payload.risk_score || 32,
    customer: payload.customer || null,
    warranty: payload.warranty || null,
    timestamp: new Date().toISOString(),
  };
  storage.devices.push(newDevice);
  res.json({ success: true, device: newDevice });
});

app.post('/api/webhooks/erp-events', (req, res) => {
  const event = req.body || {};
  const type = sanitizeText(event.type || event.event_type, 'inventory_update');
  const imei = sanitizeText(event.imei || event.imei1);
  if (!imei) return res.status(400).json({ error: 'IMEI is required' });

  let device = storage.devices.find(item => item.imei === imei);
  if (!device) {
    device = {
      id: `device_${storage.devices.length + 1}`,
      imei,
      model: sanitizeText(event.model, 'ERP handset'),
      brand: sanitizeText(event.brand, 'ERP'),
      erp_status: 'unsold',
      activation_status: 'inactive',
      branch: sanitizeText(event.branch, 'branch_alpha'),
      sim_changes: 0,
      last_sim_change: null,
      erp_sync_status: 'synced',
      risk_score: 20,
      customer: sanitizeText(event.customer),
      warranty: event.warranty || null,
      timestamp: new Date().toISOString(),
    };
    storage.devices.push(device);
  }

  if (type === 'sale_completed') {
    device.erp_status = 'sold';
    device.customer = sanitizeText(event.customer, device.customer);
    device.warranty = event.warranty || 'active';
  }
  if (type === 'branch_transfer') device.branch = sanitizeText(event.branch, device.branch);
  if (type === 'inventory_update') device.erp_status = sanitizeText(event.erp_status, device.erp_status);
  device.timestamp = new Date().toISOString();

  storage.audit_logs.unshift({
    time: new Date().toISOString(),
    actor: 'ERP webhook',
    action: `Processed ${type}`,
    target: imei,
    result: 'Completed',
  });

  res.json({ success: true, device });
});

app.post('/api/telemetry', (req, res) => {
  const payload = req.body || {};
  const token = sanitizeText(payload.device_token);
  const imei = sanitizeText(payload.imei);
  const device = storage.devices.find(item => item.imei === imei || item.id === payload.device_id);
  if (!token && !imei) return res.status(401).json({ error: 'Device token or IMEI is required' });
  if (!device) return res.status(404).json({ error: 'Device not found' });
  if (!rateLimit(`telemetry:${device.id}`, 1, 5 * 60 * 1000)) {
    return res.status(429).json({ error: 'Telemetry rate limit exceeded' });
  }

  const log = {
    id: `track_${Date.now()}`,
    device_id: device.id,
    latitude: parseNumber(payload.latitude),
    longitude: parseNumber(payload.longitude),
    accuracy: parseNumber(payload.accuracy) || 0,
    network_type: sanitizeText(payload.network_type, 'unknown'),
    sim_serial_hash: sanitizeText(payload.sim_serial_hash),
    carrier: sanitizeText(payload.carrier),
    battery: parseNumber(payload.battery) || 0,
    event_time: new Date().toISOString(),
  };
  storage.tracking_logs = storage.tracking_logs || [];
  storage.tracking_logs.unshift(log);
  device.activation_status = 'active';
  device.timestamp = log.event_time;

  if (device.erp_status === 'unsold') {
    storage.fraud_alerts.unshift({
      id: `alert_${Date.now()}`,
      type: 'unsold-active',
      severity: 'critical',
      device_id: device.id,
      description: 'Device active while ERP status remains unsold',
      branch: device.branch,
      devices_affected: 1,
      status: 'open',
      created_at: new Date().toISOString(),
    });
  }

  res.json({ success: true, log });
});

app.put('/api/devices/:id', (req, res) => {
  const device = storage.devices.find(d => d.id === req.params.id);
  if (!device) return res.status(404).json({ error: 'Device not found' });
  Object.assign(device, req.body);
  if (req.body.timestamp) device.timestamp = req.body.timestamp;
  return res.json({ success: true, device });
});

app.get('/api/customers', (req, res) => {
  res.json(storage.customers);
});

app.get('/api/staff', (req, res) => {
  res.json(storage.staff);
});

app.get('/api/fraud-alerts', (req, res) => {
  let alerts = storage.fraud_alerts;
  if (req.query.status) alerts = alerts.filter(a => a.status === req.query.status);
  if (req.query.severity) alerts = alerts.filter(a => a.severity === req.query.severity);
  res.json(alerts);
});

app.get('/api/investigations', (req, res) => {
  res.json(storage.investigations);
});

app.get('/api/audit-logs', (req, res) => {
  res.json(storage.audit_logs);
});

app.get('/api/metrics', (req, res) => {
  const devices = storage.devices;
  const alerts = storage.fraud_alerts.filter(a => a.status === 'open');
  const customers = storage.customers;
  res.json({
    activeDevices: devices.filter(d => d.activation_status === 'active').length,
    fraudAlerts: alerts.length,
    protectedDevices: customers.length,
    erpSyncHealth: 98.9,
    suspiciousDevices: devices.filter(d => d.risk_score > 50).length,
    erpSyncWarnings: devices.filter(d => d.erp_sync_status !== 'synced').length,
    highRiskDevices: devices.filter(d => d.risk_score > 80).length,
    openInvestigations: storage.investigations.filter(i => i.status !== 'ready-for-closure').length,
  });
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Secguard server running at http://localhost:${port}`);
});
