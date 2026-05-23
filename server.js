const express = require('express');
const path = require('path');
const { mockData } = require('./mock-data.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(require('cors')());
app.use(express.static(path.join(__dirname)));

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
    imei: payload.imei || 'unknown',
    model: payload.model || 'unknown',
    brand: payload.brand || 'unknown',
    erp_status: payload.erp_status || 'unsold',
    activation_status: payload.activation_status || 'active',
    branch: payload.branch || 'branch_alpha',
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
    activeDevices: devices.filter(d => d.activation_status === 'active').length + 7800,
    fraudAlerts: alerts.length + 123,
    protectedDevices: customers.length + 4300,
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
